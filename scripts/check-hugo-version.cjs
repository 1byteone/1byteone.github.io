#!/usr/bin/env node
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const result = spawnSync(process.execPath, [path.join(__dirname, 'hugo-run.cjs'), '--version-check-only'], { stdio: 'inherit' });
if (result.error) {
  console.error(`Could not start Hugo version check: ${result.error.message}`);
  process.exit(1);
}
process.exit(result.status ?? 1);
