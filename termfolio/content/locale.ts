import { siteConfig } from "@/content/site"

export type Locale = "en" | "ar"

export const localeCopy = {
  en: {
    lang: "zh-CN",
    dir: "ltr",
    portfolioLabel: "个人终端",
    languageLabel: "العربية",
    languageSwitchTitle: "打开阿拉伯语版本",
    backHome: "返回首页",
    navItems: [
      { path: "/", number: "01", label: "首页", command: "cd ~" },
      { path: "/blog", number: "02", label: "文章", command: "ls posts/" },
      { path: "/lab", number: "03", label: "实验室", command: "ls lab/" },
      { path: "/tools", number: "04", label: "工具", command: "ls tools/" },
      { path: "/about", number: "05", label: "关于我", command: "cat resume.md" },
      { path: "/contact", number: "06", label: "联系", command: "ping me" },
    ],
    footer: {
      developedBy: "开发者",
      customizedBy: "定制者",
      online: "在线",
      help: ":help 查看命令",
    },
    home: {
      status:
        "sys.status: AI 应用开发工程师，构建可观测的 RAG 与后端系统",
      navLinks: [
        { href: "/blog", label: "(01) 文章 // 阅读技术记录" },
        { href: "/lab", label: "(02) 实验室 // 浏览实验项目" },
        { href: "/tools", label: "(03) 工具 // 使用实用工具" },
        { href: "/about", label: "(04) 关于我 // 查看个人档案" },
        { href: "/contact", label: "(05) 联系 // 发起交流" },
      ],
      executiveTitle: "工程信号",
      executiveCopy:
        "终端只是界面，真正重要的是以证据驱动工程实践：构建 RAG 与 Agent 系统、后端服务，并公开记录每个取舍。",
      recentEntries: "最新记录",
      latest: "最新",
      readTime: "分钟",
    },
    blog: {
      title: "技术文章",
      description:
        "记录 RAG、Agent、Spring AI、后端系统与部署实践，拆解复杂系统，让工程决策清晰可验证。",
      searchLabel: "搜索>",
      searchMeta: "grep archive",
      searchPlaceholder: "输入主题、短语或工具名称",
      searchButton: "执行",
      allPosts: "全部文章",
      hideInsights: "隐藏摘要",
      showInsights: "显示摘要",
      featured: "精选",
      read: "阅读",
      noPosts: "没有匹配当前筛选条件的文章。换个关键词，或浏览全部文章。",
      clearFilter: "清除筛选",
    },
    post: {
      back: "返回文章列表",
      entryType: "技术文章",
      begin: "开始解析文档",
      eof: "eof",
      tags: "标签：",
      commentsCommand: "node comments.js",
      relatedCommand: "find ./related-posts",
      newsletterTitle: "$ subscribe --no-spam --pinky-promise",
      newsletterMeta: "订阅更新",
      newsletterLead:
        "我记录产品构建、团队协作，以及实践过程中逐渐想明白的事情。这些往往是最值得留下的思考。",
      newsletterCopy:
        "不发垃圾邮件，不出售邮箱，也不制造每周硬凑的简报。只有发布新内容时，给你一条安静的提醒。",
      newsletterFooter: "你的收件箱很重要，我会尊重它。",
    },
    reading: {
      progress: "阅读进度",
      readingTime: "阅读时长",
      fontSize: "字号",
      readingTheme: "阅读主题",
      spacing: "段落间距",
      focusOn: "专注模式：开启",
      focus: "专注模式",
      focusOnCopy: "点击恢复终端界面",
      focusCopy: "隐藏多余界面，专心阅读",
      info: "文章信息",
      sections: "章节",
      words: "约字数",
      themes: {
        terminal: "终端",
        sepia: "复古",
        light: "浅色",
      },
      spacings: {
        compact: "紧凑",
        comfortable: "舒适",
        spacious: "宽松",
      },
    },
    digest: {
      title: "没时间通读？",
      meta: "快速摘要模式",
      intro:
        "为想快速抓住重点的读者准备：保留关键结论，省去不必要的铺垫。",
      cards: [
        { label: "核心观点", helper: "一分钟读完文章重点。" },
        { label: "重点保留", helper: "最值得记住的想法。" },
        { label: "快速跳转", helper: "直接进入最有用的章节。" },
        { label: "三个关键词", helper: "用关键词记住全文。" },
      ],
      empty: "这篇文章足够简洁，可以直接读完。",
      fullRead: "阅读全文",
      savedTime: "阅读摘要可节省的时间",
    },
    lab: {
      title: "实验台",
      eyebrow: "$ ls ./lab",
      description:
        "这里放置小型实验、实用工具和技术探索。它们不是包装完整的案例，而是我持续公开构建的工程记录。",
      viewAll: "打开实验室",
      repo: "代码仓库",
      stack: "技术栈",
      disclaimer: "实验项目，不是作品集案例",
    },
    tools: {
      title: "实用工具",
      eyebrow: "$ open ./tools",
      description:
        "无需登录即可使用的小工具，解决真实的小问题，也延续这份工程作品集的终端体验。",
      openTool: "打开工具",
      allTools: "打开全部工具",
      indexTitle: "专注做好一件事的工具",
      indexDescription:
        "无需注册；除非浏览器需要本地文件，否则不会上传数据。为日常任务准备的轻量工具。",
      splitter: {
        title: "账单分摊",
        description:
          "分摊账单，加入服务费或税费，无需登录即可复制结果。",
        routeTitle: "分摊账单",
        routeDescription:
          "输入付款人和每个人承担的份数，一键复制清晰的分摊说明。",
      },
    },
  },
  ar: {
    lang: "ar",
    dir: "rtl",
    portfolioLabel: "موقع شخصي",
    languageLabel: "EN",
    languageSwitchTitle: "Open English version",
    backHome: "العودة للرئيسية",
    navItems: [
      { path: "/", number: "01", label: "الرئيسية", command: "cd ~" },
      { path: "/blog", number: "02", label: "الدفتر", command: "ls posts/" },
      { path: "/lab", number: "03", label: "المعمل", command: "ls lab/" },
      { path: "/tools", number: "04", label: "الأدوات", command: "ls tools/" },
      { path: "/about", number: "05", label: "عنّي", command: "cat resume.md" },
      { path: "/contact", number: "06", label: "تواصل", command: "ping me" },
    ],
    footer: {
      developedBy: "طوّره",
      customizedBy: "وخصّصه",
      online: "متصل",
      help: ":help للأوامر",
    },
    home: {
      status:
        "sys.status: أقود People Analytics & Research، وأبني أنظمة قرار مدعومة بالبيانات والذكاء الاصطناعي",
      navLinks: [
        { href: "/blog", label: "(01) الدفتر // مقالات وخربشات" },
        { href: "/lab", label: "(02) المعمل // خربشات وتجارب وقت الفراغ" },
        { href: "/tools", label: "(03) الأدوات // أشياء صغيرة تنفع وقت الحاجة" },
        { href: "/about", label: "(04) عنّي // الخبرة وطريقة العمل" },
        { href: "/contact", label: "(05) تواصل // اكتب إذا الموضوع يستاهل" },
      ],
      executiveTitle: "ما وراء الواجهة",
      executiveCopy:
        "الواجهة بطابع Terminal، وخلفها عمل جاد: قيادة People Analytics & Research، وبناء أنظمة قرار تربط بيانات المنظمة بالأثر الذي يهم القادة.",
      recentEntries: "أحدث ما في الدفتر",
      latest: "الأحدث",
      readTime: "د",
    },
    blog: {
      title: "الدفتر",
      description:
        "دفتر أفكاري وخربشاتي: مقالات، ملاحظات، وأشياء أكتبها عن المنتج، التقنية، التحول، وما أتعلمه وأنا أحاول تحويل الأفكار إلى شيء يعمل.",
      searchLabel: "بحث",
      searchMeta: "grep archive",
      searchPlaceholder: "اكتب موضوعًا أو عبارة أو أداة",
      searchButton: "ابحث",
      allPosts: "كل مقالات الدفتر",
      hideInsights: "إخفاء اللوحة",
      showInsights: "إظهار اللوحة",
      featured: "مختار",
      read: "اقرأ",
      noPosts: "لا توجد مقالات بهذا البحث. جرّب كلمة أخرى أو ارجع لكل الدفتر.",
      clearFilter: "مسح الفلتر",
    },
    post: {
      back: "العودة للدفتر",
      entryType: "مقال من الدفتر",
      begin: "بداية النص",
      eof: "انتهى النص",
      tags: "الوسوم:",
      commentsCommand: "node comments.js",
      relatedCommand: "find ./related-posts",
      newsletterTitle: "$ subscribe --no-spam --pinky-promise",
      newsletterMeta: "النشرة",
      newsletterLead:
        "أكتب في الدفتر عن بناء المنتجات وقيادة الفرق: أفكار تتكوّن أثناء التجربة، لا بعد ترتيبها في عرض جميل.",
      newsletterCopy:
        "إذا نشرت شيئًا يستحق القراءة، يصلك تنبيه خفيف. لا إزعاج، ولا نشرة أسبوعية مصطنعة.",
      newsletterFooter: "بريدك يبقى لك. أستخدمه للتنبيه فقط.",
    },
    reading: {
      progress: "التقدم",
      readingTime: "وقت القراءة",
      fontSize: "حجم الخط",
      readingTheme: "نمط القراءة",
      spacing: "التباعد",
      focusOn: "وضع التركيز مفعل",
      focus: "وضع التركيز",
      focusOnCopy: "اضغط لإرجاع واجهة Terminal",
      focusCopy: "خلّ النص في الوسط واترك الباقي على جنب",
      info: "معلومات المقال",
      sections: "الأقسام",
      words: "الكلمات تقريبًا",
      themes: {
        terminal: "Terminal",
        sepia: "دافئ",
        light: "فاتح",
      },
      spacings: {
        compact: "مضغوط",
        comfortable: "عادي",
        spacious: "واسع",
      },
    },
    digest: {
      title: "مستعجل؟ خذ الزبدة",
      meta: "قراءة سريعة",
      intro:
        "لو وصلت هنا وقلت: المختصر المفيد؟ هذه النسخة لك: أهم ما في المقال، بلا ما ترسلها لأحد يلخّصها.",
      cards: [
        { label: "الزبدة", helper: "الفكرة الأساسية في دقيقة." },
        { label: "لا تنسَ", helper: "نقاط تستحق تبقى معك." },
        { label: "اقفز إلى", helper: "أماكن تبدأ منها لو وقتك ضيق." },
        { label: "ثلاث كلمات", helper: "كلمات تحفظ روح المقال." },
      ],
      empty: "هذا المقال قصير بما يكفي لقراءته مباشرة.",
      fullRead: "قراءة كاملة",
      savedTime: "وفّرتها لو اكتفيت بالزبدة",
    },
    lab: {
      title: "المعمل",
      eyebrow: "$ ls ./lab",
      description:
        "هنا منطقة أعبث فيها، وخربشات أسويها وقت الفراغ. ليست شيئًا رسميًا ولا واجهة مشاريع؛ فقط أشياء أبنيها للمتعة، ولأفهم أكثر.",
      viewAll: "افتح المعمل",
      repo: "المستودع",
      stack: "التقنيات",
      disclaimer: "خربشات وقت الفراغ",
    },
    tools: {
      title: "أدوات تنفعك",
      eyebrow: "$ open ./tools",
      description:
        "أدوات صغيرة تعمل فورًا، بلا حسابات ولا ملفات تُرفع للسيرفر.",
      openTool: "افتح الأداة",
      allTools: "كل الأدوات",
      indexTitle: "أدوات بسيطة ترجع لها",
      indexDescription:
        "أشياء خفيفة للحياة اليومية: رابط أقصر، QR، واتساب، تقويم، صورة أصغر. بلا تسجيل ولا تعقيد.",
      splitter: {
        title: "مقسّم الفاتورة",
        description:
          "قسّم الفاتورة، أضف الخدمة أو الضريبة، وانسخ رسالة مرتبة للمجموعة.",
        routeTitle: "قسّم الفاتورة",
        routeDescription:
          "للقهوة والعشاء والطلبات المشتركة. أدخل من دفع، وعدد حصص كل شخص، ثم انسخ رسالة واضحة للمجموعة.",
      },
    },
  },
} as const

