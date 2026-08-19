---
title: "使用LangChain构建AI智能体：工具集成与多轮对话"
date: 2026-07-10
summary: "学习如何使用LangChain构建智能AI智能体，包括工具集成、记忆管理和多轮对话支持"
tags:
  - AI
  - Agent
  - LangChain
  - Python
  - 教程
authors:
  - me
featured: true
---

AI智能体正在改变我们构建智能应用的方式。与简单聊天机器人不同，智能体可以使用工具、保持上下文并做出决策。本指南介绍如何使用LangChain构建生产级智能体。

## 目录

1. [什么是AI智能体？](#什么是ai智能体)
2. [LangChain智能体框架](#langchain智能体框架)
3. [自定义工具开发](#自定义工具开发)
4. [记忆管理](#记忆管理)
5. [多轮对话](#多轮对话)
6. [生产部署](#生产部署)

## 什么是AI智能体？ {#什么是ai智能体}

智能体结合了LLM、工具和推理能力：

```
用户输入 → 智能体（推理） → 工具选择 → 工具执行 → 响应
```

关键特征：
- **工具使用** - 可与外部系统交互
- **推理** - 决定使用哪些工具以及何时使用
- **记忆** - 跨交互保持上下文
- **自主性** - 可以链接多个操作

## LangChain智能体框架 {#langchain智能体框架}

LangChain提供了强大的智能体构建框架：

```python
from langchain.agents import create_openai_tools_agent
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

# 初始化LLM
llm = ChatOpenAI(model="gpt-4", temperature=0)

# 定义提示词
prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一个有工具访问权限的有用助手。"),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}")
])

# 创建智能体
agent = create_openai_tools_agent(llm, tools, prompt)
```

## 自定义工具开发 {#自定义工具开发}

为你的用例构建特定工具：

```python
from langchain_core.tools import tool
from typing import Optional

@tool
def search_knowledge_base(query: str) -> str:
    """搜索私有知识库获取信息。"""
    # 实现代码
    results = vector_store.similarity_search(query, k=3)
    return "\n".join([doc.page_content for doc in results])

@tool
def get_product_info(product_id: str) -> str:
    """通过ID获取详细产品信息。"""
    # 数据库查询
    product = db.get_product(product_id)
    return f"产品: {product.name}, 价格: {product.price}"

# 注册工具
tools = [search_knowledge_base, get_product_info]
```

### 工具最佳实践

1. **清晰描述** - 帮助智能体理解何时使用每个工具
2. **错误处理** - 优雅处理工具失败
3. **输入验证** - 处理前验证输入
4. **速率限制** - 防止外部API滥用

## 记忆管理 {#记忆管理}

实现对话记忆以保持上下文：

```python
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain

# 初始化记忆
memory = ConversationBufferMemory(return_messages=True)

# 创建对话链
conversation = ConversationChain(
    llm=llm,
    memory=memory,
    verbose=True
)

# 在智能体中使用
agent = create_openai_tools_agent(
    llm, tools, prompt,
    memory=memory
)
```

### 记忆类型

| 类型 | 用途 | 权衡 |
|------|------|------|
| 缓冲 | 简单对话 | 有限上下文 |
| 摘要 | 长对话 | 信息丢失 |
| 向量 | 语义搜索 | 存储开销 |
| 实体 | 实体跟踪 | 复杂性 |

## 多轮对话 {#多轮对话}

处理复杂对话流程：

```python
from langchain.agents import AgentExecutor

# 创建智能体执行器
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,
    max_iterations=10,  # 防止无限循环
    handle_parsing_errors=True
)

# 带上下文的对话
def chat(user_input: str, conversation_id: str):
    # 加载对话历史
    history = load_conversation_history(conversation_id)
    
    # 运行智能体
    result = agent_executor.invoke({
        "input": user_input,
        "chat_history": history
    })
    
    # 保存到历史
    save_conversation_history(conversation_id, user_input, result["output"])
    
    return result["output"]
```

## 生产部署 {#生产部署}

### 1. FastAPI集成

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class ChatRequest(BaseModel):
    message: str
    conversation_id: str

class ChatResponse(BaseModel):
    response: str
    conversation_id: str

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        response = chat(request.message, request.conversation_id)
        return ChatResponse(
            response=response,
            conversation_id=request.conversation_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### 2. 流式响应

```python
from fastapi.responses import StreamingResponse

@app.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    async def generate():
        async for event in agent_executor.astream_events(
            {"input": request.message},
            version="v1"
        ):
            if event["event"] == "on_chat_model_stream":
                content = event["data"]["chunk"].content
                if content:
                    yield f"data: {content}\n\n"
        yield "data: [DONE]\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")
```

### 3. 错误处理

```python
@app.middleware("http")
async def error_handler(request, call_next):
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        logger.error(f"智能体错误: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": "内部服务器错误"}
        )
```

## 实际案例：农业问答智能体

以下是我如何构建农业知识库智能体：

```python
from langchain.agents import create_openai_tools_agent
from langchain.tools import Tool

# 定义农业工具
tools = [
    Tool(
        name="SearchKnowledgeBase",
        func=search_agricultural_knowledge,
        description="搜索私有农业手册获取作物病害、治疗和最佳实践"
    ),
    Tool(
        name="GeneralAgriculturalKnowledge",
        func=get_general_knowledge,
        description="当私有知识库没有答案时获取一般农业信息"
    )
]

# 强调私有数据优先的系统提示词
system_prompt = """你是一位农业专家助手。

重要提示：始终首先搜索私有知识库。仅在私有搜索没有返回相关结果时使用一般知识。

回答时：
1. 尽可能引用源文档
2. 具体说明作物名称、病害症状和治疗方法
3. 如果不确定，请说"建议咨询当地农业专家"
"""
```

## 总结

构建AI智能体需要：
- **工具设计** - 清晰、文档良好的工具
- **记忆管理** - 适合用例的记忆策略
- **错误处理** - 优雅的失败管理
- **用户体验** - 流式传输和清晰反馈

完整农业智能体代码可在 [GitHub](https://github.com/1byteone/agricultural-qa-agent) 上获取。

---

有问题？通过 [GitHub](https://github.com/1byteone) 或邮件 yjs_0831@qq.com 联系我！
