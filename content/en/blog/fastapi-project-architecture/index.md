---
title: "FastAPI Project Architecture: Layering Routes and Domain Services"
date: 2026-08-21
summary: "Organize a FastAPI service with layers, dependency injection, and configuration so AI endpoints stay testable and deployable."
tags:
  - FastAPI
  - Python
  - Backend
  - Architecture
  - Tutorial
authors:
  - me
featured: true
---

![FastAPI — FastAPI Project Architecture](featured.png)

*Whiteboard: FastAPI — FastAPI Project Architecture.*

FastAPI makes it easy to start in one file—and easy to end up with an unmaintainable global script. A durable structure lets routes handle HTTP, services handle use cases, and repositories handle persistence.

## Core mental model

A useful direction is router → service → repository/provider, with dependencies injected through function parameters. Domain services should not depend on Request or HTTP status codes, so they can be reused by jobs and tests.

## Key mechanics

Load and validate configuration at startup. Create and close pools in the lifespan context. Map exceptions centrally to a stable error schema.

## Python example

```python
from fastapi import APIRouter, Depends
from pydantic import BaseModel

router = APIRouter(prefix="/v1/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    answer: str

@router.post("", response_model=ChatResponse)
async def chat(req: ChatRequest, service = Depends(get_chat_service)):
    return ChatResponse(answer=await service.answer(req.message))
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

Split a model-calling route into api, services, providers, and schemas. Inject a fake provider into the service and use TestClient to verify error mapping.

## Conclusion

An AI feature becomes maintainable when every arrow on the whiteboard maps to an input, an output, and a failure strategy.

