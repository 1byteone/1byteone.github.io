# 1byteone 技术博客 —— AI 配图工作流规范

## 概述

本规范定义了 1byteone 技术博客（HugoBlox 静态站点）的视觉设计体系、AI 生图提示词模板、以及从生图到集成的全流程标准。目标是建立统一、专业、可复现的技术博客配图生产流水线。

---

## 一、视觉设计体系

### 1.1 统一风格

所有文章配图遵循 **"白板手绘架构图"** 风格，模仿资深后端工程师站在白板前解释系统设计的真实感。

| 属性 | 规范 |
|------|------|
| 背景 | 纯白 / 极浅灰 |
| 线条 | 黑色马克笔手绘，粗细 2-3px |
| 重点色 | 蓝色（流程）、橙色（工具）、绿色（成功）、红色（错误/风险） |
| 字体 | 手写体风格英文，技术关键词用英文 |
| 装饰 | 无装饰性科技背景，无 3D，无人物，无赛博朋克，无真实照片 |
| 尺寸 | 1200×630（封面图）、1920×1080 或排版用 16:9 |
| 地位 | 写实技术白板，非 AI 科技海报 |
| 工具 | 生成后使用 Pillow 或 cairosvg 处理（裁剪、亮度、对比度） |

### 1.2 三篇文章的视觉主题

| 文章 | 核心视觉隐喻 | 主色调 | 架构核心 |
|------|-------------|--------|---------|
| RAG 三层幻觉预防 | 安全检查站 / 防御层 | 蓝+红 | Retrieve → Constrain → Validate |
| LangChain Agent | 决策循环 / 大脑 | 蓝+橙 | Think → Act → Observe → Loop |
| LangChain RAG Pipeline | 数据流水线 | 蓝+紫+绿 | Ingestion → Embedding → Retrieval → Generation |

### 1.3 统一视觉体系关系

```
               1byteone AI TECH VISUAL SYSTEM
       ┌────────────┐
       │   RAG      │  ← 防御系统
       │ 防御系统    │
       └─────┬──────┘
             │
             ▼
       ┌────────────┐
       │   Agent    │  ← 决策系统
       │ 决策系统    │
       └─────┬──────┘
             │
             ▼
       ┌────────────┐
       │ RAG Pipeline│ ← 数据系统
       │ 数据系统     │
       └────────────┘
```

---

## 二、AI 生图提示词模板

### 2.1 通用模板结构

```
[白板架构图标识] + [主题] + [布局说明] + [元素列表] + [色彩规范] + [排除项]
```

### 2.2 RAG 三层幻觉预防提示词

**用途**：`content/zh|en/blog/hallucination-prevention/` 的封面图 + 文章内嵌图

**提示词**：

```
请绘制一张专业的 AI 工程技术白板架构图，主题为「RAG 系统中的三层幻觉预防」。

画面采用真实程序员技术白板风格，白色背景，黑色马克笔手绘线条，少量蓝色和红色荧光笔作为重点标记，具有技术博客插图和系统设计面试白板的感觉。

画面从左向右展示完整 RAG 问答链路：

【用户问题】→ 【查询理解】→ 第一道防线：检索过滤 → 【向量数据库】
→ 第二道防线：提示词工程 → 【LLM】→ 第三道防线：输出验证 → 【可信答案】

把三个防线画成三个连续的"安全检查站"：

1. Retrieval Filtering：文档召回、相似度评分、Top-K、Relevance Filter、去除低质量/无关文档
2. Prompt Engineering：Context、System Prompt、Evidence、Answer Constraint、"仅依据提供的上下文回答"
3. Output Validation：Fact Check、Citation Check、Hallucination Detection、Confidence、输出审核

在画面上方用大标题："RAG Hallucination Prevention"
三个防线之间画粗箭头：Retrieve → Constrain → Validate
错误路径旁边画红色虚线：Irrelevant Context → Hallucination / Weak Prompt → Unsupported Claim / Invalid Output → False Answer
最终答案区域使用绿色勾号表示："Grounded Answer"

要求：极简白板风、技术架构图、手绘工程师风格、黑色马克笔轮廓、蓝色重点、红色风险警告、少量绿色成功标记、大量留白、结构清晰、信息密度高但不拥挤。
不要人物、不要复杂3D、不要装饰性科技背景、不要赛博朋克、不要真实照片。
所有技术关键词使用英文。
```

