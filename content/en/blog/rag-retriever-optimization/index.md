---
title: "Optimizing RAG Retrievers: Top-K, Hybrid Search, and Reranking"
date: 2026-08-21
summary: "Tune RAG retrievers with BM25, vector search, hybrid recall, reranking, and context compression trade-offs."
tags:
  - AI
  - RAG
  - Retrieval
  - Search
  - Tutorial
authors:
  - me
featured: true
---


*Whiteboard: RAG — Optimizing RAG Retrievers.*

The goal of retrieval optimization is not to retrieve as much as possible. It is to rank supporting evidence first within a context and latency budget.

## Core mental model

Keyword search excels at exact terms while vector search captures semantics. Hybrid retrieval merges candidates, then a reranker scores the query-document pair.

## Key mechanics

Tune chunk size, overlap, K, thresholds, and reranking on an offline set. Higher recall can add noise; evaluate nDCG, answer support rate, and end-to-end latency together.

## Python example

```python
def hybrid_retrieve(query: str, k: int = 20):
    dense = vector_store.search(query, k=k)
    lexical = bm25.search(query, k=k)
    candidates = deduplicate(dense + lexical)
    ranked = reranker.rank(query, candidates)
    return [item for item in ranked if item.score >= 0.35][:5]
```

## Course focus

This article turns the whiteboard into explicit engineering boundaries: define inputs and outputs first, then decide how state, failures, and observability work. The examples use Python and focus on durable design principles rather than a particular provider version; verify APIs against the documentation for your installed dependencies.

## Engineering practice

- Keep business rules in the application layer instead of hiding them in untestable prompts or route handlers.
- Add timeouts, bounded retries, and idempotency keys to external calls; retries are not a complete error strategy.
- Record a request id, latency, input version, model/index version, and outcome without logging sensitive raw content.
- Use a small fixed regression set first, then monitor quality and cost with sampled production traffic.

## Common mistakes

- Drawing only the happy path and omitting timeouts, empty results, rate limits, and rollback paths.
- Letting one function parse input, call providers, build prompts, and persist data.
- Replacing typed contracts with string conventions that can only be verified by manual integration.

## Production checklist

- [ ] Inputs, outputs, and error responses have explicit schemas
- [ ] External dependencies have timeouts, bounded retries, rate limits, and fallbacks
- [ ] Logs, metrics, and traces can be correlated to one request
- [ ] Critical paths have unit tests, integration tests, and offline evaluation samples
- [ ] Secrets, user content, and provider responses follow least-privilege and privacy rules

## Practice

Implement the smallest loop shown on the whiteboard. Inject a timeout, an empty result, and a malformed payload, then check whether the system remains stable and diagnosable. Add one metric that proves your optimization improved quality or latency.

## Hands-on exercise

Build queries with abbreviations, numbers, and paraphrases. Compare vector-only, BM25-only, hybrid, and reranked variants with Recall@K and latency curves.

## Conclusion

An AI feature becomes maintainable when every arrow on the whiteboard maps to an input, an output, and a failure strategy.

