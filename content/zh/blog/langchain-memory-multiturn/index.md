---
title: "LangChain Memory：设计可控的多轮对话状态"
date: 2026-08-21
summary: "从会话历史、摘要记忆到长期记忆，掌握多轮 Agent 的状态边界、容量预算和隐私策略。"
tags:
  - AI
  - LangChain
  - Memory
  - Agent
  - 教程
authors:
  - me
featured: true
---


*上图：LangChain — LangChain Memory。*

多轮对话的难点不是把所有消息都塞回 prompt，而是决定哪些事实需要保留、保留多久、由谁负责删除。记忆应被视为显式数据，而不是模型的隐性能力。

## 核心心智模型

短期记忆服务当前会话，摘要记忆压缩较早内容，长期记忆保存经用户同意的偏好。三者都应带 conversation_id、租户隔离和过期策略。

## 关键机制

先计算 token 预算，再决定截断或摘要；写入长期记忆前做 PII 过滤和去重。读取记忆时标注来源和时间，避免旧事实覆盖新事实。

## Python 示例

```python
from dataclasses import dataclass
from datetime import datetime

@dataclass
class MemoryItem:
    conversation_id: str
    text: str
    source: str
    created_at: datetime

def build_context(history: list[MemoryItem], max_chars: int = 6000) -> str:
    selected, size = [], 0
    for item in reversed(history):
        if size + len(item.text) > max_chars: break
        selected.append(f"[{item.source}] {item.text}")
        size += len(item.text)
    return "\n".join(reversed(selected))
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

实现最近消息、会话摘要、用户偏好三级上下文，并记录每次摘要覆盖了哪些消息 id。删除会话时，验证缓存、向量库和审计副本是否都被清理。

## 总结

当白板上的每个箭头都能对应到一个输入、输出和失败策略时，AI 功能才从 demo 变成可维护的系统。

