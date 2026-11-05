# AI Lab / Anthropic Homepage Reference Implementation

## 使用方式

首页实施以 [`AI_LAB_ANTHROPIC_HOME_DESIGN.md`](AI_LAB_ANTHROPIC_HOME_DESIGN.md) 为准。本文件保留 AI Lab 研究档案与文章详情的内容模型和实现约束；其中旧版首页研究索引顺序已由首页设计规范替代。用户明确允许本项目在本地复用已下载的 Anthropic 首页图片；保留来源与哈希，且不要据此声称素材的独立授权或再分发权利。

## 主提示词

```text
你是一名资深产品设计工程师、设计系统工程师和前端架构师。请在现有 Hugo 站点的独立 AI Lab 模块上，完成一个“Anthropic Research-inspired，但属于 1byteone 的个性化 AI 研究博客”改造。

参考来源：
- 首页主视觉与页面结构：https://www.anthropic.com/
- 研究档案信息组织的辅助参考：https://www.anthropic.com/research

参考策略：
- 以首页截图逐段对齐网格、留白、字体层级、圆角、卡片尺寸、内容密度和页脚结构，不能简化成泛化的“研究博客”风格。
- 不复制 Anthropic、Claude 商标、logo、原站文案或源代码；首页参考图只使用本项目中已下载的本地副本，并按资产清单保留来源与哈希。
- 所有新文案改写为 1byteone 的 AI 应用开发、Agent、RAG、工程实践和实验记录语境。
- 首页复刻图像使用 `assets/media/ai-lab/anthropic-home/` 中的本地副本；文章卡片与首页卡片都只跳转站内文章/栏目，不跳转素材来源官网。

现有项目上下文：
- 技术栈：Hugo + Go templates + 原生 CSS + 原生 JavaScript。
- 工作分支：dev_theme_ai_lab。
- AI Lab 是独立 section module，不得改造成全站默认主题，也不得回写 Cyberpunk 或 Emil 主题。
- 已存在双语路由：/ai-lab/ 与 /en/ai-lab/。
- 已存在栏目：Experiments、Research、Engineering、Benchmarks、Playground、Field Notes。
- 已存在能力：搜索、栏目筛选、状态筛选、明暗模式、Mermaid、KaTeX、代码行号与复制、目录、阅读进度、上一篇/下一篇、相关记录、浏览器本地 Playground。
- 优先复用现有模板、data/ai_lab.yaml、static/css/ai-lab.css、static/js/ai-lab.js，不要另起一套平行路由或重复主题注册逻辑。

产品定位：
- 把 AI Lab 定义为“个人 AI 研究与工程档案”，而不是公司官网或普通文章列表。
- 首页需要同时表达：研究方向、精选研究、文章档案、可验证实验、个人工程观点。
- 视觉气质：克制、编辑化、研究机构感、温暖纸张、精确网格、少量高饱和强调色。
- 语言：中文为默认内容，英文为完整等价翻译；切换语言后保留当前栏目、筛选和文章上下文。

交付原则：
- 先读现有文件和邻近主题，再修改最小范围。
- 不用空白占位区、假按钮、无效筛选或写死的演示数据冒充功能。
- 所有可点击卡片、筛选器、轮播按钮、搜索框、视图切换和语言切换必须可用。
- 任何没有真实数据支撑的 benchmark 必须明确显示“暂无可复核结果”，不能制造曲线或数字。
```

## 视觉系统要求

### 1. 字体系统 Typography

```text
建立三层字体角色，不依赖远程字体才能正常阅读：

- Display Serif：用于首页主标题、文章标题、研究卡片标题、专题引导语。
  - 推荐：本地可用的 Georgia / Times New Roman / Noto Serif SC / Source Han Serif SC fallback。
  - 中文必须优先匹配思源宋体或系统宋体，英文字形保持高对比衬线感。
  - font-weight 400 为主，避免全站粗体化。
  - 检查中英混排的字面高度、x-height、标点挤压与换行位置，优先使用 font-feature-settings 的标准默认值，不做负字距压缩。

- Interface Sans：用于正文、筛选器、元信息、导航说明。
  - 推荐：system-ui、Inter、Noto Sans SC、Microsoft YaHei fallback。
  - 正文 16–18px，line-height 1.65–1.85。

- Utility Mono：用于栏目编号、日期、状态、标签、数据、键盘提示和技术参数。
  - 推荐：ui-monospace、Cascadia Code、JetBrains Mono、Consolas、Noto Sans Mono。
  - 9–12px，letter-spacing: 0；只用于元数据，不要把全文变成终端字体。

通过 CSS custom properties 定义：
--font-display、--font-sans、--font-mono、--text-display-xl、--text-display-lg、--text-title、--text-body、--text-meta。
使用断点媒体查询建立桌面、平板、移动端字号阶梯；禁止使用 viewport 单位或 clamp() 连续缩放字号。390px 宽度下中文标题必须自然换行且不能溢出。
```

