export const labExperiments = [
  {
    repo: "1byteone/agri-qa-assistant",
    url: "https://github.com/1byteone/agri-qa-assistant",
    title: "Agricultural QA Agent",
    type: { en: "RAG 与 Agent 项目", ar: "RAG and agent project" },
    summary: {
      en: "基于 LangGraph、FastAPI、ChromaDB 和 MCP 的知识助手，支持引用回答与证据评分。",
      ar: "LangGraph, FastAPI, ChromaDB, and MCP project with citation-aware answers.",
    },
    stack: ["Python", "FastAPI", "LangGraph", "ChromaDB"],
  },
  {
    repo: "1byteone/mall-micro-cloud",
    url: "https://github.com/1byteone/mall-micro-cloud",
    title: "Distributed Micro Cloud Mall",
    type: { en: "分布式后端项目", ar: "distributed backend project" },
    summary: {
      en: "Spring Cloud Alibaba 实践，覆盖服务拆分、网关、搜索、缓存、消息和分布式一致性。",
      ar: "Spring Cloud Alibaba practice covering service decomposition and distributed consistency.",
    },
    stack: ["Java", "Spring Boot", "Nacos", "Redis", "RocketMQ"],
  },
  {
    repo: "1byteone/engineering-archive",
    url: "https://github.com/1byteone",
    title: "Engineering Archive",
    type: { en: "公开技术文章", ar: "public technical notes" },
    summary: {
      en: "围绕后端边界、Spring AI、RAG 流水线和生产取舍的场景化文章。",
      ar: "Scenario-driven notes on backend boundaries and AI engineering.",
    },
    stack: ["Spring Boot", "RAG", "Architecture"],
  },
  {
    repo: "1byteone/terminal-theme",
    url: "https://github.com/1byteone",
    title: "Terminal Theme System",
    type: { en: "主题架构实验", ar: "theme architecture experiment" },
    summary: {
      en: "基于分支管理的终端作品集方向，每个方向都有独立的交互语法和视觉系统。",
      ar: "A branch-based collection of terminal portfolio directions.",
    },
    stack: ["Next.js", "React", "Tailwind", "Hugo"],
  },
] as const

export const utilityTools = [
  {
    slug: "splitter",
    href: "/tools/splitter",
    title: { en: "账单分摊", ar: "مقسّم الفاتورة" },
    summary: {
      en: "分摊共同支出、服务费和税费，并复制一条清晰的群聊结算消息。",
      ar: "قسّم الفاتورة مع الخدمة والضريبة، وانسخ رسالة مرتبة للمجموعة.",
    },
    command: "split bill",
  },
  {
    slug: "short-link",
    href: "/tools/short-link",
    title: { en: "短链接", ar: "رابط قصير" },
    summary: {
      en: "把长 URL 缩短成适合直接粘贴到消息中的链接。",
      ar: "حوّل الرابط الطويل إلى رابط أقصر وأنظف للمشاركة.",
    },
    command: "url short",
  },
  {
    slug: "qr",
    href: "/tools/qr",
    title: { en: "二维码生成器", ar: "مولّد QR" },
    summary: {
      en: "把链接、文本、电话或 Wi-Fi 信息转换为可下载的二维码。",
      ar: "حوّل رابطًا أو نصًا أو رقمًا إلى QR جاهز للتحميل.",
    },
    command: "qr make",
  },
  {
    slug: "whatsapp",
    href: "/tools/whatsapp",
    title: { en: "WhatsApp 链接", ar: "رابط واتساب" },
    summary: {
      en: "创建带预置消息的 WhatsApp 点击聊天链接，适合不想保存号码的场景。",
      ar: "أنشئ رابط واتساب برسالة مسبقة، من غير ما يحفظ الطرف الثاني الرقم.",
    },
    command: "wa link",
  },
  {
    slug: "event",
    href: "/tools/event",
    title: { en: "日历文件", ar: "ملف تقويم" },
    summary: {
      en: "生成可添加到 Apple Calendar、Google Calendar 或 Outlook 的 .ics 日程文件。",
      ar: "جهّز ملف .ics صغيرًا يضيف الموعد مباشرة إلى التقويم.",
    },
    command: "make ics",
  },
  {
    slug: "image",
    href: "/tools/image",
    title: { en: "图片压缩", ar: "تصغير الصور" },
    summary: {
      en: "在浏览器中调整并压缩本地图片，再发送到其他地方。",
      ar: "صغّر صورة من جهازك داخل المتصفح قبل إرسالها.",
    },
    command: "image shrink",
  },
  {
    slug: "share-card",
    href: "/tools/share-card",
    title: { en: "分享卡片", ar: "بطاقة مشاركة" },
    summary: {
      en: "把引用、公告或短消息制作成适合社交分享的图片。",
      ar: "حوّل اقتباسًا أو إعلانًا قصيرًا إلى بطاقة أنيقة للمشاركة.",
    },
    command: "card make",
  },
] as const

export type UtilityToolSlug = (typeof utilityTools)[number]["slug"]

export function getUtilityTool(slug: string) {
  return utilityTools.find((tool) => tool.slug === slug)
}
