---
title: "LangChain Prompt Chain：让提示词成为可维护的程序"
date: 2026-08-21
summary: "学习提示词模板、变量契约、消息角色和链式组合，构建可版本化、可评测的 Prompt Chain。"
tags:
  - AI
  - LangChain
  - Prompt Engineering
  - Python
  - 教程
authors:
  - me
featured: true
---


*上图：LangChain — LangChain Prompt Chain。*

提示词不是散落在代码里的长字符串，而是一个需要版本管理、输入校验和回归测试的程序组件。本篇围绕模板、结构化输入、模型和解析建立可靠链路。

## 核心心智模型

稳定的 Prompt Chain 会区分 system 规则、human 任务和历史上下文；变量名应该表达语义，避免一个 text 在不同阶段含义漂移。

## 关键机制

先渲染并检查 prompt，再调用模型。对长上下文做长度预算，对用户文本做边界标记；不要把用户提供的内容拼进 system 指令。

## Python 示例

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

prompt = ChatPromptTemplate.from_messages([
    ("system", "只依据 context 回答；信息不足时明确说不知道。"),
    ("human", "<context>\n{context}\n</context>\n问题：{question}"),
])
chain = prompt | model | StrOutputParser()
print(chain.invoke({"context": "幂等请求重复执行不会产生额外业务副作用。", "question": "幂等性解决什么问题？"}))
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

给 prompt 增加 prompt_version，把 20 个固定问题作为回归集，比较每次修改前后的事实一致性、拒答率和 token 用量。

## 总结

当白板上的每个箭头都能对应到一个输入、输出和失败策略时，AI 功能才从 demo 变成可维护的系统。

