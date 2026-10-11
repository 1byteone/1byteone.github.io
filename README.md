# 1byteone 个人主页

这是 1byteone 的个人主页与 AI 工程作品集，基于 Hugo 构建，内容覆盖 AI 应用、RAG、智能体、Java 后端和技术学习记录。

## 主题分支

主题代码按分支隔离，公共内容和数据保持一致：

- `dev_theme_oil`：Oil 主题分支，根路径使用 Oil 主页。
- `dev_theme_AIxian`：Alxian 主题分支，根路径使用 Alxian 主页。
- `main`：发布基线分支，用于稳定版本确认。

Oil 分支只包含 Oil 运行代码和公共内容；Alxian 模板、样式、脚本和主题资源在 `dev_theme_AIxian` 维护，不跨分支复制。

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
layouts/             Hugo 页面模板和 Oil 主题局部模板
assets/              Hugo 处理前的源媒体
static/              公共图片、下载文件、CSS 和 JavaScript
docs/                架构、交付、运维与历史文档
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

Oil 分支的默认主题由 `config/_default/params.yaml` 的 `site_theme: oil` 控制。

## 内容维护

- `data/site.yaml`：姓名、联系方式、导航和共享文案
- `data/authors/`：作者资料
- `content/zh/`、`content/en/`：中英文页面、文章和项目
- `layouts/partials/themes/oil/`：Oil 主题模板
- `static/css/`、`static/js/`：Oil 主题运行资源

完整架构说明见 [`docs/README.md`](docs/README.md)。

## 部署

`.github/workflows/deploy.yml` 会在 `main` 和 `dev_theme_oil` 上执行 GitHub Pages 构建与发布。Alxian 分支使用独立工作流验证，不覆盖 Oil 线上站点。

## 联系方式

- GitHub：[1byteone](https://github.com/1byteone)
- Email：yjs_0831@qq.com

## 许可证

MIT License。
