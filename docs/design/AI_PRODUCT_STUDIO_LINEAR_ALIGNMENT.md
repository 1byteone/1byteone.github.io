# AI Product Studio / Linear 公开契约对齐记录

本记录描述 1BYTEONE AI Product Studio 对 `https://linear.app/homepage` 的公开可观察契约复刻。实现目标是对齐 DOM 关系、布局几何、字体层级、交互状态、动效时序和响应式约束，再注入 YOYO / 1BYTEONE 的中文 AI 工程内容。

实现遵循三个边界：

1. **Reference layer**：研究公开 HTML/CSS、浏览器渲染结果和可操作状态；实现本地原创的产品工作面 DOM/CSS。
2. **Interaction layer**：把菜单、滚动进度、问题切换、键盘、焦点、reduced-motion 和离屏降频抽成可复用状态契约。
3. **Personalization layer**：保留 YOYO / 1BYTEONE 品牌、中文内容、AI 应用工程文章、项目和实验路由。

没有复制 Linear 私有 Next.js bundle、私有源码、专属字体、商标 SVG、专属图片或原站文案。

## 参考层：公开测量

参考页在 Chromium 中以相同视口测量。公开首页首屏没有 `video` 或 `canvas`，主视觉是 DOM/CSS 产品工作面；页面使用深色主题，Header 约 73px。H1 使用逐行 `opacity + blur(10px) + translateY(20%)` 入场；产品 frame 通过滚动进度渐入并上移，包含 sidebar、workspace、Search/New issue、状态视图、问题 topbar、Activity 和 Properties。

已记录的参考基线：

| 视口 | H1 参考几何 | 主视觉参考几何 | 页面高度 | 关键行为 |
| --- | --- | --- | ---: | --- |
| 1440 × 900 | x≈78, y≈272, w≈1282, h≈128 | x≈60, y≈527, w≈1320, h≈720 | ≈9960px | header sticky；主视觉滚动渐入 |
| 768 × 1024 | 移动/平板导航收敛 | frame 保持可读的工作面比例 | 以内容为准 | 菜单折叠，无横向溢出 |
| 664 × 524 | 标题约 28.9px / 37.6px | Canvas 起点约 y=328，高约 440px | ≈4006px | 公告卡首张约 y=800，单列 |
| 390 × 844 | 标题约 38px | frame 在首屏内可见 | 以内容为准 | 导航折叠，触摸可操作 |

## 本地实现层：四视口实测

测量页面：`http://127.0.0.1:1328/zh/`，Hugo Extended `0.161.1`，资源版本 `linear-contract-2`。

| 视口 | Header | 首屏 Hero | H1 | Product frame | 页面高度 | 横向溢出 |
| --- | ---: | ---: | --- | --- | ---: | --- |
| 1440 × 900 | 74px | y=74 / h=1650px | 约 76px，双行 | x=109 / y≈604 / 1222×702px | 6425px | 无 |
| 768 × 1024 | 74px | y=74 / h=1650px | 响应式缩放 | x=61 / y≈494 / 646×702px | 6471px | 无 |
| 664 × 524 | 66px | y=66 / h=1300px | 38px，双行 | x=46 / y≈345 / 572×608px | 7831px | 无 |
| 390 × 844 | 66px | y=66 / h=1300px | 38px，双行 | x=46 / y≈338 / 298×608px | 7622px | 无 |

页面高度仍受 AI Product Studio 的工作台、工作流、项目、研究、日志、工程系统和资料档案内容影响，不能与参考站的内容数量直接等比；首屏关键几何已按参考基线校准。

## 交互契约

| 组件 | 默认状态 | Hover / Focus | Pressed / Selected | 动效与降级 |
| --- | --- | --- | --- | --- |
| Product / Resources mega menu | 关闭，`aria-expanded=false` | 90ms hover intent，面板渐入 | 点击只保留一个面板 | Escape 关闭并恢复触发器焦点；快速重开不会被旧 timer 隐藏 |
| Hero H1 | 隐藏、blur、下移 | IntersectionObserver 进入视口 | `is-visible` | reduced-motion 直接静态显示 |
| Product frame | 低透明度、下移 | 边缘高光与 grain 保持 | 滚动驱动 `--linear-stage-progress` | 离屏停止 RAF；恢复可见时更新；reduced-motion 固定 opacity=1 |
| Issue previous / next | 1 / 06 | 键盘 focus ring | 更新 issue id、标题、描述和 live region | ArrowLeft / ArrowRight 与按钮共用状态机 |
| Workspace tabs | Pulse selected | raised surface | `aria-selected=true` | 内容不离开页面，不创建假链接 |
| Engineering note | 可提交按钮 | hover / focus 明确反馈 | 提交后显示 ✓ 并更新 `aria-live` | 无模型依赖，失败路径可扩展 |
| New issue dialog | 关闭 | 点击 `+` 打开并自动聚焦标题 | 提交后生成 APS 编号、更新当前问题并写入 localStorage | Escape / 取消关闭；刷新后保留自建问题 |
| Issue actions | 菜单关闭 | 点击 `•••` 打开 | 复制链接、完成、恢复均更新状态和反馈 | 点击外部或 Escape 关闭 |
| Frame actions | 静态工具按钮 | hover / focus | Search 打开站内搜索；Context 展开上下文；Delegate 更新委派状态 | Clipboard 不可用时降级到 selection copy |
| Workspace menu | YOYO / STUDIO | 点击工作区按钮 | 选择当前工作区或跳转 RAG / DELIVERY | outside click / Escape 关闭 |
| Frame tabs | Pulse selected | hover / keyboard | Pulse / Inbox / Issues / Reviews 切换真实 DOM panel；Projects / Initiatives 跳转真实页面；Favorite 持久化 | Arrow/Home/End 可操作，panel 变化写入 `aria-hidden` 与 live region |
| Inbox items | Inbox panel | 卡片上移、边框高亮 | 点击任务进入 Issues panel 并定位对应 APS issue | 保留当前工作区上下文，不生成重复页面 |
| Review actions | Review queue | 通过/补证按钮高亮 | 更新卡片 `data-review-state`、禁用已处理按钮并播报结果 | 适配 reduced-motion |
| Site controls | Theme manager、中文/英文入口可见 | dark header hover | 主题中心保留全局入口 | 主题管理面板沿用站内一致逻辑 |

