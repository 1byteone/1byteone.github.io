---
title: "Distributed Micro Cloud Mall"
date: 2026-05-15
summary: "Microservice E-commerce Platform - SpringCloud Alibaba Stack (Nacos/Gateway/Sentinel) + MyBatis-Plus + Feign Remote Calls"
tags:
  - Java
  - Spring Boot
  - Microservices
  - Distributed
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
    label: Code
featured: true
status: "Completed"
role: "Core Backend Lead"
duration: "4 months"
team_size: 4
highlights:
  - "Microservice architecture design"
  - "11 middleware integrations"
  - "10k+ concurrent stress testing"
  - "Enterprise-grade solutions"
---

Microservice E-commerce Platform - SpringCloud Alibaba Stack (Nacos/Gateway/Sentinel) + MyBatis-Plus + Feign Remote Calls.

## Project Overview

Complete practice from monolithic to microservice architecture, covering enterprise middleware integration and distributed solutions. The project benchmarks against mid-senior Java backend engineer core competency models.

## Professional GOAL (Position Capability Benchmarking)

| Level | Capability Domain | Coverage Modules | Weight |
|-------|-------------------|------------------|--------|
| 🥇 **Distributed Architecture** | Microservice splitting, service governance, distributed transactions, message queues | mall-order-service, mall-seckill-service, Middleware | 35% |
| 🥈 **Middleware Depth** | Redis cache, ES search, RocketMQ messaging, Seata transactions, Sentinel rate limiting | docs/Middleware/ (11 middlewares) | 30% |
| 🥉 **Business Implementation** | Product/User/Cart/Order CRUD, JWT auth, AOP logging | mall-product-service, mall-user-service, mall-cart-service | 25% |
| 🏅 **Engineering** | Docker containerization, Gateway, Nacos config center, CI deployment | mall-gateway, docs/docker/ | 10% |

## Technical Architecture

```
┌──────────┐   ┌──────────┐   ┌──────────┐
│ Client    │   │ Client   │   │ Client   │
└────┬─────┘   └────┬─────┘   └────┬─────┘
     └──────────────┴──────────────┘
                │
         ┌──────┴──────┐
         │ Spring Cloud │
         │   Gateway    │  ← Unified Auth + Routing + Rate Limiting
         └──────┬──────┘
                │
     ┌──────────┼──────────┐
     │          │          │
┌────┴────┐ ┌──┴───┐ ┌───┴────┐
│ Services │ │Middle│ │Infra   │
│ User     │ │Redis │ │Nacos   │
│ Product  │ │MySQL │ │Sentinel│
│ Order    │ │Mongo │ │Seata   │
│ Cart     │ │ES    │ │XXL-Job │
│ Pay      │ │MQ    │ │        │
│ Seckill  │ │Canal │ │        │
└─────────┘ └──────┘ └─────────┘
```

## Project Structure

```
mall-micro-cloud/
├── mall-api/                  # Feign Interface Layer
├── mall-common/               # Common Utilities
├── mall-gateway/              # Spring Cloud Gateway
├── mall-services/
│   ├── mall-user-service/     # User Service (JWT + BCrypt)
│   ├── mall-product-service/  # Product Service (MyBatis-Plus)
│   ├── mall-cart-service/     # Cart Service (Redis Cache)
│   ├── mall-order-service/    # Order Service (Seata Distributed Tx)
│   ├── mall-pay-service/      # Payment Service (RocketMQ Tx Messages)
│   ├── mall-seckill-service/  # Seckill Service (High Concurrency)
│   ├── mall-es-service/       # Search Service (Elasticsearch)
│   ├── mall-oss-service/      # Object Storage Service
│   ├── mall-scheduler-service/ # Scheduler Service (XXL-Job)
│   ├── mall-consumer-service/ # Message Consumer Service
│   └── mall-test-service/     # Test Service
├── docs/
│   ├── Middleware/             # 11 Middleware Tutorials
│   ├── interview/             # Interview Questions (9 chapters)
│   ├── db-sql/                # Business SQL
│   └── docker/                # Docker Deployment Guide
└── pom.xml                    # Maven Parent POM
```

## Technical Highlights

### 1. Distributed Architecture
- **Microservice Splitting**: Independent services by business domain
- **Service Governance**: Nacos discovery + Gateway routing
- **Distributed Transactions**: Seata AT mode for cross-service consistency

### 2. Deep Middleware Integration
- **Redis**: Cache + Distributed Lock + Session Management
- **Elasticsearch**: Full-text Search + IK Analyzer
- **RocketMQ**: Async Messaging + Transaction Messages
- **Sentinel**: Rate Limiting + Circuit Breaking

### 3. High-Concurrency Seckill
- Redis pre-deduction + Redisson reentrant lock
- RocketMQ async persistence prevents overselling
- Sentinel rate limiting protects system stability

### 4. Engineering Practices
- Docker containerization
- Gateway unified authentication
- Nacos configuration center

## Project Results

- **Architecture**: 11 microservices designed and governed
- **Middleware**: 11 enterprise middlewares integrated
- **Performance**: 10k+ concurrent stress testing passed
- **Documentation**: Complete middleware tutorials and interview questions

---

**Project Status**: ✅ Completed  
**GitHub**: [View Source Code](https://github.com/1byteone/mall-micro-cloud)
