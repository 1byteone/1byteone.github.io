# Linear Research Studio

这套工具把公开网站研究拆成可审计的证据层，再把证据转换为 1BYTEONE / YOYO 的原创实现契约。它解决的是“研究并对齐公开可观察行为”，不是把 Linear 的生产 bundle 下载到主题中。

## 快速开始

在仓库根目录执行：

```powershell
pnpm run research:linear -- --url https://linear.app/homepage --out research/linear
```

浏览器模式需要一次性安装外部依赖：

```powershell
pnpm add -D playwright
pnpm exec playwright install chromium
pnpm run research:linear -- --mode browser --url https://linear.app/homepage
```

没有 Playwright 时默认自动切换到 `static` 模式。静态模式会抓取脱敏后的 HTML、同源链接、资源 URL 和 CSS 自定义属性，但不会声称已经完成截图或动态交互验收；可用 `--mode browser` 强制要求浏览器证据。

## 输出结构

```text
research/linear/
├─ REPORT.md
├─ manifest.json
├─ pages/                       # DOM、page.json、截图和交互证据
├─ licenses/provenance.json     # 来源与许可证人工核验记录
├─ archives/README.md           # Browsertrix/WARC 合规提示
└─ reproduction-skeleton/       # 原创实现的 regions/states 契约
```

浏览器模式默认采集 `1440×900`、`768×1024`、`664×524`、`390×844` 四个视口；可以用 `--viewports 1440x900,390x844` 覆盖。`--routes` 支持逗号分隔 URL 或文本文件，每个页面最多采集 12 个，避免误触发大规模抓取。

## 证据边界

- DOM 会移除脚本内容和内联事件属性；资源清单只保存 URL、类型和性能元数据，不保存第三方 JS 内容。
- 交互采集只对可见元素执行 hover/focus 观察，不自动提交表单、发送消息或复制受限资源。
- 许可证状态默认是 `manual-review-required`。开源采集工具的许可证不等于目标站点素材的授权，发布前必须逐项核验。
- Browsertrix 归档命令只写入提示文档，不会在没有明确授权时自动运行全站爬取。

## 验收建议

将 `REPORT.md` 与 `docs/design/AI_PRODUCT_STUDIO_LINEAR_ALIGNMENT.md` 一起审阅，分别判断：

1. 视觉结构：几何、字体、间距、层级和响应式断点是否有证据。
2. 交互可用：hover、focus、expanded、键盘、触摸、reduced-motion 和错误回退是否有证据。
3. 生产边界：主题中只接入原创组件、中文内容和许可明确的本地素材。
