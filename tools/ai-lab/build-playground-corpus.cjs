#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = process.cwd();
const destination = path.join(root, 'static/data/ai-lab/playground-corpus.json');
const imported = /^ai-lab-/;

function frontMatter(source) {
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n/);
  if (!match) return { metadata: '', body: source };
  return { metadata: match[1], body: source.slice(match[0].length) };
}

function scalar(metadata, key) {
  const value = (metadata.match(new RegExp(`^${key}:\\s*(.+)$`, 'm')) || [])[1] || '';
  return value.trim().replace(/^(["'])(.*)\1$/, '$2');
}

function collect(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...collect(filename));
    else if (entry.name.endsWith('.md') && !entry.name.startsWith('_')) files.push(filename);
  }
  return files;
}

function toPlainText(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 $2')
    .replace(/^\s{0,3}#{1,6}\s*/gm, '')
    .replace(/^\s{0,3}[-*+]\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s*\|.*\|\s*$/gm, ' ')
    .replace(/[`*_~]/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const documents = [];
for (const language of ['zh', 'en']) {
  for (const category of ['engineering', 'experiments', 'research']) {
    const section = path.join(root, 'content', language, 'ai-lab', category);
    for (const filename of collect(section)) {
    const source = fs.readFileSync(filename, 'utf8');
    const { metadata, body } = frontMatter(source);
    const translationKey = scalar(metadata, 'translationKey');
    if (!imported.test(translationKey)) continue;
    const slug = translationKey.slice('ai-lab-'.length);
    const relative = path.relative(section, filename).replaceAll('\\', '/').replace(/(?:\/index)?\.md$/, '');
    const category = relative.split('/')[0];
    const summary = scalar(metadata, 'summary');
    const bodyText = toPlainText(body).slice(0, 2400);
    documents.push({
      id: `${language}-${slug}`,
      language,
      translation_key: translationKey,
      title: scalar(metadata, 'title'),
      category,
      url: `/${language === 'en' ? 'en/' : ''}ai-lab/${relative.replace(/\/$/, '')}/`,
      cover: scalar(metadata, 'cover'),
      content: `${summary} ${bodyText}`.trim(),
      source_sha256: crypto.createHash('sha256').update(source).digest('hex'),
    });
    }
  }
}
documents.sort((a, b) => a.id.localeCompare(b.id));
const zhCount = documents.filter((document) => document.language === 'zh').length;
const enCount = documents.filter((document) => document.language === 'en').length;
if (zhCount !== 20 || enCount !== 20) {
  console.error(`Expected 20 imported shared articles per language; found zh=${zhCount}, en=${enCount}.`);
  process.exit(1);
}
const corpus = {
  schema_version: 1,
  corpus_id: 'ai-lab-shared-articles-bilingual-v1',
  generated_from: 'content/{zh,en}/ai-lab/{engineering,experiments,research}, only posts whose translationKey starts with ai-lab-',
  document_count: documents.length,
  language_counts: { zh: zhCount, en: enCount },
  documents,
};
fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.writeFileSync(destination, `${JSON.stringify(corpus, null, 2)}\n`);
console.log(`Built offline Playground corpus: ${documents.length} shared article pages (${zhCount} zh + ${enCount} en).`);