### 2. 色彩与表面 Color Tokens

```text
建立语义化 token，而不是把颜色写死在组件里：

--lab-paper: #f5f3ec;       /* 主纸张背景，允许调整为 1byteone 品牌色 */
--lab-surface: #fbfaf6;     /* 卡片、表单、浮层 */
--lab-ink: #191a17;         /* 主文字 */
--lab-muted: #6b6c65;       /* 次要文字 */
--lab-line: #d4d2c8;        /* 细分隔线 */
--lab-line-strong: #8c8c82; /* 强分隔线 */
--lab-accent: #c84a35;      /* 研究动作、链接、编号 */
--lab-accent-soft: #ead8ce;
--lab-olive: #7d8c65;       /* 次级研究标签 */
--lab-blue: #6e98bd;        /* 科学/数据标签 */
--lab-dark: #191a17;        /* 页脚、代码块 */

深色模式不能简单反转颜色。重新定义纸张、表面、线条、正文和强调色，保证 WCAG AA 对比度。
边框优先使用 1px 实线；阴影只用于弹层和键盘聚焦，不做大面积玻璃拟态或渐变光晕。
```

### 3. 网格与版式 Layout / Grid

```text
- 页面使用 12-column responsive grid；正文最大宽度 1280px，左右留白随视口变化。
- Desktop：主容器 width: min(1280px, calc(100% - 96px))。
- Tablet：左右边距 40–56px，卡片从 3 列降为 2 列。
- Mobile：左右边距 20px，所有网格降为 1 列，横向筛选栏允许水平滚动。
- 文章页采用 content + aside 双栏：正文 680–760px，侧栏 180–240px；移动端侧栏移到正文之后。
- section 使用明确的 border-top / border-bottom 建立编辑节奏，避免把每个区域包成圆角卡片。
- 卡片边角默认为 0–2px；按钮和筛选控件可使用 2–4px，小圆角仅用于交互控件。
- 垂直节奏使用 8px 基础间距：8 / 12 / 16 / 24 / 32 / 48 / 64 / 96。
- 主标题允许跨两行，但在 390px 宽度下不得出现横向溢出。
```

## 页面信息架构

### `/ai-lab/` 首页

```text
按以下顺序实现，不要简化成单一文章列表：

1. Global header
   - 左：1byteone / AI LAB wordmark，不使用 Anthropic logo。
   - 中：Overview、Experiments、Research、Engineering、Benchmarks、Playground、Field Notes。
   - 右：中英文切换、明暗模式、搜索入口；移动端折叠为可访问菜单。

2. Research statement hero
   - 参考截图中的跨全宽复合宣言：前半段粗体无衬线，后半段大号衬线；中文改写为 1byteone 的 AI 工程定位。
   - 不额外加入截图中没有的统计仪表盘或装饰标签。

3. Editorial feature animation
   - 使用浅灰全宽舞台。中心是一张约 610px 的方形本地图片，下方紧接独立的浅色细边框标题面板。
   - 面板显示固定的栏目/分类小字与一条大号衬线标题；图片上不叠字、不加假 CTA。
   - Anthropic 首页主特辑实测为 Canvas 动画，不是视频。按观察到的 settle、populate、zoom、subdivide、hold、breathe、expand 阶段重做图块运动；HTML 标题、栏目和文章链接全程固定。
   - 使用 requestAnimationFrame、帧时间上限与 IntersectionObserver；舞台离屏或标签页隐藏时暂停，提供右下角暂停/继续控制。reduced-motion 下直接显示最终静态画面。
   - 不得把 sprite sheet 按定时器逐格替换冒充动效，也不得伪造视频背景。

4. Announcements
   - 特辑之后直接显示三列公告卡，不加额外大标题。
   - 保留日期、标题、摘要、相关链接和阅读入口的信息层级。

5. Learn more
   - 使用一条细分隔线和紧凑标题引出四列竖版图文卡；小类目在图片上方，图片保持一致裁切比例。

6. Archive toolbar
   - 搜索、Filter、Sort by、View as 三类控件。
   - Filter：栏目、状态、技术领域。
   - Sort：最近更新、标题、阅读时间。
   - View as：Editorial list / Card grid / Gallery（至少实现 list 与 grid）。
   - 筛选状态写入 URL query，刷新后可恢复，不要只存在内存。

7. Research archive
   - 文章列表优先使用高信息密度行：日期、栏目、标题、摘要、标签、箭头。
   - Gallery 视图显示 16:9 或 4:3 的本地封面图，统一 object-fit: cover；禁止拉伸。
   - 卡片点击进入本地文章详情，不跳转到第三方官网。
   - 空状态必须说明当前筛选条件和清除筛选动作。

8. Footer
   - 研究档案、博客、项目、GitHub、联系入口、素材声明和隐私页。
```

