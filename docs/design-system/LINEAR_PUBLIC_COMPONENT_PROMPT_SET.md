# Linear 公开交互契约 → YOYO / 1BYTEONE 中文 AI UI Prompt 集

> 用途：把 `clones/linear.app` 与 `static/linear-mirror` 中可观察到的公开 DOM、CSS、字体和交互状态，转化为可执行的前端实现指令。该文件是研究与实现契约，不是 Linear 私有源码，也不复制私有 bundle、私有 API、认证态或账号数据。

## 0. 工作边界

输入参考：`https://linear.app/homepage` 的本地公开快照（2026-11-10）。快照清单显示 796 个下载资源、0 个本地引用缺失，包含公开 HTML/CSS/JS、字体和图片；API、登录态、Cloudflare `/cdn-cgi/` 资源和服务器行为不在范围内。

实现目标：保留公开可观察的几何关系、状态机、动效节奏、键盘行为和视觉层级，把内容层替换为 YOYO / 1BYTEONE 的中文 AI 工程博客数据。页面必须是可用的真实状态页，不能用相同的占位面板或 toast 冒充导航。

实现载体：优先使用当前 Next.js/React 应用的真实路由与数据模型；静态镜像只作为研究落地页。禁止直接修改快照中的压缩 chunk 来“伪造”内容层。

## 1. 总控 Prompt（交给前端 Agent）

```text
你是一名资深产品界面工程师、交互工程师、中文信息架构师和无障碍审查员。

基于本地 Linear 公开快照提取的 reference-contract 实现 YOYO / 1BYTEONE AI 工程工作区。目标是复现可观察的结构和行为契约，而不是复制受限源码、私有 API、认证逻辑、商标、专属文案或未授权媒体。

先读取并保留当前 git status；只修改本主题允许的 React/Next 页面、组件、样式、数据和测试文件。不要 reset、stash、无范围清理或覆盖其他主题改动。

按以下阶段执行：
1. 建立路由与数据契约：/、/projects、/issues、/reviews、/insights、/blog、/lab、/about、/contact；每个入口必须有独立内容、空态、加载态、错误态和可回退数据。
2. 建立 token 层：字体、字号、字重、颜色、圆角、边框、阴影、层级、动效时长和缓动均使用变量；中文断行、行高和字距独立校准。
3. 实现组件状态机：default、hover、focus-visible、pressed、expanded、loading、empty、error、disabled、selected、reduced-motion。每个状态要有可见反馈和 ARIA 属性。
4. 实现交互：工作区菜单、搜索、筛选、排序、收藏、新建事项、事项详情、评审队列、Agent 洞察、文章预览、主题入口。按钮点击必须改变 URL、面板状态或数据，不允许只弹相同提示。
5. 中文内容个性化：所有展示字段来自 YOYO / 1BYTEONE 内容模型；保留技术名词 RAG、Agent、LangGraph、Spring AI、FastAPI、MySQL、Redis、向量检索和可观测性，不写 Linear 的产品数据。
6. 通过键盘、触摸和 reduced-motion 验收，再以 1440×900、768×1024、664×524、390×844 进行截图和布局断言。

交付：变更文件清单、reference-contract 对照表、路由状态矩阵、截图/控制台/键盘验证结果、已知限制与未覆盖的服务器能力。
```

## 2. 设计 Token Prompt

```text
建立 --yoyo-* CSS token，并让所有组件只引用 token：

字体：英文/数字使用 Inter Variable；代码和命令使用 Berkeley Mono；中文使用 "Noto Sans SC", "Microsoft YaHei", sans-serif。字重 300/400/510/590/680，正文避免过细。
字号：tiny/micro/small/regular/mini 与 title-1…title-9；中文正文 line-height 至少 1.6，标题按实际字数重排，不沿用英文 nowrap。
几何：radius 4/6/8/10/12/16/24/32/9999；hairline 1px（高密度屏可用 .5px）；交互目标最小 44px。
层级：popover 600、command 650、dialog 700、tooltip 1100、navigation context 1200。浮层必须有明确的 stacking context，不能覆盖正文图片造成文字不可读。
时序：quick 100ms，regular 250ms，highlight fade-out 150ms；菜单打开 opacity/scale 80ms，关闭 60ms；使用 out-quad、out-cubic、in-out-quad。
焦点：2px indigo ring + 2px offset；`:focus-visible` 与鼠标 hover 分开。
颜色：primary/secondary/tertiary/quaternary text，panel/background/border，semantic blue/green/indigo/orange/red/teal/yellow；中文对比度达到 WCAG AA。
阴影：低层使用 inset hairline 和柔和 ambient shadow，高层使用 shadow-high；hover 只提高层级和亮度，不制造厚重黑框。
```

