# 主题导航与主题面板审计交付

审计基线：`origin/dev_theme_lzw_archive`（`e1f52d2`）

审计对象：主题注册表中 `available: true` 且可从主题中心预览的 14 个主题。

## 交付结论

- 主题切换面板统一使用视口定位，面板宽度和上下边界会根据触发器、视口和面板高度动态计算。
- Minimal 家族、Oil、Alxian 的页面头部统一进入 sticky 导航契约；Oil 列表页和详情页的头部父级结构已修正，确保滚动容器覆盖正文。
- 移动端面板不再使用会造成二次收缩的 `left/right/width:auto` 规则，窄屏下保持可滚动且不出屏。
- 主题面板保留键盘焦点样式、搜索、最近使用、收藏和默认主题状态；本次没有改变主题选择数据或 URL 契约。

## 主题问题统计

| 主题 | 预览入口 | 原问题 | 当前状态 | 仍需补充的内容 |
| --- | --- | --- | --- | --- |
| LZW Archive | `/themes/lzw-archive/` | 导航已有 sticky；共享面板在窄父级中可能向左溢出 | 已修复面板定位 | 真实项目截图、经历时间线和简历事实需持续维护 |
| Cyberpunk 2077 | `/themes/cyberpunk2077/` | 导航已有 sticky；右侧面板边界依赖旧 absolute 定位 | 已修复共享面板定位 | 项目状态、故障复盘和终端命令示例 |
| Engineer Terminal | `/themes/engineer-terminal/` | 导航已有 sticky；移动端面板可能被视口裁切 | 已修复共享面板定位 | 部署日志、监控截图和真实指标 |
| Astro TUI Portfolio | `/themes/engineer-terminal/astro-tui-portfolio/` | 终端窗口导航正常；主题面板在右对齐触发器下可能偏移 | 已修复共享面板定位 | TUI 命令、项目演示和文章索引 |
| Termfolio | `/themes/engineer-terminal/termfolio/` | 导航已有 sticky；共享面板存在同源偏移风险 | 已修复共享面板定位 | 本地 Bitmap 封面与工具链接的最终素材 |
| Minimal | `/themes/minimal/` | 旧 `top:86px/78px` 假定存在未渲染的 family bar，滚动时产生空白偏移 | 已统一 `top:0` | 个人简介、项目真实数据、联系方式 |
| Astro Blog | `/themes/minimal/astro-blog/` | 头部未统一 sticky；面板从顶部独立触发器向左溢出 | 已修复 sticky 与面板定位 | 文章摘要、项目封面和研究状态 |
| AstroPaper | `/themes/minimal/astropaper/` | 首页头部与列表头部行为不一致；面板边界依赖 absolute | 已修复 sticky 与面板定位 | 文章元数据、目录和阅读进度内容 |
| Astro Erudite | `/themes/minimal/astro-erudite/` | 研究页头部未统一 sticky；主题面板可能被视口裁切 | 已修复 sticky 与面板定位 | 术语词汇表、研究索引和文章关联 |
| Pudding | `/themes/minimal/pudding/` | 知识花园头部未统一 sticky；面板在左侧触发器下偏移 | 已修复 sticky 与面板定位 | 项目到笔记的真实反向链接和学习路径 |
| Miniblog | `/themes/minimal/miniblog/` | 归档头部未统一 sticky；移动端面板宽度不稳定 | 已修复 sticky 与面板定位 | 精选文章、归档排序和作者说明 |
| Oil | `/themes/oil/` | 首页头部已有样式但列表/详情页父级只包住 header，sticky 实际失效 | 已修复页面结构并统一 sticky | 真实作品图、项目链接、履历和联系信息 |
| Alxian | `/themes/alxian/` | 首页 `.alxian-topbar` 与内页 `.alxian-page-topbar` 未统一固定 | 已覆盖两套 topbar 的 sticky 规则 | GitHub API、访客统计、音乐/评论外部服务配置 |
| BlogGPT | `/themes/bloggpt/` | 侧栏和顶栏已有 fixed；共享面板曾被 sidebar 特殊规则覆盖 | 已保留 sidebar 兼容并改用动态定位 | 文章分类、搜索索引、评论和状态数据 |

## 已实现与验收标准

### 共享主题面板

`static/js/theme-manager.js` 在面板打开、窗口尺寸变化和页面滚动时重新计算位置：

- 触发器右边缘作为优先对齐点；宽面板自动向视口内回退。
- 面板底部超出视口时优先翻转到触发器上方，并保留安全边距。
- 桌面端保持最大 360px 宽度；移动端按视口宽度收缩并允许面板内部滚动。

### 导航

`static/css/theme-manager.css` 提供共享 sticky 契约，覆盖 Minimal 全部变体、Oil 两类页面头部、Alxian 首页/内页头部。主题自身已有 fixed/sticky 的导航（BlogGPT、Cyberpunk、Engineer Terminal、Astro TUI、Theme Center、Termfolio、LZW）保留原有视觉参数。

### 内容补充边界

模板、路由、主题切换、响应式布局和共享内容模型已经准备好。上线前你仍需要确认：

1. 姓名、邮箱、GitHub、所在地、求职状态等身份信息。
2. 每个项目的真实仓库、截图、技术栈、职责、时间和可公开程度。
3. 文章标题、摘要、发布日期、标签、封面和中英文对应关系。
4. Alxian 的 GitHub/访客统计接口、音乐资源、评论或聊天服务是否接入真实后端。
5. 简历 PDF、头像、作品图片和第三方字体的授权与长期可用性。

## 验收命令

```powershell
node --check static/js/theme-manager.js
git diff --check
hugo --minify
pnpm run pagefind --site public
```

线上验收至少覆盖根站、主题中心、6 个 Minimal 入口、Oil、Alxian、BlogGPT 和 Termfolio，并检查桌面 1440px 与移动 390px 两个视口下：导航滚动后仍可见，面板完整显示，主题切换链接不产生 404。
