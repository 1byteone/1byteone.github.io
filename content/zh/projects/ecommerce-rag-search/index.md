---
title: "分布式微云商城"
date: 2026-05-15
summary: "面向百万用户级交易场景的分布式电商平台，构建ES关键词检索+RAG语义检索双体系"
tags:
  - AI
  - RAG
  - Java
  - Spring Boot
  - 微服务
tech_stack:
  - Spring Boot 3
  - Spring Cloud Alibaba
  - MySQL
  - Redis/Redisson
  - RocketMQ
  - Elasticsearch
  - RedisStack
  - OpenFeign
  - Seata
links:
  - type: github
    url: https://github.com/1byteone/ecommerce-rag-search
    label: 代码
featured: true
status: "已完成"
role: "核心后端负责人"
duration: "4个月"
team_size: 4
highlights:
  - "商品搜索响应从2s降至20ms内"
  - "语义召回准确率提升35%"
  - "大模型幻觉率降低90%"
  - "万级并发压测稳定运行"
---

面向百万用户级交易场景的分布式电商平台，构建ES关键词检索+RAG语义检索双体系。

## 项目概述

核心后端负责人，面向百万用户级交易场景拆分商品、订单、用户、支付、搜索等微服务，构建 ES 关键词检索 + RAG 语义检索双体系；基于 Spring Cloud Alibaba、Gateway、RocketMQ 完成流量治理与异步解耦，Docker 单机集群压测验证万级并发稳定运行。

## 核心职责

主导秒杀链路、搜索/RAG、分布式一致性与研发规范。

## 技术亮点

### 1. 秒杀防超卖高吞吐架构
采用 Redis 预扣库存 + Redisson 可重入锁 + RocketMQ 异步落库，解决超卖问题，吞吐量较原生乐观锁提升 5 倍；通过定时校对补偿异常库存。

### 2. 检索与性能优化
- **关键词检索**：以 IK 分词 + ES DSL 实现关键词检索和多条件筛选，商品搜索响应从 2s 降至 20ms 内
- **RAG语义检索**：独立搭建 RAG 微服务，语义召回准确率提升 35%，幻觉率降低 90%

### 3. 一致性与协同
以 Seata AT + 事务消息 + 重试/死信队列保障跨服务一致性；统一建表、SQL 评审、Git 分支与 CodeReview 规范，联调 Bug 降低 60%，数据库访问压力下降 70%。

## 系统架构

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   前端      │────▶│   网关       │────▶│  业务服务   │
└─────────────┘     │  (Gateway)   │     │  (Spring)   │
                    └──────┬───────┘     └──────┬──────┘
                           │                    │
                    ┌──────▼───────┐     ┌──────▼──────┐
                    │   AI搜索服务 │     │  向量存储   │
                    │  (FastAPI)   │     │  (Redis)    │
                    └──────────────┘     └─────────────┘
```

## 项目成果

- **性能**: 商品搜索响应从2s降至20ms内
- **准确性**: 语义召回准确率提升35%
- **可靠性**: 大模型幻觉率降低90%
- **稳定性**: 万级并发压测稳定运行

## 技术栈详情

**后端服务**
- Spring Boot 3
- Spring Cloud Alibaba
- Nacos（服务发现）
- Gateway（网关）
- OpenFeign（远程调用）
- Seata（分布式事务）

**数据层**
- MySQL（业务数据）
- Redis/Redisson（缓存/分布式锁）
- RocketMQ（消息队列）
- Elastic-Job（定时任务）

**检索服务**
- Elasticsearch 8 + IK分词
- RedisStack（向量存储）
- LangChain + FastAPI（RAG服务）

---

**项目状态**: ✅ 已完成  
**GitHub**: [查看源代码](https://github.com/1byteone/ecommerce-rag-search)
