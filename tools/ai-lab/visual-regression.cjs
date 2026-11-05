#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const publicArg = process.argv.includes('--public') ? process.argv[process.argv.indexOf('--public') + 1] : process.argv[2];
const publicDir = path.resolve(process.env.AI_LAB_PUBLIC || publicArg || 'public');
const checks = [
  ['homepage hero', 'ai-lab/index.html', ['al-home-intro', 'data-home-sizzle', 'al-home-announcements']],
  ['archive controls', 'ai-lab/experiments/index.html', ['data-lab-controls', 'data-category', 'data-view-choice']],
  ['article layout', 'ai-lab/engineering/fastapi-ai-streaming-api/index.html', ['al-article-layout', 'al-toc', 'al-cover-image']],
  ['local playground', 'ai-lab/playground/index.html', ['data-lab-playground', 'data-json-check', 'data-rag-run']],
  ['bilingual archive', 'en/ai-lab/field-notes/index.html', ['Field Notes', 'data-lab-search-open']],
];
const failures = [];
for (const [label, relative, needles] of checks) {
  const file = path.join(publicDir, relative);
  if (!fs.existsSync(file)) {
    failures.push(`${label}: missing ${relative}`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  for (const needle of needles) if (!html.includes(needle)) failures.push(`${label}: missing selector/text ${needle}`);
}
const css = path.join(publicDir, 'css/ai-lab.css');
if (!fs.existsSync(css)) failures.push('tokens: missing css/ai-lab.css');
else {
  const styles = fs.readFileSync(css, 'utf8');
  for (const token of ['--al-paper', '--al-ink', '--al-serif', 'prefers-reduced-motion']) {
    if (!styles.includes(token)) failures.push(`tokens: missing ${token}`);
  }
}
if (failures.length) {
  console.error(`AI Lab structural regression failed:\n${failures.join('\n')}`);
  process.exit(1);
}
console.log(`AI Lab structural regression passed: ${checks.length} surfaces and design tokens checked.`);