export const siteArabic = {
  name: "وليد الحامد",
  title: "رئيس People Analytics & Research",
  headline: "أحوّل بيانات المنظمة إلى قرارات أذكى، ونماذج تتنبأ بالمخاطر قبل أن تتأخر الإشارة.",
  tagline: "بيانات الناس · البحث · التحول",
  description:
    "موقع وليد الحامد، رئيس People Analytics & Research: كتابة وتجارب وأدوات عن البيانات والبحث والتحول.",
  bio: [
    "أقود People Analytics & Research في شركة علم، وأبني People Lab كمحرك مركزي يجمع بيانات المنظمة المتفرقة ويحوّلها إلى معرفة يعتمد عليها القرار.",
    "خلال عملي مع أكثر من 20 جهة في المنطقة، قدت منتجات HR مدعومة بالذكاء الاصطناعي، ومسارات دمج واستحواذ، وتحولات في الثقافة وتجربة الموظف. يهمني أن تنتهي الفكرة إلى نظام يعمل، وقرار أوضح، وأثر يمكن قياسه.",
    "أحمل شهادات PMP وPMI-RMP وProsci، وأدرس ماجستير إدارة الأعمال في Gies College of Business بجامعة إلينوي أوربانا-شامبين.",
  ],
  location: "السعودية",
  stats: [
    { label: "جهات عملت معها", value: "20+" },
    { label: "موظفون ضمن النطاق", value: "~7,000" },
    { label: "قيمة موفّرة", value: "أكثر من مليون" },
    { label: "مراكز هاكاثون", value: "3" },
  ],
  experience: [
    {
      period: "يونيو 2026 - الآن",
      role: "مدير People Lab (رئيس People Analytics & Research)",
      company: "شركة علم",
      summary:
        "أقود People Analytics & Research في علم، وأطوّر People Lab ليكون منصة مركزية للبيانات والبحث. يجمع المعمل بيانات المنظمة في محرك واحد للقرار، ويطوّر نماذج تنبؤية، ويبني شراكات بحثية، ويربط الثقافة وتجربة الموظف بنتائج الأعمال.",
    },
    {
      period: "أبريل 2026 - يونيو 2026",
      role: "قائد People Lab (People Analytics & Research)",
      company: "شركة علم",
      summary:
        "وضعت أساس People Lab، ووحّدت مصادر البيانات لبناء محرك قرار يتوسع مع الحاجة. طوّرت نماذج تتنبأ بمخاطر الإرهاق ودوران الموظفين وتراجع الارتباط، وأسست مسارًا بحثيًا مع جامعات سعودية لإثراء المعرفة العربية في الموارد البشرية.",
    },
    {
      period: "مايو 2025 - أبريل 2026",
      role: "مساعد مدير الثقافة وتجربة الموظف",
      company: "شركة علم",
      summary:
        "قدت الثقافة والارتباط الوظيفي والتغيير وحوكمة الملكية الفكرية في علم وشركاتها التابعة، ضمن نطاق يقارب 7,000 موظف. قدت مسار الموارد البشرية في اندماج علم وثقة لنحو 3,000 موظف، وأدرت Najd 2.0 حتى انتقل من حل داخلي خفّض تذاكر الموارد البشرية 48% إلى منتج جاهز للبيع.",
    },
    {
      period: "أكتوبر 2023 - مايو 2025",
      role: "مستشار الثقافة وتجربة الموظف",
      company: "شركة علم",
      summary:
        "قدت Najd، أول مساعد HR سعودي بالكامل يعمل داخل بيئة علم ومتكامل مع Microsoft Teams عبر RAG. وفّر تطويره داخليًا قرابة مليون ريال، ثم أصبح منتجًا يُطرح للعملاء. كما صممت دليل الدمج والاستحواذ وإطار العناية الواجبة، وطوّرت قيم علم وكفاءاتها ورحلات تجربة الموظف.",
    },
    {
      period: "سبتمبر 2023 - أكتوبر 2023",
      role: "مستشار",
      company: "باسقات العربية للاستشارات",
      summary:
        "قدت مشاريع Denison للثقافة التنظيمية في المنطقة، وقيّمت الكفاءات القيادية لجهات سعودية كبرى، وحسّنت العمليات وتجارب العمل، وأسهمت في تطوير الأعمال وإدارة علاقات أصحاب المصلحة.",
    },
    {
      period: "يوليو 2022 - يوليو 2023",
      role: "محلل أعمال",
      company: "باسقات العربية للاستشارات",
      summary:
        "أنجزت أكثر من 15 مشروعًا لتحول الثقافة مع STC Group وMobily وSANS وGEA وغيرها بالشراكة مع Denison Consulting. صممت خطط التغيير، واستراتيجية HR ونموذجها التشغيلي لمركز وقاء، وأطر الكفاءات، وهندسة الإجراءات، ورحلات العملاء، وCRM، ودورة المبيعات كاملة.",
    },
    {
      period: "يناير 2020 - يوليو 2022",
      role: "منسق تدريب",
      company: "شركة نافع للتدريب",
      summary:
        "أدرت تطوير البرامج التدريبية وتنفيذها وتقييمها، ووحّدت إجراءات التدريب، ووضعت آليات لقياس النتائج، وصممت مسارات عمل تربط التدريب بأهداف المنظمة.",
    },
    {
      period: "مايو 2021 - أغسطس 2021",
      role: "متدرب هندسة ميكانيكية",
      company: "أمانة جدة",
      summary:
        "صممت نظام إطفاء FM200 لإحدى منشآت محطة السلام، وتابعت تقدم مشروع تصريف مياه الأمطار في الأصالة وأعمال محطة السلام.",
    },
  ],
  engagements: [
    {
      period: "نوفمبر 2024 - يناير 2025",
      role: "مستشار أول (خبير)",
      company: "Cornerstone Consulting",
      summary:
        "أعددت دليل تشغيل تفاعليًا لمبادرة مجالس المهارات القطاعية التابعة لوزارة الموارد البشرية والتنمية الاجتماعية، وعالجت اختناقات سير العمل لتسريع التنفيذ وتحسين المخرجات.",
    },
    {
      period: "يناير 2024 - ديسمبر 2024",
      role: "مستشار أول (خبير)",
      company: "HR Leaders Consulting وBaseqat Arabia Consulting",
      summary:
        "بنيت للهيئة الملكية للجبيل وينبع لوحة Power BI تحلل دوران الموظفين في أربع مدن، وأسهمت في تخطيط القوى العاملة، وقدمت خبرة متخصصة في تحسين العمليات وتحول الثقافة.",
    },
  ],
  hackathons: [
    {
      place: "المركز الثالث",
      name: "هاكاثون علم",
      summary: "قدت فريقًا بنى منصة AI تسهّل استئجار السيارات في المطارات.",
    },
    {
      place: "المركز الثالث",
      name: "هاكاثون إمداد",
      summary: "بنيت «خدوم»، مساعد AI ينفّذ طلبات أنظمة ERP آليًا.",
    },
    {
      place: "المركز الأول",
      name: "هاكاثون المستشارين في باسقات",
      summary: "طورت تطبيقًا يُعدّ العروض الفنية والمالية آليًا ويسرّع التقدم للمنافسات.",
    },
  ],
  skills: [
    "People Analytics",
    "النمذجة التنبؤية",
    "البحث المؤسسي",
    "إدارة المشاريع",
    "تحول الثقافة التنظيمية",
    "إدارة التغيير",
    "التحول الرقمي",
    "تطبيقات AI وPython",
    "تحليل البيانات",
    "Power BI",
    "حل المشكلات",
    "تطوير الأعمال",
    "تحسين العمليات",
    "إدارة أصحاب المصلحة",
    "Excel وPowerPoint المتقدم",
  ],
}

