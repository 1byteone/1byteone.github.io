---
# Leave the homepage title empty to use the site title
title: ''
summary: ''
date: 2026-01-05
type: landing

sections:
  # Developer Hero - Gradient background with name, role, social, and CTAs
  - block: dev-hero
    id: hero
    content:
      username: me
      greeting: "Hi, I'm"
      show_status: true
      show_scroll_indicator: true
      typewriter:
        enable: true
        prefix: "I build"
        strings:
          - "RAG-powered search systems"
          - "AI agent applications"
          - "intelligent retrieval services"
          - "LLM-integrated backends"
        type_speed: 70
        delete_speed: 40
        pause_time: 2500
      cta_buttons:
        - text: View My Work
          url: "#projects"
          icon: arrow-down
        - text: Get In Touch
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
  
  # Filterable Portfolio - Alpine.js powered project filtering
  - block: portfolio
    id: projects
    content:
      title: "Featured Projects"
      subtitle: "AI-powered systems and intelligent applications"
      count: 0
      filters:
        folders:
          - projects
      buttons:
        - name: All
          tag: '*'
        - name: AI
          tag: AI
        - name: RAG
          tag: RAG
        - name: Backend
          tag: Backend
      default_button_index: 0
    design:
      columns: 3
      background:
        color:
          light: "#ffffff"
          dark: "#0d0d12"
      spacing:
        padding: ["4rem", "0", "4rem", "0"]
  
  # Clickable tech stack learning roadmap
  - block: tech-learning
    id: skills
    content:
      title: "Tech Stack Learning Roadmap"
      subtitle: "Open any card for its diagram, tutorial, study overview, roadmap, and professional goal"
    design:
      background:
        color:
          light: "#f5f5f5"
          dark: "#08080c"
      spacing:
        padding: ["4rem", "0", "4rem", "0"]
  
  # Experience Timeline
  - block: resume-experience
    id: experience
    content:
      title: "Experience"
      date_format: Jan 2006
      items:
        - title: AI Engineering Intern
          company: Jiangxi Chuanxi Education Technology Co., Ltd.
          company_url: ''
          company_logo: ''
          location: Nanchang, China
          date_start: '2026-05-01'
          date_end: '2026-08-31'
          description: |2-
            **Backend Development Support**
            * Participated in AI product search and knowledge base R&D, responsible for query, filter, service invocation, and parameter validation interfaces
            * Completed idempotent validation, async processing, failure retry, and exception compensation using Redis, Redisson, and RocketMQ
            * Completed multi-condition filtering and result ranking based on Elasticsearch, IK tokenizer, and DSL, integrating semantic recall with ~35% improvement
            **AI Application Support**
            * Participated in enterprise RAG knowledge base Q&A scenario, responsible for PDF/Markdown preprocessing, text chunking, vectorization, and sample curation
            * Verified invocation paths based on LangChain and LCEL, supplementing source constraints, structured output, and fallback strategies
            * Coordinated FastAPI async interfaces, SSE streaming output, and session context management, supporting token-by-token display and multi-session access
            * Completed 20+ groups of concurrent testing, located and fixed 7 types of issues via log analysis, supplemented exception handling and degradation strategies
        - title: Backend Developer (Team Project)
          company: ZhiYi Elderly Care Nursing System
          company_url: 'https://github.com/1byteone'
          company_logo: ''
          location: Remote
          date_start: '2025-09-01'
          date_end: '2026-01-31'
          description: |2-
            Comprehensive management platform for medium-sized nursing homes (B-end ops dashboard + C-end family mini-program), team of 6, responsible for health assessment engine, IoT sync service, and unified auth modules.
            * Integrated Baidu Qianfan AI model for semantic analysis, designed Redis multi-level caching, reduced single analysis response from 8s to under 1s, improving nurse efficiency by ~30%
            * Developed Huawei Cloud IoT platform integration service, achieving incremental sync via async thread pool, sync time from 3min to 10s
            * Implemented WeChat mini-program seamless login and context propagation based on interceptors and ThreadLocal, supporting 2000+ daily active visits
        - title: Backend Developer (Personal Project)
          company: LingXi AI Writing Platform
          company_url: 'https://github.com/1byteone'
          company_logo: ''
          location: Remote
          date_start: '2025-02-01'
          date_end: '2026-05-31'
          description: |2-
            AI-powered intelligent article creation platform built on Spring Boot 3 + Spring AI Alibaba, independently designed and developed full-stack.
            * Designed StateGraph-based workflow engine for flexible serial/parallel orchestration of multi-agent tasks (title, outline, body generation)
            * Integrated SSE technology with frontend, built async task system with ThreadPoolTaskExecutor, achieving millisecond first-token display and 50% throughput improvement
            * Wrapped Prompt template engine and StructuredOutputConverter, designed strategy pattern for dynamic multi-source image services, maintaining 99%+ generation success rate
    design:
      columns: '1'
      background:
        color:
          light: "#ffffff"
          dark: "#0d0d12"
      spacing:
        padding: ["4rem", "0", "4rem", "0"]
  
  # Recent Blog Posts
  - block: collection
    id: blog
    content:
      title: "Recent Posts"
      subtitle: 'Thoughts on AI engineering, RAG, and LLM applications'
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
  
  # Contact Section
  - block: contact-info
    id: contact
    content:
      title: "Get In Touch"
      subtitle: "Let's build something amazing together"
      text: |-
        I'm always interested in hearing about new projects and opportunities.
        Whether you're looking to hire, collaborate, or just want to say hi, feel free to reach out!
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
  
  # CTA Card
  - block: cta-card
    content:
      title: "Open to Opportunities"
      text: |-
        I'm currently looking for **AI Application Developer** or **Backend Engineer** roles.
        
        Let's connect and discuss how I can help your team with intelligent systems.
      button:
        text: 'Download Resume'
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


