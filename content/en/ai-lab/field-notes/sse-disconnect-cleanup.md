---
title: "Who Cancels The Upstream Task After An SSE Client Disconnects?"
date: 2026-08-21
summary: "The SSE connection lifecycle must end together with generation, model requests, and billable work."
lab_category: field-notes
cover: media/ai-lab/anthropic-reference/unintended-model-actions.jpg
cover_alt: A collage of paper tables, line plots, and a red marker used with Anthropic Research's report on unintended model actions.
cover_credit: "Anthropic Research · Investigating unintended model actions (reference image)"
source_page: "ai-lab/engineering/fastapi-ai-streaming-api/"
authors: [me]
---

Once a server starts sending SSE, closing the browser does not automatically stop the model request. If the upstream stream continues after the client disconnects, background work consumes connections, memory, and model quota.

## Review Notes

- Use `try/finally` in the generator to release model responses, HTTP clients, and semaphores.
- Check for client disconnects before waiting for the next model chunk, then propagate cancellation upstream.
- Log the request id, termination reason, and cleanup result; do not record a disconnect as successful completion.
- Test normal completion, model errors, client cancellation, and server timeout as separate termination paths.

## Evidence

Implementation notes are in [FastAPI AI Streaming APIs](/en/ai-lab/engineering/fastapi-ai-streaming-api/). This is an engineering note, not a claim that deployed model traffic is currently monitored.
