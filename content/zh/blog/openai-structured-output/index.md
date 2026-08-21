---
title: "OpenAI Structured Output：让模型输出可验证的数据"
date: 2026-08-21
summary: "使用 JSON Schema/Pydantic 约束模型输出，处理拒答、解析失败和 schema 演进。"
tags:
  - AI
  - OpenAI API
  - Structured Output
  - Pydantic
  - 教程
authors:
  - me
featured: true
---


*上图：OpenAI — OpenAI Structured Output。*

自由文本适合展示，结构化输出适合驱动程序。Structured Output 的目标不是让模型永不出错，而是让成功、拒答和失败都能被程序区分。

## 核心心智模型

schema 约束字段类型、必填项和枚举，但不能保证事实正确。业务层还要检查金额范围、实体权限、引用存在性等语义规则。

## 关键机制

将解析分成 transport、schema、domain 三层；遇到 refusal 或不完整结果时不要强行填默认值，否则会把不确定性伪装成事实。

## Python 示例

```python
from pydantic import BaseModel, Field

class Incident(BaseModel):
    severity: str = Field(pattern="^(low|medium|high)$")
    summary: str = Field(min_length=1, max_length=500)
    actions: list[str] = Field(min_length=1, max_length=5)

response = client.responses.parse(model="gpt-4o-mini", input="整理故障记录", text_format=Incident)
if response.output_parsed is None: raise ValueError("model_refusal_or_parse_failure")
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

给 schema 增加版本号与向后兼容字段，准备正常、拒答、缺字段和越界四种 fixture，验证 API 不会返回看似成功的半结构化 JSON。

## 总结

当白板上的每个箭头都能对应到一个输入、输出和失败策略时，AI 功能才从 demo 变成可维护的系统。

