# YOYO 富媒体文章系统设计

状态：设计基线

适用仓库：`1byteone.github.io`

## 1. 目标

把个人技术博客从“所有文章都套同一篇 Markdown 模板”升级为“同一份内容可以被多个主题以不同方式呈现的富媒体文章系统”。内容仍然只维护一份，主题、交互组件和发布目录负责各自的表达方式。

这套设计参考了 AI 应用开发工程师博客常见的八类表现：代码、图表、表格、架构图、图片、交互组件、终端和视频；同时适配当前仓库的 Hugo、GitHub Pages、多主题和双语结构。

## 2. 设计结论

当前仓库不需要立即迁移到 Next.js、Fumadocs 或 MDX 才能实现第一阶段富媒体能力。仓库已经具备 Hugo 内容层、主题路由、图片渲染 hook、目录、阅读进度和多主题构建能力。更稳妥的路径是：

1. 继续使用 Hugo Markdown 作为内容事实来源。
2. 用 Front Matter 声明文章形态和能力需求。
3. 用 Hugo shortcode、Markdown render hook 和页面资源实现可复用富媒体块。
4. 让主题根据能力声明选择样式和降级方案。
5. 只在需要真正浏览器运行时的 Playground 或复杂节点编辑器时引入独立前端岛屿或外部 Demo。

这样可以保留现有文章和 URL，同时逐步接入富媒体能力，不把所有文章绑定到一个新框架或单一视觉模板。

## 3. 分层架构

### 3.1 内容层：一份事实来源

内容继续放在 `content/zh/` 与 `content/en/`。文章正文只表达事实、推理、代码、数据和媒体引用，不写主题专属 CSS、颜色、布局类名或导航结构。

建议的公共字段：

```yaml
title: "生产级 RAG 架构：权限、版本与可观测性"
date: 2026-11-02
summary: "从权限边界、索引版本到评测与观测，拆解生产 RAG 的稳定性要求。"
tags: [AI, RAG, Architecture, Production]
authors: [me]
featured: false
article_form: architecture
content_features: [diagram, code, table, checklist]
render_profile: rich
```

其中：

- `article_form` 描述文章的叙事方式。
- `content_features` 描述正文实际使用的富媒体能力。
- `render_profile` 描述页面密度和交互增强级别，不等同于主题名称。

现有文章可以继续只使用 `title`、`date`、`summary`、`tags`、`authors`、`featured`；新字段全部可选，未声明时回退到 `standard`。

### 3.2 能力层：语义化富媒体块

富媒体内容采用语义化块，而不是把一整套页面 HTML 直接粘进文章。第一阶段建议提供以下块：

| 能力 | 内容接口 | 第一阶段实现 | 无脚本降级 |
|---|---|---|---|
| 代码 | `code` / 普通 fenced code | Hugo 高亮、语言、复制、可选行号 | 普通代码块 |
| Diff | `code-diff` | before/after、增删行、高亮 | 两段带标题的代码块 |
| 图表 | `chart` | 静态 SVG/PNG 或轻量客户端图表 | 图片 + 数据表 |
| 架构图 | `diagram` | Mermaid 或仓库已有图片资源 | 图片或文字流程 |
| 表格 | GFM table / `data-table` | 响应式表格、可选排序筛选 | 普通 HTML 表格 |
| 图片 | Markdown image / `gallery` | render hook、灯箱、组图 | 普通图片和图注 |
| 交互 Demo | `demo` | iframe 或白名单前端 Demo | 静态截图 + 操作说明 |
| 终端 | `terminal` | 命令、输出、状态标签 | 代码块 |
| 视频 | `video` | 原生 `<video>` 或受信任嵌入 | 封面图、标题、外链 |

块的参数必须是内容语义，例如标题、语言、数据源、图注、来源和降级文本；不要暴露主题颜色和 CSS 类名作为文章参数。

### 3.3 主题层：同内容多种表达