### 栏目与文章详情页

```text
- 复用现有 category.html 和 single.html，不再复制模板。
- 栏目页顶部显示 track number、栏目标题、研究范围、记录数量和更新时间。
- 文章页使用：breadcrumb → 标题 → deck → metadata → 正文 + TOC → adjacent records → related records。
- metadata 使用 mono：发布日期、阅读时间、模型、数据集、方法、状态。
- 正文支持 Markdown headings、表格、引用、代码块、Mermaid、KaTeX、图片 figure/caption。
- 代码块必须有语言名、行号、复制按钮和失败回退。
- 文章图片采用本地资源路径和显式 alt；图片加载失败时显示可读的 fallback，不得留下空白破图。
```

## 图片与艺术指导 Art Direction

```text
复用本项目已有的 Anthropic 首页本地参考图片，构造首页轮播与栏目卡片；AI Lab 文章封面继续沿用各文章自己的 cover 字段：

- 主题方向：研究笔记、模型结构、数据流、实验桌、抽象科学、工程图纸。
- 视觉语言：纸张纹理、扫描文档、测量标记、网格、示意图、低饱和色块、局部高饱和信号色。
- 首页参考图位于 `assets/media/ai-lab/anthropic-home/`，来源页面、可识别的原图 URL 和 SHA-256 记录在 `assets/data/ai-lab-anthropic-home-assets.json`；页面只使用本地路径，不热链。
- 用户明确允许这批已下载图片在项目中本地复用。这并不等于素材的独立许可或再分发权已核实；保留来源说明，不得声称拥有素材版权。
- 本任务禁止调用生图模型生成或编辑图片；不得引入 Icons8 等其他图库素材；不得伪造第三方机构 logo。
- 封面比例：默认 16:9；方形专题图 1:1；移动端通过 picture/source 或 CSS object-position 适配。
- 每张图必须有：alt、caption（可选）、source/license metadata、主题关联字段。
- 封面不能只是纯色矩形；至少包含与文章主题相关的结构化视觉信号。
- 使用 Hugo image processing 或构建时生成缩略图，提供 WebP/AVIF 与 fallback。
- 图片懒加载，但首屏精选图设置 fetchpriority="high"；避免布局偏移，必须预留 aspect-ratio。
- 文章缩略图不能链接到 icons8、Anthropic 或其他素材官网；链接只指向本站文章详情。
```

## 交互与动效 Motion / Interaction

```text
- 所有动效服务于状态反馈，不做装饰性粒子背景。
- 统一 transition: 150–220ms ease-out；carousel 使用 300–450ms。
- hover：边框颜色、背景、箭头位移 4–8px；focus-visible：2px accent outline + 3px offset。
- 所有内容轮播（如有）：支持 touch 与键盘左右键，提供暂停/继续控制；状态由 aria-live 暴露，控制按钮提供明确的 aria-label 与 pressed 状态。首页 Canvas 视觉动画不轮播 HTML 标题或条目。
- 搜索输入支持 / 快捷键聚焦；Escape 清空或关闭浮层；筛选器可通过键盘完成。
- View as 切换保留当前 query 和 scroll position。
- 主题切换持久化到 localStorage，首屏通过内联脚本避免闪烁。
- reduced motion：禁用平移、淡入和自动滚动，只保留即时状态变化。
- 所有异步或空状态都提供明确文本，不使用假加载动画掩盖缺失数据。
```

## 数据模型与内容约束

```text
扩展现有 content/{zh,en}/ai-lab/<track>/ front matter：

title, date, description, lab_category, status, reading_time,
model, dataset, method, metrics, cover, cover_alt, tags,
repository, demo, source_page, translationKey

要求：
- zh/en 文章通过 translationKey 成对维护；标题、摘要、栏目、标签和封面语义对齐。
- status 只允许 planned / running / completed / failed / archived / published。
- metrics 只能填写可复核数据；没有真实运行结果时使用空数组并渲染明确 empty state。
- featured 只由内容字段控制，不能在模板中硬编码文章标题。
- 归档排序默认 date desc，允许 query 参数改变排序。
```

