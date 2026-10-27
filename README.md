# 1byteone 个人主页

这是 1byteone 的个人主页与 AI 工程作品集，基于 Hugo 构建，内容覆盖 AI 应用、RAG、智能体、Java 后端和技术学习记录。

## 主题分支

主题代码按分支隔离，公共内容和数据保持一致：

- `dev_theme_oil`：Oil 主题分支，根路径使用 Oil 主页。
- `dev_theme_AIxian`：Alxian 主题分支，根路径使用 Alxian 主页。
- `dev_theme_GPT`：BlogGPT 主题分支，根路径使用 BlogGPT 博客。
- `dev_theme_min`：Minimal 主题分支，根路径使用 Minimal，提供五个 Astro 风格子主题预览。
- `dev_theme_minimal-tech`：YOYO Engineering Notes 方案 1，根路径使用 AstroPaper-inspired AI 工程作品集与知识库。
- `dev_theme_engineer-terminal`：Engineer Terminal 主题分支，根路径使用终端风格，记录部署、故障、工程日志与架构决策，并提供白名单导航命令演示。
- `main`：发布基线分支，合并主题变更前用于稳定版本确认。

各主题分支共享 `content/`、`data/`、`assets/` 等内容资源；主题模板、样式、脚本和主题专属图片只在对应分支维护，避免跨主题串改。

## 主要内容

- AI 与后端工程项目展示
- RAG、LangChain、OpenAI 和智能体实践
- Java、Spring Boot、Python、MySQL 等技术路线
- 中英文双语页面
- 响应式布局、深色模式和 GitHub Pages 部署

## 目录结构

```text
content/             中文与英文发布内容
data/                个人资料、主题注册表和共享数据
config/              Hugo 默认配置与主题构建覆盖
layouts/             Hugo 页面模板和主题局部模板
assets/              Hugo 处理前的源媒体
static/              公共图片、下载文件、CSS 和 JavaScript
docs/                架构、设计、交付、运维与历史文档
scripts/             内容生成与资源校验脚本
.github/workflows/   GitHub Pages 构建与发布流程
```

`public/`、`resources/`、`node_modules/`、`.hugo-standalone/` 是本地或 CI 生成目录，已加入 `.gitignore`，不会进入远程仓库。

## 本地开发

Windows：

```powershell
choco install hugo-extended
npm ci
hugo server --disableFastRender
```

构建生产文件：

```powershell
hugo --gc --minify
```

当前分支根路径默认使用 `ai-terminal`；`config/_default/params.yaml` 中的 `site_theme` 控制默认主题，Minimal 的 `minimal_variant` 仅在 Minimal 主题下生效。`dev_theme_min` 的根路径默认是 Minimal，五个子主题预览位于：

- `/themes/minimal/astro-blog/`
- `/themes/minimal/astropaper/`
- `/themes/minimal/astro-erudite/`
- `/themes/minimal/pudding/`
- `/themes/minimal/miniblog/`

每个预览使用同一套文章、项目和联系方式数据，只替换首页信息架构与视觉令牌。

`dev_theme_minimal-tech` 将 `minimal_variant` 设为 `astropaper`，根路径提供 YOYO Engineering Notes 首页、`/blog` 文章搜索与分页、`/projects` 项目案例、`/about` 关于页面，以及带目录、阅读进度和代码复制的文章详情页。

`ai-engineering` 是六种 AI 工程视觉方向共用的父级底座，统一内容模型与能力证据链，不依赖 Minimal 主题。当前分支以 Engineer Terminal 作为根路径主题，并提供文章、项目、工程日志、故障复盘与架构决策页面。主题中心 `/theme-center/` 汇总 16 个注册主题（11 个可预览、5 个规划中），支持按场景和状态筛选、双语名称搜索、收藏、预览及设置浏览器默认主题；主题默认值保存在当前浏览器中。`Astro TUI 终端作品集` 已作为终端家族的可预览子主题接入 `/themes/engineer-terminal/astro-tui-portfolio/`，复用同一套文章、项目和双语内容源。

## 内容维护

- `data/site.yaml`：姓名、联系方式、导航和共享文案
- `data/authors/`：作者资料
- `content/zh/`、`content/en/`：中英文页面、文章和项目
- `config/<theme-id>/`：主题预览构建覆盖
- `layouts/partials/themes/<theme-id>/`：主题模板
- `static/css/`、`static/js/`、`static/assets/<theme-id>/`：主题运行资源

完整架构说明见 [`docs/README.md`](docs/README.md)。

## 部署

`.github/workflows/deploy.yml` 会在 `main`、`dev_theme_oil`、`dev_theme_AIxian`、`dev_theme_GPT`、`dev_theme_min`、`dev_theme_minimal-tech`、`dev_theme_engineer-terminal`、`dev_theme_ai-lab`、`dev_theme_ai-product-studio`、`dev_theme_pixel-world`、`dev_theme_tech-editorial` 和 `dev_termfolio` 上执行 GitHub Pages 发布。各主题分支共享同一个 Pages 站点，最近一次成功发布的分支内容会显示在根路径；主题中心位于 `/theme-center/`，Minimal 家族预览位于 `/themes/minimal/<variant>/`，Engineer Terminal 预览位于 `/themes/engineer-terminal/`，Astro TUI 预览位于 `/themes/engineer-terminal/astro-tui-portfolio/`。`dev_termfolio` 已完成线上构建与部署，其他主题分支已同步主题中心共享层。

Minimal 五个子主题的实现方案与验收矩阵见 [`docs/design/MINIMAL_FAMILY_PLAN.md`](docs/design/MINIMAL_FAMILY_PLAN.md)。

## 联系方式

- GitHub：[1byteone](https://github.com/1byteone)
- Email：yjs_0831@qq.com

## 许可证

MIT License。
