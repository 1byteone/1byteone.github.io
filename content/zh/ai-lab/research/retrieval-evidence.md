---
title: "检索增强生成的证据链：从候选片段到可核验回答"
date: 2026-08-21
summary: "把 RAG 的质量问题拆成检索、排序、上下文和回答支持四个可观察环节。"
lab_category: research
cover: media/ai-lab/anthropic-reference/provable-inference.jpg
cover_alt: 链条穿过手稿与计算图表的拼贴，源自 Anthropic Research 的可验证推理研究配图。
cover_credit: "Anthropic Research · Progress on provable inference for large language models（参考配图）"
featured: true
featured_order: 2
research_id: "RES-2026-001"
source_page: "ai-lab/experiments/rag-retriever-optimization/"
source_label: "检索优化原文"
authors: [me]
---

RAG 的回答质量不是单一的“向量相似度”问题。系统需要先找到候选证据，再按任务相关性排序，最后判断生成的每个关键结论是否被上下文支持。

## 四段证据链

1. **召回**：BM25 对专有名词和精确标识有效，向量检索补充表达不同但语义相近的查询。
2. **排序**：混合召回合并候选后，reranker 根据 query 与片段的联合相关性重新排序。
3. **上下文**：去重、权限过滤和长度预算决定哪些证据能进入提示词。
4. **回答支持**：引用位置必须指向真实片段；证据不足时系统应允许拒答。

## 容易误读的指标

Recall 提升可能只是引入更多噪声。离线排序指标无法单独证明回答忠实；端到端评估还需要引用支持率、无依据回答率和延迟。

完整的检索实现笔记见 [RAG Retriever 优化](/ai-lab/experiments/rag-retriever-optimization/)。当前仓库只发布了小型 lexical baseline 的诊断结果；真实的 dense、reranker 与回答支持指标会在相同数据集和固定版本上测得后再加入评测页。

