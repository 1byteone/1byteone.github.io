---
title: "LingXi AI Writing Platform"
date: 2026-08-24
summary: "AI-powered intelligent article creation platform built on Spring Boot 3 + Spring AI Alibaba"
tags:
  - AI
  - Java
  - Spring Boot
  - Streaming
tech_stack:
  - Spring Boot 3
  - Spring AI Alibaba
  - MyBatis Flex
  - Redis
  - SSE
  - ThreadPoolTaskExecutor
  - Pexels
links:
  - type: github
    url: https://github.com/1byteone/ai-passage-creator
    label: Source Code
featured: true
status: "Completed"
role: "Independent Full-Stack Developer"
duration: "16 months"
team_size: 1
highlights:
  - "StateGraph workflow engine"
  - "Multi-agent serial/parallel orchestration"
  - "Millisecond SSE streaming output"
  - "99%+ generation success rate"
---

AI-powered intelligent article creation platform built on Spring Boot 3 + Spring AI Alibaba, independently designed and developed full-stack.

## Project Overview

An AI-powered intelligent article creation platform built on **Spring Boot 3 + Spring AI Alibaba**. As an independent full-stack project, it explores the practical application of LLMs in long-form content generation.

The system innovatively introduces a **StateGraph workflow engine** to orchestrate multi-agent collaboration, combined with **SSE streaming output**, solving the problems of long wait times and loose content structure in traditional AI generation. The system implements a complete automated loop from inspiration to image generation.

## Core Features

| Feature | Description |
|---------|-------------|
| 🧠 **Multi-Agent Orchestration** | StateGraph workflow engine for flexible orchestration of title, outline, and body generation agents |
| ⚡ **Streaming Output** | SSE technology for millisecond first-token display, eliminating wait anxiety |
| 🔄 **Async Task System** | ThreadPoolTaskExecutor + @Async decouples long-running operations |
| 🖼️ **Multi-Source Images** | Strategy pattern for dynamic Pexels/SVG image service integration with auto-fallback |
| 📐 **Structured Output** | Prompt template engine + StructuredOutputConverter for unified LLM output format |
| 📊 **Task Tracking** | Progress management and result callback mechanisms |

## Technical Highlights

### 1. Multi-Agent Orchestration Architecture
- StateGraph-based workflow engine replaces traditional linear calls
- Title, outline, and body generation agents in serial/parallel combinations
- New generation modes require only new node configuration

### 2. High-Concurrency Streaming Response
- SSE (Server-Sent Events) integration with frontend
- ThreadPoolTaskExecutor async task system
- Millisecond first-token display, 50% throughput improvement

### 3. Fault-Tolerant Generation Pipeline
- Prompt template engine + StructuredOutputConverter for unified output
- Strategy pattern for multi-source image services
- Auto-fallback on single source failure, 99%+ success rate

### 4. Async Task & Status Tracking
- @Async decouples article/image generation as background tasks
- Task status tracking with progress management
- Significantly improved system throughput

## Project Results

- **Architecture**: StateGraph workflow engine + multi-agent orchestration
- **Performance**: Millisecond first-token display, 50% throughput improvement
- **Reliability**: Multi-source image auto-fallback, 99%+ success rate
- **Extensibility**: New generation modes require only new node configuration

---

**Project Status**: ✅ Completed  
**GitHub**: [View Source Code](https://github.com/1byteone/ai-passage-creator)