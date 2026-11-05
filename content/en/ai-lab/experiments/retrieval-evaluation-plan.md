---
title: "Hybrid Retrieval Evaluation Plan: Fix The Questions Before Comparing Retrievers"
date: 2026-11-03
summary: "A reproducible method for RAG retrieval comparisons. No measured scores have been published yet."
lab_category: experiments
cover: media/ai-lab/anthropic-reference/automated-researchers.jpg
cover_alt: Colored points arranged on blue grid paper, used with Anthropic Research reporting on automated alignment research.
cover_credit: "Anthropic Research · Automated researchers can reliably mitigate alignment failures (reference image)"
featured: true
featured_order: 4
experiment_id: "EXP-2026-002"
status: planned
model: "Embedding and reranker versions to be selected"
dataset: "Labeled evaluation set to be built and reviewed"
method: "BM25, dense, and hybrid retrieval comparison"
source_page: "ai-lab/experiments/rag-retriever-optimization/"
source_label: "Related retrieval article"
authors: [me]
---

This remains the protocol for a full RAG evaluation. A separate local lexical baseline now runs over six authored snippets and six labeled queries: BM25 and BM25+n-gram both report Recall@3 0.917, MRR 0.917, and nDCG@3 0.874. The run is recorded in `docs/audit/ai-lab-retrieval-baseline.json`; these numbers validate the fixture and script only, not dense retrieval, reranking, model answers, or production quality.

## Question

With the same corpus, chunking, and latency budget, how much answer-supporting evidence do BM25, dense retrieval, and hybrid retrieval with a reranker find?

## Controls

- Pin the corpus snapshot, chunker revision, embedding model version, and query set.
- Record Top-K, filters, reranker version, hardware, and request concurrency.
- Store relevance labels, retrieved documents, ranking scores, and end-to-end latency for every query.

## Metrics

The planned metrics are Recall@K, MRR, nDCG, citation support, unsupported-answer rate, P50/P95 latency, and token use. Definitions and denominators must ship with the results.

## Status

PLANNED / full experiment not run. The local lexical smoke baseline is complete, but embeddings/reranker versions, a production-sized labeled set, and end-to-end answer metrics are still missing. A completed report must include data files, code revision, and reproduction steps.


