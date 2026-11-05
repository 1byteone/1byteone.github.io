---
title: "RAG 评测记录规范：让每个分数都能复核"
date: 2026-11-03
summary: "一份结果发布前检查清单；当前实验室尚无公开的模型对比实测数据。"
lab_category: benchmarks
cover: media/ai-lab/anthropic-reference/frontier-measurements.jpg
cover_alt: 由深蓝渐变到浅色的星点天空，源自 Anthropic Research 关于前沿测量的配图。
cover_credit: "Anthropic Research · Illuminating the frontier（参考配图）"
featured: true
featured_order: 5
experiment_id: "BMK-2026-001"
status: planned
dataset: "尚未固定"
method: "离线检索与端到端回答评估"
authors: [me]
---

当前实验室没有可公开复核的模型基准分数。此页提供发布规范，不用合成曲线或示例数字制造性能结论。

## 每次运行必须记录

{{< lab-math display >}}
\mathrm{Recall@K} = \frac{\text{相关且出现在前 K 位的查询数}}{\text{查询总数}}
{{< /lab-math >}}

- 数据集版本、样本数量、标注规范与数据许可。
- 模型、Embedding、reranker、Prompt、Chunker 和代码提交版本。
- 硬件、批量大小、并发、温度、超时和重试策略。
- Accuracy、Precision、Recall、F1、Recall@K 等指标的计算定义。
- 延迟统计窗口、P50/P95、失败请求处理方式和 token 计费口径。
- 原始预测、错误案例、运行脚本和可复现环境。

## 当前状态

PLANNED / 无实测数据。只有完成数据审查和重复运行后，才会发布图表；小样本也会同时给出样本量和不确定性说明。
