# 1byteone 个人主页

这是 1byteone 的个人主页与 AI 工程作品集，基于 Hugo 构建，内容覆盖 AI 应用、RAG、智能体、Java 后端和技术学习记录。

## 主题分支

主题代码按分支隔离，公共内容和数据保持一致：

- `dev_theme_oil`：Oil 主题分支，根路径使用 Oil 主页。
- `dev_theme_AIxian`：Alxian 主题分支，根路径使用 Alxian 主页。
- `dev_theme_GPT`：BlogGPT 主题分支，根路径使用 BlogGPT 博客。
- `main`：发布基线分支，合并主题变更前用于稳定版本确认。

三个主题分支共享 `content/`、`data/`、`assets/` 等内容资源；主题模板、样式、脚本和主题专属图片只在对应分支维护，避免跨主题串改。

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

当前分支默认主题由 `config/_default/params.yaml` 的 `site_theme` 控制。主题预览环境位于 `/themes/<theme-id>/`。

## 内容维护

- `data/site.yaml`：姓名、联系方式、导航和共享文案
- `data/authors/`：作者资料
- `content/zh/`、`content/en/`：中英文页面、文章和项目
- `config/<theme-id>/`：主题预览构建覆盖
- `layouts/partials/themes/<theme-id>/`：主题模板
- `static/css/`、`static/js/`、`static/assets/<theme-id>/`：主题运行资源

完整架构说明见 [`docs/README.md`](docs/README.md)。

## 部署

`.github/workflows/deploy.yml` 会在 `main`、`dev_theme_oil`、`dev_theme_AIxian` 和 `dev_theme_GPT` 上执行 GitHub Pages 发布。各主题分支共享同一个 Pages 站点，最近一次成功发布的分支内容会显示在根路径；Oil、Minimal 和 Alxian 主题预览会随发布产物提供在 `/themes/<theme-id>/`。

## 联系方式

- GitHub：[1byteone](https://github.com/1byteone)
- Email：yjs_0831@qq.com

## 许可证

MIT License。
