---
# 中文主页配置
title: ''
summary: ''
date: 2026-01-05
type: landing

sections:
  # 开发者英雄区 - 个人介绍
  - block: dev-hero
    id: hero
    content:
      username: me
      greeting: "你好，我是"
      show_status: true
      show_scroll_indicator: true
      typewriter:
        enable: true
        prefix: "我构建"
        strings:
          - "RAG智能检索系统"
          - "AI智能体应用"
          - "智能问答服务"
          - "大模型集成后端"
        type_speed: 70
        delete_speed: 40
        pause_time: 2500
      cta_buttons:
        - text: 查看我的作品
          url: "#projects"
          icon: arrow-down
        - text: 联系我
          url: "#contact"
          icon: envelope
    design:
      style: centered
      avatar_shape: circle
      animations: true
      background:
        color:
          light: "#fafafa"
          dark: "#0a0a0f"
      spacing:
        padding: ["6rem", "0", "4rem", "0"]
  
  # 项目展示区
  - block: portfolio
    id: projects
    content:
      title: "精选项目"
      subtitle: "我的项目作品集"
      count: 0
      filters:
        folders:
          - projects
      buttons:
        - name: 全部
          tag: '*'
        - name: Java
          tag: Java
        - name: AI
          tag: AI
        - name: Python
          tag: Python
      default_button_index: 0
    design:
      columns: 3
      background:
        color:
          light: "#ffffff"
          dark: "#0d0d12"
      spacing:
        padding: ["4rem", "0", "4rem", "0"]
  
  # 技术栈展示区
  - block: tech-stack
    id: skills
    content:
      title: "技术栈"
      subtitle: "我用来构建智能系统的技术"
      categories:
        - name: AI与大模型
          items:
            - name: LangChain
              icon: devicon/python
            - name: FastAPI
              icon: devicon/python
            - name: RAG
              icon: devicon/python
            - name: OpenAI
              icon: devicon/python
        - name: 后端开发
          items:
            - name: Java
              icon: devicon/java
            - name: Spring Boot
              icon: devicon/spring
            - name: Python
              icon: devicon/python
            - name: MySQL
              icon: devicon/mysql
        - name: 基础设施
          items:
            - name: Redis
              icon: devicon/redis
            - name: Docker
              icon: devicon/docker
            - name: RocketMQ
              icon: devicon/rabbitmq
            - name: Elasticsearch
              icon: devicon/elasticsearch
        - name: 开发工具
          items:
            - name: Git
              icon: brands/github
            - name: Conda
              icon: devicon/python
            - name: Jupyter
              icon: devicon/jupyter
            - name: Linux
              icon: devicon/linux
    design:
      style: grid
      show_levels: false
      background:
        color:
          light: "#f5f5f5"
          dark: "#08080c"
      spacing:
        padding: ["4rem", "0", "4rem", "0"]
  
  # 工作经历时间线
  - block: resume-experience
    id: experience
    content:
      title: "工作经历"
      date_format: Jan 2006
      items:
        - title: Java后端 / AI应用开发实习生
          company: 江西传习教育科技有限公司
          company_url: ''
          company_logo: ''
          location: 南昌，中国
          date_start: '2026-09-01'
          date_end: ''
          description: |2-
            * 开发AI驱动的搜索与推荐系统
            * 构建基于RAG的智能检索服务
            * 集成Python AI服务与Spring Cloud微服务
            * 实现向量搜索与幻觉控制机制
        - title: 核心后端负责人（分布式微云商城）
          company: 4人实训项目
          company_url: 'https://github.com/1byteone'
          company_logo: ''
          location: 远程
          date_start: '2026-05-01'
          date_end: '2026-09-01'
          description: |2-
            * 主导秒杀链路、搜索/RAG、分布式一致性与研发规范
            * 采用Redis预扣库存+Redisson可重入锁+RocketMQ异步落库解决超卖
            * 商品搜索响应从2s降至20ms内，语义召回准确率提升35%
            * 统一建表、SQL评审、Git分支与CodeReview规范，联调Bug降低60%
        - title: 独立开发者（农业知识库问答智能体）
          company: 个人实训项目
          company_url: 'https://github.com/1byteone'
          company_logo: ''
          location: 远程
          date_start: '2026-03-01'
          date_end: '2026-03-31'
          description: |2-
            * 独立完成农业病害问答Agent，从PDF文档预处理、向量检索到FastAPI接口闭环
            * 采用私有知识库优先、通用知识兜底的调度策略
            * 支持多轮记忆、SSE流式输出和结构化结果
            * 定位修复向量召回超时、工具调用失效等7类故障
    design:
      columns: '1'
      background:
        color:
          light: "#ffffff"
          dark: "#0d0d12"
      spacing:
        padding: ["4rem", "0", "4rem", "0"]
  
  # 博客文章区
  - block: collection
    id: blog
    content:
      title: "最新文章"
      subtitle: '关于AI工程、RAG和大模型应用的思考'
      text: ''
      filters:
        folders:
          - blog
        exclude_featured: false
      count: 3
      order: desc
    design:
      view: card
      columns: 3
      background:
        color:
          light: "#f5f5f5"
          dark: "#08080c"
      spacing:
        padding: ["4rem", "0", "4rem", "0"]
  
  # 联系方式
  - block: contact-info
    id: contact
    content:
      title: "联系我"
      subtitle: "一起构建精彩项目"
      text: |-
        我对新的项目和机会总是很感兴趣。
        无论你是想雇佣、合作，还是只想打个招呼，都可以随时联系我！
      email: "yjs_0831@qq.com"
      autolink: true
    design:
      columns: '1'
      background:
        color:
          light: "#ffffff"
          dark: "#0d0d12"
      spacing:
        padding: ["4rem", "0", "4rem", "0"]
  
  # 行动号召卡片
  - block: cta-card
    content:
      title: "开放机会"
      text: |-
        我目前正在寻找 **AI应用开发工程师** 或 **后端工程师** 职位。
        
        让我们联系讨论我能如何为你的团队带来智能系统。
      button:
        text: '下载简历'
        url: uploads/resume.pdf
        new_tab: true
    design:
      card:
        css_class: 'bg-gradient-to-br from-primary-200 via-primary-100 to-secondary-200 dark:from-primary-600 dark:via-primary-700 dark:to-secondary-700'
        text_color: dark
      background:
        color:
          light: "#f5f5f5"
          dark: "#08080c"
      spacing:
        padding: ["4rem", "0", "6rem", "0"]
---