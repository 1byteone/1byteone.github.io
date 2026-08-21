---
title: "FastAPI Async 与依赖注入：避免阻塞事件循环"
date: 2026-08-21
summary: "理解 async/sync 边界、连接池、依赖生命周期与并发控制，构建高吞吐 FastAPI 服务。"
tags:
  - FastAPI
  - Async Python
  - Dependency Injection
  - Performance
  - 教程
authors:
  - me
featured: true
---

![FastAPI — FastAPI Async 与依赖注入](featured.png)

*上图：FastAPI — FastAPI Async 与依赖注入。*

async def 并不会自动让阻塞代码变快。文件 I/O、同步 SDK、CPU 密集任务如果直接运行在事件循环中，会拖慢所有请求。

## 核心心智模型

异步路由适合等待异步网络 I/O；同步依赖应明确隔离，CPU 任务放入任务队列或进程池。依赖注入的重点是生命周期可见、替换容易。

## 关键机制

在 lifespan 创建共享客户端，在请求结束后复用连接；用 semaphore 限制并发外部调用，避免本地服务把供应商打爆。

## Python 示例

```python
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI

limit = asyncio.Semaphore(20)

async def call_provider(client, payload):
    async with limit:
        return await client.post("/responses", json=payload, timeout=15)

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.client = make_async_client()
    yield
    await app.state.client.aclose()

app = FastAPI(lifespan=lifespan)
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

用一个同步假客户端和一个异步假客户端压测 50 个并发请求，比较事件循环阻塞情况；再加入 semaphore，观察上游错误率与平均延迟。

## 总结

当白板上的每个箭头都能对应到一个输入、输出和失败策略时，AI 功能才从 demo 变成可维护的系统。

