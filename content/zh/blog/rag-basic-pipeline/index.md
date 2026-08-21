---
title: "RAG 基础管道：从文档到可引用答案"
date: 2026-08-21
summary: "理解 RAG 的摄入、切分、检索、增强生成全流程，并用来源引用约束回答。"
tags:
  - AI
  - RAG
  - Python
  - Information Retrieval
  - 教程
authors:
  - me
featured: true
---


*上图：RAG — RAG 基础管道。*

RAG 不是给模型塞几段文本这么简单，而是一条知识数据管道。最终质量同时受文档解析、切分、召回、提示词和答案验证影响。

## 核心心智模型

离线阶段是 Load → Clean → Chunk → Embed → Index，在线阶段是 Query → Retrieve → Rerank/Filter → Generate → Cite。两条链路要用版本号连接。

## 关键机制

每个 chunk 保存 source、page、section 和 content hash。回答时只传递通过相关性阈值的上下文，并要求模型给出可回溯引用。

## Python 示例

```python
from dataclasses import dataclass

@dataclass
class Chunk:
    text: str
    source: str
    page: int
    chunk_id: str

def make_context(chunks: list[Chunk]) -> str:
    return "\n\n".join(f"[{c.chunk_id}] {c.text} (source={c.source}, page={c.page})" for c in chunks)
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

建立 30 个带标准答案和来源的问题，分别评估检索命中率、引用正确率和拒答准确率；不要只看模型回答是否读起来合理。

## 总结

当白板上的每个箭头都能对应到一个输入、输出和失败策略时，AI 功能才从 demo 变成可维护的系统。

