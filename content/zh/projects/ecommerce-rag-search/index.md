---
title: "分布式微云商城"
date: 2026-05-15
summary: "微服务电商平台 - SpringCloud Alibaba技术栈 + MyBatis-Plus + Feign远程调用"
tags:
  - Java
  - Spring Boot
  - 微服务
  - 分布式
tech_stack:
  - Spring Boot 3.3.2
  - Spring Cloud Alibaba
  - Nacos
  - Gateway
  - Sentinel
  - MyBatis-Plus
  - Feign
  - Redis
  - MySQL
  - Elasticsearch
  - RocketMQ
  - Seata
links:
  - type: github
    url: https://github.com/1byteone/mall-micro-cloud
    label: 查看代码
featured: true
status: "已完成"
role: "核心后端负责人"
duration: "4个月"
team_size: 4
highlights:
  - "微服务架构设计与拆分"
  - "11个中间件实战集成"
  - "万级并发压测验证"
  - "完整企业级解决方案"
---

微服务电商平台 - SpringCloud Alibaba技术栈 + MyBatis-Plus + Feign远程调用。

## 项目概述

从单体架构到微服务演进的完整实践，覆盖企业级中间件集成与分布式解决方案。项目对标中高级Java后端工程师核心能力模型，按技术深度分层实现。

## 专业GOAL（岗位能力对标）

| 层级 | 能力域 | 覆盖模块 | 权重 |
|------|--------|---------|------|
| 🥇 **分布式架构** | 微服务拆分、服务治理、分布式事务、消息队列 | mall-order-service, mall-seckill-service, Middleware | 35% |
| 🥈 **中间件深度** | Redis缓存、ES搜索、RocketMQ消息、Seata事务、Sentinel限流 | docs/Middleware/ (11个中间件) | 30% |
| 🥉 **业务实现** | 商品/用户/购物车/订单CRUD、JWT鉴权、AOP日志 | mall-product-service, mall-user-service, mall-cart-service | 25% |
| 🏅 **工程化** | Docker容器化、Gateway网关、Nacos配置中心、CI部署 | mall-gateway, docs/docker/ | 10% |

## 核心职责

主导秒杀链路、搜索/RAG、分布式一致性与研发规范。

## 技术架构

```
┌──────────┐   ┌──────────┐   ┌──────────┐
│ 客户端     │   │ 客户端    │   │ 客户端    │
└────┬─────┘   └────┬─────┘   └────┬─────┘
     └──────────────┴──────────────┘
                │
         ┌──────┴──────┐
         │ Spring Cloud │
         │   Gateway    │  ← 统一鉴权 + 路由 + 限流
         └──────┬──────┘
                │
     ┌──────────┼──────────┐
     │          │          │
┌────┴────┐ ┌──┴───┐ ┌───┴────┐
│ 业务服务  │ │ 中间件 │ │ 基础设施 │
│ User     │ │ Redis │ │ Nacos   │
│ Product  │ │ MySQL │ │ Sentinel│
│ Order    │ │ Mongo │ │ Seata   │
│ Cart     │ │ ES    │ │ XXL-Job │
│ Pay      │ │ MQ    │ │         │
│ Seckill  │ │ Canal │ │         │
└─────────┘ └──────┘ └─────────┘
```

## 项目结构

```
mall-micro-cloud/
├── mall-api/                  # Feign接口声明层
├── mall-common/               # 公共工具模块
├── mall-gateway/              # Spring Cloud Gateway网关
├── mall-services/
│   ├── mall-user-service/     # 用户服务（JWT + BCrypt鉴权）
│   ├── mall-product-service/  # 商品服务（MyBatis-Plus）
│   ├── mall-cart-service/     # 购物车服务（Redis缓存）
│   ├── mall-order-service/    # 订单服务（Seata分布式事务）
│   ├── mall-pay-service/      # 支付服务（RocketMQ事务消息）
│   ├── mall-seckill-service/  # 秒杀服务（高并发 + 限流）
│   ├── mall-es-service/       # 商品搜索服务（Elasticsearch）
│   ├── mall-oss-service/      # 对象存储服务
│   ├── mall-scheduler-service/ # 分布式调度服务（XXL-Job）
│   ├── mall-consumer-service/  # 消息消费服务
│   └── mall-test-service/     # 测试服务
├── docs/
│   ├── Middleware/             # 11个中间件实战文档
│   ├── interview/             # 面试题库（9章）
│   ├── db-sql/                # 业务表SQL
│   └── docker/                # Docker容器化部署指南
└── pom.xml                    # Maven父POM
```

## 技术亮点

### 1. 分布式架构
- **微服务拆分**: 按业务域拆分为用户、商品、订单、支付等独立服务
- **服务治理**: Nacos服务注册发现 + Gateway统一路由
- **分布式事务**: Seata AT模式保证跨服务数据一致性

### 2. 中间件深度集成
- **Redis**: 缓存 + 分布式锁 + 会话管理
- **Elasticsearch**: 全文搜索 + IK分词
- **RocketMQ**: 异步消息 + 事务消息
- **Sentinel**: 限流降级 + 熔断保护

### 3. 高并发秒杀
- Redis预扣库存 + Redisson可重入锁
- RocketMQ异步落库解决超卖
- Sentinel限流保护系统稳定

### 4. 工程化实践
- Docker容器化部署
- Gateway统一鉴权
- Nacos配置中心

## 项目成果

- **架构**: 完成11个微服务拆分与治理
- **中间件**: 集成11个企业级中间件
- **性能**: 万级并发压测稳定运行
- **文档**: 完整的中间件实战文档与面试题库

---

**项目状态**: ✅ 已完成  
**GitHub**: [查看源代码](https://github.com/1byteone/mall-micro-cloud)
