#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { performance } = require('node:perf_hooks');

const root = process.cwd();
const datasetPath = path.join(root, 'data/ai_lab/retrieval_fixture.json');
const outPath = path.join(root, 'docs/audit/ai-lab-retrieval-baseline.json');
const datasetRaw = fs.readFileSync(datasetPath, 'utf8');
const dataset = JSON.parse(datasetRaw);
if (!dataset.documents?.length || !dataset.queries?.length) throw new Error('Evaluation fixture must have documents and labeled queries.');

const tokenize = (value) => (value.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) || []);
const docs = dataset.documents.map((doc) => ({ ...doc, tokens: tokenize(doc.text) }));
const df = new Map();
for (const doc of docs) for (const token of new Set(doc.tokens)) df.set(token, (df.get(token) || 0) + 1);
const avgdl = docs.reduce((sum, doc) => sum + doc.tokens.length, 0) / docs.length;

function bm25(query, doc, k1 = 1.2, b = 0.75) {
  const terms = tokenize(query);
  const counts = new Map();
  for (const token of doc.tokens) counts.set(token, (counts.get(token) || 0) + 1);
  return terms.reduce((score, term) => {
    const frequency = counts.get(term) || 0;
    if (!frequency) return score;
    const idf = Math.log(1 + (docs.length - (df.get(term) || 0) + 0.5) / ((df.get(term) || 0) + 0.5));
    return score + idf * ((frequency * (k1 + 1)) / (frequency + k1 * (1 - b + b * doc.tokens.length / avgdl)));
  }, 0);
}

function trigrams(value) {
  return new Set(tokenize(value).flatMap((token) => Array.from({ length: Math.max(1, token.length - 2) }, (_, index) => token.slice(index, index + 3))));
}

function ngramScore(query, doc) {
  const left = trigrams(query);
  const right = trigrams(doc.text);
  const intersection = [...left].filter((item) => right.has(item)).length;
  return intersection / Math.max(1, new Set([...left, ...right]).size);
}

function rank(query, method) {
  return docs.map((doc) => ({
    id: doc.id,
    score: method === 'bm25' ? bm25(query, doc) : (bm25(query, doc) * 0.7 + ngramScore(query, doc) * 2),
  })).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}

function percentile(values, percentileValue) {
  const sorted = [...values].sort((a, b) => a - b);
  const position = (sorted.length - 1) * percentileValue;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  return sorted[lower] + ((sorted[upper] - sorted[lower]) * (position - lower));
}

const repeats = 100;
const perQuerySamples = 10;
const methods = ['bm25', 'hybrid-lexical-baseline'];
const runs = methods.map((method) => {
  const latencySamples = [];
  const perQuery = dataset.queries.map((query) => {
    const ranked = rank(query.query, method);
    for (let sample = 0; sample < perQuerySamples; sample += 1) {
      const start = performance.now();
      for (let repetition = 0; repetition < repeats; repetition += 1) rank(query.query, method);
      latencySamples.push((performance.now() - start) / repeats);
    }

    const relevant = new Set(query.relevant);
    const top = ranked.slice(0, 3);
    const hit = top.filter((item) => relevant.has(item.id)).length;
    const first = ranked.findIndex((item) => relevant.has(item.id));
    const dcg = top.reduce((sum, item, index) => sum + (relevant.has(item.id) ? 1 / Math.log2(index + 2) : 0), 0);
    const idealHits = Math.min(3, relevant.size);
    const idcg = Array.from({ length: idealHits }, (_, index) => 1 / Math.log2(index + 2)).reduce((sum, value) => sum + value, 0);
    return {
      id: query.id,
      retrieved_at_3: top.map((item) => item.id),
      relevant: [...relevant],
      recall_at_3: hit / relevant.size,
      reciprocal_rank: first < 0 ? 0 : 1 / (first + 1),
      ndcg_at_3: idcg ? dcg / idcg : 0,
    };
  });
  return {
    method,
    query_count: dataset.queries.length,
    recall_at_3: perQuery.reduce((sum, item) => sum + item.recall_at_3, 0) / perQuery.length,
    mrr: perQuery.reduce((sum, item) => sum + item.reciprocal_rank, 0) / perQuery.length,
    ndcg_at_3: perQuery.reduce((sum, item) => sum + item.ndcg_at_3, 0) / perQuery.length,
    latency_measurement: `${perQuerySamples} samples/query; each sample times ${repeats} local rankings and divides by ${repeats}`,
    latency_sample_count: latencySamples.length,
    p50_ms_per_query_ranking: Number(percentile(latencySamples, 0.5).toFixed(4)),
    p95_ms_per_query_ranking: Number(percentile(latencySamples, 0.95).toFixed(4)),
    per_query: perQuery,
  };
});

const report = {
  run_id: `baseline-${dataset.dataset_id}`,
  generated_at: new Date().toISOString(),
  dataset_id: dataset.dataset_id,
  dataset_sha256: crypto.createHash('sha256').update(datasetRaw).digest('hex'),
  corpus_document_count: docs.length,
  query_count: dataset.queries.length,
  relevance_labels: dataset.queries.reduce((sum, query) => sum + query.relevant.length, 0),
  implementation: 'Deterministic local Node.js BM25 and character-trigram hybrid ranking baseline. No embedding model, LLM, API key, or network request is used.',
  environment: { node: process.version, platform: process.platform, architecture: process.arch },
  latency_method: `Warm local process; ${perQuerySamples} timing samples per query; each sample averages ${repeats} consecutive rankings. These are CPU-only ranking timings, not request, network, or end-to-end RAG latency.`,
  limitations: [
    'Only six project-authored English queries over six short synthetic engineering snippets; relevance labels are authored with the fixture.',
    'The hybrid method combines lexical BM25 with character trigrams; it is not dense-vector or embedding retrieval.',
    'Retrieval metrics are diagnostic on this fixture and must not be generalized to production or model quality.',
    'Answer faithfulness, citation support, abstention, token cost, model behavior, and API latency are not measured.',
  ],
  runs,
};
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Local lexical baseline complete: ${runs.map((run) => `${run.method} Recall@3=${run.recall_at_3.toFixed(3)} MRR=${run.mrr.toFixed(3)} nDCG@3=${run.ndcg_at_3.toFixed(3)} P50/P95=${run.p50_ms_per_query_ranking}/${run.p95_ms_per_query_ranking}ms`).join(' | ')}`);
