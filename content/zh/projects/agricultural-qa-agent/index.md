---
title: "农业知识库问答智能体"
date: 2026-03-20
summary: "独立完成农业病害问答Agent，从PDF文档预处理、向量检索到FastAPI接口闭环"
tags:
  - AI
  - Agent
  - LangChain
  - RAG
  - Python
tech_stack:
  - Python
  - LangChain
  - LCEL
  - FastAPI
  - SSE
  - Pydantic
  - 向量检索
  - InMemorySaver
links:
  - type: github
    url: https://github.com/1byteone/agricultural-qa-agent
    label: 代码
featured: true
status: "已完成"
role: "独立开发者"
duration: "1个月"
team_size: 1
highlights:
  - "私有知识库优先调度策略"
  - "多轮记忆与SSE流式输出"
  - "结构化结果与幻觉控制"
  - "20+组检索并发压测"
---

独立完成农业病害问答Agent，从PDF文档预处理、向量检索到FastAPI接口闭环。

## 项目概述

独立完成农业病害问答 Agent，从 PDF 文档预处理、向量检索到 FastAPI 接口闭环；采用私有知识库优先、通用知识兜底的调度策略，支持多轮记忆、SSE 流式输出和结构化结果，解决私有农技手册不可读与事实幻觉问题。

## 核心职责

独立负责 Agent 调度、检索工具、会话记忆与流式接口。

## 技术亮点

### 1. 工具调度
基于 LangChain Agent + LCEL 封装私有 PDF 检索和通用农业知识两套工具，按"知识库优先、无匹配兜底"完成动态路由。

### 2. 会话与交互
使用 thread_id 隔离用户上下文，InMemorySaver 持久化多轮记忆；FastAPI astream 按 Token 返回，支持前端打字机式交互和多用户并发访问。

### 3. 可靠性与压测
以 Pydantic 约束作物、病害、风险等级、防治方案结构化输出，结合来源约束、全局异常捕获和 20+ 组检索并发压测，定位修复向量召回超时、工具调用失效、会话内存等 7 类故障。

## 系统架构

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   前端      │────▶│   FastAPI    │────▶│  LangChain  │
│  (聊天界面) │     │  (流式传输)  │     │   智能体    │
└─────────────┘     └──────────────┘     └──────┬──────┘
                                                │
                                         ┌──────▼──────┐
                                         │   工具      │
                                         │  ┌────────┐ │
                                         │  │私有    │ │
                                         │  │PDF检索 │ │
                                         │  └────────┘ │
                                         │  ┌────────┐ │
                                         │  │通用    │ │
                                         │  │农业知识│ │
                                         │  └────────┘ │
                                         └─────────────┘
```

## 项目成果

- **准确性**: 私有知识库问答零幻觉
- **可用性**: 多轮对话减少用户输入60%
- **性能**: 流式响应提供实时反馈
- **可靠性**: 结构化输出确保前端一致渲染

## 技术栈详情

**核心框架**
- Python 3.10+
- LangChain（智能体编排）
- LCEL（链式表达式）
- FastAPI（异步Web框架）

**数据处理**
- PDF文档预处理
- 向量检索
- 会话记忆管理

**接口与输出**
- SSE流式传输
- Pydantic结构化输出
- 全局异常捕获

---

**项目状态**: ✅ 已完成  
**GitHub**: [查看源代码](https://github.com/1byteone/agricultural-qa-agent)
