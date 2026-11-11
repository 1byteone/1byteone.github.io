---
title: "ZhiYi Elderly Care Nursing System"
date: 2026-08-24
summary: "Comprehensive management platform for medium-sized nursing homes - IoT monitoring + Health assessment engine + Unified auth"
tags:
  - Java
  - Spring Boot
  - IoT
  - Team Project
tech_stack:
  - Spring Boot 2.7
  - MyBatis-Plus
  - MySQL 8.0
  - Redis 7
  - Huawei Cloud IoTDA
  - Baidu Qianfan LLM
  - Vue3 + Element Plus
links:
  - type: github
    url: https://github.com/1byteone/zznursing
    label: Source Code
    coming_soon: true
featured: true
status: "Completed"
role: "Backend Developer"
duration: "5 months"
team_size: 6
highlights:
  - "Baidu Qianfan AI integration, 8s → 1s response"
  - "IoT device sync, 3min → 10s"
  - "ThreadLocal seamless login"
  - "500+ devices real-time monitoring"
---

Comprehensive management platform for medium-sized nursing homes (B-end ops dashboard + C-end family mini-program), covering health assessment, IoT device monitoring, and care work orders.

> 🔒 **Repository is not yet public.** Project details below.

## Project Overview

Comprehensive management platform for medium-sized nursing homes with both **B-end operations dashboard** and **C-end family mini-program**. Covers health assessment, IoT device monitoring, and nursing work orders.

Team of 6 developers; responsible for the **health assessment engine**, **IoT sync service**, and **unified authentication** modules, serving 500+ devices and 2000+ daily family visits.

## Core Responsibilities

### 1. Health Assessment Module Development & Performance Optimization
- Integrated **Baidu Qianfan AI model** for semantic analysis of health reports
- Designed **Redis multi-level caching** for frequently accessed health advice
- Reduced single analysis response from **8s to under 1s**
- Improved nurse review efficiency by ~**30%**
- Effectively supported high-concurrency queries during peak morning hours

### 2. IoT Device Management Module Design
- Developed **Huawei Cloud IoT platform** integration service
- Incremental sync of product lists via async thread pool
- "Device-Location" binding logic for data consistency
- Sync time reduced from **3 minutes to 10 seconds**
- Real-time monitoring of **500+ devices**

### 3. Security Authentication System
- Interceptor + **ThreadLocal** based seamless login for WeChat mini-program users
- Multi-thread data isolation and security
- Zero memory leak stable operation
- Supporting **2000+ daily** active visits

## Project Results

- **Performance**: AI analysis response reduced from 8s to under 1s
- **Sync**: IoT device list sync from 3min to 10s
- **Scale**: 500+ devices real-time monitoring, 2000+ daily visits
- **Stability**: Zero memory leak, stable production operation

---

**Project Status**: ✅ Completed  
**Repository**: 🔒 Not yet public — coming soon

<script>
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href*="zznursing"]').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      alert('🔒 This repository is not yet public. Please check back later!');
    });
  });
});
</script>