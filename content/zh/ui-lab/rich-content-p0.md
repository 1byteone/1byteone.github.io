---
title: "富媒体文章组件：P0 阅读与演示能力"
date: 2026-11-02
summary: "展示共享文章内容中的代码、数据表、架构图、图片灯箱与终端记录。"
tags:
  - Hugo
  - 技术写作
  - 文章组件
authors:
  - me
featured: false
article_form: reference
content_features:
  - code
  - diagram
  - table
  - gallery
  - terminal
render_profile: rich
---

这页用同一份 Markdown 内容演示博客的 P0 富媒体能力。组件只描述文章语义，由当前主题负责视觉呈现；不支持交互增强时，正文仍可作为静态内容阅读。

## 架构图与图片

架构图包含可复用的 Mermaid 源文本和静态图片。图片可以点击放大；同一篇文章中的图片组成一个可用键盘浏览的画廊。

{{< rich-image src="media/ai-engineering/09-rag-basic-pipeline.png" alt="RAG 基础管道：文档、分块、嵌入、检索、提示词和答案" caption="RAG 基础管道" >}}

{{< diagram src="media/ai-engineering/09-rag-basic-pipeline.png" alt="RAG 基础管道，从文档摄入到带来源的答案" caption="静态架构图随文章资源发布，Mermaid 源文本保持可审阅。" >}}
flowchart LR
  A[文档] --> B[清洗与分块]
  B --> C[Embedding]
  C --> D[向量索引]
  Q[用户问题] --> R[检索与过滤]
  D --> R
  R --> P[上下文组装]
  P --> G[生成与引用校验]
{{< /diagram >}}

## 代码块

代码围栏自动带语言标识、行号和复制按钮。这里的实现是教学示例，具体检索参数应由数据集评测决定。

```python {title="retrieval.py"}
def retrieve(query: str, vector_store, top_k: int = 5):
    return vector_store.similarity_search(query, k=top_k)
```

## 参数表

| 阶段 | 输入 | 输出 | 验证重点 |
|---|---|---|---|
| 分块 | 清洗后的文档 | 带元数据的文本块 | 语义完整、来源可追溯 |
| 嵌入 | 文本块 | 向量和版本信息 | 模型版本、维度一致 |
| 检索 | 用户问题 | 候选上下文 | Recall、权限过滤 |
| 生成 | 问题与上下文 | 答案和引用 | 忠实度、引用覆盖 |

宽表在窄屏中保留表格语义并允许横向滚动。

## 终端记录

下面是用于说明组件外观的合成示例数据，不代表线上评测结果。

{{< terminal title="检索评测示例（合成数据）" shell="bash" status="0" >}}
$ python evaluate_retrieval.py --top-k 5
queries=20
retrieved_chunks=100
citation_coverage=0.90
{{< /terminal >}}
