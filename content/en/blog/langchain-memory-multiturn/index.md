---
title: "LangChain Memory: Designing Controlled Multi-Turn State"
date: 2026-08-21
summary: "Design conversation history, summary memory, and long-term memory with clear state, capacity, and privacy boundaries."
tags:
  - AI
  - LangChain
  - Memory
  - Agent
  - Tutorial
authors:
  - me
featured: true
---


*Whiteboard: LangChain — LangChain Memory.*

The challenge of multi-turn chat is not putting every message back into the prompt. It is deciding which facts to retain, for how long, and who can delete them. Memory is explicit data, not an implicit model capability.

## Core mental model

Short-term memory serves the current conversation, summaries compress earlier turns, and long-term memory stores consented preferences. All three need a conversation id, tenant isolation, and retention policy.

## Key mechanics

Budget tokens before deciding whether to truncate or summarize. Filter PII and deduplicate before writing long-term memory. When reading memory, include source and timestamp so stale facts do not override newer ones.

## Python example

```python
from dataclasses import dataclass
from datetime import datetime

@dataclass
class MemoryItem:
    conversation_id: str
    text: str
    source: str
    created_at: datetime

def build_context(history: list[MemoryItem], max_chars: int = 6000) -> str:
    selected, size = [], 0
    for item in reversed(history):
        if size + len(item.text) > max_chars: break
        selected.append(f"[{item.source}] {item.text}")
        size += len(item.text)
    return "\n".join(reversed(selected))
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

Implement three context layers—recent turns, a conversation summary, and user preferences—and record which message ids each summary covers. When deleting a conversation, verify caches, vector stores, and audit copies are all removed.

## Conclusion

An AI feature becomes maintainable when every arrow on the whiteboard maps to an input, an output, and a failure strategy.