### 2.3 LangChain Agent 提示词

**用途**：`content/zh|en/blog/building-ai-agents/` 的封面图 + 文章内嵌图

**提示词**：

```
绘制一张专业的软件工程白板图，主题为"Building an AI Agent with LangChain"。

整体采用程序员白板手绘风格，白色背景，黑色马克笔线条，蓝色表示Agent工作流，橙色表示工具调用，绿色表示成功结果，红色表示失败/重试。

核心结构放在画面中央：

USER → USER QUESTION → LANGCHAIN AGENT → THINK/PLAN → SELECT TOOL → TOOL EXECUTION → OBSERVATION → REASON AGAIN → FINAL ANSWER

把Agent设计成中央"大脑"，周围连接多个工具：Search Tool、Calculator、Database、API、Web Search、Custom Tool。每个工具画成小模块，使用箭头与Agent相连。

在Agent旁边画Memory模块：Conversation Memory包含Previous Question、Previous Answer、User Context、Conversation History。

画一个简单的多轮对话示例：用户问"帮我查询昨天的天气"→Agent调用Weather API→Observation得到结果→用户问"那今天呢？"→Agent根据Memory判断用户仍然询问相同地点→调用天气工具。

右侧增加小型错误处理流程：Tool Failed → Retry → Alternative Tool → Final Response。

底部写：# LangChain Agent = LLM + Tools + Memory + Reasoning Loop

要求：白色背景、黑色马克笔手绘、程序员技术白板、架构图、清晰箭头、模块化。
不要复杂背景、不要人物主体、不要科幻HUD、不要3D、不要照片。
技术关键词使用英文。
```

### 2.4 LangChain RAG Pipeline 提示词

**用途**：`content/zh|en/blog/building-rag-pipeline/` 的封面图 + 文章内嵌图

**提示词**：

```
绘制一张高级软件工程白板架构图，主题为"Building a Production RAG Pipeline with LangChain"。

画面采用极简程序员白板风格：纯白背景、黑色马克笔手绘线条、蓝色表示数据流、紫色表示Embedding、橙色表示Vector Search、绿色表示最终答案、红色表示错误/无关数据。

整个系统采用从左到右的Pipeline：

Documents → Document Loading → Text Splitting → Embedding → Vector Store → Retriever → Context → LLM → Answer

第一部分DOCUMENT INGESTION：画出多个原始文档（PDF、DOCX、TXT、Markdown、Web Page）进入Document Loader，然后进入Text Splitter，把长文档手绘成很多小文本块（Chunk 1/2/3...），标注Chunk Size和Chunk Overlap。

第二部分EMBEDDING：每个Chunk进入Embedding Model变成向量[0.12, -0.34, 0.87...]，然后进入Vector Database。

第三部分QUERY："How does the system prevent hallucination?"→Query Embedding→Retriever→Similarity Search→Top-K→Relevant Chunks，把无关Chunk用红色叉号过滤。

第四部分AUGMENTED GENERATION：User Query + Retrieved Context组合成Prompt→LLM→Grounded Answer。

第五部分增加Retrieval Optimization区域：Top-K、Similarity Threshold、Hybrid Search、Metadata Filtering、Reranking。

顶部横向标题："Production RAG Pipeline"
底部总结：Ingestion → Embedding → Retrieval → Augmentation → Generation

要求：专业软件架构白板、数据流清晰、黑色手绘线、白色背景。
不要人物、不要复杂科技背景、不要赛博朋克、不要真实照片、不要过度装饰。
技术关键词英文。
```

---

## 三、生图到集成全流程

### 3.1 流程步骤