## 已执行验证

- `node --check static/js/ai-product-studio.js`：通过。
- `node --check static/js/linear-contract.js`：通过。
- `git diff --check`：通过（仅有 Git 的 LF/CRLF 提示）。
- Hugo Extended 0.161.1 production preview：通过，ZH 255 页 / EN 253 页。
- 四视口 HTTP 200、`lang=zh-Hans`、无横向溢出、控制台错误 0。
- Product / Resources：点击、90ms hover intent、Escape、焦点恢复通过。
- Issue：按钮和 ArrowLeft / ArrowRight 更新 APS-211 / APS-207 等状态通过。
- New issue：填写标题与摘要后生成 APS 编号，Activity / live region 更新，刷新后从 localStorage 恢复。
- Frame action：站内搜索、复制链接、上下文、委派和问题菜单均通过真实点击路径验收。
- Frame tabs：Pulse / Inbox / Issues / Reviews 更新不同 DOM panel；Inbox 任务进入对应 issue；Review 操作更新卡片状态；Projects / Initiatives 跳转 `/zh/projects/`、`/zh/experiments/`。
- Mobile nav：390px 下菜单按钮打开，`aria-expanded` 和 `.is-open` 同步。
- Reduced motion：H1 直接显示，主视觉 opacity=1，transition/transform 关闭。
- Scroll contract：664px 从初始 progress≈0.033 / opacity≈0.207，滚动到 650px 后 progress≈0.745 / opacity≈0.791。
- Browser route audit：`/about/` 使用 `aps-about-shell`，`/tech-stack/` 使用 `aps-stack-archive`，`/projects/`、`/experiments/`、`/blog/` 分别使用 product、experiment、journal 结构；五条路由均无控制台错误。

## 差距统计（本轮复核）

| 区域 | 参考站公开契约 | 本地当前实现 | 差距与处理结论 |
| --- | --- | --- | --- |
| Header | sticky header、Products/Resources 菜单、CTA、焦点与 hover | 已实现深色 sticky header、mega menu、中文 ARIA、Escape 恢复焦点 | 几何与状态已对齐；私有图标与品牌资产不复制 |
| Hero | 大标题 blur/reveal、首屏留白和滚动进入 | 已实现逐行 reveal、滚动 progress、响应式字号 | 文案与内容长度不同，保留 YOYO / 1BYTEONE 个性化信息 |
| Product surface | sidebar、工作区、tab、topbar、属性栏与 stacked shadow | 已实现 DOM/CSS 工作面，四 tab 对应四个不同 panel | 原站私有数据和 bundle 不可取得；本地使用原创 AI 工程数据 |
| Tab interaction | 视图切换、键盘操作、面板状态 | Pulse / Inbox / Issues / Reviews 真实切换；Inbox 可进入 issue；Review 可通过/请求补证 | 已从“只改标题”修正为状态机；仍不复制 Linear 私有源码 |
| Hover / depth | 多层阴影、raised surface、按钮反馈 | frame、菜单、Inbox、Review 均有 hover/focus、阴影和入场动画 | 视觉层级已补齐；像素级差异受字体/内容限制 |
| Long page | 参考站内容密度与公告卡节奏 | AI 工程文章、项目、实验、资源档案按站内路由承载 | 页面总高度不能等比，已记录首屏几何和内容差异 |
| Route differentiation | 公开站后续模块具有各自结构 | projects/experiments/blog/resource/about/tech-stack 分支独立；about 与 tech-stack 使用独立模板 | 不是所有页面共用 journal list；内容资产仍持续补齐 |

按可观察交互统计，本轮覆盖 **7 类差距项**：其中 6 类已完成本地实现并验证，1 类（私有品牌资产、私有源码和精确像素差异）受公开边界限制，使用原创等价实现并保留差距说明。

## 当前状态

### 已对齐

- 深色 sticky header、双层导航和 Product / Resources mega menu 结构。
- 逐行标题 reveal、主视觉 frame、sidebar、issue detail、Activity、Properties、grain、glow、shine。
- 滚动驱动主视觉时序、issue 切换、工作区 tab、键盘与焦点反馈。
- 中文字体优先级、中文文案、中文 ARIA 标签和中英文深链接。
- 主题中心与语言入口未被 Linear 合约样式移除。

### 部分对齐

- 参考页的全部后续营销模块、私有图标细节和服务端数据无法合法复制；本地以 AI 工程项目、实验、日志和资料档案替换。
- 页面总高度因本地内容数量显著不同；首屏几何已对齐，长页内容密度保留个性化信息架构。
- 产品 frame 是原创 DOM/CSS 实现，不是 Linear 私有源码或 bundle 的字节复制。

### 未完成

- 尚未把远端 CI run 和 GitHub Pages 发布证据写入本记录；提交推送后补充 commit、workflow run 和线上资源探针。
- 尚未生成自动像素差异热力图；当前验收使用同视口浏览器几何、状态和截图证据。
- Frame tabs 已从“更新 issue 文案”改为四个独立 panel state：`pulse`、`inbox`、`issues`、`reviews`。
- Inbox 和 Review 操作具备明确的 pressed/disabled/live 状态，移动端与 reduced-motion 样式已补齐。
