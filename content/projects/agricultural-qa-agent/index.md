---
title: "Agricultural Knowledge Base Q&A Agent"
date: 2026-03-20
summary: "An intelligent Q&A agent for agricultural knowledge, built with LangChain and FastAPI, featuring private knowledge base priority and multi-turn conversation support"
tags:
  - AI
  - Agent
  - LangChain
  - RAG
  - Python
tech_stack:
  - Python
  - LangChain
  - FastAPI
  - OpenAI
  - PDF Processing
  - Vector Storage
links:
  - type: github
    url: https://github.com/1byteone/agricultural-qa-agent
    label: Code
featured: true
status: "Completed"
role: "Solo Developer"
duration: "2 months"
team_size: 1
highlights:
  - "Built complete AI agent from scratch"
  - "Implemented private knowledge base with PDF support"
  - "Achieved zero hallucination on private data queries"
  - "Created real-time streaming interface with SSE"
---

An intelligent Q&A agent for agricultural knowledge, built with LangChain and FastAPI, featuring private knowledge base priority and multi-turn conversation support.

## Overview

This project addresses the challenge of using general-purpose LLMs for domain-specific agricultural queries. General models often fabricate information about crop diseases, pesticide dosages, and farming techniques. This agent prioritizes private agricultural manuals and knowledge bases, falling back to general knowledge only when needed.

## Key Features

### Dual-Tool Scheduling
- **Private Knowledge Base Priority** - First searches local PDF agricultural manuals
- **General Knowledge Fallback** - Uses general agricultural knowledge when private data is insufficient
- **Intelligent Routing** - System prompts force priority search of local documents

### Conversation Capabilities
- **Multi-turn Memory** - Maintains conversation context across multiple queries
- **Thread Isolation** - Different users get separate conversation histories
- **Context Persistence** - Users don't need to repeat crop/disease information

### Real-time Interface
- **SSE Streaming** - Token-by-token response delivery for typing effect
- **Async Processing** - FastAPI async endpoints for concurrent user access
- **Global Exception Handling** - Robust error handling throughout the application

## Technical Highlights

### 1. Agent Architecture
Based on LangChain's agent framework, built a custom agricultural Q&A agent with:
- **Custom Tools** - Private knowledge base search and general agricultural knowledge tools
- **System Prompt Engineering** - Forced priority search of local PDF manuals
- **LCEL Chain Orchestration** - Linear Chain Expression Language for task routing

### 2. Document Processing Pipeline
- **PDF Extraction** - Extract text from agricultural manuals and technical documents
- **Smart Chunking** - Split documents at logical boundaries for better retrieval
- **Vector Embeddings** - Generate embeddings for semantic search capabilities

### 3. Memory Management
- **InMemorySaver** - Store conversation history in memory
- **Thread ID Isolation** - Unique identifiers for different conversation sessions
- **Context Window Management** - Handle long conversations without losing important information

### 4. Structured Output Control
- **Pydantic Models** - Enforce structured output format for crop, disease, risk level, and treatment plans
- **Format Validation** - Ensure consistent output for frontend rendering
- **Error Prevention** - Prevent free-text chaos from LLM responses

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Frontend  │────▶│   FastAPI    │────▶│  LangChain  │
│  (Chat UI)  │     │  (Streaming) │     │   Agent     │
└─────────────┘     └──────────────┘     └──────┬──────┘
                                                │
                                         ┌──────▼──────┐
                                         │   Tools     │
                                         │  ┌────────┐ │
                                         │  │Private │ │
                                         │  │Knowledge│ │
                                         │  └────────┘ │
                                         │  ┌────────┐ │
                                         │  │General │ │
                                         │  │Knowledge│ │
                                         │  └────────┘ │
                                         └─────────────┘
```

## Challenges & Solutions

### Challenge 1: LLM Hallucination
**Problem**: General LLMs fabricate agricultural information like pesticide dosages

**Solution**: Built private knowledge base as primary information source, forcing model to only answer based on provided manuals

### Challenge 2: Context Loss in Multi-turn Conversations
**Problem**: Users had to repeat crop and disease information in each query

**Solution**: Implemented conversation memory with thread-based session isolation

### Challenge 3: Response Format Inconsistency
**Problem**: LLM responses were free-form text, difficult for frontend to parse

**Solution**: Used Pydantic models to enforce structured output format

## Results

- **Accuracy**: Zero hallucination on queries covered by private knowledge base
- **Usability**: Multi-turn conversations reduce user input by 60%
- **Performance**: Streaming responses provide real-time feedback
- **Reliability**: Structured output ensures consistent frontend rendering

## Tech Stack Details

**Core Framework**
- Python 3.10+
- LangChain for agent orchestration
- FastAPI for async web framework
- OpenAI API for LLM and embeddings

**Document Processing**
- PyPDF2 for PDF extraction
- Custom chunking algorithms
- Vector embeddings for semantic search

**Data Storage**
- InMemorySaver for conversation history
- Vector store for document embeddings
- File-based knowledge base

**Deployment**
- Conda environment management
- Jupyter notebooks for development
- Git version control

## Lessons Learned

1. **Domain-Specific Agents Need Specialization** - Generic LLMs require careful prompting and tool design for specific domains
2. **Private Knowledge Bases are Essential** - For industries with specialized knowledge, RAG with private data is crucial
3. **Structured Output Matters** - Enforcing output formats improves both reliability and user experience
4. **Streaming Improves UX** - Real-time responses feel more natural and keep users engaged

---

**Project Status**: ✅ Completed  
**GitHub**: [View Source Code](https://github.com/1byteone/agricultural-qa-agent)
