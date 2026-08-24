---
title: "灵犀智能写作"
date: 2026-08-24
summary: "基于Spring Boot 3 + Spring AI Alibaba的AI智能图文创作平台，多智能体编排 + SSE流式输出"
tags:
  - AI
  - Java
  - Spring Boot
  - 流式输出
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
    label: 查看代码
featured: true
status: "已完成"
role: "独立全栈开发"
duration: "16个月"
team_size: 1
highlights:
  - "StateGraph工作流引擎"
  - "多智能体串行/并行编排"
  - "毫秒级SSE流式输出"
  - "99%+生成成功率"
---

基于 Spring Boot 3 + Spring AI Alibaba 构建的 AI 智能图文创作平台，独立全栈设计与开发。

## 项目概述

灵犀写作是一个基于 Spring Boot 3 + Spring AI Alibaba 构建的 AI 智能图文创作平台。作为独立全栈设计与开发的个人项目，旨在探索大模型在长文生成领域的落地应用。

系统创新性地引入 **StateGraph 工作流引擎** 编排多智能体协作，结合 **SSE 流式输出** 技术，解决了传统 AI 生成等待时间长、内容结构松散的问题。作为一个高并发、可扩展的后端架构实践，该系统完整实现了从灵感激发到配图生成的自动化闭环。

## 核心功能

| 功能 | 描述 |
|------|------|
| 🧠 **多智能体编排** | StateGraph工作流引擎，标题生成、大纲构建、正文撰写多智能体灵活编排 |
| ⚡ **流式输出** | SSE技术毫秒级首字上屏，消除等待焦虑 |
| 🔄 **异步任务体系** | ThreadPoolTaskExecutor + @Async，长耗时操作解耦为后台任务 |
| 🖼️ **多源配图** | 策略模式动态接入Pexels/SVG等多源配图服务，自动降级切换 |
| 📐 **结构化输出** | Prompt模板引擎 + StructuredOutputConverter，统一不同大模型的输出格式 |
| 📊 **任务追踪** | 任务状态tracking机制，进度管理与结果回调 |

## 技术架构

```
┌─────────────────────────────────────────────────────────────┐
│                     前端 (Vue 3)                             │
│            流式渲染 + 任务进度 + 图文编辑                     │
└──────────────────────────┬──────────────────────────────────┘
                           │ SSE (Server-Sent Events)
┌──────────────────────────▼──────────────────────────────────┐
│         Spring Boot 3 + Spring AI Alibaba 后端               │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐  │
│  │ StateGraph     │  │ ThreadPoolTask │  │ Prompt模板    │  │
│  │ 工作流引擎      │  │ Executor异步   │  │ 引擎+策略模式  │  │
│  │ (多智能体编排)  │  │ 任务体系       │  │ (多源配图)    │  │
│  └────────────────┘  └────────────────┘  └───────────────┘  │
└──────────┬──────────────────┬──────────────────┬─────────────┘
           │                  │                  │
     ┌─────▼─────┐      ┌─────▼─────┐      ┌─────▼─────┐
     │ Spring AI │      │  Redis    │      │ MyBatis   │
     │ Alibaba   │      │ (缓存/状态)│      │ Flex(DB)  │
     └───────────┘      └───────────┘      └───────────┘
```

## 技术亮点

### 1. 多智能体编排架构
摒弃传统的线性调用，基于 StateGraph 自主设计工作流引擎：
- 标题生成、大纲构建、正文撰写等多智能体灵活编排
- 串行/并行组合，复杂长文生成任务拆解为可维护节点流程
- 新增一种生成模式仅需配置新节点即可，系统可扩展性显著提升

### 2. 高并发流式响应
针对大模型生成慢的痛点：
- SSE (Server-Sent Events) 技术整合前端对接
- ThreadPoolTaskExecutor 构建异步任务体系
- 毫秒级首字上屏，接口吞吐量提升 50%

### 3. 高容错图文生成链路
- Prompt 模板引擎与 StructuredOutputConverter 统一输出格式
- 策略模式动态接入 Pexels/SVG 等多源配图服务
- 单一图源失败时自动降级切换，保证 99% 以上生成成功率

### 4. 异步任务与状态追踪
- @Async 将文章生成、图片生成等耗时操作解耦为后台任务
- 任务状态 tracking 机制，进度管理与结果回调
- 显著提升系统吞吐能力，避免接口阻塞

## 项目成果

- **架构**: StateGraph工作流引擎 + 多智能体编排
- **性能**: 毫秒级首字上屏，接口吞吐量提升 50%
- **可靠性**: 多源配图自动降级，生成成功率 99%+
- **可扩展**: 新增生成模式仅需配置新节点

---

**项目状态**: ✅ 已完成  
**GitHub**: [查看源代码](https://github.com/1byteone/ai-passage-creator)