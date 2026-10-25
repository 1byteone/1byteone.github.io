export const labExperiments = [
  {
    repo: "1byteone/agri-qa-assistant",
    url: "https://github.com/1byteone/agri-qa-assistant",
    title: "Agricultural QA Agent",
    type: { en: "RAG and agent project", ar: "RAG and agent project" },
    summary: {
      en: "A LangGraph, FastAPI, ChromaDB, and MCP based knowledge assistant with citation-aware answers and evidence scoring.",
      ar: "LangGraph, FastAPI, ChromaDB, and MCP project with citation-aware answers.",
    },
    stack: ["Python", "FastAPI", "LangGraph", "ChromaDB"],
  },
  {
    repo: "1byteone/mall-micro-cloud",
    url: "https://github.com/1byteone/mall-micro-cloud",
    title: "Distributed Micro Cloud Mall",
    type: { en: "distributed backend project", ar: "distributed backend project" },
    summary: {
      en: "Spring Cloud Alibaba practice covering service decomposition, gateway, search, caching, messaging, and distributed consistency.",
      ar: "Spring Cloud Alibaba practice covering service decomposition and distributed consistency.",
    },
    stack: ["Java", "Spring Boot", "Nacos", "Redis", "RocketMQ"],
  },
  {
    repo: "1byteone/engineering-archive",
    url: "https://github.com/1byteone",
    title: "Engineering Archive",
    type: { en: "public technical notes", ar: "public technical notes" },
    summary: {
      en: "Scenario-driven notes on backend boundaries, Spring AI, RAG pipelines, and production trade-offs.",
      ar: "Scenario-driven notes on backend boundaries and AI engineering.",
    },
    stack: ["Spring Boot", "RAG", "Architecture"],
  },
  {
    repo: "1byteone/terminal-theme",
    url: "https://github.com/1byteone",
    title: "Terminal Theme System",
    type: { en: "theme architecture experiment", ar: "theme architecture experiment" },
    summary: {
      en: "A branch-based collection of terminal portfolio directions, each with its own interaction grammar and visual system.",
      ar: "A branch-based collection of terminal portfolio directions.",
    },
    stack: ["Next.js", "React", "Tailwind", "Hugo"],
  },
] as const

export const utilityTools = [
  {
    slug: "splitter",
    href: "/tools/splitter",
    title: { en: "Bill splitter", ar: "مقسّم الفاتورة" },
    summary: {
      en: "Split shared costs, service charge, and tax. Copy a clean settlement note for the group chat.",
      ar: "قسّم الفاتورة مع الخدمة والضريبة، وانسخ رسالة مرتبة للمجموعة.",
    },
    command: "split bill",
  },
  {
    slug: "short-link",
    href: "/tools/short-link",
    title: { en: "Short link", ar: "رابط قصير" },
    summary: {
      en: "Shorten a long URL into something you can actually paste in a message.",
      ar: "حوّل الرابط الطويل إلى رابط أقصر وأنظف للمشاركة.",
    },
    command: "url short",
  },
  {
    slug: "qr",
    href: "/tools/qr",
    title: { en: "QR generator", ar: "مولّد QR" },
    summary: {
      en: "Turn a link, note, phone, or Wi-Fi text into a downloadable QR code.",
      ar: "حوّل رابطًا أو نصًا أو رقمًا إلى QR جاهز للتحميل.",
    },
    command: "qr make",
  },
  {
    slug: "whatsapp",
    href: "/tools/whatsapp",
    title: { en: "WhatsApp link", ar: "رابط واتساب" },
    summary: {
      en: "Create a click-to-chat WhatsApp link with a ready message. Useful when people hate saving numbers.",
      ar: "أنشئ رابط واتساب برسالة مسبقة، من غير ما يحفظ الطرف الثاني الرقم.",
    },
    command: "wa link",
  },
  {
    slug: "event",
    href: "/tools/event",
    title: { en: "Calendar file", ar: "ملف تقويم" },
    summary: {
      en: "Make a tiny .ics event file people can add to Apple Calendar, Google Calendar, or Outlook.",
      ar: "جهّز ملف .ics صغيرًا يضيف الموعد مباشرة إلى التقويم.",
    },
    command: "make ics",
  },
  {
    slug: "image",
    href: "/tools/image",
    title: { en: "Image shrinker", ar: "تصغير الصور" },
    summary: {
      en: "Resize and compress a local image in the browser before sending it anywhere.",
      ar: "صغّر صورة من جهازك داخل المتصفح قبل إرسالها.",
    },
    command: "image shrink",
  },
  {
    slug: "share-card",
    href: "/tools/share-card",
    title: { en: "Share card", ar: "بطاقة مشاركة" },
    summary: {
      en: "Turn a quote, announcement, or short note into a clean image for social sharing.",
      ar: "حوّل اقتباسًا أو إعلانًا قصيرًا إلى بطاقة أنيقة للمشاركة.",
    },
    command: "card make",
  },
] as const

export type UtilityToolSlug = (typeof utilityTools)[number]["slug"]

export function getUtilityTool(slug: string) {
  return utilityTools.find((tool) => tool.slug === slug)
}
