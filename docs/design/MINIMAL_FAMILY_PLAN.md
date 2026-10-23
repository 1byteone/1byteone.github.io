# Minimal 主题家族实现方案

`dev_theme_min` 将 Minimal 定为站点根路径的默认主题，并在同一套 Hugo 内容上实现五个 Astro 风格子主题。这里的“模板”指视觉与信息架构的实现方向，不复制外部仓库代码；文章、项目和联系方式继续由 `content/` 与 `data/site.yaml` 统一提供。

## 父子主题关系

`Minimal` 是主题家族的父主题和默认入口，地址为 `/themes/minimal/`；五个模板是同一内容模型上的子主题预览，不是五个互相独立的站点。每个页面顶部都显示统一的家族栏：左侧回到 Minimal 父主题，右侧切换 Astro Blog、AstroPaper、astro-erudite、Pudding 和 Miniblog。当前子主题使用高亮状态，移动端保持横向滚动，避免把切换入口隐藏掉。

## 主题矩阵

| 预览路径 | 模板方向 | 首页重点 | 适合场景 |
| --- | --- | --- | --- |
| `/themes/minimal/` | Minimal | 极简英雄区、项目与文章索引、联系入口 | 根站默认、快速打开 |
| `/themes/minimal/astro-blog/` | Astro Blog | 开放式编辑网格、最近写作、当前研究 | 从零二开、轻量上线 |
| `/themes/minimal/astropaper/` | AstroPaper | 文章列表、主题侧栏、阅读统计 | 长期维护技术博客 |
| `/themes/minimal/astro-erudite/` | astro-erudite | 研究索引、术语表、原生 CSS 排版 | 深入理解前端与知识组织 |
| `/themes/minimal/pudding/` | Pudding | 知识花园、项目到笔记的关联路径 | 知识库与反向链接扩展 |
| `/themes/minimal/miniblog/` | Miniblog | 精选文章、写作归档、作者简介 | 专注写作与阅读 |

## 五个子主题的博客设计特点

| 子主题 | 设计特点 | 适合承载的内容 |
| --- | --- | --- |
| Astro Blog | 开放式编辑网格、宽松留白、`Currently exploring` 状态卡，首页先展示最近写作，再展示项目实验。 | 快速发布的技术文章、实验记录、项目进展 |
| AstroPaper | 文档化的信息架构，文章主列表配主题侧栏、文章数量和学习路线统计。 | 长期维护的 RAG、Agent、MCP、Spring AI 系列文章 |
| astro-erudite | 研究札记风格，衬线字体、目录索引、词汇表和“问题—约束—实现—验证”的文章组织。 | 原理拆解、源码阅读、工程取舍与复盘 |
| Pudding | 知识花园视觉，使用主题节点、术语轨道和项目到笔记的关联路径。 | 知识卡片、主题地图、反向链接和学习路径 |
| Miniblog | 写作优先，单篇精选文章占据首屏，下面接时间归档和作者简介，阅读节奏最安静。 | 深度长文、周刊式更新、个人技术随笔 |

## 技术结构

```text
config/_default/params.yaml          # 生产根路径：minimal + minimal_variant=minimal
config/minimal/params.yaml            # /themes/minimal/ 预览
config/minimal-<variant>/params.yaml  # 五个子主题预览构建
data/theme_registry.yaml              # Minimal 家族白名单、标签、预览地址
layouts/partials/themes/minimal/home.html
layouts/partials/themes/minimal/variants/*.html
layouts/partials/minimal-family-switcher.html
static/css/minimal-theme.css          # 共用基础令牌 + 五套 variant 命名空间
```

`theme-router.html` 只负责把首页请求分发到 `minimal`。`minimal/home.html` 再根据 `minimal_variant` 白名单加载子主题 partial；无效值会回退到 Minimal，避免配置错误导致首页 500。所有子主题的 CSS 都挂在 `.variant-*` 命名空间下，不会污染 Oil、Alxian 或 BlogGPT。

## 交互与内容契约

- 主题切换器只显示 Minimal 家族，当前主题使用 `aria-current="page"` 标记。
- 中文和英文预览都提供，链接使用 `/themes/minimal/<variant>/` 与 `/en/` 路由。
- 首页只做静态展示和锚点导航；文章、项目与 RSS 仍沿用 Hugo 原有 URL。
- 预览构建设置 `theme_preview: true` 并加入 `data-pagefind-ignore`，避免重复内容进入搜索索引。
- 生产根路径保持 `theme_preview: false`，后续若选择某个子主题，只需把 `minimal_variant` 改为对应 ID。

## 发布与验收

GitHub Actions 在 `dev_theme_min` 分支构建根站、Minimal 父主题和五个子主题目录。验收包含：

1. 六个中文首页和六个英文首页均生成。
2. 每个首页都能加载 `css/minimal-theme.css`。
3. 切换器从任一子主题可以回到 Minimal 或进入其他四个子主题。
4. 文章与项目链接仍指向共享内容路由，不产生主题专属副本。
5. 移动端在 760px 以下切换为单列布局，保留标题、文章列表和联系方式。

本地可用 Hugo 的 `config` 环境构建单个预览，例如：

```powershell
hugo --environment minimal-astropaper --configDir config --baseURL http://localhost:1313/themes/minimal/astropaper/
```
