---
title: "FastAPI Request and Response Contracts with Pydantic"
date: 2026-08-21
summary: "Use Pydantic schemas, field validation, response shaping, and consistent errors instead of fragile dictionary conventions."
tags:
  - FastAPI
  - Pydantic
  - API Design
  - Python
  - Tutorial
authors:
  - me
featured: true
---


*Whiteboard: FastAPI — FastAPI Request and Response Contracts with Pydantic.*

AI endpoints receive untrusted client input and often relay unstable model or third-party output. Pydantic schemas create the first boundary by turning data that looks right into data that has been validated.

## Core mental model

Request models validate inputs, domain models enforce business invariants, and response models define the public surface. Do not return ORM objects or raw provider JSON directly.

## Key mechanics

Bound string lengths, use Literal for enumerations, and model nested structures. Parse model output before returning it; route failures through an observable 502/422 branch.

## Python example

```python
from typing import Literal
from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    mode: Literal["answer", "summarize"] = "answer"

class ChatResponse(BaseModel):
    request_id: str
    answer: str
    citations: list[str] = Field(default_factory=list)
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

Add request_id, length limits, a mode enum, and citations to a Q&A endpoint. Submit an empty string, oversized text, unknown mode, and missing fields and verify stable client errors.

## Conclusion

An AI feature becomes maintainable when every arrow on the whiteboard maps to an input, an output, and a failure strategy.

