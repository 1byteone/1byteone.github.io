---
title: "FastAPI AI Streaming API：用 SSE 交付增量结果"
date: 2026-08-21
summary: "从生成器、SSE 协议到断开处理，构建可取消、可观测的 AI 流式接口。"
tags:
  - FastAPI
  - Streaming
  - SSE
  - AI Backend
  - 教程
authors:
  - me
featured: true
---


*上图：FastAPI — FastAPI AI Streaming API。*

流式响应改善的是首字节延迟和用户感知，不是让模型计算更快。接口需要明确事件格式、结束信号、异常事件和客户端断开后的清理动作。

## 核心心智模型

服务器以 data 事件发送，客户端按事件边界解析。不要把任意未转义文本拼成 SSE；更推荐 JSON 事件并统一 type 字段。

## 关键机制

生成器用 try/finally 释放上游资源；每个事件携带 request id；模型错误转换成 error 事件并明确关闭。

## Python 示例

```python
import json
from fastapi.responses import StreamingResponse

async def events(prompt: str):
    try:
        async for token in provider.stream(prompt):
            yield f"data: {json.dumps({'type': 'token', 'text': token})}\n\n"
        yield "data: {\"type\":\"done\"}\n\n"
    except Exception:
        yield "data: {\"type\":\"error\",\"code\":\"upstream_failed\"}\n\n"

@app.post("/v1/chat/stream")
async def stream(req: ChatRequest):
    return StreamingResponse(events(req.message), media_type="text/event-stream")
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

写一个浏览器端 SSE 客户端，分别测试正常完成、上游报错、用户刷新页面和网络断开。记录 TTFT、完整响应耗时以及未完成流的取消率。

## 总结

当白板上的每个箭头都能对应到一个输入、输出和失败策略时，AI 功能才从 demo 变成可维护的系统。

