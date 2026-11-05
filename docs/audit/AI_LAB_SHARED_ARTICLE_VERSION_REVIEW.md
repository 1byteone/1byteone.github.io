# AI Lab 共享文章版本核验

生成：node tools/ai-lab/audit-shared-articles.cjs  
结果：docs/audit/ai-lab-shared-article-audit.json

审计范围只包含 content/{zh,en}/ai-lab/{engineering,experiments,research} 中 translationKey 以 ai-lab- 开头、并能匹配 content/{zh,en}/blog/<slug>/ 的共享文章。当前结果是 20 篇文章、40 个双语页面；个人资料、项目、法律和联系人页面不会被误算成共享文章。

每条记录保存 AI Lab 页面、源博客页面、日期、Python 代码块 hash、代码块数量、AST 语法检查和静态风险标记。最近一次 40/40 页面语法检查通过；`reproduced_with_current_dependencies` 保持 `false`，因为静态检查不是运行证据。

## 当前环境证据

本机已检测到 langchain-core 1.2.28、langchain-classic 1.0.3、langgraph 1.1.6、openai 2.15.0 和 pydantic 2.12.5；缺少 fastapi、langchain-openai 与 pytest。因此不能把文章中的 ChatOpenAI、ConversationChain、SSE 或依赖注入代码宣称为当前依赖下可运行。

## 下一步升级门槛

为每一篇文章建立锁定的 Python 环境和最小测试：记录版本、使用 fake/录制响应隔离外部密钥、运行代码块、保存失败原因和迁移差异，再逐篇将状态改成 reproduced 或 blocked。在这之前，旧 API 标记是需要修订的工程风险，而不是文章质量评分。

