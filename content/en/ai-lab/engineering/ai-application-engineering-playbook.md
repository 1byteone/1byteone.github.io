---
title: "From One AI Request to an Operable System: An Engineering Playbook for AI Applications"
date: 2026-11-05
summary: "An end-to-end guide to boundaries, RAG, agents, streaming cancellation, evaluation, observability, failure analysis, and a reusable engineering prompt for AI interns."
description: "A practical AI engineering guide for interns that separates the Agri-QA prototype’s documented facts from recommendations, teaching examples, and untested hypotheses."
lab_category: engineering
status: published
cover: media/projects/cover-agri-qa.jpg
cover_alt: "Architecture illustration of a retrieval augmented generation system"
tech_stack: [Python 3.10+, FastAPI, LangGraph, ChromaDB, SQLite, Next.js 14]
authors: [me]
translationKey: "ai-application-engineering-playbook"
---

> **Evidence boundary:** This article uses the public description of the Agri-QA agricultural question-answering prototype as a learning context. That description lists Python, FastAPI, LangGraph, ChromaDB, SQLite, and Next.js. The material available here does not provide a reproducible production SLA, concurrency test, labeled quality dataset, or cost report. Metrics below are an evaluation plan, code is teaching pseudocode unless noted, and before/after comparisons describe target designs rather than shipped or measured improvements.

AI application engineering is rarely just “how to call a model.” A useful system must behave coherently when input is incomplete, retrieval returns nothing, a provider times out, a tool receives invalid arguments, a user leaves mid-stream, permissions change, or model output drifts. Engineering quality comes from boundaries, state ownership, failure policy, and evidence—not from making a prompt longer.

This playbook follows a request through its lifecycle: define the product contract, design system boundaries, reason about prompts and retrieval, constrain tools, validate outputs, stream and cancel work, observe failures, evaluate changes, and learn by teaching the design back. It closes with a reusable professional prompt and an intern practice path.

## 1. Define the product boundary first

Consider a user asking an agricultural assistant: “Brown spots have appeared on my plant leaves. What should I spray?” This may involve symptom interpretation, retrieval, consequential advice, and missing context about plant, region, or growth stage. If the application simply puts the text into a prompt and asks the model to “answer accurately,” product and safety decisions have been delegated to probabilistic generation.

Turn the goal into observable acceptance criteria:

1. For in-domain questions, use only sources the current user may access.
2. Provide traceable evidence for factual claims; state when evidence is insufficient.
3. Route consequential or ambiguous advice to a qualified person rather than presenting a confident guess as fact.
4. Return a stable response contract that the UI, logs, and evaluation pipeline can consume.
5. When a user cancels, stop work that is no longer needed and release resources where the SDK permits it.

These are product behaviors, not a promise that a model is always right. Convert them to tests, state transitions, and safety rules so a failure can be located at a boundary.

The Agri-QA prototype is a learning example, not proof of an automatically validated crop-disease diagnosis system. Its public description does not establish model quality, production scale, or an SLA. For actionable agricultural guidance, domain experts must define source quality, risk categories, disclaimers, and escalation policy. Engineers implement those decisions as permissions, routing, and validation; they should not invent domain conclusions.

## 2. Treat each layer as a contract

    Browser / Mobile → HTTPS/SSE → API boundary
      authentication, authorization, rate limits, request ID
                 ↓ validated command
      application use case
        ├─ intent / policy router
        ├─ retrieval port → ACL filter → vector / keyword index
        ├─ model port → provider adapter
        └─ tool port → allowlist / approval / idempotency
                 ↓ typed result + evidence + status
      output validation → persistence / audit / trace → client

This isolates change: replacing a provider should not rewrite domain policy; replacing a vector store should not change the API contract; the UI should not decide transaction boundaries; a model’s proposed side effect should not execute by itself.

| Boundary | Input | Output | Failure behavior |
| --- | --- | --- | --- |
| API | Authenticated request and actor/tenant context | Validated command, request ID | 401/403, invalid payload, rate limit |
| Use case | Command and dependency interfaces | Typed business result | Refusal, timeout, recoverable status |
| Retrieval | Query, permissions, index version | Ranked evidence and metadata | No evidence, unavailable index, stale access |
| Model | Versioned messages and timeout budget | Response or stream events | 429/5xx, timeout, refusal, cancellation |
| Tool | Validated name and arguments | Result and idempotency reference | Unauthorized action, duplicate, approval wait |
| Output validator | Untrusted model output | Schema-validated object | Invalid shape, out-of-range field, refusal |

