---
title: "RAG 生产边界审查：权限、索引版本与引用"
date: 2026-08-21
summary: "把 RAG 从单次检索演示拆成摄入、索引、在线查询与评估四个可运维平面。"
lab_category: experiments
cover: media/ai-lab/anthropic-reference/alignment-cyber-assessment.jpg
cover_alt: 复古灯塔版画与红色手绘轨迹拼贴，源自 Anthropic Research 的网络安全评估配图。
cover_credit: "Anthropic Research · An alignment assessment of recent cybersecurity incidents（参考配图）"
featured: true
featured_order: 1
experiment_id: "EXP-2026-001"
status: completed
model: "不涉及模型对比"
dataset: "架构审查；无基准数据集"
method: "边界清单审查"
source_page: "ai-lab/experiments/rag-production-architecture/"
source_label: "对应技术文章"
authors: [me]
---

这份记录整理的是一次架构审查，而不是模型性能实验。交付物是可检查的生产边界清单；没有运行吞吐或准确率测试，因此不展示虚构指标。

## 问题

一个 RAG demo 能返回答案，并不代表它能处理租户权限、文档更新、删除传播和上游故障。审查关注的是这些状态能否在系统中被明确表达。

## 方法

将系统拆成 ingestion、indexing、query serving 与 evaluation 四个平面。在线查询只读取当前 active index；新索引在后台构建并通过原子切换发布。

检查缓存键是否包含 tenant、权限摘要和 index version；检查删除事件能否传播到所有副本；检查回答是否带有可验证的来源引用。

## 结论

- 权限过滤需要在召回阶段执行，不能依赖生成模型忽略越权内容。
- 索引版本必须进入缓存键，否则切换索引后旧结果可能继续返回。
- 评测集应覆盖权限、引用、拒答和文档更新，不应只统计语义相似度。

## 证据与限制

这是工程设计审查记录，不包含独立部署的运行数据。完整实现示例见 [生产级 RAG 架构](/ai-lab/experiments/rag-production-architecture/)。

## 后续验证

下一步需要准备带租户和权限标签的固定测试集，测量 Recall@K、引用支持率、权限违规率与端到端延迟，再补充环境和代码版本。

以下是缓存隔离的设计示意，不是项目源码或运行记录：

```python
def retrieval_cache_key(tenant_id, permission_digest, index_version, query_hash):
    return (tenant_id, permission_digest, index_version, query_hash)
```
