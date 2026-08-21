---
title: "RAG Retriever 优化：从 Top-K 到混合检索与重排"
date: 2026-08-21
summary: "系统调优 RAG 检索器，理解 BM25、向量搜索、混合召回、重排和上下文压缩的取舍。"
tags:
  - AI
  - RAG
  - Retrieval
  - Search
  - 教程
authors:
  - me
featured: true
---


*上图：RAG — RAG Retriever 优化。*

检索优化的目标不是召回越多越好，而是在有限上下文和延迟预算内，把真正支持答案的证据排在前面。

## 核心心智模型

关键词检索擅长精确术语，向量检索擅长语义表达；混合召回取两者候选，再用 reranker 结合 query 与文档重排。

## 关键机制

用离线评测集调整 chunk size、overlap、K、阈值和 reranker。单独提高 Recall 可能增加噪声，最终要看 nDCG、答案支持率和端到端延迟。

## Python 示例

```python
def hybrid_retrieve(query: str, k: int = 20):
    dense = vector_store.search(query, k=k)
    lexical = bm25.search(query, k=k)
    candidates = deduplicate(dense + lexical)
    ranked = reranker.rank(query, candidates)
    return [item for item in ranked if item.score >= 0.35][:5]
```

## 课程定位

这篇文章把白板上的模块拆成可以落地的工程边界：先定义输入和输出，再决定状态、失败策略与可观测性。示例使用 Python，重点是设计原则而不是绑定某个供应商版本；上线前请以当前依赖的官方文档为准。

## 工程实践

- 将业务规则放在应用层，不要藏进难以测试的提示词或路由函数。
- 为外部调用设置超时、重试上限和幂等键；重试不是错误处理的全部。
- 记录 request id、耗时、输入版本、模型/索引版本和结果状态，避免记录敏感原文。
- 用小规模固定数据集做回归测试，再用线上抽样监控质量与成本。

## 常见错误

- 只画 happy path，没有画超时、空结果、限流和回滚路径。
- 让一个函数同时负责解析、调用外部服务、拼接提示词和持久化。
- 用字符串约定代替类型契约，导致改动只能靠人工联调。

## 生产检查清单

- [ ] 输入、输出和错误响应均有明确 schema
- [ ] 外部依赖有 timeout、retry、rate limit 和 fallback
- [ ] 日志、指标、trace 能关联到同一次请求
- [ ] 关键路径有单元测试、集成测试和一组离线评测样本
- [ ] 密钥、用户内容和供应商响应按最小权限与隐私策略处理

## 练习建议

先实现白板中的最小闭环，再故意注入一个超时、一个空结果和一个格式错误，观察系统能否给出稳定且可诊断的结果。最后补一条指标，证明你的优化确实改善了质量或延迟。

## 动手练习

准备包含缩写、数字和同义改写的查询集，比较纯向量、纯 BM25、混合召回和重排四个版本，画出 Recall@K 与延迟曲线。

## 总结

当白板上的每个箭头都能对应到一个输入、输出和失败策略时，AI 功能才从 demo 变成可维护的系统。

