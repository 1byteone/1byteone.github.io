---
title: "The Evidence Chain In Retrieval-Augmented Generation"
date: 2026-08-21
summary: "Break RAG quality into observable retrieval, ranking, context, and answer-support stages."
lab_category: research
cover: media/ai-lab/anthropic-reference/provable-inference.jpg
cover_alt: A collage of chains, handwritten notes, and computation charts used for Anthropic Research's work on provable inference.
cover_credit: "Anthropic Research · Progress on provable inference for large language models (reference image)"
featured: true
featured_order: 2
research_id: "RES-2026-001"
source_page: "ai-lab/experiments/rag-retriever-optimization/"
source_label: "Retrieval optimization notes"
authors: [me]
---

RAG answer quality is not a single vector-similarity problem. The system must find candidate evidence, rank it by task relevance, and determine whether each important generated claim is supported by the context.

## Four Stages

1. **Recall**: BM25 helps with exact terms and identifiers; dense retrieval covers semantically similar phrasing.
2. **Ranking**: Hybrid candidates can be reranked using the query and passage together.
3. **Context**: Deduplication, authorization filters, and a length budget decide what reaches the prompt.
4. **Answer support**: Citations must point to real passages, and the system needs an abstention path when evidence is insufficient.

## Metrics That Need Context

Higher recall may simply add noise. Offline ranking metrics alone do not establish answer faithfulness; end-to-end evaluation also needs citation support, unsupported-answer rate, and latency.

The companion implementation notes are in [RAG Retriever Optimization](/en/ai-lab/experiments/rag-retriever-optimization/). The repository currently publishes only a small lexical-baseline diagnostic; dense, reranker, and answer-support metrics will be added after measurement on the same dataset and pinned versions.

