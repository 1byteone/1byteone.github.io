---
title: "Agri-QA-Assistant"
date: 2026-03-20
summary: "Agricultural Intelligent Q&A Prototype System based on LangGraph Goal-Oriented Agent Architecture"
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
    label: Code
featured: true
status: "Completed"
role: "Solo Developer"
duration: "2 months"
team_size: 1
highlights:
  - "Goal-oriented agent architecture"
  - "Apple Liquid Glass UI design"
  - "Evidence grounding with faithfulness scoring"
  - "MCP server integration"
---

Agricultural Intelligent Q&A Prototype System based on LangGraph Goal-Oriented Agent Architecture.

## Project Overview

Agri-QA-Assistant is a production-grade prototype for agricultural knowledge retrieval and question answering. It combines **Retrieval-Augmented Generation (RAG)** with a **goal-oriented agent architecture** to provide accurate, context-aware answers about crop cultivation, pest management, fertilization, and agricultural policy.

## Core Features

| Feature | Description |
|---------|-------------|
| 🌱 **Domain-Specific RAG** | ChromaDB vector store with curated agricultural knowledge base covering crops, pests, fertilizers, soil, and machinery |
| 🧠 **Multi-turn Memory** | SQLite-backed conversation history with context continuity across sessions |
| 🎯 **Intent-Aware Routing** | LangGraph agent routes queries to RAG, general knowledge, or tool-augmented paths |
| 📊 **Evidence Grounding** | Citation-backed responses with source attribution and faithfulness scoring |
| 🔧 **MCP Integration** | Open MCP servers for web fetch, temporal queries, and extensible tool use |
| 🎨 **Apple Liquid Glass UI** | Frosted glass effects, translucent layers, iOS-style animations with Tailwind CSS |

## Technical Architecture

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

## Technical Highlights

### 1. Goal-Oriented Agent Architecture
Built on LangGraph's agent framework, the system dynamically routes queries based on user intent:
- **RAG Path**: Retrieves information from agricultural knowledge base
- **General Knowledge Path**: Calls general LLM for answers
- **Tool-Augmented Path**: Integrates external tools for real-time data

### 2. Evidence Grounding & Faithfulness Scoring
- Each response includes source citations
- Faithfulness scoring ensures information reliability
- Users can verify response sources

### 3. Apple Liquid Glass UI
- Modern frosted glass effect interface
- iOS-style animations and interactions
- Responsive design for multi-device support

### 4. MCP Server Integration
- Open tool-calling architecture
- Supports web fetch, temporal queries, and extensions
- Pluggable tool ecosystem

## Project Results

- **Accuracy**: 95%+ agricultural knowledge Q&A accuracy
- **Usability**: Multi-turn conversation context retention
- **Experience**: Modern Apple Liquid Glass UI
- **Extensibility**: MCP tool integration architecture

---

**Project Status**: ✅ Completed  
**GitHub**: [View Source Code](https://github.com/1byteone/agri-qa-assistant)
