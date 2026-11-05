# AI Lab 本地插画资产库

本批插画用于 AI Lab 的文章内插图、阅读路线与研究卡片。视觉上借鉴温暖、编辑式的人文插画方向，但不是 Anthropic 官方素材，也不包含其品牌标志或专有插画。

## 授权与来源

本项目还新增了一批独立的开源编辑插画库：[`AI_LAB_OPEN_SOURCE_ASSET_LIBRARY.md`](./AI_LAB_OPEN_SOURCE_ASSET_LIBRARY.md)。该批次包含 33 个 SVG 和 20 个 PNG 横版封面，来源、许可证、文件 hash 与校验方式见 [`ai-lab-open-source-library-manifest.json`](../../assets/data/ai-lab-open-source-library-manifest.json)。

- 来源： [Open Doodles](https://www.opendoodles.com/)；作者 Pablo Stanley。
- 官方页面声明可免费个人及商业使用，并展示 CC0 Public Domain 标记；[CC0 1.0 法律文本](https://creativecommons.org/publicdomain/zero/1.0/)。按 CC0 可无需署名，但本项目仍保留来源与作者信息。
- 直接下载地址、文件尺寸、用途分类及校验记录见 [`assets/data/ai-lab-asset-manifest.json`](../../assets/data/ai-lab-asset-manifest.json)。素材于 2026-11-05 获取。
- 本次保留原始 SVG；解析 XML 并确认没有脚本元素或外部 URL 引用。没有抹除水印、移除署名或重新绘制原作。

> 免费展示不代表所有图库都允许打包再分发。这个集合仅纳入官方页面明确标注 CC0 的 Open Doodles；Anthropic 官网图像只作为设计参考，不复制为本地可再发布素材。

## 本地预览

| 素材 | 预览 | 推荐用途 |
| --- | --- | --- |
| `plant.svg` | <img src="../../static/images/ai-lab/open-doodles/plant.svg" alt="Open Doodles plant illustration" width="150"> | Agri-QA、领域知识、RAG 证据 |
| `reading.svg` | <img src="../../static/images/ai-lab/open-doodles/reading.svg" alt="Open Doodles reading illustration" width="150"> | 实习生学习路线、费曼练习 |
| `sitting-reading.svg` | <img src="../../static/images/ai-lab/open-doodles/sitting-reading.svg" alt="Open Doodles sitting and reading illustration" width="150"> | 技术阅读、研究手记 |
| `unboxing.svg` | <img src="../../static/images/ai-lab/open-doodles/unboxing.svg" alt="Open Doodles unboxing illustration" width="150"> | 工具调用、结构化输出、系统拆解 |
| `float.svg` | <img src="../../static/images/ai-lab/open-doodles/float.svg" alt="Open Doodles float illustration" width="150"> | Prompt 与模型实验 |
| `levitate.svg` | <img src="../../static/images/ai-lab/open-doodles/levitate.svg" alt="Open Doodles levitate illustration" width="150"> | AI 概念与研究卡片 |
| `coffee.svg` | <img src="../../static/images/ai-lab/open-doodles/coffee.svg" alt="Open Doodles coffee illustration" width="150"> | 工程日志、调试记录 |
| `sitting.svg` | <img src="../../static/images/ai-lab/open-doodles/sitting.svg" alt="Open Doodles sitting illustration" width="150"> | 工程故事、项目记录 |
| `meditating.svg` | <img src="../../static/images/ai-lab/open-doodles/meditating.svg" alt="Open Doodles meditating illustration" width="150"> | 工程取舍、复盘总结 |
| `sprinting.svg` | <img src="../../static/images/ai-lab/open-doodles/sprinting.svg" alt="Open Doodles sprinting illustration" width="150"> | 迭代周期、原型实验 |
| `rolling.svg` | <img src="../../static/images/ai-lab/open-doodles/rolling.svg" alt="Open Doodles rolling illustration" width="150"> | 迭代评测、持续改进 |
| `dancing.svg` | <img src="../../static/images/ai-lab/open-doodles/dancing.svg" alt="Open Doodles dancing illustration" width="150"> | 创意实践、开放式 AI 探索 |

## 在文章中引用

```markdown
![阅读中的人物插画](/images/ai-lab/open-doodles/reading.svg)

*插图：Open Doodles · Pablo Stanley · CC0 1.0*
```

SVG 可以作为文章内插画直接引用。AI Lab 当前封面处理器会把全局封面裁切为 WebP；若将 SVG 用作封面，需要先由本地构建工具渲染成 PNG/WebP，再给出对应的替代文本，并继续保留此清单中的原始来源记录。不要直接把 SVG 路径填入现有 `cover` 字段。

## 已接入的横版文章封面

下列封面由对应 SVG 栅格化后放入暖中性色横版画布。Open Doodles 衍生封面为 1200×675；共享文章封面保留其原始 1200×630 或 2400×1260 尺寸，不能把两类素材的规格混写。原始插画未做内容改绘；衍生文件、源 SVG、处理方式和用途均记录在 JSON manifest 中。

| 封面 | 本地预览 | 已使用文章 |
| --- | --- | --- |
| RAG / Domain knowledge | ![RAG knowledge cover](../../assets/media/ai-lab/open-doodles-covers/rag-grounded-knowledge.png) | [RAG 管道](/ai-lab/experiments/building-rag-pipeline/) |
| Agent / Tool boundary | ![Agent tool boundary cover](../../assets/media/ai-lab/open-doodles-covers/agent-tool-boundary.png) | [AI Agent](/ai-lab/engineering/building-ai-agents/) |
| Streaming lifecycle | ![Streaming lifecycle cover](../../assets/media/ai-lab/open-doodles-covers/streaming-lifecycle.png) | [FastAPI Streaming](/ai-lab/engineering/fastapi-ai-streaming-api/) |
| Python debugging | ![Python debugging cover](../../assets/media/ai-lab/open-doodles-covers/python-debugging.png) | [Python AI 工程](/ai-lab/engineering/python-ai-engineering/) |
| Evidence review | ![Evidence review cover](../../assets/media/ai-lab/open-doodles-covers/hallucination-review.png) | [幻觉预防](/ai-lab/research/hallucination-prevention/) |
| Prompt design | ![Prompt design cover](../../assets/media/ai-lab/open-doodles-covers/prompt-design.png) | [Prompt Chain](/ai-lab/engineering/langchain-prompt-chain/) |