**Intern exercise:** write a Python type or JSON Schema for each arrow. For each dependency, identify who creates it, releases it, owns its timeout, and receives cancellation. An unanswered question often reveals hidden coupling.

## 3. Prompts are versioned contracts, not security controls

A prompt may define role, task, context, evidence, output contract, and refusal policy. It is not an authorization mechanism, database constraint, or executable control flow. “Do not access another tenant’s data” cannot replace a query filter on tenant ID.

A maintainable prompt defines: the variables and their provenance; which passages are untrusted; schema fields, enums, and length limits; refusal states; prompt/model/retriever/index versions; and regression cases. Do not interpolate arbitrary data into system instructions. Treat retrieved instructions as data. A schema-valid citation still needs application-side verification.

Teaching schema sketch (not drop-in provider code):

    from typing import Literal
    from pydantic import BaseModel, Field

    class Citation(BaseModel):
        evidence_id: str  # app-created, e.g. manual:v3:chunk:0042
        document_id: str
        document_version: str
        chunk_id: str
        quote: str = Field(min_length=1, max_length=800)

    class Answer(BaseModel):
        status: Literal["answered", "needs_review", "insufficient_evidence"]
        answer: str = Field(max_length=4000)
        citations: list[Citation]
        next_step: str | None = None

The application should create the canonical evidence ID from document ID, source version, and chunk ID; the model may select only IDs from this request’s candidates. Verify that each citation remains active, belongs to the authorized retrieval set, and supports the claim. Render quotations from the verified source rather than trusting model-rewritten text. Valid JSON does not prove semantic correctness.

## 4. RAG is an evidence pipeline

Retrieval-Augmented Generation has offline ingestion and online answering:

    Source → parse/normalize → chunk + metadata → embed → versioned index
    Query → identity/ACL → keyword + vector retrieval → optional reranking
          → deduplicate/context budget → generate → validate citations/output

In ingestion, retain parser version; preserve structural units such as tables and policy clauses; attach source, tenant, access labels, locale, effective date, version, and deletion state; pin embedding model, dimensions, and normalization. When components change, build a candidate index, validate it, and switch an active pointer only when ready. Keep rollback possible.

For online requests, authenticate and constrain the candidate set before retrieval. Do not retrieve across tenants and ask the model to ignore unauthorized passages. BM25 helps exact terminology, vectors help varied phrasing, hybrid retrieval combines signals, and a reranker may improve ordering at added latency and cost. Choose with a fixed corpus, labeled queries, and a latency budget—not because a component sounds advanced.

Cache keys must include security and index context, such as tenant, permission digest, active index version, normalization version, and normalized query hash. Omitting access or index version can expose stale data after permission changes, deletion, or index publication.

If evidence is insufficient, return an explicit insufficient_evidence or needs_review state. Raising temperature or saying “be accurate” does not repair missing evidence. See the [RAG evidence record](/en/ai-lab/research/retrieval-evidence/) and [hybrid retrieval evaluation plan](/en/ai-lab/experiments/retrieval-evaluation-plan/); these are records, not published benchmark results.

## 5. Agents propose; applications authorize and execute

A controlled tool cycle is: model proposes a tool → application validates name and arguments → authorization and risk policy → execution → normalized result → continue or finish. A model-generated function call is an **untrusted proposal**, not an authorization token. Enforce allowlists, schema checks, actor/resource authorization, deadlines, and audit in application code.

| Risk | Example | Controls |
| --- | --- | --- |
| Read-only | Look up public crop knowledge | Data filtering, rate limit, redaction |
| Low-risk write | Save a draft | Actor/CSRF checks, idempotency, reversible record |
| High-impact | Send notification, place order, alter critical setting | Explicit authorization, confirmation/approval, audit and compensation |

Retries can repeat side effects. Define idempotency keys, replay behavior, compensation, unknown state after timeout, and human resolution. “Retry every failed tool” is not a recovery policy.

## 6. Streaming, cancellation, and backpressure

Server-Sent Events (SSE) are one-way HTTP events from server to client, not WebSockets. They do not automatically manage provider generation lifetime. Define behavior for disconnects, proxy buffering, reconnects, and provider work. Distinguish token, status, error, and done events; never expose keys, internal prompts, stack traces, or unauthorized passages in errors. If reconnect is supported, specify event IDs and Last-Event-ID behavior.

Verify Content-Type is text/event-stream, caching is appropriate, and the deployment proxy does not buffer events. A proxy may require buffering to be disabled and heartbeat events. Emit at most one terminal event (done or error), and still clean up if the client disconnects first.

