import { siteConfig } from "@/content/site"

export type Locale = "en" | "ar"

export const localeCopy = {
  en: {
    lang: "en",
    dir: "ltr",
    portfolioLabel: "portfolio",
    languageLabel: "العربية",
    languageSwitchTitle: "Open Arabic version",
    backHome: "back to home",
    navItems: [
      { path: "/", number: "01", label: "home", command: "cd ~" },
      { path: "/blog", number: "02", label: "journal", command: "ls posts/" },
      { path: "/lab", number: "03", label: "lab", command: "ls lab/" },
      { path: "/tools", number: "04", label: "tools", command: "ls tools/" },
      { path: "/about", number: "05", label: "about", command: "cat resume.md" },
      { path: "/contact", number: "06", label: "contact", command: "ping me" },
    ],
    footer: {
      developedBy: "developed by",
      customizedBy: "customized by",
      online: "online",
      help: ":help for commands",
    },
    home: {
      status:
        "sys.status: AI application engineer, building observable RAG and backend systems",
      navLinks: [
        { href: "/blog", label: "(01) journal // read the writing" },
        { href: "/lab", label: "(02) lab // browse experiments" },
        { href: "/tools", label: "(03) tools // use something small" },
        { href: "/about", label: "(04) about // open the dossier" },
        { href: "/contact", label: "(05) contact // book a conversation" },
      ],
      executiveTitle: "Engineering signal",
      executiveCopy:
        "The terminal is an interface; the work is evidence-driven engineering: building RAG and agent systems, backend services, and public notes that explain the trade-offs.",
      recentEntries: "Recent entries",
      latest: "latest",
      readTime: "min",
    },
    blog: {
      title: "Journal",
      description:
        "Technical notes on RAG, agents, Spring AI, backend systems, deployment, and the craft of making complicated systems feel clear.",
      searchLabel: "search>",
      searchMeta: "grep archive",
      searchPlaceholder: "type a topic, phrase, or tool",
      searchButton: "run",
      allPosts: "All Posts",
      hideInsights: "hide insights",
      showInsights: "show insights",
      featured: "Featured",
      read: "read",
      noPosts: "No posts match this filter. Try another topic or browse all.",
      clearFilter: "clear filter",
    },
    post: {
      back: "back to journal",
      entryType: "journal entry",
      begin: "begin document parsing",
      eof: "eof",
      tags: "tags:",
      commentsCommand: "node comments.js",
      relatedCommand: "find ./related-posts",
      newsletterTitle: "$ subscribe --no-spam --pinky-promise",
      newsletterMeta: "newsletter",
      newsletterLead:
        "I write about building products, leading teams, and the things I figure out along the way. Honestly? It's some of my best thinking.",
      newsletterCopy:
        "No spam, no selling your email, no fake weekly digest cadence. Just a quiet ping when I publish something new.",
      newsletterFooter: "Your inbox is sacred. I respect that.",
    },
    reading: {
      progress: "Progress",
      readingTime: "reading time",
      fontSize: "Font Size",
      readingTheme: "Reading Theme",
      spacing: "Spacing",
      focusOn: "Focus Mode ON",
      focus: "Focus Mode",
      focusOnCopy: "Click to restore terminal shell",
      focusCopy: "Strip the chrome for a calmer read",
      info: "Article Info",
      sections: "Sections",
      words: "~Words",
      themes: {
        terminal: "Terminal",
        sepia: "Sepia",
        light: "Light",
      },
      spacings: {
        compact: "Tight",
        comfortable: "Normal",
        spacious: "Airy",
      },
    },
    digest: {
      title: "Too lazy to read?",
      meta: "brain-rot mode",
      intro:
        "I made this for the honest reader who opened the post, respected the effort, and still wants the point now.",
      cards: [
        { label: "The point", helper: "The post compressed into one minute." },
        { label: "Keep these", helper: "The ideas most worth remembering." },
        { label: "Jump to", helper: "Skip straight to the useful sections." },
        { label: "Three words", helper: "A memory hook for the whole thing." },
      ],
      empty: "This article is compact enough to read straight through.",
      fullRead: "full read",
      savedTime: "saved if this is enough",
    },
    lab: {
      title: "Lab bench",
      eyebrow: "$ ls ./lab",
      description:
        "Small experiments, utilities, and technical play. These are not polished case studies. They are proof that I like building in public.",
      viewAll: "open lab",
      repo: "repo",
      stack: "stack",
      disclaimer: "experiments, not portfolio case studies",
    },
    tools: {
      title: "Useful tools",
      eyebrow: "$ open ./tools",
      description:
        "Tiny no-login utilities people can actually use, while still feeling like part of the portfolio.",
      openTool: "open tool",
      allTools: "open all tools",
      indexTitle: "Tools that do one thing",
      indexDescription:
        "No account, no upload unless the browser needs a local file, no ceremony. Small tools for normal everyday tasks.",
      splitter: {
        title: "Bill splitter",
        description:
          "Split a bill, add service charge or tax, and copy the result without signing in.",
        routeTitle: "Split a bill",
        routeDescription:
          "Enter who paid, how many portions each person covers, and copy a clear note for the group.",
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
