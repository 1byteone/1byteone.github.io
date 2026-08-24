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
  
  # 可点击技术栈学习区
  - block: tech-learning
    id: skills
    content:
      title: "技术栈学习路线"
      subtitle: "点击任意卡片，查看配套架构图、教程、学习速览、路线大纲与专业 Goal"
    design:
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
        - title: AI工程实习生
          company: 江西传习教育科技有限公司
          company_url: ''
          company_logo: ''
          location: 南昌，中国
          date_start: '2026-05-01'
          date_end: '2026-08-31'
          description: |2-
            **后端研发支持**
            * 参与公司AI商品搜索与知识库应用研发，负责查询、筛选、服务调用和参数校验等接口开发
            * 使用Redis、Redisson和RocketMQ完成幂等校验、异步处理、失败重试与异常补偿
            * 基于Elasticsearch、IK分词和DSL完成多条件筛选、结果排序，接入语义召回能力，召回效果提升约35%
            **AI应用支持**
            * 参与企业RAG知识库问答场景，负责PDF/Markdown材料预处理、文本分块、向量化入库和样例整理
            * 基于LangChain、LCEL验证调用路径，补充来源约束、结构化输出与兜底策略
            * 使用FastAPI异步接口、SSE流式输出和会话上下文管理联调，支持逐Token展示和多会话访问
            * 完成20余组并发测试，结合日志定位并修复7类问题，补充异常处理、降级策略和测试记录
        - title: 后端开发（团队项目）
          company: 智颐养老护理系统
          company_url: 'https://github.com/1byteone'
          company_logo: ''
          location: 远程
          date_start: '2025-09-01'
          date_end: '2026-01-31'
          description: |2-
            面向中型养老院的综合管理平台（B端运营后台 + C端家属小程序），团队6人，负责健康评估引擎、IoT同步服务及统一鉴权三个模块。
            * 集成百度千帆AI大模型进行语义分析，设计Redis多级缓存策略，单次分析响应时间从8秒降低至1秒以内，护理人员查阅效率提升约30%
            * 开发华为云IoT平台对接服务，通过异步线程池实现产品列表与本地数据的增量同步，列表同步耗时从3分钟缩短至10秒
            * 基于拦截器与ThreadLocal实现微信小程序用户的无感登录与上下文传递，支撑小程序端日均2000+次活跃访问
        - title: 后端开发（个人项目）
          company: 灵犀智能写作
          company_url: 'https://github.com/1byteone'
          company_logo: ''
          location: 远程
          date_start: '2025-02-01'
          date_end: '2026-05-31'
          description: |2-
            基于Spring Boot 3 + Spring AI Alibaba构建的AI智能图文创作平台，独立全栈设计与开发。
            * 基于StateGraph自主设计工作流引擎，实现标题生成、大纲构建、正文撰写等多智能体的串行/并行灵活编排
            * 整合SSE技术与前端对接，基于ThreadPoolTaskExecutor构建异步任务体系，实现内容的毫秒级首字上屏，接口吞吐量提升50%
            * 封装Prompt模板引擎与StructuredOutputConverter，设计策略模式动态接入多源配图服务，保证99%以上的生成成功率
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