主题继续通过 `site_theme`、主题注册表和现有局部模板渲染文章。主题只读取内容字段和能力声明，然后决定视觉表现：

富媒体能力的共享契约登记在 `data/feature_registry.yaml`。它描述能力名称、内容接口、实现阶段、主题支持级别和静态降级方式；主题不应各自重新定义同一个能力。

- `engineer-terminal`：代码、终端、日志、故障和架构证据优先。
- `cyberpunk2077`：媒体封面、信号式元数据和工程档案氛围优先。
- `bloggpt`：字段笔记、目录、阅读时间和轻量长文阅读优先。
- `minimal` 家族：paper、research、garden、editorial 等阅读方式。
- `alxian` / `oil`：保留现有作品集、图库和阅读体验。

富媒体组件的语义接口保持共享，但视觉皮肤按主题加载，不能把同一套卡片样式复制到所有站点。`layouts/partials/rich-content/assets.html` 只加载当前 `site_theme` 对应的皮肤：

| 主题 | 富媒体皮肤 | 表达重点 |
|---|---|---|
| `ai-terminal` / `lzw-archive` | `rich-content-engineer-terminal.css` | 终端证据、状态色、直角面板、等宽密度 |
| `bloggpt` | `rich-content-bloggpt.css` | 编辑式长文、轻边界、阅读宽度和低干扰 |
| `cyberpunk2077` | `rich-content-cyberpunk2077.css` | 夜之城档案、黄/青信号、警示标签和硬边界 |
| `minimal` | `rich-content-minimal.css` | 研究笔记、纸面细线、衬线正文和静态降级 |
| `astro-tui-portfolio` | `rich-content-astro-tui.css` | 绿色 TUI、系统面板和工程日志 |
| `emil-pixel-terminal` | `rich-content-emil-pixel-terminal.css` | 像素终端、荧光色和低分辨率控制台 |
| `alxian` | `rich-content-alxian.css` | 蓝灰产品档案、柔和卡片和媒体边界 |
| `oil` | `rich-content-oil.css` | 暖色编辑档案、单色代码和资料索引 |

皮肤只能改变展示方式，不能改变文章结构、来源、权限或静态降级契约。新增主题时必须登记对应皮肤或明确复用同一主题家族的皮肤，并在至少一个富媒体演示页上验证代码、终端、图表、表格和图片不会被主题 CSS 隐藏。

主题可以忽略不支持的增强能力，但必须显示可理解的降级内容。不能因为某个主题没有图表组件，就隐藏图表数据或让文章空白。

### 3.4 发布层：静态优先

GitHub Pages 是静态托管，因此第一阶段所有富媒体块必须满足：构建时可生成、客户端可选增强、无脚本仍可阅读。复杂交互使用白名单资源、静态 iframe 或独立构建产物，不直接执行来自雨雀的任意脚本。

## 4. 内容形态与富媒体组合

文章形态决定结构，能力块决定演示方式。两者不能混为一个固定模板。

| 文章模板 | 推荐能力组合 | 默认 section |
|---|---|---|
| 原理解析型 | diagram + code + checklist | `blog` |
| 实战教程型 | steps + code + terminal + result | `blog` |
| 架构设计型 | diagram + table + code-diff + trade-off | `blog` |
| 源码阅读型 | code + code-diff + annotations | `blog` |
| 性能分析型 | chart + data-table + benchmark | `blog` 或 `ui-lab` |
| 项目复盘型 | gallery + project-meta + diagram + result | `projects` |
| 技术对比型 | comparison-table + chart + conclusion | `blog` |
| 运维手册型 | terminal + logs + checklist + rollback | `logs` |
| AI 实验型 | experiment-table + chart + demo + limitations | `ui-lab` |
| 滚动叙事型 | timeline + image + chart + progressive enhancement | `blog`，需要单独评估 |

雨雀同步器先识别文章形态和能力需求，再生成预览；不能把所有文章默认标成 `tutorial`，也不能因为存在图片就自动升级成复杂交互文章。

## 5. 组件接入优先级

