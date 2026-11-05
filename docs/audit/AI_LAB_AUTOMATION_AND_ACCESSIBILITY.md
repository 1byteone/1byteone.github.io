# AI Lab 自动化与无障碍验收

## 已接入

- node --check static/js/ai-lab.js：前端 JavaScript 语法。
- node tools/ai-lab/build-playground-corpus.cjs：从实际文章生成离线语料，并检查 20+20 数量。
- node tools/ai-lab/audit-shared-articles.cjs：共享文章映射和版本风险静态审计。
- node tools/ai-lab/audit-assets.cjs：20 张共享封面 PNG 的存在、尺寸、hash 与来源状态。
- node tools/ai-lab/evaluate-retrieval.cjs：固定小数据集上的本地 lexical baseline。
- node tools/ai-lab/ai-lab-smoke.cjs --public <dir>：双语路由、资源和外部官网误链接检查。
- node tools/ai-lab/structural-regression.cjs --public <dir>：DOM/选择器/设计 token 结构回归。
- Hugo Extended 0.162.0 临时目录构建。
- `npm run build` + Pagefind：408 个页面建立索引；Pagefind 仅提示中文语言没有 stemming。
- `python tools/ai-lab/browser-regression.py --base-url http://127.0.0.1:1322`：真实 Chromium 双语多视口回归，截图和 JSON 保存在 `docs/audit/ai-lab-browser/`。
- `python tools/ai-lab/evaluate-semantic-retrieval.py`：能力门禁式 dense/reranker/回答评测报告，缺包时明确写入 `blocked`，不伪造模型指标。

最近一次本地证据：Hugo 中文 312 / 英文 310 页；AI Lab smoke 13 项必需资源、100 个 AI Lab HTML 页面通过；结构回归 5 个页面契约通过；Python fenced blocks 的 AST 检查 40/40 通过。

## 已通过的真实 Chromium 检查

`docs/audit/ai-lab-browser/report.json` 当前为 `pass`，覆盖中文和英文的 1440×900、768×1024、664×524、390×844，以及 390×844 的 `prefers-reduced-motion`。已通过无横向溢出、main/nav/dialog 地标、图片 alt、控件 accessible name、动画暂停/恢复、可见时的 Learn more 下一张、搜索聚焦、语言切换和控制台无 error；每个视口均保存完整截图并记录 intro、Canvas stage、公告区、Learn more、footer 的 bounding box。

## 尚需人工或环境升级

1. 真实屏幕阅读器（NVDA/VoiceOver）名称、焦点返回和动态状态。
2. 颜色对比、200/400% 缩放、输入法、系统高对比和移动真机性能。
3. 隐藏标签/离屏暂停的人工确认；脚本已覆盖可见暂停恢复和 reduced-motion。

语义评测报告 `docs/audit/ai-lab-semantic-evaluation.json` 当前为 `blocked`：缺少 `sentence_transformers`、`transformers`、`torch`，所以 dense、reranker、LLM answer、引用支持率和无依据回答率均为 `null`。词法 baseline 仍只代表本地诊断结果。

结构检查不等于像素级视觉回归；Hugo 构建通过也不等于线上部署或 WCAG 合规。


