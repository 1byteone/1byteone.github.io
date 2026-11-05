#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const publicDir = process.argv.includes('--public')
  ? path.resolve(process.argv[process.argv.indexOf('--public') + 1] || 'public')
  : path.join(root, 'public');

const required = [
  'ai-lab/index.html',
  'en/ai-lab/index.html',
  'ai-lab/experiments/index.html',
  'en/ai-lab/experiments/index.html',
  'ai-lab/research/index.html',
  'en/ai-lab/research/index.html',
  'ai-lab/engineering/index.html',
  'ai-lab/benchmarks/index.html',
  'ai-lab/playground/index.html',
  'ai-lab/field-notes/index.html',
  'en/ai-lab/field-notes/index.html',
  'images/ai-lab/open-doodles/reading.svg',
  'media/ai-lab/open-doodles-covers/rag-grounded-knowledge.png',
];
const missing = required.filter((file) => !fs.existsSync(path.join(publicDir, file)));
if (missing.length) {
  console.error(`AI Lab smoke check failed. Missing files:\n${missing.join('\n')}`);
  process.exit(1);
}

const htmlFiles = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) htmlFiles.push(full);
  }
}
walk(path.join(publicDir, 'ai-lab'));
walk(path.join(publicDir, 'en', 'ai-lab'));
const forbidden = [];
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  if (/icons8\.com|anthropic\.com\/research/i.test(html)) forbidden.push(path.relative(publicDir, file));
  if (!html.includes('data-lab-theme-toggle') && html.includes('AI Lab')) {
    console.warn(`AI Lab page has no color-mode control: ${path.relative(publicDir, file)}`);
  }
}
if (forbidden.length) {
  console.error(`AI Lab smoke check found external article/card destinations:\n${forbidden.join('\n')}`);
  process.exit(1);
}
console.log(`AI Lab smoke check passed: ${required.length} required files, ${htmlFiles.length} AI Lab HTML files.`);
