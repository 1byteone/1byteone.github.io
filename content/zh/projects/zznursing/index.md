---
title: "智颐养老护理系统"
date: 2026-08-24
summary: "面向中型养老院的综合管理平台 - IoT设备监控 + 健康评估引擎 + 统一鉴权"
tags:
  - Java
  - Spring Boot
  - IoT
  - 团队项目
tech_stack:
  - Spring Boot 2.7
  - MyBatis-Plus
  - MySQL 8.0
  - Redis 7
  - 华为云IoTDA
  - 百度千帆大模型
  - Vue3 + Element Plus
links:
  - type: github
    url: https://github.com/1byteone/zznursing
    label: 查看代码
    coming_soon: true
featured: true
status: "已完成"
role: "后端开发"
duration: "5个月"
team_size: 6
highlights:
  - "百度千帆AI集成，响应时间8s→1s"
  - "IoT设备同步，3min→10s"
  - "ThreadLocal无感登录"
  - "500+设备实时监控"
---

面向中型养老院的综合管理平台（B端运营后台 + C端家属小程序），覆盖健康评估、IoT设备监控、护理工单等核心业务。

> 🔒 **项目仓库暂未公开。** 以下为项目详情。

## 项目概述

面向中型养老院的综合管理平台，包含**B端运营后台**和**C端家属小程序**双端。覆盖健康评估、IoT设备监控、护理工单等核心业务。

团队6人协作开发，我负责 **健康评估引擎**、**IoT同步服务** 及 **统一鉴权** 三个模块，服务于院内500+设备、日均2000+次家属端访问。

## 技术架构

| 层级 | 技术选型 |
|------|----------|
| 后端框架 | Spring Boot 2.7 / MyBatis-Plus |
| 数据库 | MySQL 8.0 / Redis 7 |
| IoT平台 | 华为云IoTDA |
| AI能力 | 百度千帆大模型 |
| 前端 | Vue3 + Element Plus |
| 安全 | 拦截器 + ThreadLocal |

## 核心职责

### 1. 健康评估模块开发与性能优化
- 针对体检报告分析耗时痛点，集成 **百度千帆AI大模型** 进行语义分析
- 设计 **Redis多级缓存** 策略存储高频访问的健康建议
- 将单次分析响应时间从 **8秒降低至1秒以内**
- 护理人员查阅效率提升约 **30%**
- 有效支撑早高峰期间的高并发查询

### 2. IoT设备管理模块设计
- 开发 **华为云IoT平台** 对接服务
- 通过异步线程池实现产品列表与本地数据的 **增量同步**
- 设计"设备-位置"绑定逻辑确保数据一致性
- 列表同步耗时从 **3分钟缩短至10秒**
- 支持院内 **500+设备** 的实时状态监控

### 3. 安全认证体系构建
- 基于拦截器与 **ThreadLocal** 实现微信小程序用户的无感登录
- 实现多线程环境下的数据隔离与安全
- 零内存泄漏稳定运行
- 支撑小程序端日均 **2000+次** 活跃访问

## 项目成果

- **性能**: AI分析响应时间从8s降至1s以内
- **同步**: IoT设备列表同步从3min降至10s
- **规模**: 支持500+设备实时监控、日均2000+次访问
- **稳定**: 零内存泄漏，稳定支撑生产环境

---

**项目状态**: ✅ 已完成  
**仓库状态**: 🔒 暂未公开，敬请期待

<script>
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href*="zznursing"]').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      alert('🔒 该项目仓库暂未公开，敬请期待！');
    });
  });
});
</script>