Lifecycle pseudocode, not SDK-specific runnable code:

    async def stream_answer(request, provider, command):
        upstream = await provider.open_stream(command)
        try:
            async for event in upstream:
                if await request.is_disconnected():
                    break
                yield encode_sse(event)
        finally:
            await upstream.aclose()

Confirm installed SDK cancellation semantics. Release the provider stream, generator, response, semaphore, and temporary resources. Calling a synchronous model SDK in async code can block the event loop; prefer a truly async client or a bounded thread pool.

**Backpressure** occurs when the consumer cannot keep up with the producer. Bound queues or apply flow control. Split deadlines across connection, retrieval, time-to-first-token, and total response. Nested retry loops must share the deadline or amplify an outage.

## 7. Setbacks: symptom → cause → fix → regression test

These are common risks, not claims that Agri-QA experienced each incident. Provider APIs vary by version.

| Symptom | Likely cause | Fix and regression test |
| --- | --- | --- |
| Fluent answer cites deleted or cross-tenant data | ACL only in prompt; no source/version verification | Filter before retrieval; verify citations against authorized candidates. Test cross-tenant, deleted, and expired sources. |
| Closing stream leaves generation running | Disconnect is not propagated; cleanup absent | Use request-scoped cancellation and finally cleanup. Disconnect a fake long stream and assert resources are released. |
| JSON intermittently fails to parse | Prompt wording mistaken for schema enforcement | Use supported structured output plus Pydantic/JSON Schema. Test malformed, truncated, refusal, and old-schema cases. |
| Retries amplify 429s or duplicate a write | No shared deadline or idempotency | Bound transient retries with backoff/jitter; honor Retry-After. Inject 429, timeout, 5xx, duplicates, and assert caps. |
| Deleted text still appears after index update | Unversioned index/cache | Build and validate versioned candidate index, atomically switch, isolate cache. Test update, deletion, activation, rollback. |
| Long conversations retain deleted facts | History, long-term memory, tool state, profile conflated | Define owner, TTL, deletion, and inference policy for each state. Test budget, isolation, deletion, summary drift. |
| Quality regression cannot be reproduced | Missing versions, trace IDs, stage timing—or excessive sensitive logs | Correlate with request/trace ID; log versions, status, timing and error class, redact raw data. Test trace schema and redaction. |

## 8. Before/after design and measurable proof

| Area | Common initial sketch | Target design | Evidence |
| --- | --- | --- | --- |
| API | Route queries DB and calls model | Router validates, use case orchestrates, adapters isolate dependencies | Inject fakes; provider change does not alter domain rules |
| RAG access | Retrieve broadly, tell model to ignore | Filter before retrieval and verify citations | Zero unauthorized retrieval in security cases |
| Output | Arbitrary text for UI | Typed response, schema validation, refusal state | Malformed/refusal/legacy tests pass |
| Streaming | Browser only stops rendering | Disconnect reaches provider and cleanup | Fake stream cancels and releases resources |
| Retry | Independent loops per layer | Shared deadline, retry budget, idempotency | Fault injection proves bounded attempts/queues |
| Index | Overwrite active index | Candidate → validate → atomic switch → rollback | Fixed corpus reproduces switch and rollback |
| Quality | “Looks good” | Golden set, metrics, human review, traces | Save evaluation version and error breakdown |
| Privacy | Log everything | Minimize, redact, measure stages, audit access | Access, deletion, and redaction rules tested |

This is a design comparison, not a performance benchmark. Without fixed data, environment, and code version, do not claim a percentage improvement.

Evaluation should fix corpus snapshot, chunker, embedding model, and query set. Define metrics and annotation rules:

- **Recall@K:** relevant documents in top K divided by all labeled relevant documents; state aggregation. Queries with no relevant documents must be reported separately and assessed for abstention, not divided by zero.
- **MRR:** average reciprocal rank of the first relevant result. State whether no-match queries score zero or are excluded.
- **nDCG@K:** publish graded relevance and gain function.
- **Citation Support Rate:** answer claims supported by cited evidence divided by all claims requiring external support. Define claim segmentation and annotator adjudication; report refusal cases separately.
- **Permission violation rate:** any unauthorized context or output is a security defect; averages must not hide one breach.
- **P50/P95 latency:** report retrieval, first token, and completion separately.
- **Cost per task:** count input/output tokens, retries, embeddings, reranking, and tools; include currency, price date, and request definition.

No single metric represents quality. Preserve dataset, labels, versions, refusal rules, and human-review notes. The current [evaluation plan](/en/ai-lab/experiments/retrieval-evaluation-plan/) is planned and has no measured score.

## 9. Observability without excessive data collection

