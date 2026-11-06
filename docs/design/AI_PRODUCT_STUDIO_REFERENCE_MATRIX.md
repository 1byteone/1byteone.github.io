# AI Product Studio 参考拆解与接入矩阵

本轮以多个公开网站的可观察行为为输入，采用原创数据、结构和素材实现。参考站用于研究页面关系与交互，不复制其源码、商标、文案或专属资产。

| 参考方向 | 提取的亮点 | 当前主题落点 | 验收证据 |
| --- | --- | --- | --- |
| Anthropic / Warm Editorial | 暖纸张、衬线主标题、研究与产品并行 | `--aps-paper` 令牌、编辑式 Hero、Journal 区 | 桌面 Hero 双栏，中文标题单独断行 |
| Linear / Precision Product | 细线网格、状态、精确间距、工作区侧栏、问题流、活动时间线 | `PRODUCT SURFACE` 工作面、Inbox/My work/Reviews 视图、Backlog/In progress/Done 状态列、活动流、工作台阶段导航 | 1280px 截图核对；筛选与标签切换可复现，卡片 hover/focus 不改变布局 |
| Vercel / Monochrome Engineering | 工程边界、黑白几何、架构表达 | 工程系统区、命令式方法追踪 | 代码追踪面板显示约束→假设→证据 |
| Raycast / Command UX | 快捷入口、键盘优先弹层 | `⌘/Ctrl+K` 搜索、方向键选择、Escape 还焦 | 搜索打开、选中、关闭路径可复现 |
| Cursor / Replicate / Warp | 真实代码、模型流程、终端状态 | Workbench 六阶段与 trace 输出 | 每个 tab 有独立 panel、输出和状态 |
| Josh Comeau / Emil / Rauno | 微交互、焦点、滚动 reveal | IntersectionObserver、按钮状态、pointer parallax | reduced-motion 自动移除 reveal/parallax |
| Active Theory / Locomotive | 滚动节奏与空间叙事 | 首页区块 reveal 和工作流纵向阅读节奏 | 视觉效果不阻塞内容和键盘操作 |
| 独立开发者作品集 | 个人定位、项目档案、持续记录 | YOYO / 1BYTEONE 品牌、Projects、Journal、Archive | 中英文导航与深链接对称 |

## 本轮实现的状态契约

- Workbench tabs：`selected`、`focus`、`Arrow/Home/End` 导航、面板切换、空闲时无自动轮播。
- Hero scene：桌面 pointer parallax，触摸和 `prefers-reduced-motion` 自动降级到静态图。
- 方法追踪：输出内容来自 `data/ai_product_studio.yaml`，不虚构模型调用、benchmark 或部署状态。
- 资源路径：CSS/JS 使用 `workbench-1` 版本标记，便于 Pages 缓存回归。

## Linear 对齐边界

- `PRODUCT SURFACE` 是基于公开页面可观察关系重构的原创产品工作面，不复制 Linear 的源码、品牌、商标、字体、专属图片或文案。
- 侧栏只表达工作区上下文；状态列表达产品生命周期；右侧活动流表达最近动作。三者各自承担不同的信息职责，避免把所有信息堆在同一张卡片里。
- `All / Active` 筛选只改变问题卡片的可见状态；`Inbox / My work / Reviews` 只改变当前工作区语义并保持键盘可达，保证视觉状态与交互状态一致。
- 移动端将状态列保留为内部横向滚动容器，页面本身保持无横向溢出；`prefers-reduced-motion` 下仍保留完整内容与状态。

## 后续可扩展边界

真实模型 Demo、运行时 RAG 检索和线上评测需要独立服务端或本地实验台；本主题只展示已发布记录与可复核的静态方法契约，不把静态演示包装成在线模型服务。
