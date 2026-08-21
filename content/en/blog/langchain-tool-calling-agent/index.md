---
title: "LangChain Tool-Calling Agents: Separate Decisions from Execution"
date: 2026-08-21
summary: "Design controllable agents with explicit tool schemas, decision loops, execution boundaries, and error recovery."
tags:
  - AI
  - Agent
  - LangChain
  - Tool Calling
  - Tutorial
authors:
  - me
featured: true
---


*Whiteboard: LangChain — LangChain Tool-Calling Agents.*

An agent should not give a model direct access to your system. The model proposes a structured tool intent; the application validates and executes it. The central boundary is: the model decides, the application executes.

## Core mental model

The loop is Think → Call → Observe, while the host application controls iteration limits, tool allowlists, parameter validation, and permissions. Good descriptions improve selection but are not security policies.

## Key mechanics

Tools should return machine-readable success or failure results; do not expose raw stack traces to the model or user. Require explicit confirmation for writes and emit an audit event for every call.

## Python example

```python
from langchain_core.tools import tool

@tool
def get_weather(city: str) -> dict:
    """Return current weather for an allowed city."""
    if city not in {"Shanghai", "Beijing"}:
        return {"ok": False, "error": "city_not_allowed"}
    return {"ok": True, "city": city, "celsius": 26}

llm_with_tools = model.bind_tools([get_weather])
message = llm_with_tools.invoke("Is Shanghai good for a run today?")
if message.tool_calls:
    result = get_weather.invoke(message.tool_calls[0]["args"])
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

Add one read-only search tool and one side-effecting refund tool. Auto-run the first, return requires_confirmation for the second, and test that the agent cannot bypass confirmation.

## Conclusion

An AI feature becomes maintainable when every arrow on the whiteboard maps to an input, an output, and a failure strategy.

