---
title: "Production RAG Architecture: Permissions, Versions, and Observability"
date: 2026-08-21
summary: "Design deployable RAG systems with ingestion, permission filters, index versions, caching, evaluation, and graceful degradation."
tags:
  - AI
  - RAG
  - Production
  - Architecture
  - Tutorial
authors:
  - me
featured: true
---


*Whiteboard: RAG — Production RAG Architecture.*

The gap between a RAG demo and production is mostly boundary conditions: who can see a document, how indexes update, how answers cite evidence, and what happens when an upstream is unavailable.

## Core mental model

Separate ingestion, indexing, query serving, and evaluation planes. Online traffic reads only the active index while new versions build in the background and switch atomically.

## Key mechanics

Enforce permissions during retrieval. Cache keys should include tenant, a permission digest, query-normalization version, and index version. Deletions must reach every replica.

## Python example

```python
from dataclasses import dataclass

@dataclass
class QueryContext:
    tenant_id: str
    allowed_collections: set[str]
    index_version: str

def cache_key(query: str, ctx: QueryContext) -> str:
    scopes = ",".join(sorted(ctx.allowed_collections))
    return f"rag:v2:{ctx.tenant_id}:{ctx.index_version}:{scopes}:{normalize(query)}"
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

Design active and candidate indexes. Simulate a failed publish and a document deletion, verify traffic never receives unauthorized stale data, and persist evidence ids for every answer.

## Conclusion

An AI feature becomes maintainable when every arrow on the whiteboard maps to an input, an output, and a failure strategy.

