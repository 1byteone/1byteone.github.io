#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = process.cwd();
const manifestPath = path.join(root, 'assets/data/ai-lab-open-source-library-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if (manifest.new_asset_count < 50) throw new Error(`Expected at least 50 new assets, got ${manifest.new_asset_count}`);
let svgCount = 0;
let pngCount = 0;
for (const item of manifest.assets) {
  const filename = path.join(root, item.local_path);
  if (!fs.existsSync(filename)) throw new Error(`Missing asset: ${item.local_path}`);
  const bytes = fs.readFileSync(filename);
  const hash = crypto.createHash('sha256').update(bytes).digest('hex');
  if (hash !== item.sha256) throw new Error(`Hash mismatch: ${item.local_path}`);
  if (bytes.length !== item.bytes) throw new Error(`Byte count mismatch: ${item.local_path}`);
  if (item.format === 'SVG') {
    svgCount += 1;
    const text = bytes.toString('utf8');
    if (!text.includes('<svg')) throw new Error(`Invalid SVG: ${item.local_path}`);
    if (/<script\b|(?:href|xlink:href)=["']https?:/i.test(text)) throw new Error(`Unsafe SVG reference: ${item.local_path}`);
    if (item.dimensions.viewBox !== '0 0 1024 768') throw new Error(`Unexpected SVG viewBox: ${item.local_path}`);
  } else if (item.format === 'PNG') {
    pngCount += 1;
    if (bytes.readUInt32BE(0) !== 0x89504e47) throw new Error(`Invalid PNG signature: ${item.local_path}`);
    const width = bytes.readUInt32BE(16);
    const height = bytes.readUInt32BE(20);
    if (width !== item.dimensions.width || height !== item.dimensions.height) throw new Error(`PNG dimensions mismatch: ${item.local_path}`);
    if (width !== 1200 || height !== 675) throw new Error(`PNG cover must be 1200x675: ${item.local_path}`);
  } else throw new Error(`Unsupported format: ${item.format}`);
  if (item.license_status !== 'verified' || item.redistributable !== true) throw new Error(`Unverified license status: ${item.local_path}`);
}
if (svgCount !== 33 || pngCount !== 20) throw new Error(`Expected 33 SVG + 20 PNG, got ${svgCount} SVG + ${pngCount} PNG`);
console.log(`Open-source AI Lab library passed: ${manifest.assets.length} files (${svgCount} SVG + ${pngCount} PNG), hashes and dimensions verified.`);