```
Step 1: 编写/选择提示词
  ├─ 从上方模板中选择对应文章的提示词
  ├─ 根据文章具体内容微调（增加/删除特定技术点）
  └─ 确认提示词符合白板风格规范

Step 2: 生成图片
  ├─ 方式A：Agnes AI（agnes-image-2.1-flash）
  │   ├─ POST https://api.agnes-ai.cn/v1/images/generations
  │   ├─ Header: Authorization: Bearer $AGNES_API_KEY
  │   ├─ Body: {"model":"agnes-image-2.1-flash","prompt":"...","size":"1024x768","n":1}
  │   └─ 注意：返回的url需下载，时长约20-300秒，可能503需重试
  ├─ 方式B：Midjourney / DALL·E / 即梦 / Flux
  │   └─ 使用上方提示词，输出宽高比 16:9
  └─ 方式C：image-search skill（CC0照片）
      └─ 当AI生成不可用时，作为fallback

Step 3: 图片处理（Pillow）
  ├─ 裁剪至 1200×630 (16:9)
  ├─ 直方图均衡化（ImageOps.equalize / autocontrast）
  ├─ 自适应亮度增强（目标亮度 > 100/255）
  └─ 对比度增强 1.2x，色彩增强 1.2x

Step 4: 集成到项目
  ├─ 复制到对应文章目录：
  │   ├─ content/zh/blog/<文章名>/featured.png
  │   └─ content/en/blog/<文章名>/featured.png
  ├─ 备份原始素材到：
  │   ├─ assets/media/blog/<图片名>.png
  │   └─ assets/media/projects/<图片名>.png
  ├─ 在文章index.md正文第一段后嵌入图片引用：
  │   ![图片说明](/zh/blog/<文章名>/featured.png)
  │   *图注说明文字*
  └─ 确保front matter中 featured: true

Step 5: 推送部署
  ├─ git add -A
  ├─ git commit -m "Add [文章名] architecture diagram"
  └─ git push origin main
```

### 3.2 图片处理命令参考

```bash
# 裁剪至 1200×630 (16:9) + 增强
python3 -c "
from PIL import Image, ImageEnhance, ImageOps, ImageDraw
import os

img = Image.open('input.png').convert('RGB')
w, h = img.size
target_w, target_h = 1200, 630
tr = target_w / target_h

# 16:9 crop
if w/h > tr:
    nw = int(h*tr); x=(w-nw)//2; img=img.crop((x,0,x+nw,h))
else:
    nh = int(w/tr); y=(h-nh)//2; img=img.crop((0,y,w,y+nh))
img = img.resize((target_w, target_h), Image.LANCZOS)

# Enhance
img = ImageOps.autocontrast(img, cutoff=2)
img = ImageEnhance.Brightness(img).enhance(1.3)
img = ImageEnhance.Contrast(img).enhance(1.2)

img.save('output.png', 'PNG')
print('Done:', img.size)
"
```

### 3.3 亮度验证

```bash
python3 -c "
from PIL import Image
img = Image.open('featured.png').convert('L')
px = list(img.getdata())
avg = sum(px) / len(px)
status = 'OK' if avg > 100 else 'DARK'
print(f'Brightness: {avg:.0f}/255 [{status}]')
"
```

---

## 四、内容结构映射

### 4.1 文章与图片目录映射

| 文章 | 中文目录 | 英文目录 | 素材备份 |
|------|---------|---------|---------|
| RAG 三层幻觉预防 | `content/zh/blog/hallucination-prevention/` | `content/en/blog/hallucination-prevention/` | `assets/media/blog/` |
| LangChain Agent | `content/zh/blog/building-ai-agents/` | `content/en/blog/building-ai-agents/` | `assets/media/blog/` |
| LangChain RAG Pipeline | `content/zh/blog/building-rag-pipeline/` | `content/en/blog/building-rag-pipeline/` | `assets/media/blog/` |
| 项目：分布式微云商城 | `content/zh/projects/ecommerce-rag-search/` | `content/en/projects/ecommerce-rag-search/` | `assets/media/projects/` |
| 项目：Agri-QA | `content/zh/projects/agricultural-qa-agent/` | `content/en/projects/agricultural-qa-agent/` | `assets/media/projects/` |

### 4.2 图片命名规范

