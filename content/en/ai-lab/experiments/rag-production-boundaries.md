---
title: "RAG Production Boundaries: Permissions, Index Versions, and Citations"
date: 2026-08-21
summary: "Split a RAG demo into ingest, indexing, query-serving, and evaluation planes that can be operated explicitly."
lab_category: experiments
cover: media/ai-lab/anthropic-reference/alignment-cyber-assessment.jpg
cover_alt: A collage of a vintage lighthouse and red hand-drawn marks used with Anthropic Research's cybersecurity incident assessment.
cover_credit: "Anthropic Research · An alignment assessment of recent cybersecurity incidents (reference image)"
featured: true
featured_order: 1
experiment_id: "EXP-2026-001"
status: completed
model: "No model comparison"
dataset: "Architecture review; no benchmark dataset"
method: "Boundary checklist review"
source_page: "ai-lab/experiments/rag-production-architecture/"
source_label: "Related technical article"
authors: [me]
---

This is an architecture review, not a model performance experiment. Its deliverable is a production-boundary checklist; no throughput or accuracy run was performed, so no fabricated metrics are shown.

## Question

A RAG demo returning an answer does not prove it can handle tenant permissions, document updates, deletion propagation, or upstream failures. The review asks whether those states are explicit in the system.

## Method

Separate the system into ingestion, indexing, query serving, and evaluation planes. Online queries read only the active index; a new index is built in the background and published through an atomic switch.

Check that cache keys include tenant, permission digest, and index version; that deletion events reach every replica; and that answers carry verifiable source citations.

## Findings

- Apply permission filters during retrieval. Do not rely on the generation model to ignore unauthorized context.
- Include the index version in cache keys so stale results do not survive an index switch.
- Evaluation data should cover permissions, citations, abstention, and document updates, not only semantic similarity.

## Evidence And Limits

This is an engineering design review without independent runtime measurements. The companion implementation notes are in [Production RAG Architecture](/en/ai-lab/experiments/rag-production-architecture/).

## Next Validation

Prepare a fixed dataset with tenant and permission labels, then measure Recall@K, citation support, authorization violations, and end-to-end latency with the environment and code revision recorded.

The following is a cache-isolation design sketch, not project source code or a run record:

```python
def retrieval_cache_key(tenant_id, permission_digest, index_version, query_hash):
    return (tenant_id, permission_digest, index_version, query_hash)
```
