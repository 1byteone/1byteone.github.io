#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'assets/data/ai-lab-source-library-manifest.json'), 'utf8'));
if (manifest.source_count < 20) throw new Error(`Expected the complete source inventory, got ${manifest.source_count}`);
let downloaded = 0;
for (const source of manifest.sources) {
  for (const file of source.files) {
    const filename = path.join(root, file.path);
    if (!fs.existsSync(filename)) throw new Error(`Missing ${source.source_id}: ${file.path}`);
    const bytes = fs.readFileSync(filename);
    if (bytes.length !== file.bytes) throw new Error(`Byte count mismatch: ${file.path}`);
    if (crypto.createHash('sha256').update(bytes).digest('hex') !== file.sha256) throw new Error(`Hash mismatch: ${file.path}`);
    if (file.format === 'svg' && !bytes.toString('utf8').includes('<svg')) throw new Error(`Invalid SVG: ${file.path}`);
    if (file.format === 'png' && bytes.readUInt32BE(0) !== 0x89504e47) throw new Error(`Invalid PNG: ${file.path}`);
    if (file.format === 'jpg' && !(bytes[0] === 0xff && bytes[1] === 0xd8)) throw new Error(`Invalid JPEG: ${file.path}`);
    downloaded += 1;
  }
}
if (manifest.local_file_count !== downloaded) throw new Error(`Manifest count mismatch: ${manifest.local_file_count} vs ${downloaded}`);
console.log(`Source inventory passed: ${manifest.source_count} sources, ${downloaded} local image files; every local file hash and signature verified.`);
