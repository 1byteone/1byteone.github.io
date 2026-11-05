#!/usr/bin/env node
const { execFileSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const expected = fs.readFileSync(path.join(__dirname, '..', '.hugo-version'), 'utf8').trim();
const configured = process.env.HUGO_BIN;

function discoverBinary() {
  if (configured) return configured;
  if (process.platform !== 'win32') return 'hugo';
  const command = 'Get-Command hugo -CommandType Application -All | Where-Object { $_.Source -match "\\.exe$" } | Select-Object -ExpandProperty Source';
  try {
    const candidates = execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', command], { encoding: 'utf8' })
      .split(/\r?\n/).map((value) => value.trim()).filter(Boolean);
    for (const fallback of [`D:\\tools\\hugo-${expected}-verified\\hugo.exe`, `D:\\tools\\hugo-${expected}\\hugo.exe`]) {
      if (fs.existsSync(fallback) && !candidates.includes(fallback)) candidates.push(fallback);
    }
    for (const candidate of candidates) {
      try {
        const version = execFileSync(candidate, ['version'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
        if (version.includes(`v${expected}-`) || version.includes(`v${expected}+`)) return candidate;
      } catch { /* Try the next executable on PATH. */ }
    }
    return candidates[0] || 'hugo.exe';
  } catch {
    return 'hugo.exe';
  }
}

const binary = discoverBinary();
let output;
try {
  output = execFileSync(binary, ['version'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
} catch {
  console.error(`Could not run Hugo at "${binary}". Set HUGO_BIN to Hugo Extended ${expected}.`);
  process.exit(1);
}
const match = output.match(/hugo v(\d+)\.(\d+)\.(\d+)/i);
const version = match?.slice(1, 4).map(Number);
const extended = /\+extended\b/i.test(output);
const versionString = version?.join('.') || '';
if (!extended || versionString !== expected) {
  console.error(`Hugo Extended ${expected} is pinned for reproducible builds; found ${output.trim() || 'unknown version'}. Set HUGO_BIN to the approved executable.`);
  process.exit(1);
}
if (process.argv.includes('--version-check-only')) {
  console.log(`Hugo ${versionString} Extended matches .hugo-version.`);
  process.exit(0);
}
const result = spawnSync(binary, process.argv.slice(2), { stdio: 'inherit' });
if (result.error) {
  console.error(`Could not start Hugo: ${result.error.message}`);
  process.exit(1);
}
process.exit(result.status ?? 1);
