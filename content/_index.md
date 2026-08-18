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
  
  # Visual Tech Stack - Icons organized by category
  - block: tech-stack
    id: skills
    content:
      title: "Tech Stack"
      subtitle: "Technologies I use to build intelligent systems"
      categories:
        - name: AI & LLM
          items:
            - name: LangChain
              icon: devicon/python
            - name: FastAPI
              icon: devicon/python
            - name: RAG
              icon: devicon/python
            - name: OpenAI
              icon: devicon/python
        - name: Backend
          items:
            - name: Java
              icon: devicon/java
            - name: Spring Boot
              icon: devicon/spring
            - name: Python
              icon: devicon/python
            - name: MySQL
              icon: devicon/mysql
        - name: Infrastructure
          items:
            - name: Redis
              icon: devicon/redis
            - name: Docker
              icon: devicon/docker
            - name: RocketMQ
              icon: devicon/rabbitmq
            - name: Elasticsearch
              icon: devicon/elasticsearch
        - name: DevOps
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
  
  # Experience Timeline
  - block: resume-experience
    id: experience
    content:
      title: "Experience"
      date_format: Jan 2006
      items:
        - title: AI Application Developer Intern
          company: Jiangxi Chuanxi Education Technology Co., Ltd.
          company_url: ''
          company_logo: ''
          location: Nanchang, China
          date_start: '2026-09-01'
          date_end: ''
          description: |2-
            * Developing AI-powered search and recommendation systems
            * Building RAG-based intelligent retrieval services
            * Integrating Python AI services with Spring Cloud microservices
            * Implementing vector search and hallucination control mechanisms
        - title: AI Application Developer (Personal Projects)
          company: Independent Developer
          company_url: 'https://github.com/1byteone'
          company_logo: ''
          location: Remote
          date_start: '2026-03-01'
          date_end: '2026-09-01'
          description: |2-
            * Built agricultural knowledge base Q&A agent with LangChain
            * Developed e-commerce natural language AI search system
            * Implemented RAG pipelines with vector storage and multi-turn conversation
            * Created FastAPI streaming interfaces with SSE support
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
