export const siteConfig = {
  name: "Jinsong Yang",
  professionalName: "Yang Jinsong / 杨劲松",
  handle: "1byteone",
  title: "AI 应用开发工程师 · RAG 与后端系统",
  headline: "我构建可理解、可验证、可持续维护的 AI 应用与后端系统。",
  tagline: "AI 应用 · RAG · 后端工程",
  description:
    "杨劲松的工程档案，记录 RAG、Agent、Spring AI、后端系统、部署与开源实践。",
  bio: [
    "我从请求边界、检索、模型编排到生产验证，完整构建 AI 应用后端。",
    "当前关注可落地的工程实践：让系统行为可观测，让证据贴近决策，并把实验沉淀为可维护的服务。",
    "这是一个持续更新的终端式工程档案，记录项目、技术文章、实验和背后的取舍。",
  ],

  avatar: "/engineer-terminal-avatar.png",

  location: "中国 · 南昌",
  email: "yjs_0831@qq.com",
  phone: "",
  siteUrl: "http://localhost:1315",
  twitterHandle: "",
  calUrl: "mailto:yjs_0831@qq.com",
  calEmbedUrl: "",

  socials: {
    github: { url: "https://github.com/1byteone", label: "GitHub", icon: "</>" },
  },

  coordinates: { lat: 28.6829, lon: 115.8582, label: "Nanchang" },
  terminalPrompt: "yoyo@engineering-lab:~",

  asciiArt: {
    home: [
      "__   __  ___  _   _  ___",
      "\\ \\ / / / _ \\| | | |/ _ \\",
      " \\ V / | (_) | |_| |  __/",
      "  \\_/   \\___/ \\___/ \\___|",
    ],
    about: [
      "__   __  ___  _   _  ___",
      "\\ \\ / / / _ \\| | | |/ _ \\",
      " \\ V / | (_) | |_| |  __/",
      "  \\_/   \\___/ \\___/ \\___|",
    ],
  },

  whoami: {
    focus: "RAG、Agent、后端系统、工程验证",
    status: "构建 AI 应用并记录开源工程实践",
  },

  terminalSkills: [
    "rag & agents       // Spring AI            // LangGraph",
    "java & spring boot // Python               // FastAPI",
    "retrieval systems  // observability        // deployment",
  ],

  // The upstream project is MIT licensed; keep its attribution visible in this fork.
  developedBy: {
    name: "termfolio contributors",
    url: "https://github.com/wa1939/termfolio",
  },
  customizedBy: {
    name: "Jinsong Yang",
    url: "https://github.com/1byteone",
  },

  stats: [
    { label: "已发布文章", value: "20+" },
    { label: "项目档案", value: "2" },
    { label: "工程重点", value: "RAG + Agent" },
    { label: "站点模式", value: "4" },
  ],
  experience: [
    {
      period: "2026 - 至今",
      role: "AI 应用开发工程师",
      company: "独立工程实践",
      summary:
        "构建 RAG 与 Agent 系统，关注请求边界、证据链、可观测性和可维护的后端服务。",
    },
    {
      period: "2025 - 至今",
      role: "后端系统工程实践者",
      company: "Java / Spring Boot / Python",
      summary:
        "通过项目与技术文章实践服务边界、依赖注入、分布式系统、检索流水线和部署流程。",
    },
  ],
  engagements: [
    {
      period: "项目 01",
      role: "独立开发者",
      company: "农业知识问答 Agent",
      summary:
        "基于 LangGraph、FastAPI、ChromaDB 与 MCP 的知识助手，支持带引用回答和证据评分。",
    },
    {
      period: "项目 02",
      role: "核心后端负责人",
      company: "分布式微云商城",
      summary:
        "Spring Cloud Alibaba 实践项目，覆盖服务拆分、网关、搜索、缓存、消息和分布式一致性。",
    },
  ],
  hackathons: [
    {
      place: "开源实践",
      name: "工程档案",
      summary: "公开记录实现细节、失败现场、关键决策和验证步骤。",
    },
    {
      place: "方法",
      name: "证据先于结论",
      summary: "每个结论都应回到具体场景、信号、测试或已发布的工程产物。",
    },
    {
      place: "方向",
      name: "真正上线的 AI 系统",
      summary: "把有潜力的 Demo 推进为可解释、可观测、可维护的服务。",
    },
  ],
  skills: [
    "RAG",
    "AI Agent",
    "Spring AI",
    "LangGraph",
    "Java",
    "Spring Boot",
    "Python",
    "FastAPI",
    "ChromaDB",
    "MySQL",
    "Redis",
    "Elasticsearch",
    "Docker",
    "可观测性",
    "技术写作",
  ],
  certifications: [
    { name: "RAG", desc: "检索增强生成", mark: "RAG", image: "" },
    { name: "AGENT", desc: "目标驱动的 Agent 工作流", mark: "AI", image: "" },
    { name: "BACKEND", desc: "可靠的服务边界", mark: "API", image: "" },
    { name: "JAVA", desc: "Spring Boot 与分布式系统", mark: "JVM", image: "" },
    { name: "PYTHON", desc: "FastAPI 与 AI 工具链", mark: "PY", image: "" },
    { name: "OPEN SOURCE", desc: "公开的工程实践", mark: "OSS", image: "" },
  ],
  credentials: [
    { name: "GitHub", icon: "</>", desc: "github.com/1byteone", image: "" },
    { name: "南昌", icon: "LOC", desc: "江西 / 中国", image: "" },
    { name: "工程档案", icon: "LOG", desc: "技术文章与项目记录", image: "" },
  ],
} as const
