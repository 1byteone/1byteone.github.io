---
title: "农业问答 Agent：把 RAG、路由与证据引用分开"
date: 2026-03-20
summary: "基于已有 Agri-QA 项目梳理知识检索、意图路由和证据归属的系统边界。"
lab_category: engineering
cover: media/projects/cover-agri-qa.jpg
cover_alt: 农业知识问答 Agent 的田间数据与检索路由概念图
featured: true
featured_order: 3
repository: "https://github.com/1byteone/agri-qa-assistant"
project_page: "projects/agricultural-qa-agent/"
tech_stack: [Python, FastAPI, LangGraph, ChromaDB, SQLite, Next.js]
authors: [me]
---

Agri-QA 是一个已完成的农业知识问答原型。它将领域知识检索、目标导向型路由和证据引用放在不同职责中，避免把所有问题都交给一个无边界的生成步骤。

## 请求路径

![农业知识问答中的植物领域知识插画](/images/ai-lab/open-doodles/plant.svg)

*插图：Pablo Stanley / Open Doodles · CC0 1.0。*

{{< lab-diagram >}}
flowchart LR
  A[用户问题] --> B{意图路由}
  B -->|领域问题| C[领域检索]
  B -->|通用问题| D[通用回答]
  C --> E[证据约束的回答]
  D --> E
  E --> F[引用与置信提示]
{{< /lab-diagram >}}

Python / FastAPI 提供服务边界，LangGraph 表达查询路由与工具流程，ChromaDB 保存向量索引，SQLite 保存原型阶段的会话记录。当前公开项目描述没有给出可复核的生产 SLA 或模型评测数据，因此这里不推断准确率、吞吐或生产规模。

## 代码与资料

- 项目档案：[农业知识问答系统](/projects/agricultural-qa-agent/)
- 源码：[agri-qa-assistant](https://github.com/1byteone/agri-qa-assistant)

复现或扩展时，应另外固定语料版本、权限策略和评测集；原型能力不等同于生产验证。