## 技术实现约束

```text
- Hugo 模板保持语义 HTML：header、nav、main、section、article、figure、footer。
- 不引入 React/Next.js；只用现有 Hugo + CSS + 原生 JS。
- JavaScript 按功能拆分：archive-filter、home-canvas-animation、view-switcher、theme-toggle、search。
- 事件监听使用事件委托；避免每张卡片重复注册大量监听器。
- URL query 与 DOM 状态双向同步，并在 back/forward 时恢复。
- 图片、字体和 CDN 依赖必须有 fallback；生产环境不能因为 CDN 失败导致页面不可用。
- 不修改默认主题注册为 AI Lab；AI Lab 继续保持 scope: section、default_selectable: false。
- 不修改 Emil、Cyberpunk2077、Engineer Terminal 的布局和交互，除非共享组件发生兼容性修复。
- 所有新增 CSS token 以 --al- 或 --lab- 前缀命名，避免污染全站。
```

## 可访问性、性能与验收

```text
验收必须包括：

1. `hugo --renderToMemory` 中文和英文构建均成功，无 template error。
2. `/ai-lab/`、`/en/ai-lab/`、六个栏目页、至少两篇文章详情页返回 200。
3. Lighthouse 或等价检查：无明显 CLS，首屏图片有尺寸，键盘可完成导航和筛选。
4. 390px、768px、1440px 三个宽度无横向滚动和标题溢出。
5. 搜索、栏目筛选、状态筛选、排序、list/grid 切换、首页 Canvas 暂停/继续、语言切换、暗色模式可交互。
6. 图片错误、无结果、无 benchmark、无相关记录等边界状态都有可读反馈。
7. 页面中不存在 Anthropic / Claude 的品牌 logo、复制文案和第三方官网跳转。
8. `node --check static/js/ai-lab.js` 通过，`git diff --check` 通过。
9. 交付截图至少包含：桌面首页、移动首页、筛选后的 archive、文章详情、深色模式。
10. 输出变更文件清单、构建命令、验证结果和已知限制。

首页必须单独通过以下视觉验收：
- 与 `docs/design/references/anthropic-home-fullpage.png` 在相同视口下逐段对照，不以“整体气质相似”代替结构核验。
- 桌面特辑舞台为浅色全宽区域，约 610px 方图居中，下面紧接同宽边框标题面板；留白和右下角暂停控制按参考图定位。
- 移动端保留方图比例、图下标题面板和舞台层次；所有文字都在面板中，不压在图片上。
- 图片拼贴、浮动小图、指针视差、粒子背景都不属于此参考首页；不得用额外特效替代图像与标题面板的版式还原。
```

## 明确禁止

```text
- 不要把参考站的颜色、logo、文章和图片直接搬进项目。
- 不要用“Coming soon”或静态 demo 冒充已经实现的筛选、轮播和视图切换。
- 不要用全屏 hero、渐变背景、玻璃卡片、发光粒子、过度圆角破坏研究档案的克制感。
- 不要把所有内容塞进首页；首页负责索引，详情页负责深度阅读。
- 不要给不存在的 benchmark 填写演示数值。
- 不要让中文内容只翻译导航而不翻译文章、摘要、空状态和错误状态。
```

## 实施顺序

```text
Phase 1：读取现有 AI Lab 模板、数据和 CSS，建立差异清单。
Phase 2：完成 design tokens、字体栈、响应式 grid 和 header/footer。
Phase 3：实现 research tracks、Canvas feature animation、archive toolbar、list/grid view。
Phase 4：补齐本地封面图、图片 metadata、文章详情和边界状态。
Phase 5：接入双语 query 状态、暗色模式、可访问性和性能优化。
Phase 6：构建、浏览器验收、截图、修复，再提交变更。
```

## Source note

主参考页面：[Anthropic](https://www.anthropic.com/)，检查日期：2026-11-04。首页主要结构为胶囊导航、居中 wordmark、大号混排宣言、全宽轮播舞台、三栏公告卡、四栏 Learn more 图片卡和深色折叠式页脚。辅助研究栏目参考：[Anthropic Research](https://www.anthropic.com/research)。具体文案、品牌标识与站点路径均改为 1byteone AI Lab 内容；不把参考站的栏目数量、文章标题或品牌数据写死到本站。