export function getLocalePath(path: string, locale: Locale): string {
  if (locale === "en") return path
  if (path === "/") return "/ar"
  return `/ar${path}`
}

export function getLanguageSwitchPath(pathname: string, locale: Locale): string {
  if (locale === "ar") {
    const withoutPrefix = pathname.replace(/^\/ar(?=\/|$)/, "")
    return withoutPrefix || "/"
  }

  if (pathname === "/") return "/ar"
  return `/ar${pathname}`
}

export function getSiteName(locale: Locale) {
  return locale === "ar" ? siteArabic.name : siteConfig.name
}

const chineseTagLabels: Record<string, string> = {
  Tutorial: "教程",
  Streaming: "流式传输",
  "AI Backend": "AI 后端",
  "Async Python": "异步 Python",
  "Dependency Injection": "依赖注入",
  Performance: "性能",
  Backend: "后端",
  Architecture: "架构",
  "API Design": "API 设计",
  "Hallucination Prevention": "幻觉防护",
  Concurrency: "并发",
  "Thread Pool": "线程池",
  Memory: "记忆",
  "Prompt Engineering": "提示工程",
  "Tool Calling": "工具调用",
  Agents: "Agent",
  Database: "数据库",
  "High Concurrency": "高并发",
  Index: "索引",
  Transaction: "事务",
  Multimodal: "多模态",
  "Computer Vision": "计算机视觉",
  "Structured Output": "结构化输出",
  "AI Engineering": "AI 工程",
  "Data Structures": "数据结构",
  Decorator: "装饰器",
  Runtime: "运行时",
  "Information Retrieval": "信息检索",
  Embeddings: "向量嵌入",
  "Vector Database": "向量数据库",
  Production: "生产环境",
  Retrieval: "检索",
  Search: "搜索",
  Microservices: "微服务",
}

export function getTagLabel(tag: string, locale: Locale = "en") {
  return locale === "ar" ? tag : chineseTagLabels[tag] ?? tag
}