Trace request/trace ID; a non-sensitive tenant identifier; prompt/model/provider versions; corpus/chunker/embedding/index versions; retrieval candidate and evidence IDs; filter reasons; tool and authorization state; latency by stage; tokens/retries; disconnect/cancel status; schema and citation-validation result.

Do not log full prompts, private questions, keys, credentials, or unauthorized source text by default. Trace data is sensitive: define readers, retention, redaction, deletion, and access-request handling.

## 10. Security checklist

- Treat retrieved text as data; test direct and indirect prompt injection.
- Derive actor and tenant from authenticated context, never model output.
- Restrict tools with allowlists and resource-level authorization.
- Validate output for the target interpreter (HTML, SQL, shell, URL).
- Keep provider keys on the server; obfuscated browser keys are still extractable.
- Cap input, file size, concurrency, queues, tool steps, tokens, total cost, and duration.
- Distinguish retry, fallback, alternate model, and refusal; never bypass validation on fallback.
- Audit sensitive writes and settings.

## 11. Two-week intern practice plan

| Day | Focus | Reviewable deliverable |
| --- | --- | --- |
| 1–2 | Typing, Pydantic, HTTP, async boundaries | Request/response/error models and input tests |
| 3 | FastAPI, DI, settings, fake provider | Tests that need no real API key |
| 4–5 | Prompt, structured output, timeout, refusal | Versioned prompt, schema, invalid-output tests |
| 6–7 | Parsing, chunk metadata, retrieval | Reproducible corpus and retrieval record |
| 8 | ACL and citation checks | Two-tenant and source-attribution tests |
| 9 | Tool schema, allowlist, idempotency | Safe read tool and rejected unauthorized call |
| 10 | SSE, first token, cancellation | Fake-stream cleanup test |
| 11–12 | Golden set, metrics, traces | Annotation protocol, metric script, failure examples |
| 13 | 429, timeout, empty retrieval, bad JSON | Bounded retry, timeout, fallback evidence |
| 14 | README, architecture, tradeoffs | Reproducible setup and retrospective |

Each commit should state why a change exists and how it was tested. Do not add frameworks and infrastructure as résumé keywords; use them when they solve orchestration, lifecycle, or observability needs.

## 12. Feynman practice

![An editorial illustration of a person reading and learning](/images/ai-lab/open-doodles/reading.svg)

*Illustration: Pablo Stanley / Open Doodles · CC0 1.0.*

1. Pick one narrow question, such as why authorization must precede generation.
2. Explain it without jargon: an ACL is like a librarian checking borrowing rights before placing a book on the desk.
3. Find where the explanation breaks and return to code, data, or tests. “The framework handles it” is not an explanation.
4. Draw inputs, state, outputs, and failure routes; teach it back and write a test.

Add active recall: close the notes and answer whether a failed tool call should always retry, when retry is safe, and how duplicate side effects are prevented. Use spaced review. Explanation does not replace tests; it exposes assumptions the tests can check.

Exercises: explain retrieval vs generation and why retrieval is not evidence; draw cancellation from browser disconnect to provider cleanup; sketch the tool authorization boundary; show valid JSON versus semantically supported content; calculate Recall@K for five documents and explain its limits.

## 13. Retrospective

Engineering maturity is not adding more models. It is turning uncertainty into auditable state: schema-validated input, deadlines, scoped retrieval, evidence identifiers, authorized/idempotent tools, cancellable streams, fixed evaluation data, and redacted logs.

Content integration has parallel lessons: shared prose still needs destination categories; routes, cross-links, and language pairs must agree; Page Bundle covers need an explicit Hugo asset path; taxonomy metadata is a build contract; and engineering skill is clearest when failure cases, tests, and evidence accompany the implementation. These constraints do not imply a production SLA. Release still needs a passing build, working links, readable covers, paired translations, and interaction checks.