## 3. 可复用组件 Prompt

### 3.1 顶部导航与工作区切换

```text
实现 StickyWorkspaceHeader：品牌区 YOYO / 1BYTEONE、工作区切换按钮、Product/Resources/System 菜单、搜索按钮、主题中心入口和中文 CTA。

工作区按钮：28px 高、radius 8、hover 使用低透明背景；`aria-haspopup="menu"`、`aria-expanded` 与 `aria-controls` 必须同步。点击打开可聚焦菜单，Escape 关闭并将焦点还给触发器，点击外部关闭；鼠标从按钮移动到面板时保持可进入。
桌面菜单使用 opacity + scale(.98→1)，打开 80ms、关闭 60ms；移动端触发器为 16px 图标，两条线以 160ms out-quad 变换为关闭图标。菜单项高度 32px，中文副标题可换行但不能改变点击区域。
搜索按钮显示“搜索工作区 ⌘K”，打开命令面板；没有搜索结果时显示中文空态和清除筛选动作。
```

### 3.2 侧栏导航

```text
实现 WorkspaceSidebar：动态总览、收件箱、我的事项、评审队列、路线目标、工程项目、更多、收藏、Agent 任务、Agent 洞察、界面迭代。

侧栏宽度约 240px；nav item 高 28px、radius 8、左右 padding 7px、icon/text gap 8px。active 使用低透明背景与 primary text，hover 使用更低透明背景；不可用项必须 disabled 并给出原因。
侧栏折叠状态保留 aria-label 和 tooltip；移动端转为抽屉，打开时 focus trap，关闭后恢复焦点。每个链接必须导航到独立页面或带状态的 URL，禁止所有按钮渲染同一个面板。
```

### 3.3 按钮、图标和工具提示

```text
实现 Button/IconButton/Tooltip：mini 24px、small 32px、medium/default 40px、large 44px。primary 用品牌色，secondary 使用半透明面板和 inset shadow，tertiary 使用 hairline border，ghost 无边框，glass 使用 backdrop-blur(8px)，invert 用反色 CTA。

按钮状态必须覆盖 hover、focus-visible、pressed（scale .97）、disabled（opacity 降低但文字仍可读）、loading（保留按钮宽度并显示进度）和 success/error 反馈。图标使用 14–16px 线性 SVG 或 lucide 等价图标，提供 aria-label；装饰图标 `aria-hidden=true`。
Tooltip 延迟打开，支持鼠标、键盘和触摸；含快捷键时显示 KBD。工具提示不能成为唯一信息来源。
```

### 3.4 事项列表、详情和评审队列

```text
实现 IssueList/IssueCard/IssueDetail/ReviewQueue：列表项有事项 ID、作者头像、中文标题、优先级图标、标签、更新时间和状态；卡片宽度约 300px、radius 8–9、hairline border、低透明 panel background。

点击列表项进入 /issues/:id 或 /reviews/:id，详情页显示面包屑、标题、描述、标签、收藏、上一篇/下一篇、复制链接、代码 diff、评论和操作菜单。上一条/下一条必须真正切换数据并更新 URL。
状态覆盖待处理、进行中、待评审、已完成、阻塞和空队列；错误时提供重试和回退到列表。
```

### 3.5 Agent 洞察与聊天输入

```text
实现 AgentInsightPanel：展示文章/项目的检索证据、决策摘要、风险、下一步和引用来源。数据来自 YOYO 的文章、实验和项目索引，明确标注“本地研究数据”或“实时服务”。

实现 ChatComposer：附件、格式化、表情、提及 YOYO、录音、快捷操作、发送、稍后安排。输入区桌面高度约 160px，窄屏约 116px；工具栏按钮 28–32px，发送按钮组约 65×28px，发送中禁用并显示进度，发送失败保留草稿和重试。
支持 Enter 发送、Shift+Enter 换行、Escape 关闭提及菜单；提及菜单、附件菜单有 aria-expanded、键盘上下选择和空态。
```

