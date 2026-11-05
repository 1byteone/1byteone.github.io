# AI Lab 开发完成度盘点

盘点日期：2026-11-05  
工作树：D:\\worktrees\\dev_theme_ai_lab（dev_theme_ai_lab）  
本地验证输出：.hugo-preview-ai-lab/（被忽略，不是发布目录）

## 本轮已完成

- dev_theme_ai_lab 已加入 GitHub Pages workflow 的 push/deploy 条件；这只是触发配置，当前没有 CI run URL，也没有推送或线上发布证据。
- Hugo 版本统一为 0.162.0 Extended：.hugo-version、CI 环境和 scripts/hugo-run.cjs 均校验精确版本。Windows 开发脚本会避开 npm shim，使用真实 Hugo 可执行文件。
- Playground 现在由 tools/ai-lab/build-playground-corpus.cjs 从 AI Lab 实际导入的 20 篇中英文共享文章生成 static/data/ai-lab/playground-corpus.json，支持按当前语言执行 BM25 + 字符 n-gram 本地检索；仍不调用模型、Embedding、密钥或外网。
- 本地词法基准已固定到 data/ai_lab/retrieval_fixture.json，运行脚本输出 Recall@3、MRR、nDCG@3 和本地 CPU 排序 P50/P95。最近一次运行：BM25 与 hybrid lexical 均 Recall@3 0.917、MRR 0.917、nDCG@3 0.874；P50/P95 仅是短文本排序耗时，不是网络或端到端 RAG 延迟。
- 共享文章审计只扫描真实导入的 20 篇（40 个双语页面），记录源文章路径、代码块 hash、静态旧 API 风险和未复现状态。当前 4 篇含 langchain.agents、ConversationChain 或 AgentExecutor 等兼容性审查标记。
- 审计会对 40 个页面中的 Python fenced blocks 做 AST 语法检查；最近一次 40/40 通过。AST 通过只说明代码文本语法可解析，不等于依赖安装、网络调用、运行时行为或业务结果通过。
- 20 张共享文章 PNG 已补充 assets/data/ai-lab-shared-cover-manifest.json，记录尺寸、字节数、hash、文章映射和来源审查状态；它们是仓库已有素材的导入记录，不自动声称具备外部再分发许可。
- 新增开源素材库：assets/media/ai-lab/library/ 共 53 个文件（33 个 SVG + 20 个 1200×675 PNG），均有来源、许可证、尺寸和 SHA-256 记录；校验器 tools/ai-lab/verify-open-source-library.cjs 最近一次通过。该批素材来自 react-open-doodles 分发包所承载的 Open Doodles 作品，保留 MIT NOTICE。
- 参考清单已拆成 27 个独立来源，并新增 `assets/data/ai-lab-source-library-manifest.json` 与 `docs/design/AI_LAB_SOURCE_COVERAGE.md`：6 个来源已落地 258 个文件，其他来源分别标记为 reference-only、metadata-only、review-required 或 not-downloaded；不会把未核验素材写成可再分发资产。
- 12 张 Open Doodles SVG 和 6 张本地衍生封面继续按 CC0 证据单独管理；Anthropic 首页/Research 图片保持“参考副本”身份，来源、hash 和授权边界独立登记。当前清单为首页 7 张、Research 5 张。
- CI 增加 AI Lab 语料、文章、资产、smoke 和结构回归检查；结构回归名称明确为 DOM/选择器检查，不冒充像素级截图比较。
- `npm run build` 已在 Hugo Extended 0.162.0 上通过，Pagefind 索引了 408 个页面；中文分词提示是工具限制，不是构建失败。

## 仍未完成或有边界

- 未执行 GitHub Actions，未推送，未部署 GitHub Pages；“已加入 workflow”不等于“已上线”。
- 20 篇共享文章没有逐篇在锁定的 LangChain/OpenAI/FastAPI 环境中运行；当前 Python 环境缺少 fastapi、langchain-openai 和 pytest，因此不能把静态扫描升级为复现通过。
- 本地基准不是完整 RAG：没有 dense embedding、reranker、模型回答、引用支持率、无依据回答率、成本或生产网络延迟。两篇内容页的实验状态继续保留 planned。
- 资产审计记录了共享 PNG 的本地来源和 hash，但原始素材的外部许可仍需逐项确认。Anthropic 图片仅用于学习/界面研究参考，不写成 CC0 或可再分发授权。
- 当前自动化是 Node 结构检查和 Hugo smoke；还没有真实浏览器的四视口截图 diff、屏幕阅读器、200/400% 缩放、触摸和完整 WCAG 人工审查。
- Playground 是轻量本地检索学习台，不是线上模型工作台或真实 RAG 服务；若接入模型，应另设服务端密钥、权限、额度、审计和故障边界。