## 14. Reusable professional development prompt

    ROLE
    You are a senior AI application architect, Python/FastAPI engineer,
    RAG and agent reviewer, SRE/security reviewer, and mentor for interns.

    TASK
    Write a complete engineering article about [real project or feature] for
    [blog theme/category]. Readers are AI application development interns
    who know [prerequisites]. Help them explain the system, reproduce steps,
    verify failure handling, and identify claims not proven by data.

    PROJECT FACTS — use only these as sources of project-specific claims
    - Product goal and user scenario: [fill in]
    - Repository, commit, and source paths: [verifiable references]
    - Implemented workflows, APIs, and data models: [list]
    - Technology stack and versions: [fill in]
    - Reproducible experiments, tests, environment, and raw results:
      [fill in; otherwise say “not provided”]
    - Known limitations, unimplemented work, privacy and security limits:
      [fill in]
    - Reader prerequisites and knowledge gaps: [fill in]

    EVIDENCE RULES
    1. Label verified facts, recommendations/teaching examples, and
       assumptions awaiting validation. Claim implementation only with code,
       tests, runtime evidence, or a cited source.
    2. Never invent accuracy, recall, latency, throughput, user counts,
       savings, deployment status, code details, or incidents. Without data,
       propose metrics, dataset, comparison method, and reproduction steps.
    3. Identify framework/SDK versions; verify version-sensitive APIs or
       explain how to verify them.
    4. Do not disclose secrets or personal data. Explain redaction,
       authorization boundaries, and retention.
    5. A prompt instruction is not authorization, validation, or a security
       guarantee.

    REQUIRED CONTENT
    - Scenario, goals, non-goals, prerequisites, acceptance criteria.
    - End-to-end architecture; each boundary’s inputs, outputs, state owner,
      and failure responsibility.
    - Glossary defining relevant terms on first use: RAG, embeddings, hybrid
      search, reranking, agents, tool calling, structured output, SSE,
      backpressure, timeout, retry, idempotency, tracing, Recall@K, MRR.
    - Data flow and code, marked runnable or pseudocode, with versions,
      failure branches, and tests. Never invent repository code.
    - Prompt/context design: role, untrusted data, evidence, variable contract,
      schema, refusal, injection defense, versioning, regression evaluation.
    - At least two viable approaches and their use cases, cost, latency,
      reliability, maintenance, and selection rationale.
    - Troubleshooting as symptom → root cause → diagnostic evidence → fix →
      regression test. Label project incidents separately from common risks.
    - Before/after comparison on the same input, corpus, and environment;
      if unmeasured, keep it qualitative and invent no percentages.
    - Evaluation and observability: logs, metrics, traces, versions, dataset,
      formula, annotation protocol, baseline, acceptance threshold; mark
      unrun evaluation as planned.
    - Security review: injection, ACL/multi-tenancy, tools, secrets, logs,
      resources/cost, approval, and graceful degradation.
    - Intern learning path with prerequisites, artifacts, tests, and acceptance.
    - Feynman practice, active recall, retrospective, open risks, next tests,
      and pre-release checklist.

    STYLE
    - Write primarily in [language], preserving standard English terms.
    - Use clear headings, tables, diagrams, and short code blocks.
    - Explain why, then mechanism, implementation, failure, and verification.
    - Separate observation, recommendation, and inference; link key claims to
      evidence or a verification step.
    - Avoid unsupported “production-grade,” “high-performance,” and
      “state-of-the-art accuracy” claims.
    - End with reproduction environment, commands, tests, sources, limits,
      and last verification date.

    Before drafting, list missing critical facts. If a gap affects safety or
    project truth, do not guess; mark it “author confirmation required” while
    completing sections supported by evidence.

### Pre-publication checklist

- [ ] Implementation claims point to source, tests, or runtime evidence.
- [ ] Numbers include data, environment, version, denominator, and method.
- [ ] Code states whether it runs; APIs and imports are version-checked.
- [ ] Failure analysis includes cause and regression test.
- [ ] Choices say when they may not apply.
- [ ] Injection, ACL, idempotency, timeout, cancellation, and sensitive logs
      are reviewed.
- [ ] Feynman exercises are verifiable by diagram, calculation, or test.
- [ ] Routes, citations, cover, and language switch are checked.

## Closing

The project-specific facts in this article are limited to the public project description and the linked AI Lab architecture note. Authentication, streaming cancellation, thresholds, workload, and commercial deployment are recommendations or unverified plans—not confirmed implementation details. A mature AI application delivers on the normal path, stops when evidence is insufficient, refuses when authorization is missing, recovers within defined limits, and gives engineers enough information to understand what happened. The most transferable intern skill is not memorizing an SDK. It is reasoning about contracts, state, failure, and proof.

### Further reading

- [Agri-QA agent architecture](/en/ai-lab/engineering/agri-qa-architecture/)
- [RAG evidence and attribution](/en/ai-lab/research/retrieval-evidence/)
- [Production RAG boundary review](/en/ai-lab/experiments/rag-production-boundaries/)
- [Hybrid retrieval evaluation plan](/en/ai-lab/experiments/retrieval-evaluation-plan/)
- [SSE cleanup after disconnect](/en/ai-lab/field-notes/sse-disconnect-cleanup/)
- [Agri-QA Assistant source and project description](https://github.com/1byteone/agri-qa-assistant): verify implementation and dependency versions against the current repository and lockfile.

