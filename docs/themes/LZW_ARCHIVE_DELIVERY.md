# LZW Personal Archive 交付说明

本分支 `dev_theme_lzw_archive` 已将 [lzw-cjs/personal-website](https://lzw-cjs.github.io/personal-website/) 的公开模板适配到 Hugo。首页保留档案标签、实时钟、打字机文案、数字滚动、作品卡片倾斜、滚动渐入、章节线段动画与 Konami 彩蛋；关于页和简历页作为静态交付页一并发布。

## 已经准备好的内容

- 完整首页视觉结构：Hero、作品索引、进行中、实验残篇、成就、联系方式。
- 原模板色板、字体组合、纸张噪声、扫描线、邮戳、胶带和档案编号视觉。
- 原生 JavaScript 交互：实时钟、打字机、统计数字动画、滚动显现、卡片倾斜、锚点平滑滚动、随机文件编号和 Konami 彩蛋。
- 响应式布局与移动端断点，保留目标站点的桌面与移动端阅读节奏。
- 关于页 `static/about.html`、关于页样式 `static/about.css`、简历页 `static/resume.html`。
- 主题注册和路由：`site_theme: lzw-archive`，可在主题中心/配置中识别。
- 独立预览地址：`/themes/lzw-archive/`，主题切换器使用该地址，不再占用根路径。
- 原始模板字体来源、外链 GitHub/PyPI、邮件联系入口和简历下载入口的结构。

## 必须补充或核对的内容

模板现在保留了参考站点的示例身份信息。正式发布前请逐项替换：

| 内容 | 当前占位位置 | 需要补充 |
| --- | --- | --- |
| 姓名、职业和求职城市 | `layouts/partials/themes/lzw-archive/home.html`、`static/about.html` | 你的姓名、职位、城市和对外称呼 |
| Hero 打字机文案 | `home.html` + `static/lzw-archive.js` | 3-6 条与你实际方向一致的短句 |
| Hero 宣言和统计数字 | `home.html` | 个人简介、项目数、测试数、MCP/工具数等可验证数字 |
| 作品卡片 | `home.html` 的 `works-grid` | 项目名称、技术栈、状态、描述、使用情景、仓库和演示链接 |
| 进行中项目 | `home.html` 的 `in-progress` | 当前周期、项目名称、时间范围和进展说明 |
| 实验残篇 | `home.html` 的 `shards` | 可公开的文章、实验、失败复盘和日期 |
| 成就 | `home.html` 的 `achievements-grid` | 证书、竞赛、发布记录、指标与时间 |
| 联系方式 | `home.html` 的 `contact-grid` | 邮箱、GitHub、简历地址、主推项目链接 |
| 关于页内容 | `static/about.html` | 教育/工作经历、技术方向、工作方式、个人照片或替代视觉（如需要） |
| 简历 | `static/resume.html` | 完整教育经历、项目数据、联系方式、下载版本；如需 PDF，请替换 `static/uploads/resume.pdf` |
| SEO 元信息 | 首页和 `static/about.html` 的 `<title>`、`description` | 网站标题、描述、分享图、favicon 和 canonical |
| 外链可用性 | 所有 `github.com`、`pypi.org`、`mailto:` 链接 | 确认仓库公开、链接有效、邮箱可接收 |
| 合规与授权 | 站点发布前 | 确认公开项目名称、数据、奖项和他人信息均可公开 |

## 修改入口

- 首页模板：`layouts/partials/themes/lzw-archive/home.html`
- 首页样式：`static/lzw-archive.css`
- 首页交互：`static/lzw-archive.js`
- 关于页：`static/about.html`、`static/about.css`
- 简历页：`static/resume.html`
- 主题开关：`config/_default/params.yaml` 中的 `site_theme`
- 主题注册：`data/theme_registry.yaml`

## 本地运行

```bash
pnpm install
pnpm dev
```

打开 `http://localhost:1313/` 检查首页。生产构建使用 `pnpm build`。
