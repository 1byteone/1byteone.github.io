# 李知旺

> 大三 | 2023级 | 人文地理与城乡规划 | 湖南财政经济学院（经济地理学院）  
> 手机：19138370022 | 邮箱：[待补充] | GitHub：[github.com/lzw-cjs](https://github.com/lzw-cjs)

---

## 求职意向

**AI Agent 开发实习生** — 深圳 | 实习3-6个月 | 每周3-5天

---

## 个人简介

AI Agent 全栈开发者，独立完成 6 个 AI Agent 项目，覆盖 Multi-Agent 协作、RAG 知识库、MCP 协议、桌面应用、数据分析全链路。核心技术栈：LangChain + LangGraph + FastMCP + FastAPI。最新项目基于 Multi-Agent 架构开发了项目管理助手，并用 FastMCP 封装为 MCP Server（10 Tools + 3 Resources + 3 Prompts），已在 Claude Code、Claude Desktop、Cursor、Trea、OpenClaw 5 个平台验证；完成产品化交付：54 个 pytest 测试用例（核心覆盖率 85%+）、Gradio Web Demo、GitHub Actions CI/CD。同时具备 ArcGIS Pro 国土空间规划项目能力。

---

## AI Agent 项目经历

### 1. project-manager-agent — Multi-Agent 项目管理助手 + MCP Server

> Python + DeepSeek + FastMCP + Flask + NetworkX | 2026 | [GitHub](https://github.com/lzw-cjs/project-manager-agent)

- 设计 Multi-Agent 协作架构：Coordinator + 4 个专业 Agent（代码分析/架构评估/稳定性评估/变更管理），Plan-Execute 编排模式
- 实现 Blackboard 共享状态模式，Agent 间解耦协作；纯计算分析引擎（AST 解析、圈复杂度、依赖图、循环检测）
- 基于 FastMCP 2.x 开发 MCP Server，封装 10 个 Tools + 3 个 Resources + 3 个 Prompts，使用 lifespan 机制管理组件生命周期，stdio 传输，MCP Server 直接复用 CLI 核心能力零重复开发
- 产品化：54 个 pytest 测试用例（核心覆盖率 85%+）、Gradio Web Demo（3-Tab 界面）、GitHub Actions CI/CD（多版本矩阵 + ruff + Codecov）
- Flask Web Dashboard + Chart.js 可视化，REST API 支持异步分析任务；量化指标收集器（MetricsCollector）

### 2. langchain-langgraph-projects — RAG 知识库问答 + 学习路径生成

> LangChain + LangGraph + ChromaDB + FastAPI | 2025

- 构建 4 个子项目的完整 RAG 系统：问答机器人、学习路径生成器、Web UI、文档加载器
- 实现高级检索策略：QueryRouter 自动路由（global/local/hybrid）、HyDE 假设性文档嵌入、Multi-Query 扩展、LLM Reranking 重排序
- 用 LangGraph StateGraph 搭建 6 节点学习路径流水线，集成 Context7 和 Firecrawl 外部工具调用
- 构建两阶段知识图谱（实体提取 → 跨文档消歧融合），支持 8 种实体类型和 8 种关系类型
- 实现 FastAPI 后端：滑动窗口会话管理 + LRU 淘汰 + SSE 流式输出

### 3. zhuochong（智能桌面宠物）

> PySide6 + OpenAI/Anthropic API + edge-tts | 2025

- 桌面 AI 宠物应用，支持文字/语音双模态交互
- 设计统一 LLM 接口层，支持 OpenAI 和 Anthropic 双后端无缝切换
- 集成 edge-tts 文本转语音 + 动画状态机（idle/talking/sleeping）+ 日程提醒
- 模块化架构 35+ Python 文件，tool calling 框架完善

### 4. pipeline-deploy — 智能数据分析 Web 应用

> Streamlit + scikit-learn + pandas | 2025-2026

- 端到端数据分析平台：上传数据 → 智能审查 → 深度分析 → 报告生成 < 1 分钟
- DataAuditor 7 维度数据画像：语义类型识别、共线性检测（Pearson + VIF）、正态性预检等，自动推荐分析方法
- DeepAnalyzer 实现 10 种统计方法链式调用：t 检验（Welch）、ANOVA（Tukey）、逻辑回归（ROC/AUC）、K-Means（肘部法则）、DBSCAN（k-distance）、时序分解等
- 三 Tab 布局 + 批量处理 + JSON 持久化历史管理

### 5. my_ai_study — 数据分析 Agent

> ZhipuAI (GLM) + pandas | 2025

- 构建 CSV 自动分析 Agent：LLM 识别字段类型 → 生成 pandas 代码 → 内置安全约束（禁止 eval/exec）
- 问卷交叉分析引擎：卡方独立性检验 + Cramér's V 效应量 + 自然语言洞察生成
- 规则引擎自动检测 3 种模式：主导分布（阈值 70%）、两极分化（top2 > 80%）、统计显著性（p < 0.05）

### 6. OpenClaw 多模型 Agent 平台配置

> DeepSeek V3.2（主力） + Kimi（fallback） | 2025-2026

- 设计多模型 fallback 策略：DeepSeek 超限自动切换 Kimi，保证服务可用性
- 编写 Agent skills 和项目进度追踪自定义模板
- 多模型并发管理和速率限制处理实践

---

## GIS 项目经历

### ArcGIS Pro 技能学习与国土空间规划

> ArcGIS Pro 3.1/3.4 + ArcMap 10.8 | 2024-2026

- 完成 3,000+ 文件的 ArcGIS Pro 系统学习，涵盖 DEM 分析、遥感影像土地利用分类、空间查询、适宜性评价
- **石牛寨镇国土空间规划实训**：处理 DEM、遥感影像（~330MB）、地类矢量数据，制作 5 类规划图件（用地用海图、现状图、村庄布点图、空间规划分区图、基础设施图）
- 积累 GIS 数据资源：Landsat 8/Sentinel-2 遥感影像、湖南省 DEM 12.5m、中国行政区划矢量 GS(2024)
- Python 辅助：编写 ArcGIS 椭球面积计算公式、地理空间数据处理脚本

---

## 技能专长

| 类别 | 技能 |
|------|------|
| **AI/LLM** | LangChain、LangGraph、RAG、Prompt Engineering、Multi-Agent、MCP 协议、ChromaDB |
| **编程语言** | Python（主力）、SQL、基础 JavaScript |
| **AI 框架/平台** | OpenAI API、Anthropic SDK、ZhipuAI (GLM)、SenseNova |
| **后端/部署** | FastAPI、Flask、Streamlit、asyncio、RESTful API、SSE 流式输出、Gradio |
| **桌面应用** | PySide6、edge-tts 语音合成 |
| **数据科学** | pandas、scikit-learn、NumPy、统计分析（假设检验/回归/聚类） |
| **测试/CI** | pytest、pytest-cov、GitHub Actions、Codecov、ruff |
| **GIS** | ArcGIS Pro 3.x、ArcMap 10.8、DEM/遥感影像处理、空间分析 |
| **工具链** | Git、Docker（学习中）、Claude Code、Ollama、LM Studio |
| **语言** | 英语（读写技术文档）、日语（四级备考中） |

---

## 创新创业与竞赛

- **三创赛** — 农产品竞品市场研究，完成抖音/淘宝/拼多多/快手四平台竞品报告，2025 年 4 月
- **大学生创新创业大赛** — 项目负责人，"新脚步·丰富品牌"，2024 年 3 月
- **大学生创新创业训练计划** — 项目申报，2024
- **纸塑能·森林** — 环保纸质家居产品，团队"零碳新塑料"，2024

### 获奖荣誉

| 时间 | 奖项 | 等级 |
|------|------|------|
| 2024.03 | 挑战杯（Challenge Cup） | 院级二等奖 |
| 2023-2024 | 湖南省青马工程培训 | 结业 |

---

## 证书与考试

- 软件设计师（中级）— 备考中
- 青马工程结业证书 — 2023-2024
- 日语四级 — 备考中

---

## 自我评价

- **Multi-Agent 架构实战经验**：独立设计并实现 5-Agent 协作系统（Plan-Execute 编排 + Blackboard 共享状态），理解 Agent 间任务分解与状态流转
- **MCP 协议开发者**：基于 FastMCP 2.x 开发 MCP Server，封装 10 Tools + 3 Resources + 3 Prompts，已在 Claude Code、Claude Desktop、Cursor、Trea、OpenClaw 5 个平台验证，理解 MCP 与 Function Calling 的本质区别
- **产品级交付能力**：从代码到测试（54 用例，覆盖率 85%+）到 Demo（Gradio）到 CI/CD（GitHub Actions）的完整产品化流程
- **RAG 全链路实战**：覆盖 QueryRouter 路由、HyDE 嵌入、Multi-Query 扩展、LLM Reranking、知识图谱构建全流程
- **多模型工程化实践**：同时对接 OpenAI/Anthropic/ZhipuAI/SenseNova 四家 API，设计 DeepSeek + Kimi 多模型 fallback 策略
- **AI 工具链深度使用者**（27 个 AI 编程助手），保持对 AI Agent 领域最新进展的持续追踪
- **GIS + AI 交叉背景**，对智慧城市/地理信息方向的 AI Agent 应用有深入理解和浓厚兴趣

---

> 完整项目代码见 GitHub：[github.com/lzw-cjs](https://github.com/lzw-cjs)
> 核心项目 project-manager-agent：[github.com/lzw-cjs/project-manager-agent](https://github.com/lzw-cjs/project-manager-agent)
