# 🎯 专业GOAL: 使用Agnes AI生图生成专业文章封面

## 需求对齐（头脑风暴）

### 用户目标
使用Agnes AI的生图能力，为博客文章和项目页面生成专业的、高质量的封面图片。

### 技术方案
| 项目 | 说明 |
|------|------|
| 模型 | `agnes-image-2.1-flash` |
| 端点 | `POST /v1/images/generations` |
| API Key | `AGNES_API_KEY` (可用) |
| Base URL | `https://api.agnes-ai.cn` |
| 尺寸 | `1024x768` (接近4:3) |

### 图片设计方案
每篇文章使用**结构化英文Prompt**，包含：
- 主体内容
- 场景/环境
- 风格（科技感、专业）
- 光照/构图
- 质量要求

### 文章Prompt策略

| 文章 | 设计主题 | Prompt关键词 |
|------|----------|-------------|
| **RAG Pipeline** | 数据管道+AI架构图 | data pipeline, glowing nodes, network flow, tech blue |
| **AI Agents** | 智能体+工具调度 | AI agent, tool calling, robot assistant, cyberpunk |
| **Hallucination Prevention** | 盾牌+安全防护 | shield, security, LLM protection, defense layers |
| **Micro Cloud Mall** | 微服务+云架构 | microservices, cloud architecture, distributed system |
| **Agri-QA** | 农业+AI问答 | agriculture, AI farming, knowledge graph, nature |

## 验收标准

1. ✅ 每篇文章有AI生成的封面图片
2. ✅ 图片专业、清晰、与主题相关
3. ✅ 中英版本共用同一张图片
4. ✅ 图片尺寸≥1024×768
5. ✅ 部署成功，HTTP 200

## 执行计划

1. 为每篇文章编写专业Prompt
2. 调用Agnes AI API生成图片
3. 下载图片到本地
4. 替换featured.png
5. 推送部署验证