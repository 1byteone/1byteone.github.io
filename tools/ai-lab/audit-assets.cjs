#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = process.cwd();
const sharedDir = path.join(root, 'assets/media/ai-lab/shared');
const manifestPath = path.join(root, 'assets/data/ai-lab-shared-cover-manifest.json');
const expected = [
  'building-ai-agents', 'building-rag-pipeline', 'fastapi-ai-streaming-api', 'fastapi-async-dependency-injection',
  'fastapi-project-architecture', 'fastapi-request-response-pydantic', 'hallucination-prevention',
  'langchain-core-architecture', 'langchain-memory-multiturn', 'langchain-prompt-chain', 'langchain-tool-calling-agent',
  'openai-api-fundamentals', 'openai-multimodal-ai', 'openai-structured-output', 'openai-tool-calling',
  'python-ai-engineering', 'rag-basic-pipeline', 'rag-embedding-vector-database', 'rag-production-architecture',
  'rag-retriever-optimization',
];
const categories = {
  'building-ai-agents': 'engineering', 'fastapi-ai-streaming-api': 'engineering', 'fastapi-async-dependency-injection': 'engineering',
  'fastapi-project-architecture': 'engineering', 'fastapi-request-response-pydantic': 'engineering', 'langchain-core-architecture': 'engineering',
  'langchain-memory-multiturn': 'engineering', 'langchain-prompt-chain': 'engineering', 'langchain-tool-calling-agent': 'engineering',
  'openai-api-fundamentals': 'engineering', 'openai-multimodal-ai': 'engineering', 'openai-structured-output': 'engineering', 'openai-tool-calling': 'engineering', 'python-ai-engineering': 'engineering',
  'building-rag-pipeline': 'experiments', 'rag-basic-pipeline': 'experiments', 'rag-embedding-vector-database': 'experiments', 'rag-production-architecture': 'experiments', 'rag-retriever-optimization': 'experiments',
  'hallucination-prevention': 'research',
};
const dimensions = (filename) => {
  const bytes = fs.readFileSync(filename);
  if (bytes.length < 24 || bytes.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
};
const items = expected.map((slug) => {
  const filename = path.join(sharedDir, `${slug}.png`);
  if (!fs.existsSync(filename)) throw new Error(`Missing shared cover: ${path.relative(root, filename)}`);
  const sourceBlog = ['zh', 'en'].map((language) => `content/${language}/blog/${slug}/featured.png`);
  const sourcePresent = sourceBlog.map((relative) => ({ path: relative, exists: fs.existsSync(path.join(root, relative)) }));
  const bytes = fs.readFileSync(filename);
  return {
    asset_id: `shared-cover-${slug}`,
    filename: `assets/media/ai-lab/shared/${slug}.png`,
    article_slug: slug,
    ai_lab_routes: [`/ai-lab/${categories[slug]}/${slug}/`, `/en/ai-lab/${categories[slug]}/${slug}/`],
    source_blog_featured: sourcePresent,
    format: 'PNG',
    resolution: dimensions(filename),
    bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
    provenance: 'Existing repository cover carried into the AI Lab shared-article import; this record does not relicense the original artwork.',
    license_status: 'review-required',
    redistributable: null,
    attribution: 'See the original article/source manifest before external redistribution.',
  };
});
const manifest = {
  collection: 'AI Lab shared article covers',
  generated_at: new Date().toISOString(),
  scope: 'The 20 bilingual shared engineering articles imported into AI Lab. Hashes are of the local PNG files.',
  license_policy: 'Repository provenance is recorded separately from permission to redistribute. review-required means no external license claim is made.',
  count: items.length,
  assets: items,
};
fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
const validDimensions = items.filter((item) => item.resolution && ((item.resolution.width === 1200 && item.resolution.height === 630) || (item.resolution.width === 2400 && item.resolution.height === 1260)));
if (validDimensions.length !== items.length) throw new Error(`Unexpected shared cover dimensions: ${items.filter((item) => !validDimensions.includes(item)).map((item) => item.article_slug).join(', ')}`);
console.log(`Asset audit passed: ${items.length} shared PNG covers (${items.filter((item) => item.resolution.width === 2400).length} retina 2400x1260, ${items.filter((item) => item.resolution.width === 1200).length} 1200x630); manifest written to ${path.relative(root, manifestPath)}.`);
