---
title: "OpenAI Tool Calling：函数声明、执行循环与安全边界"
date: 2026-08-21
summary: "掌握工具 schema、模型决策、应用执行与结果回传，构建安全可审计的函数调用循环。"
tags:
  - AI
  - OpenAI API
  - Tool Calling
  - Agents
  - 教程
authors:
  - me
featured: true
---


*上图：OpenAI — OpenAI Tool Calling。*

Tool Calling 让模型输出函数名和参数，而不是直接执行函数。应用必须验证函数是否允许、参数是否合规、调用者是否有权限，然后把结果以工具消息回传。

## 核心心智模型

循环是 request → tool_call → validate → execute → tool_result → request。每一轮都有最大次数，最终答复不能绕过业务授权。

## 关键机制

schema 描述怎样调用，策略层决定是否允许调用。读操作可以自动执行，写操作应二次确认、幂等并审计。

## Python 示例

```python
def execute_tool(call, user):
    if call.name not in TOOL_ALLOWLIST:
        return {"ok": False, "error": "tool_not_allowed"}
    args = validate_args(call.name, call.arguments)
    authorize(user, call.name, args)
    if is_side_effecting(call.name) and not user.confirmed:
        return {"ok": False, "error": "confirmation_required"}
    return TOOL_REGISTRY[call.name](**args)
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

实现天气查询和退款申请两个工具；让模型可以自动查天气，但退款必须经过用户确认、幂等键和审计日志。

## 总结

当白板上的每个箭头都能对应到一个输入、输出和失败策略时，AI 功能才从 demo 变成可维护的系统。

