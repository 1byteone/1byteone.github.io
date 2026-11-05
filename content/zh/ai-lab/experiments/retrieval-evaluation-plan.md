---
title: "混合检索评测计划：先固定问题，再比较检索器"
date: 2026-11-03
summary: "定义一套可以复跑的 RAG 检索对比方法；目前没有发布任何实测分数。"
lab_category: experiments
cover: media/ai-lab/anthropic-reference/automated-researchers.jpg
cover_alt: 蓝色网格纸上排列的彩色圆点图，源自 Anthropic Research 的自动化对齐评测配图。
cover_credit: "Anthropic Research · Automated researchers can reliably mitigate alignment failures（参考配图）"
featured: true
featured_order: 4
experiment_id: "EXP-2026-002"
status: planned
model: "待选定 embedding 与 reranker 版本"
dataset: "待构建并审核标注集"
method: "BM25、向量召回与混合召回对比"
source_page: "ai-lab/experiments/rag-retriever-optimization/"
source_label: "相关检索优化文章"
authors: [me]
---

本条目仍是完整 RAG 评测的待执行方案。当前已经先运行一个独立的、项目自有的 lexical baseline：6 个查询、6 条短文档，BM25 与 BM25+n-gram 均为 Recall@3 0.917、MRR 0.917、nDCG@3 0.874。记录见 `docs/audit/ai-lab-retrieval-baseline.json`；这些分数只验证脚本和标注口径，不代表向量检索、reranker、模型回答或生产质量。

## 实验问题

在相同语料、切分方式和延迟预算下，BM25、向量召回、混合召回加 reranker 分别能找到多少支持答案的证据？

## 控制变量

- 固定语料快照、chunker 版本、embedding 模型版本与查询集合。
- 记录 Top-K、过滤条件、reranker 版本、硬件和请求并发。
- 每个查询保存相关文档标注、召回结果、排序分数和端到端耗时。

## 指标

计划记录 Recall@K、MRR、nDCG、引用支持率、无依据回答率、P50/P95 延迟和 token 消耗。指标定义和分母需要随结果一起发布。

## 状态

PLANNED / 完整实验尚未运行。已完成的是可复跑的本地 lexical smoke baseline；尚未选择 embedding/reranker、尚未构建生产规模标注集，也没有发布端到端回答分数。实验完成后再发布数据文件、代码版本和复现步骤。