| 类型 | 命名规则 | 示例 |
|------|---------|------|
| 封面图 | `featured.png`（固定名，Hugo自动识别） | `content/zh/blog/building-rag-pipeline/featured.png` |
| 素材备份 | `{主题}-{描述}.png` | `assets/media/blog/product-rag-pipeline.png` |
| Agnes AI生图 | `agnes_{主题}.png` | `assets/media/blog/agnes_ai_agents.png` |
| CC0照片 | `cover-{主题}.jpg` | `assets/media/blog/cover-rag-pipeline.jpg` |

---

## 五、API 与工具参考

### 5.1 Agnes AI 生图 API

| 参数 | 值 |
|------|-----|
| 端点 | `POST https://api.agnes-ai.cn/v1/images/generations` |
| 模型 | `agnes-image-2.1-flash` |
| 尺寸 | `1024x768` |
| Key | `AGNES_API_KEY`（环境变量） |
| 超时 | 300-600秒 |
| 重试 | 503时等待30秒重试，最多3次 |

### 5.2 image-search skill

| 参数 | 值 |
|------|-----|
| 命令 | `python ~/.claude/skills/image-search/scripts/image_search.py` |
| 搜索 | `search "<query>" --count N --orientation landscape --min-width 1200` |
| 下载 | `download <url> --output <path>` |
| 许可 | 默认CC0/CC-BY/Unsplash，商用需核验 |

### 5.3 see skill（图片识别）

| 参数 | 值 |
|------|-----|
| 命令 | `bash scripts/see.sh <image_path>` |
| 输出 | 读取 `output_path=<path>` 指向的 Markdown |
| 适用 | 识别用户提供的图片内容，判断应匹配哪篇文章 |

---

## 六、验收标准

每次配图完成后，逐项检查：

- [ ] 图片风格符合白板手绘规范（非科技海报/赛博朋克/3D）
- [ ] 图片与文章内容高度匹配（技术点对应）
- [ ] 亮度 > 100/255（可见清晰）
- [ ] 尺寸 1200×630（16:9）
- [ ] 已复制到 `content/zh|en/.../featured.png`
- [ ] 已嵌入文章正文顶部（带图注）
- [ ] 原始素材已备份到 `assets/media/` 对应子目录
- [ ] 中英文版本均已更新
- [ ] 部署成功，HTTP 200
- [ ] 版权合规（CC0/CC-BY/Unsplash 或 AI生成可商用）

---

## 七、项目结构速查

```
1byteone.github.io/
├── content/
│   ├── zh/                       ← 中文内容（默认语言）
│   │   ├── _index.md
│   │   ├── blog/
│   │   │   ├── building-rag-pipeline/       ← RAG管道教程
│   │   │   │   ├── index.md
│   │   │   │   └── featured.png             ← 封面图
│   │   │   ├── building-ai-agents/          ← AI智能体教程
│   │   │   │   ├── index.md
│   │   │   │   └── featured.png
│   │   │   └── hallucination-prevention/    ← 幻觉预防指南
│   │   │       ├── index.md
│   │   │       └── featured.png
│   │   ├── projects/
│   │   │   ├── ecommerce-rag-search/        ← 分布式微云商城
│   │   │   │   ├── index.md
│   │   │   │   └── featured.png
│   │   │   └── agricultural-qa-agent/       ← 农业知识问答系统
│   │   │       ├── index.md
│   │   │       └── featured.png
│   │   └── work/                            ← 专业GOAL页
│   └── en/                       ← 英文内容（结构同zh）
├── assets/
│   └── media/
│       ├── authors/              ← 头像
│       ├── blog/                 ← 博客文章原始素材
│       ├── projects/             ← 项目原始素材
│       └── icons/                ← 图标
├── config/_default/
│   ├── hugo.yaml                 ← Hugo基础配置
│   ├── languages.yaml            ← 中英双语配置（contentDir）
│   └── params.yaml               ← 站点参数
├── i18n/                         ← 国际化翻译
│   ├── zh.yaml
│   └── en.yaml
└── data/authors/me.yaml          ← 作者资料
```