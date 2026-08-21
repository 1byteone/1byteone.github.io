---
title: "生产级 RAG 架构：权限、版本与可观测性"
date: 2026-08-21
summary: "设计可上线的 RAG 系统，覆盖文档摄入、权限过滤、索引版本、缓存、评估与故障降级。"
tags:
  - AI
  - RAG
  - Production
  - Architecture
  - 教程
authors:
  - me
featured: true
---


*上图：RAG — 生产级 RAG 架构。*

从 demo 到生产的差距主要在边界条件：谁能看到文档、索引如何更新、答案如何引用、上游不可用时怎么办。

## 核心心智模型

把系统分成 ingestion、indexing、query serving 和 evaluation 四个平面；在线请求只读当前 active index，更新在后台构建并原子切换。

## 关键机制

权限过滤必须在检索阶段执行；缓存键包含 tenant、权限摘要、query 规范化版本和 index version；删除文档要能传播到所有副本。

## Python 示例

```python
from dataclasses import dataclass

@dataclass
class QueryContext:
    tenant_id: str
    allowed_collections: set[str]
    index_version: str

def cache_key(query: str, ctx: QueryContext) -> str:
    scopes = ",".join(sorted(ctx.allowed_collections))
    return f"rag:v2:{ctx.tenant_id}:{ctx.index_version}:{scopes}:{normalize(query)}"
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

设计 active/candidate 两套索引，模拟一次失败发布和一次文档删除，检查流量是否仍读到旧权限数据，并为每次回答保存 evidence ids。

## 总结

当白板上的每个箭头都能对应到一个输入、输出和失败策略时，AI 功能才从 demo 变成可维护的系统。

