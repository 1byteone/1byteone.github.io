---
title: "Three-Layer Hallucination Prevention in RAG Systems: A Practical Guide"
date: 2026-08-05
summary: "Learn how to prevent LLM hallucinations in RAG systems with a three-layer approach: retrieval filtering, prompt engineering, and output validation"
tags:
  - AI
  - RAG
  - LLM
  - Hallucination Prevention
  - Python
authors:
  - me
featured: true
---

Hallucination is one of the biggest challenges in deploying LLMs for production use. This guide presents a practical three-layer approach to prevent hallucinations in RAG systems.


*Above: Three-layer defense architecture for RAG hallucination prevention — Retrieval Filtering → Prompt Engineering → Output Validation*

## Table of Contents

1. [Understanding Hallucination](#understanding)
2. [Layer 1: Retrieval Filtering](#layer-1)
3. [Layer 2: Prompt Engineering](#layer-2)
4. [Layer 3: Output Validation](#layer-3)
5. [Implementation Example](#implementation)
6. [Measuring Effectiveness](#measuring)

## Understanding Hallucination {#understanding}

Hallucination occurs when LLMs generate plausible-sounding but factually incorrect information. In RAG systems, this typically happens when:

- Retrieved context is irrelevant or insufficient
- LLMs prioritize their training data over provided context
- Models "fill in gaps" with fabricated information

### Common Scenarios

1. **Product Information** - LLMs inventing prices, specifications, or availability
2. **Medical/Agricultural Advice** - Generating incorrect dosages or treatments
3. **Legal/Financial** - Creating non-existent regulations or policies

## Layer 1: Retrieval Filtering {#layer-1}

Ensure only relevant information reaches the LLM:

```python
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor

class RetrievalFilter:
    def __init__(self, vector_store, llm):
        self.vector_store = vector_store
        self.llm = llm
    
    def filter_documents(self, query: str, threshold: float = 0.7):
        """Filter retrieved documents by relevance score."""
        # Get initial results
        results = self.vector_store.similarity_search_with_score(query, k=10)
        
        # Filter by score threshold
        filtered = [
            (doc, score) 
            for doc, score in results 
            if score >= threshold
        ]
        
        # Rerank using LLM
        reranked = self.rerank_with_llm(query, filtered)
        
        return reranked
    
    def rerank_with_llm(self, query: str, documents):
        """Use LLM to rerank documents by relevance."""
        prompt = f"""Rank these documents by relevance to the query: {query}
        
Documents:
{[doc.page_content for doc, _ in documents]}

Return the most relevant document indices (comma-separated):"""
        
        response = self.llm.predict(prompt)
        # Parse and return top documents
        # Implementation details...
```

### Filtering Strategies

1. **Score Thresholding** - Remove low-relevance documents
2. **Diversity Filtering** - Ensure varied perspectives
3. **Source Verification** - Prioritize authoritative sources
4. **Freshness Filtering** - Prefer recent information

## Layer 2: Prompt Engineering {#layer-2}

Design prompts that constrain LLM behavior:

```python
HALLUCINATION_PREVENTION_PROMPT = """You are a helpful assistant. Answer the question based ONLY on the provided context.

Rules:
1. If the context doesn't contain enough information, say "I don't have enough information to answer this question."
2. Never make up information not present in the context.
3. Always cite the source document when possible.
4. If multiple sources conflict, present both perspectives.
5. For numerical data, quote exact figures from the context.

Context:
{context}

Question: {input}

Answer:"""
```

### Prompt Templates by Domain

**E-Commerce Products:**
```python
ECOMMERC_PROMPT = """You are a product expert. Answer questions about products using ONLY the provided product information.

Rules:
1. Never invent prices, specifications, or availability
2. If product info is incomplete, say "I don't have complete information about this product"
3. Always mention the product name and key features from the data
4. For comparisons, stick strictly to the provided data

Product Information:
{context}

Question: {input}
"""
```

**Agricultural Knowledge:**
```python
AGRICULTURAL_PROMPT = """You are an agricultural expert. Answer farming questions using ONLY the provided knowledge base.

Rules:
1. Never invent pesticide dosages or treatment methods
2. If the knowledge base doesn't cover the specific crop/disease, recommend consulting a local expert
3. Always cite the source manual when possible
4. For safety-critical advice, include appropriate warnings

Knowledge Base:
{context}

Question: {input}
"""
```

## Layer 3: Output Validation {#layer-3}

Verify LLM responses against source data:

```python
import re
from typing import Dict, List, Tuple

class OutputValidator:
    def __init__(self, llm):
        self.llm = llm
    
    def validate_response(self, response: str, context: str) -> Dict:
        """Validate LLM response against source context."""
        validation_results = {
            "is_valid": True,
            "issues": [],
            "corrected_response": response
        }
        
        # Check 1: Numerical claims
        numerical_issues = self.check_numerical_claims(response, context)
        if numerical_issues:
            validation_results["issues"].extend(numerical_issues)
        
        # Check 2: Entity verification
        entity_issues = self.verify_entities(response, context)
        if entity_issues:
            validation_results["issues"].extend(entity_issues)
        
        # Check 3: Source citation
        citation_issues = self.check_citations(response, context)
        if citation_issues:
            validation_results["issues"].extend(citation_issues)
        
        # If issues found, generate corrected response
        if validation_results["issues"]:
            validation_results["corrected_response"] = self.generate_corrected_response(
                response, validation_results["issues"], context
            )
            validation_results["is_valid"] = False
        
        return validation_results
    
    def check_numerical_claims(self, response: str, context: str) -> List[str]:
        """Verify numerical values in response exist in context."""
        issues = []
        
        # Extract numbers from response
        numbers = re.findall(r'\b\d+(?:\.\d+)?(?:%|元|kg|ml)?\b', response)
        
        for number in numbers:
            if number not in context:
                issues.append(f"Numerical value '{number}' not found in source context")
        
        return issues
    
    def verify_entities(self, response: str, context: str) -> List[str]:
        """Verify product/entity names exist in context."""
        issues = []
        
        # Simple entity extraction (can be enhanced with NER)
        entities = re.findall(r'[A-Z][a-z]+(?:\s[A-Z][a-z]+)*', response)
        
        for entity in entities:
            if entity.lower() not in context.lower():
                issues.append(f"Entity '{entity}' not found in source context")
        
        return issues
```

## Implementation Example {#implementation}

Complete three-layer prevention system:

```python
from langchain.chains import LLMChain
from langchain.prompts import ChatPromptTemplate

class HallucinationPreventionSystem:
    def __init__(self, vector_store, llm):
        self.vector_store = vector_store
        self.llm = llm
        self.retrieval_filter = RetrievalFilter(vector_store, llm)
        self.output_validator = OutputValidator(llm)
    
    def query(self, user_input: str) -> Dict:
        """Process query with three-layer hallucination prevention."""
        
        # Layer 1: Filter retrieval
        filtered_docs = self.retrieval_filter.filter_documents(user_input)
        context = "\n\n".join([doc.page_content for doc in filtered_docs])
        
        # Layer 2: Generate response with constrained prompt
        prompt = ChatPromptTemplate.from_template(HALLUCINATION_PREVENTION_PROMPT)
        chain = LLMChain(llm=self.llm, prompt=prompt)
        response = chain.invoke({"context": context, "input": user_input})
        
        # Layer 3: Validate output
        validation = self.output_validator.validate_response(
            response["text"], context
        )
        
        return {
            "response": validation["corrected_response"],
            "is_valid": validation["is_valid"],
            "issues": validation["issues"],
            "sources": [doc.metadata.get("source") for doc in filtered_docs]
        }
```

## Measuring Effectiveness {#measuring}

Track key metrics to evaluate your prevention system:

```python
class HallucinationMetrics:
    def __init__(self):
        self.metrics = {
            "total_queries": 0,
            "hallucinations_detected": 0,
            "false_positives": 0,
            "retrieval_accuracy": 0
        }
    
    def evaluate_response(self, response: str, context: str, ground_truth: str):
        """Evaluate response quality and hallucination presence."""
        self.metrics["total_queries"] += 1
        
        # Check for hallucinations
        if self.detect_hallucination(response, context):
            self.metrics["hallucinations_detected"] += 1
        
        # Compare with ground truth
        accuracy = self.calculate_accuracy(response, ground_truth)
        self.metrics["retrieval_accuracy"] += accuracy
    
    def detect_hallucination(self, response: str, context: str) -> bool:
        """Simple hallucination detection."""
        # Check if response contains information not in context
        response_words = set(response.lower().split())
        context_words = set(context.lower().split())
        
        # Words in response but not in context
        novel_words = response_words - context_words
        
        # If too many novel words, likely hallucination
        return len(novel_words) > len(response_words) * 0.3
```

### Metrics Dashboard

| Metric | Description | Target |
|--------|-------------|--------|
| Hallucination Rate | % of responses with hallucinations | < 5% |
| Retrieval Accuracy | % of relevant documents retrieved | > 90% |
| Response Quality | User satisfaction score | > 4.5/5 |
| Latency | Response time including validation | < 2s |

## Conclusion

Preventing hallucinations in RAG systems requires a multi-layered approach:

1. **Retrieval Filtering** - Ensure only relevant information reaches the LLM
2. **Prompt Engineering** - Constrain LLM behavior with clear instructions
3. **Output Validation** - Verify responses against source data

The complete implementation is available on [GitHub](https://github.com/1byteone/hallucination-prevention).

---

Questions? Reach out on [GitHub](https://github.com/1byteone) or email me at yjs_0831@qq.com!
