---
title: "AI 应用开发工程师博客的富媒体文章系统"
date: 2026-11-05
summary: "为 AI 应用开发工程师设计一套可跨主题复用的文章系统：用 Markdown 维护事实，用代码、图表、架构图、终端和图片画廊表达工程证据。"
tags:
  - AI 应用开发
  - 技术写作
  - 富媒体
  - Hugo
  - RAG
authors:
  - me
featured: false
article_form: architecture
content_features:
  - code
  - diagram
  - table
  - gallery
  - terminal
render_profile: rich
---

一篇面向 AI 应用开发工程师的文章，不应该只能展示一段文字和一组固定卡片。RAG 检索链路需要架构图，Agent 调用链需要时序或流程图，模型评测需要表格与图表，部署排障需要命令和日志，交互 Demo 则需要可阅读的静态回退。

这篇文章把这些需求整理成一套可长期维护的内容系统。核心约束是：**正文只维护一份事实，主题负责各自表达，复杂交互必须有静态降级。**

## 先定义文章能力，而不是先挑模板

技术博客的文章可以组合以下八类内容：

| 内容形态 | 工程用途 | 推荐的静态表达 |
|---|---|---|
| 代码演示 | 展示实现、关键调用和重构 | 语言高亮、行号、复制、差异说明 |
| 图表演示 | 展示延迟、召回率和模型对比 | 图片或可审阅的数据表 |
| 表格演示 | 对比参数、方案和边界 | GFM 表格，窄屏横向滚动 |
| 架构图解 | 说明 RAG、Agent 和服务边界 | Mermaid 源文本加 PNG/SVG 回退 |
| 图片画廊 | 展示界面、实验截图和参考资料 | page bundle、图注和灯箱 |
| 交互组件 | 演示可调参数和工作流 | 独立 Demo 加静态截图 |
| 终端记录 | 记录部署、测试和排障过程 | 命令、输出、退出状态 |
| 视频演示 | 展示完整流程或操作录屏 | 封面、来源、可访问文本说明 |

这份矩阵比“所有文章都使用同一个模板”更稳定：文章只声明真正使用的能力，主题根据能力选择视觉皮肤。当前仓库已经支持 `article_form`、`content_features` 和 `render_profile` 这组字段，普通 Markdown 文章也可以继续保持轻量。

## 内容、渲染和主题分层

建议把文章系统拆成三层：

1. **内容层**：Markdown、Front Matter、代码和数据文件，是唯一事实来源。
2. **渲染层**：Markdown render hook、短代码和可选前端增强，把语义块转成 HTML。
3. **主题层**：terminal、editorial、paper、research 或 cyberpunk 等主题分别决定排版、颜色、密度和动效。

主题不应复制正文，也不应要求文章写入主题专属 CSS。一个 `architecture` 文章可以在终端主题中呈现为日志面板，在编辑主题中呈现为长文图解，在研究主题中呈现为带注释的图表；事实、来源和无脚本回退保持一致。

{{< diagram src="images/content-architecture.svg" alt="AI 工程文章的内容、渲染和主题分层" caption="内容层只维护事实；渲染层提供语义块；主题层提供不同的阅读表达。" >}}
flowchart LR
  A[Markdown + Front Matter] --> B[语义块]
  B --> C[代码 / 图表 / 表格 / 图片 / 终端]
  C --> D[主题皮肤]
  D --> E[静态页面]
  C --> F[可选交互增强]
  F --> E
{{< /diagram >}}

## 面向 AI 工程文章的模板组合

不同文章形态需要不同证据组合，而不是统一套用教程结构：

| 文章形态 | 推荐结构 | 适合的内容能力 |
|---|---|---|
| 原理解析型 | 背景 → 原理 → 架构 → 代码 → 总结 | `diagram`、`code`、`table` |
| 实战教程型 | 需求 → 选型 → 步骤 → 验证 → 排障 | `code`、`terminal`、`table` |
| 架构设计型 | 边界 → 组件 → 数据流 → 失败路径 → 权衡 | `diagram`、`code-diff`、`table` |
| 源码阅读型 | 项目 → 调用链 → 关键源码 → 迁移 | `code`、`code-diff` |
| 性能分析型 | 数据集 → 指标 → 实验 → 对比 → 限制 | `chart`、`table` |
| 项目复盘型 | 背景 → 目标 → 方案 → 结果 → 经验 | `gallery`、`diagram`、`table` |
| 运维手册型 | 环境 → 命令 → 日志 → 回滚 → 预防 | `terminal`、`code` |
| AI 实验型 | 假设 → 变量 → 方法 → 结果 → 可复现步骤 | `chart`、`table`、`demo` |

