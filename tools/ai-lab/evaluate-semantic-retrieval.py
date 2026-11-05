#!/usr/bin/env python3
"""Capability-gated semantic/RAG evaluation.

This command never labels lexical retrieval as dense, and never fabricates an
LLM answer score.  When the required packages, model and API key are absent it
writes a reproducible blocked report with the exact missing prerequisites.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import os
import platform
import sys
from datetime import datetime, timezone
from pathlib import Path


def available(module: str) -> bool:
    return importlib.util.find_spec(module) is not None


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--fixture", default="data/ai_lab/retrieval_fixture.json")
    parser.add_argument("--output", default="docs/audit/ai-lab-semantic-evaluation.json")
    parser.add_argument("--model", default=os.environ.get("AI_LAB_EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2"))
    parser.add_argument("--run", action="store_true", help="run the model-backed path when all prerequisites are available")
    args = parser.parse_args()

    fixture_path = Path(args.fixture)
    fixture = json.loads(fixture_path.read_text(encoding="utf-8")) if fixture_path.exists() else {}
    packages = {
        "sentence_transformers": available("sentence_transformers"),
        "transformers": available("transformers"),
        "torch": available("torch"),
        "openai": available("openai"),
    }
    key_available = any(bool(os.environ.get(name)) for name in ("OPENAI_API_KEY", "AGNES_API_KEY"))
    missing = [name for name, present in packages.items() if not present and name in {"sentence_transformers", "transformers", "torch"}]
    if not key_available:
        missing.append("OPENAI_API_KEY or AGNES_API_KEY")

    report = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "status": "blocked",
        "evaluation_scope": ["dense_embedding", "reranker", "llm_answer", "citation_support", "unsupported_claims", "abstention", "latency"],
        "fixture": str(fixture_path).replace("\\", "/"),
        "fixture_documents": len(fixture.get("documents", [])) if isinstance(fixture, dict) else 0,
        "embedding_model": args.model,
        "runtime": {"python": platform.python_version(), "platform": platform.platform(), "packages": packages, "api_key_configured": key_available},
        "blocked_reasons": missing,
        "metrics": {"dense": None, "reranker": None, "answer": None},
        "reproduction_command": "python tools/ai-lab/evaluate-semantic-retrieval.py --run",
        "lexical_baseline_report": "docs/audit/ai-lab-retrieval-baseline.json",
        "integrity_rule": "null metrics mean no model-backed evaluation was executed; lexical baseline must not be reported as dense or reranked.",
    }

    if args.run and not missing:
        # Keep the model-backed implementation explicit.  It is intentionally
        # gated so a normal CI run cannot silently download weights or call a
        # provider without an operator choosing --run.
        from sentence_transformers import SentenceTransformer  # type: ignore

        model = SentenceTransformer(args.model)
        documents = fixture.get("documents", [])
        texts = [f"{item.get('title', '')}\n{item.get('content', '')}" for item in documents]
        embeddings = model.encode(texts, normalize_embeddings=True, show_progress_bar=False)
        report["status"] = "partial"
        report["metrics"]["dense"] = {"documents_encoded": len(embeddings), "model": args.model}
        report["blocked_reasons"] = ["fixed query relevance labels and answer rubric are not present in retrieval_fixture.json"]
    
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"status": report["status"], "blocked_reasons": report["blocked_reasons"], "output": str(output)}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