### P0：先把稳定表达做好

- 代码块：语言、复制、标题、行高亮、移动端滚动。
- 图片：已有 render hook、灯箱、图注、组图和前后对比。
- 目录与阅读进度：沿用现有主题能力。
- Mermaid 或静态架构图：构建失败时回退到图片或文字。
- 终端块：命令、输出、退出状态和环境标签。
- 响应式表格：窄屏横向滚动，保留表头和图注。

### P1：提升数据和演示能力

- ECharts 或轻量客户端图表，只在声明了 `chart` 的文章加载。
- Diff 代码块和参数对比表。
- 图片画廊、轮播和前后对比。
- 独立 Demo iframe，明确来源、版本和失败回退。

### P2：只对高价值文章投入

- Sandpack / React Live 浏览器运行环境。
- React Flow 等可编辑节点图。
- 滚动叙事、动画时间线和复杂数据故事。
- 视频章节、动画演示和多媒体编排。

P2 能力不应阻塞普通文章发布，也不应成为雨雀同步的默认动作。

## 6. 资源和安全契约

- 文章资源优先使用 page bundle：`content/<lang>/<section>/<slug>/index.md` 与同目录图片、数据、代码样例一起维护。
- 外部图片、视频和 Demo 必须有来源、许可或稳定 URL；同步预览中标记外部依赖。
- 雨雀正文中的 `<script>`、事件属性、未知 iframe 和外链样式默认视为不可信，不直接复制到博客。
- 图表数据应写入 JSON/CSV 或可审阅的 Markdown 表格；不要把不可追溯的截图当作唯一证据。
- 交互组件必须有静态回退、键盘操作、可见焦点、`prefers-reduced-motion` 支持和移动端方案。
- 代码示例需标注语言、依赖版本和是否可直接运行；后端代码不能伪装成浏览器 Playground。

## 7. 文章质量门槛

每篇进入正式发布前，至少通过以下检查：

1. 内容形态与 section 匹配。
2. `content_features` 与正文实际块一致。
3. 标题、摘要、标签、作者和日期符合仓库现有格式。
4. 代码、图表、图片和外部链接都有说明或降级文本。
5. 文章在当前主题和至少一个备用主题下都有可读输出。
6. 没有把主题 CSS、脚本或第三方品牌组件写入共享正文。
7. 没有引入未授权转载内容、密钥、Cookie 或内部链接。
8. Hugo 构建、页面路径、图片资源和 RSS/搜索索引没有新增错误。

## 8. 分阶段交付计划

### Phase 1：内容契约与 P0 富媒体块

- 新增 `article_form`、`content_features`、`render_profile` 字段说明。
- 定义短代码/渲染 hook 的语义接口。
- 完善代码块、图片灯箱、终端块、Mermaid 静态回退和响应式表格。
- 选一篇 RAG 架构文章和一篇 FastAPI 实战文章做跨主题验收。

### Phase 2：数据与演示能力

- 接入按页面懒加载的图表模块。
- 增加 Diff、参数对比、图片组和独立 Demo iframe。
- 建立 `data/feature_registry.yaml`，声明每个主题支持的富媒体能力和降级策略。

### Phase 3：实验和叙事能力

- 为 AI 实验文章提供可复现数据、评测图和可选 Playground。
- 为高价值专题文章提供时间线、滚动叙事和视频章节。
- 只有在交互需求稳定且 Hugo 静态增强不足时，才评估 Astro/Next.js island 或独立文档应用。

## 9. 本次设计的验收标准

- 同一篇文章正文可以在至少三种主题中复用。
- 同一篇文章可以组合代码、图片、图表、表格和架构图，不需要复制三份内容。
- 不支持某个组件的主题仍然显示静态降级结果。
- 雨雀同步只写内容和资源契约，不把第三方模板代码直接粘入仓库。
- 普通文章仍然保持低成本 Markdown 写作；复杂文章才声明额外能力。
- 主题增加或替换时，不需要修改已有文章正文。
