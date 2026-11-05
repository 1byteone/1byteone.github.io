# AI Lab 发布矩阵

| 项目 | 当前结果 | 证据 | 结论 |
| --- | --- | --- | --- |
| Pages 触发 | dev_theme_ai_lab 在 push/deploy 条件中 | .github/workflows/deploy.yml | 配置完成；没有实际 CI run 或线上 URL |
| Hugo | 精确校验 0.162.0 Extended | .hugo-version、scripts/hugo-run.cjs | 本地批准版本可复现；PATH 中的 0.152.2 不再被开发脚本接受 |
| Playground corpus | 40 个共享文章页面（20 zh + 20 en） | static/data/ai-lab/playground-corpus.json、生成脚本 | 本地文章语料可复建；不连模型 |
| 检索 baseline | BM25/hybrid lexical，6 queries | data/ai_lab/retrieval_fixture.json、docs/audit/ai-lab-retrieval-baseline.json | 已有诊断分数；不是生产质量结论 |
| 共享文章 | 20 篇，40 个双语导入页面 | docs/audit/ai-lab-shared-article-audit.json | 路径/代码风险已审计；runtime reproduction 未完成 |
| 共享封面 | 20 张 PNG，逐图 hash 与尺寸 | assets/data/ai-lab-shared-cover-manifest.json | 本地来源已登记；外部再分发许可需逐项核验 |
| CC0 插画 | 12 SVG + 6 衍生封面 | assets/data/ai-lab-asset-manifest.json | Open Doodles CC0 证据和衍生关系已登记 |
| 开源图片库 | 53 个新增文件（33 SVG + 20 PNG） | assets/data/ai-lab-open-source-library-manifest.json、tools/ai-lab/verify-open-source-library.cjs | 来源、许可证、hash、尺寸已逐项验证；保留 MIT NOTICE |
| 多来源覆盖 | 27 个来源、258 个本地文件 | assets/data/ai-lab-source-library-manifest.json、tools/ai-lab/verify-source-library.cjs | 每个参考源有独立状态；未稳定下载或授权不明者明确标记 |
| Anthropic 参考图 | Research 5 张、首页 7 张本地参考副本（含两个 atlas 文件） | assets/data/ai-lab-reference-images.json、assets/data/ai-lab-anthropic-home-assets.json | 仅按参考用途记录，未推断授权 |
| 自动化 | smoke、资产、文章、检索、结构检查 | tools/ai-lab/*.cjs | CI 可运行；结构检查不是像素回归 |
| Chromium 回归 | 双语四视口 + reduced-motion | tools/ai-lab/browser-regression.py、docs/audit/ai-lab-browser/report.json | 本地 `public/` 实测通过；截图证据已落盘，屏幕阅读器/真机仍需人工 |
| Dense/reranker/回答评测 | 能力门禁报告 | tools/ai-lab/evaluate-semantic-retrieval.py、docs/audit/ai-lab-semantic-evaluation.json | 当前 blocked（缺少 sentence-transformers/transformers/torch），没有伪造指标 |



