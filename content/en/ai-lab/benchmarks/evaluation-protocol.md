---
title: "RAG Evaluation Protocol: Make Every Score Auditable"
date: 2026-11-03
summary: "A release checklist for evaluation results. No public model-comparison measurements are available yet."
lab_category: benchmarks
cover: media/ai-lab/anthropic-reference/frontier-measurements.jpg
cover_alt: A deep-to-light blue sky with sparse stars, used for Anthropic Research's frontier measurement feature.
cover_credit: "Anthropic Research · Illuminating the frontier (reference image)"
featured: true
featured_order: 5
experiment_id: "BMK-2026-001"
status: planned
dataset: "Not pinned"
method: "Offline retrieval and end-to-end answer evaluation"
authors: [me]
---

The lab currently has no public benchmark scores that can be independently reproduced. This page defines a release protocol; it does not use synthetic curves or sample numbers to imply performance.

## Required Run Record

{{< lab-math display >}}
\mathrm{Recall@K} = \frac{\text{relevant queries retrieved in top K}}{\text{total queries}}
{{< /lab-math >}}

- Dataset version, sample count, annotation policy, and data license.
- Model, embedding, reranker, prompt, chunker, and code revision.
- Hardware, batch size, concurrency, temperature, timeout, and retry policy.
- Metric definitions for Accuracy, Precision, Recall, F1, Recall@K, and related measures.
- Latency window, P50/P95, failed-request treatment, and token accounting.
- Raw predictions, error cases, run scripts, and reproducible environment.

## Current Status

PLANNED / no measurements. Charts will be published only after data review and repeated runs, with sample sizes and uncertainty disclosed for small datasets.
