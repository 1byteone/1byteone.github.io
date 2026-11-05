---
title: "流式请求断开后，谁负责清理上游任务？"
date: 2026-08-21
summary: "SSE 连接生命周期必须与生成器、模型请求和计费任务一起结束。"
lab_category: field-notes
cover: media/ai-lab/anthropic-reference/unintended-model-actions.jpg
cover_alt: 纸质表格、折线记录和红色标记拼贴，源自 Anthropic Research 的模型意外行为调查配图。
cover_credit: "Anthropic Research · Investigating unintended model actions（参考配图）"
source_page: "ai-lab/engineering/fastapi-ai-streaming-api/"
authors: [me]
---

服务端开始发送 SSE 后，浏览器关闭页面并不代表模型请求自动结束。若客户端断开后仍继续读取上游流，后台任务会占用连接、内存和模型额度。

## 复盘要点

- 生成器使用 `try/finally` 统一释放模型响应、HTTP 客户端和信号量。
- 在等待下一段模型输出前检查客户端断开状态，并把取消向上游传播。
- 请求日志记录 request id、结束原因和清理结果；不要把断连记录为成功完成。
- 测试正常结束、模型异常、客户端取消和服务端超时四条终止路径。

## 证据

相关实现讨论见 [FastAPI AI Streaming API](/ai-lab/engineering/fastapi-ai-streaming-api/)。本条是工程实践手记，不代表当前服务已部署模型流量监控。
