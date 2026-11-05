---
title: "Agri-QA Agent: Separate Retrieval, Routing, and Evidence"
date: 2026-03-20
summary: "System boundaries for knowledge retrieval, intent routing, and evidence attribution in the existing Agri-QA project."
lab_category: engineering
cover: media/projects/cover-agri-qa.jpg
cover_alt: Concept art for an agricultural knowledge agent and retrieval routing
featured: true
featured_order: 3
repository: "https://github.com/1byteone/agri-qa-assistant"
project_page: "projects/agricultural-qa-agent/"
tech_stack: [Python, FastAPI, LangGraph, ChromaDB, SQLite, Next.js]
authors: [me]
---

Agri-QA is a completed agricultural question-answering prototype. It assigns domain retrieval, goal-oriented routing, and evidence citation to separate responsibilities instead of sending every question through one unbounded generation step.

## Request Path

![A plant illustration for the agricultural knowledge domain](/images/ai-lab/open-doodles/plant.svg)

*Illustration: Pablo Stanley / Open Doodles · CC0 1.0.*

{{< lab-diagram >}}
flowchart LR
  A[User question] --> B{Intent route}
  B -->|Domain question| C[Domain retrieval]
  B -->|General question| D[General answer]
  C --> E[Evidence-aware response]
  D --> E
  E --> F[Citation and confidence display]
{{< /lab-diagram >}}

Python / FastAPI defines the service boundary, LangGraph models query routing and tool flow, ChromaDB stores the vector index, and SQLite stores prototype conversation history. The public project description does not provide independently verifiable production SLAs or model evaluations, so this record makes no accuracy, throughput, or scale claims.

## Code And Project Record

- Project archive: [Agricultural Q&A System](/projects/agricultural-qa-agent/)
- Source: [agri-qa-assistant](https://github.com/1byteone/agri-qa-assistant)

Reproduction or extension should pin corpus versions, authorization policy, and evaluation data separately; prototype behavior is not production validation.
