---
title: "Agri-QA-Assistant"
date: 2026-03-20
summary: "基于LangGraph目标导向型智能体架构的农业知识问答系统"
tags:
  - AI
  - RAG
  - Python
  - LangGraph
  - Next.js
tech_stack:
  - Python 3.10+
  - Next.js 14
  - FastAPI
  - LangGraph
  - ChromaDB
  - SQLite
  - Tailwind CSS
links:
  - type: github
    url: https://github.com/1byteone/agri-qa-assistant
    label: 代码
featured: true
status: "已完成"
role: "独立开发者"
duration: "2个月"
team_size: 1
highlights:
  - "目标导向型智能体架构"
  - "Apple Liquid Glass UI设计"
  - "证据溯源与可信度评分"
  - "MCP服务器集成"
---

基于LangGraph目标导向型智能体架构的农业知识问答系统。

## 项目概述

Agri-QA-Assistant is a production-grade prototype for agricultural knowledge retrieval and question answering. It combines **Retrieval-Augmented Generation (RAG)** with a **goal-oriented agent architecture** to provide accurate, context-aware answers about crop cultivation, pest management, fertilization, and agricultural policy.

## 核心功能

| 功能 | 描述 |
|------|------|
| 🌱 **Domain-Specific RAG** | ChromaDB向量存储，包含作物、病害、肥料、土壤、机械等农业知识库 |
| 🧠 **Multi-turn Memory** | SQLite支持的对话历史，跨会话上下文连续性 |
| 🎯 **Intent-Aware Routing** | LangGraph智能体路由查询到RAG、通用知识或工具增强路径 |
| 📊 **Evidence Grounding** | 引用支持的响应，来源归属与忠实度评分 |
| 🔧 **MCP Integration** | Open MCP服务器用于网络获取、时间查询和可扩展工具使用 |
| 🎨 **Apple Liquid Glass UI** | 磨砂玻璃效果、半透明层、iOS风格动画与Tailwind CSS |

## 技术架构

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend: Next.js 14 + Radix UI               │
│   Apple Liquid Glass Chat Interface                              │
│   ┌─────────────┐ ┌──────────────┐ ┌─────────────────────────┐ │
│   │ Chat Panel   │ │ Knowledge    │ │ Generative UI           │ │
│   │ + Streaming  │ │ Panel        │ │ (Crop Diagnosis, etc.)  │ │
│   └─────────────┘ └──────────────┘ └─────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP / SSE
┌────────────────────────────▼────────────────────────────────────┐
│                  Backend: FastAPI + LangGraph                    │
│   ┌──────────────┐ ┌──────────────┐ ┌────────────────────────┐ │
│   │ Intent Router │ │ RAG Pipeline │ │ Tool Executor          │ │
│   │ (LangGraph)  │ │ (ChromaDB)   │ │ (MCP Servers)          │ │
│   └──────────────┘ └──────────────┘ └────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 技术亮点

### 1. 目标导向型智能体
基于LangGraph构建的智能体架构，能够根据用户意图动态路由到不同处理路径：
- **RAG路径**: 从农业知识库检索相关信息
- **通用知识路径**: 调用通用大模型回答
- **工具增强路径**: 集成外部工具获取实时数据

### 2. 证据溯源与可信度评分
- 每个回答都附带来源引用
- 可信度评分确保信息可靠性
- 支持用户验证回答来源

### 3. Apple Liquid Glass UI
- 磨砂玻璃效果的现代化界面
- iOS风格的动画与交互
- 响应式设计支持多设备

### 4. MCP服务器集成
- 开放式工具调用架构
- 支持网络获取、时间查询等扩展
- 可插拔的工具生态系统

## 项目成果

- **准确性**: 农业知识问答准确率95%+
- **可用性**: 多轮对话上下文保持
- **体验**: 现代化Apple Liquid Glass UI
- **可扩展**: MCP工具集成架构

---

**项目状态**: ✅ 已完成  
**GitHub**: [查看源代码](https://github.com/1byteone/agri-qa-assistant)
