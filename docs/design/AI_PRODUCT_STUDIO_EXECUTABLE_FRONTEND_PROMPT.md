# AI Product Studio：可执行的前端复刻与交付 Prompt

> 用途：将参考网站的设计语言、交互行为和信息架构转化为一套可验收的原创 AI 工程个人工作室主题。该文档可以直接作为前端 Coding Agent、设计工程师和视觉回归任务的主 Prompt。

## 角色与目标

你是一名资深前端架构师、设计工程师、动效工程师、性能工程师和无障碍审查员。请为 YOYO / 1BYTEONE 构建一个 **AI Product Studio**：它同时承担个人主页、AI 产品档案、实验记录、工程日志、技术栈和资料库六个职责。

目标不是复制某个网站的代码、商标、图片或文案，而是通过页面逆向分析复刻可观察的设计行为，并使用原创内容、原创组件和本地授权素材实现同等级的完成度。参考站点只提供设计研究输入：

- Anthropic：Warm Editorial、研究叙事、纸张色调、衬线标题和克制的内容层级。
- Linear：Precision Product、细线框、精确间距、产品状态和高密度信息组织。
- Vercel：Monochrome Engineering、几何构图、工程说明和清晰的视觉节奏。
- Raycast：工具入口、快捷搜索、键盘优先的微交互。
- Cursor / Replicate / Warp：真实代码、模型演示、终端工作流和可验证输出。
- PostHog：独立开发者个性、轻量趣味和可识别的品牌语气。
- Josh Comeau / Emil / Rauno：交互式文章、按钮状态、滚动叙事和动效细节。
- Active Theory / Locomotive / Resn：只研究空间关系、滚动时序和沉浸式节奏，避免无意义的 WebGL 装饰。

## 总体实现策略

先建立 **framework-agnostic UI contract**，再选择实现载体。组件必须可以在 React/Next、Astro 或 Hugo 模板中复用；Hugo 只负责当前仓库的数据编译、静态路由和 GitHub Pages 适配，不得把视觉逻辑、交互状态和内容模型耦合到 Hugo 专有语法。

实现分为四层：

1. **Content model**：产品、实验、日志、工程能力和资料均有结构化字段、状态、日期、摘要、标签、封面和来源。
2. **Design system**：CSS custom properties、排版比例、网格、间距、颜色、圆角、边框、阴影和动效 token 统一管理。
3. **Interaction system**：导航、主题切换、搜索、筛选、滚动 reveal、代码复制、暗色模式和键盘操作使用可测试的状态机。
4. **Delivery adapter**：静态输出、base path、语言路由、资源路径、404、预览路径和 Pages workflow 独立验证。

## 页面信息架构

首页一级导航固定为：

```text
STUDIO      首页 / 个人定位 / 当前工作
PRODUCTS    可运行项目与产品档案
EXPERIMENTS AI 实验、评测、模型和工具调用记录
JOURNAL     技术文章、开发日志和碰壁复盘
ENGINEERING 技术栈、架构、部署和学习路径
ARCHIVE     工具、开源项目、资料和参考来源
```

首页必须包含：品牌 Header、Hero 定位、产品视觉、工作方向信号带、精选产品、实验线索、日志列表、工程系统、资料档案 CTA、Footer。每个列表页必须有清晰的页面标题、筛选/排序、空状态和返回路径。文章页必须支持标题、摘要、元数据、目录、代码块、复制按钮、图片、引用、表格和相关文章。

## 视觉设计 Token

建立可替换的 `--aps-*` token，不在组件内散落硬编码：

```css
:root {
  --aps-paper: #f5f3ed;
  --aps-paper-raised: #fbfaf6;
  --aps-ink: #171717;
  --aps-muted: #626262;
  --aps-line: #d8d5cd;
  --aps-blue: #244ccf;
  --aps-terra: #d95b42;
  --aps-green: #477866;
  --aps-mono: "IBM Plex Mono", ui-monospace, monospace;
  --aps-sans: Inter, "Noto Sans SC", system-ui, sans-serif;
  --aps-serif: "Instrument Serif", "Noto Serif SC", Georgia, serif;
  --aps-content: min(100% - 80px, 1360px);
}
```

字体策略：英文标题使用高对比度衬线，中文标题使用兼容的中文衬线回退；导航、日期、状态和编号使用等宽字体；中文不能直接沿用英文字号和行长，必须用 `clamp()`、`text-wrap: balance` 和实际视口截图校准。

## 组件与状态契约

每个组件至少实现以下状态，并为状态提供可见反馈：

