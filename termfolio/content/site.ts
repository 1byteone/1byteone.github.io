export const siteConfig = {
  name: "Jinsong Yang",
  professionalName: "Yang Jinsong / 杨劲松",
  handle: "1byteone",
  title: "AI Application Engineer · RAG & Backend Systems",
  headline: "I build AI applications and backend systems that stay understandable, verifiable, and maintainable.",
  tagline: "ai applications · rag · backend engineering",
  description:
    "The engineering archive of Jinsong Yang, covering RAG, agents, Spring AI, backend systems, deployment, and open-source practice.",
  bio: [
    "I build AI application backends from the request boundary to retrieval, model orchestration, and production verification.",
    "My current focus is practical engineering: make system behavior observable, keep evidence close to decisions, and turn experiments into maintainable services.",
    "This terminal portfolio is a living archive of projects, technical notes, experiments, and the trade-offs behind them.",
  ],

  avatar: "/engineer-terminal-avatar.png",

  location: "Nanchang, China",
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
    focus: "RAG, agents, backend systems, engineering verification",
    status: "building AI applications and open-source engineering notes",
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
    { label: "published notes", value: "20+" },
    { label: "project records", value: "2" },
    { label: "engineering focus", value: "RAG + Agent" },
    { label: "site modes", value: "4" },
  ],
  experience: [
    {
      period: "2026 - present",
      role: "AI application engineer",
      company: "Independent engineering practice",
      summary:
        "Building RAG and agent systems with a focus on request boundaries, evidence, observability, and maintainable backend services.",
    },
    {
      period: "2025 - present",
      role: "Backend systems builder",
      company: "Java / Spring Boot / Python",
      summary:
        "Designing service boundaries, dependency injection, distributed systems, retrieval pipelines, and deployment workflows through project work and technical notes.",
    },
  ],
  engagements: [
    {
      period: "Project 01",
      role: "Independent developer",
      company: "Agricultural QA Agent",
      summary:
        "A LangGraph, FastAPI, ChromaDB, and MCP based knowledge assistant with citation-aware answers and evidence scoring.",
    },
    {
      period: "Project 02",
      role: "Core backend lead",
      company: "Distributed Micro Cloud Mall",
      summary:
        "A Spring Cloud Alibaba practice covering service decomposition, gateway, search, caching, messaging, and distributed consistency.",
    },
  ],
  hackathons: [
    {
      place: "OPEN SOURCE",
      name: "Engineering archive",
      summary: "A public record of implementation details, failures, decisions, and verification steps.",
    },
    {
      place: "METHOD",
      name: "Evidence before confidence",
      summary: "Every conclusion should point back to a scenario, signal, test, or published artifact.",
    },
    {
      place: "DIRECTION",
      name: "AI systems that ship",
      summary: "Move from a promising demo to a service that can be explained, observed, and maintained.",
    },
  ],
  skills: [
    "RAG",
    "AI agents",
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
    "observability",
    "technical writing",
  ],
  certifications: [
    { name: "RAG", desc: "Retrieval augmented generation", mark: "RAG", image: "" },
    { name: "AGENT", desc: "Goal-oriented agent workflows", mark: "AI", image: "" },
    { name: "BACKEND", desc: "Reliable service boundaries", mark: "API", image: "" },
    { name: "JAVA", desc: "Spring Boot and distributed systems", mark: "JVM", image: "" },
    { name: "PYTHON", desc: "FastAPI and AI tooling", mark: "PY", image: "" },
    { name: "OPEN SOURCE", desc: "Public engineering practice", mark: "OSS", image: "" },
  ],
  credentials: [
    { name: "GitHub", icon: "</>", desc: "github.com/1byteone", image: "" },
    { name: "Nanchang", icon: "LOC", desc: "Jiangxi / China", image: "" },
    { name: "Archive", icon: "LOG", desc: "Static notes and project records", image: "" },
  ],
} as const