例如，RAG 文章可以用架构图解释摄入、嵌入、检索和生成，用代码块展示检索接口，再用终端块放置评测命令；三种主题共享这份正文时，不需要维护三套文章。

```python {title="retrieval.py"}
def retrieve(query: str, vector_store, top_k: int = 5):
    """返回候选上下文；生产环境还应叠加权限过滤和来源校验。"""
    return vector_store.similarity_search(query, k=top_k)
```

{{< terminal title="检索评测示例（合成数据）" shell="bash" status="0" >}}
$ python evaluate_retrieval.py --top-k 5
queries=20
retrieved_chunks=100
citation_coverage=0.90
{{< /terminal >}}

## 组件选型：按稳定性分阶段交付

| 阶段 | 先解决什么 | 推荐技术 | 文章中的回退 |
|---|---|---|---|
| P0 | 代码、图片、表格、架构图和终端 | Hugo render hook、Mermaid、语义 shortcode | 普通 Markdown、图片和代码块 |
| P1 | 图表、Diff、图片组和可选 Demo | ECharts、Diff 组件、灯箱 | 静态图、两段代码和操作说明 |
| P2 | 浏览器运行时和滚动叙事 | Sandpack、React Flow、GSAP | 截图、源代码和数据表 |

Fumadocs、Nextra、Docusaurus、Astro Starlight 和 VitePress 都值得研究；它们解决的是内容站或文档站的组织问题。对当前 Hugo 仓库，先把语义块、资源契约和主题降级做好，能够减少迁移成本，也不会阻塞普通文章发布。

## 参考资料与本地图片资源

下面的图片是这篇文章的视觉和组件参考，已按 page bundle 规则保存到本地 `images/`。图片点击后可以使用当前主题提供的灯箱；原始参考页、代理地址和抓取状态见同目录的 [`source-manifest.yaml`](images/source-manifest.yaml)。仓库内的人读说明保留在 `images/SOURCES.md`。

### 代码、图表和交互组件

{{< rich-image src="images/code-hike.jpg" alt="Code Hike 的交互式代码讲解示例" caption="Code Hike：代码讲解与 Scrollycoding" >}}

{{< rich-image src="images/sandpack.jpg" alt="Sandpack 的在线代码编辑器示例" caption="Sandpack：浏览器中的代码编辑和预览" >}}

{{< rich-image src="images/shiki.jpg" alt="Shiki 的代码高亮示例" caption="Shiki：接近 VS Code 的语法高亮" >}}

{{< rich-image src="images/mermaid.jpg" alt="Mermaid 的架构图示例" caption="Mermaid：流程图、时序图和架构图" >}}

{{< rich-image src="images/react-flow.jpg" alt="React Flow 的节点工作流示例" caption="React Flow：可交互的 Agent 工作流节点" >}}

{{< rich-image src="images/observable-plot.jpg" alt="Observable Plot 的数据可视化示例" caption="Observable Plot：模型评测与数据叙事" >}}

### 文章视觉参考

{{< rich-image src="images/refero.jpg" alt="Refero 的产品界面参考" caption="Refero：产品界面与文章视觉参考" >}}

{{< rich-image src="images/anthropic.jpg" alt="Anthropic Research 的编辑式视觉参考" caption="Anthropic Research：研究文章与编辑式插图" >}}

{{< rich-image src="images/rag-use-cases.jpg" alt="RAG 用例架构参考图" caption="RAG：从文档摄入到检索和生成" >}}

Vercel Blog 和 Linear Blog 的代理图片在本次抓取时返回了 `400` 或超时，因此没有写入伪造文件。两项仍保留在资源清单中，后续拿到稳定原图或重新生成可追溯静态图后再补入画廊。

## 交付规则

每篇共享文章发布前，至少检查以下项目：

- Front Matter 的 `article_form` 与正文结构一致。
- `content_features` 与实际语义块一致。
- 图片有 `alt`、图注、来源页和许可状态。
- 外部 Demo 有版本、来源和静态回退。
- 代码示例写明语言、依赖和是否可以直接运行。
- 主题不支持增强能力时，正文仍能作为普通 Markdown 阅读。
- 文章不包含 Token、Cookie、未知脚本、事件属性或临时内部链接。

这套做法让博客从“固定模板集合”变成“可组合的技术内容演示平台”：同一份工程事实可以被多个主题共享，每种主题仍然拥有自己的文章节奏和视觉语言。

> 参考链接、开源项目维护状态和许可证需要在正式集成前逐项复核。本文中的截图用于技术选型与版式研究，不代表相关项目的官方背书。