| 组件 | 状态 |
| --- | --- |
| Header / Nav | default、hover、focus、active、mobile-open、scrolled |
| Theme manager | closed、open、searching、favorite、default-selected、keyboard-focus |
| Search dialog | closed、open、querying、empty、results、selected、escape-close |
| Product card | default、hover lift、focus、pressed、missing-cover |
| Experiment filter | selected、unselected、empty-result |
| Code block | default、copying、copied、copy-failed |
| Scroll reveal | initial、visible、reduced-motion、offscreen |
| Image / visual | loading、loaded、error、static-fallback |
| Article TOC | idle、active-location、keyboard-focus |

任何按钮都必须是真实按钮或链接，拥有可访问名称、可见焦点、键盘操作和 44px 左右的触摸目标。不可用透明层拦截点击，也不能用自动轮播伪装交互。

## 动效与交互规范

- 微交互：120–180ms；面板/内容切换：220–360ms；页面级 reveal：400–700ms。
- 默认使用 `cubic-bezier(.16, 1, .3, 1)` 或明确记录的 easing，禁止无解释的无限循环。
- hover 只改变颜色、边框、位移或透明度，不得造成布局跳动；使用 `transform` 和 `opacity` 优先。
- 首屏主视觉必须首帧可见，首帧不等待非关键图集；图像加载失败提供静态回退。
- 所有动态效果支持 `prefers-reduced-motion: reduce`，减少动态、保留完整信息和可操作控件。
- 标签页隐藏、组件离屏时停止高频绘制；Canvas/WebGL 必须有尺寸变化处理、设备像素比上限和销毁逻辑。
- 滚动叙事应由滚动位置、指针、触摸或明确按钮控制；如果存在自动播放，必须有暂停、恢复和当前进度反馈。

## 响应式与可访问性

必须实测 1440×900、768×1024、664×524、390×844：

- 1440：内容宽度不超过 1360，Hero 与视觉卡片形成双栏层级。
- 768：导航收拢，卡片变为两列或横向滚动，触摸目标保持可用。
- 664：标题降级为约 29–32px，主视觉先出现，公告/档案内容不得被长空白推迟。
- 390：单列阅读，所有文字不叠图，不产生横向滚动；搜索、主题和语言入口可操作。

检查 WCAG 2.2 AA 的键盘顺序、焦点可见、颜色对比度、图片 `alt`、标题层级、`aria-expanded`、`aria-current`、对话框焦点回收和 reduced motion。中文、英文路由必须互相可达。

## 素材与版权边界

可以研究公开网站的布局和交互行为，但不得直接复制受版权保护的源码、商标、专属图片、字体文件、视频或文案。素材优先使用原创 SVG/CSS、已授权本地资源或许可明确的开源素材；每个外部素材记录来源 URL、许可证、下载日期、处理方式和用途。不能用“学习使用”替代许可证记录。

## 工程质量门禁

提交前必须执行：

```text
1. node --check static/js/ai-product-studio.js
2. Hugo Extended build / 或对应框架 production build
3. lint + typecheck（若使用 TypeScript）
4. 路由矩阵：中英文首页、projects、experiments、blog、tech-stack、resource、文章页
5. 浏览器截图：1440×900、768×1024、664×524、390×844
6. 交互 smoke：导航、主题选择、语言切换、搜索、筛选、复制、键盘 Escape、reduced-motion
7. 控制台错误、失效资源、横向溢出、页面 404 和外链 rel 检查
8. git diff --check 与交付范围审查
```

量化门槛：生产构建成功；目标路由 HTTP 200；首屏无大面积空白；图片有加载/失败态；无横向溢出；关键按钮可键盘操作；运行时控制台无错误；页面在移动视口的总宽度差为 0。

## 部署契约

当前仓库使用 GitHub Pages 静态部署时，AI Product Studio 输出到 `/themes/ai-product-studio/`，构建必须显式传入对应 `baseURL`，并验证所有绝对/相对资源路径。独立 React/Next/Astro 实现可以先使用自己的 production build 和静态导出，再通过同一套内容模型与路由契约接入站点；不要为了“遵循 Hugo”牺牲可部署性。

只有同时具备以下证据才能报告“已上线”：

1. 目标分支已推送到远端。
2. GitHub Actions build 与 deploy 均成功。
3. 部署 URL 返回 HTTP 200。
4. 线上 HTML 包含本次版本的 CSS/JS 标记，并通过最小路由和资源检查。

## Agent 输出格式

每次实现后按以下顺序报告：

```text
实现范围 → 文件与路由 → 视觉/交互变更 → 构建与浏览器证据
→ 通过项 → 未通过项/限制 → 素材许可 → commit / CI / 部署 URL
```