### 3.6 文章、实验与资料卡

```text
实现 BlogCard/ExperimentCard/ResourceCard：封面、标题、摘要、标签、阅读时长、日期、状态和进入链接全部来自内容模型。首帧使用本地封面或渐进式骨架，图片失败显示同主题静态回退；文字层使用不透明度和背景层级，禁止覆盖图片主体。

文章详情包含固定大纲、阅读进度、复制代码、表格/引用/脚注渲染、相关文章和返回列表；移动端大纲改为可展开抽屉。中文文章保留技术英文名词，并提供中文解释。
```

## 4. YOYO / 1BYTEONE 内容映射

| 参考工作区字段 | 中文内容字段 | 数据来源 |
| --- | --- | --- |
| Workspace | YOYO / 1BYTEONE AI 工程档案 | `content/site.ts` |
| Pulse | 工程动态：最新文章、实验进度、部署记录 | `content/zh/blog`、实验数据 |
| Inbox | 待处理评论、文章反馈、Agent 任务 | 本地状态存储 |
| My issues | 我的待办：RAG 评测、检索优化、服务观测 | 项目数据 |
| Reviews | 技术复盘：失败路径、性能对比、无障碍检查 | 文章 frontmatter |
| Initiatives | 研究路线：RAG、Agent、Spring AI、后端可靠性 | `siteConfig.skills` |
| Projects | 农业知识问答 Agent、分布式微云商城、AI 实验室 | `siteConfig.projects` |
| Agent Insights | 证据摘要、召回指标、幻觉风险、下一步实验 | AI Lab 数据 |
| UI Refresh | 主题复刻、中文优化、视觉回归记录 | docs/audit |
| New issue | 新建文章任务 / 实验任务 / 修复记录 | 表单数据模型 |

内容层只替换名称、字段、文案和本地数据；组件结构、状态机和交互契约独立于内容，方便切换中文/英文并保留原有路由。

## 5. 状态机与无障碍验收 Prompt

```text
为每个交互组件建立 finite state machine：idle → hover/focus → open/expanded → active/loading → success/error → idle。

每个可操作元素必须有可计算名称；菜单使用 role=menu/menuitem 或语义 nav；对话框有 aria-modal、labelledby 和 focus trap；折叠控件同步 aria-expanded/aria-controls；列表选中项同步 aria-current 或 aria-selected；图片提供准确 alt；动态状态使用 aria-live="polite"，错误使用 role=alert。

使用键盘 Tab/Shift+Tab/Enter/Space/Arrow/Escape、触摸点击和 reduced-motion 进行验收。`prefers-reduced-motion: reduce` 下移除 scale/位移和高频循环，但保留完整内容和状态反馈。
```

## 6. 像素级对照与交付门槛

1. 对照视口：1440×900、768×1024、664×524、390×844；记录 header、侧栏、标题块、列表卡、详情面板、页脚和页面总高。
2. 对每个状态记录 source selector、local selector、measurement、interaction、evidence、status（已对齐/部分对齐/未实现）。
3. 通过 `npm run lint`、`npm run typecheck`、`npm run build`；运行浏览器截图、键盘巡检和控制台错误检查。
4. 检查中文断行、长标题、无图片回退、空状态、网络失败、触摸目标、横向溢出和 reduced-motion。
5. 报告必须区分“公开快照已观察”“本地已实现”“服务器/API 未覆盖”，不能把静态镜像、构建成功或本地启动描述为线上部署。

## 7. 禁止事项

- 不复制或逆向 Linear 私有 React bundle、私有 API、账号态逻辑、服务器数据或认证流程。
- 不把一张截图、颜色渐变或相同 toast 当作页面交互；按钮必须改变状态、数据或 URL。
- 不把英文文案机械翻译成中文；中文字段要结合 YOYO 的 AI 工程博客、RAG/Agent 实验和真实项目。
- 不覆盖其他主题和已有未提交改动；不删除镜像中的授权记录和缺失资源说明。
