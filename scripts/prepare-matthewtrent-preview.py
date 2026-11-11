#!/usr/bin/env python3
"""Prepare the captured Matthew Trent mirror for a Pages sub-path preview.

The capture is intentionally kept outside Hugo's static directory so it can
still be opened directly at http://127.0.0.1:8766/. CI copies it into the
generated site and rewrites root-relative URLs to the preview prefix.
"""

from __future__ import annotations

import argparse
import re
import shutil
from pathlib import Path


TEXT_EXTENSIONS = {
    ".css",
    ".html",
    ".js",
    ".json",
    ".svg",
    ".txt",
    ".webmanifest",
    ".xml",
}

BLOG_ROUTES = {
    "ai-engineering-blog-content-system",
    "langchain-tool-calling-agent",
    "mysql-high-concurrency-architecture",
    "rag-basic-pipeline",
    "rag-retriever-optimization",
    "spring-boot-request-lifecycle",
}


def rewrite_root_urls(value: str, prefix: str) -> str:
    """Prefix local root-relative URLs while leaving protocols untouched."""

    # Root URLs in the capture occur in HTML attributes, CSS url() values, and
    # JavaScript strings/template literals. Restrict the match to a URL-like
    # delimiter so regular-expression literals and https:// values are not
    # changed accidentally.
    escaped_prefix = re.escape(prefix)
    pattern = re.compile(rf"([\"'`(=])/(?![/>])(?!{escaped_prefix.lstrip('/')})")
    return pattern.sub(rf"\1{prefix}", value)


def copy_preview(source: Path, destination: Path, prefix: str) -> int:
    if not source.is_dir():
        raise FileNotFoundError(f"Mirror source does not exist: {source}")
    if not prefix.startswith("/") or not prefix.endswith("/"):
        raise ValueError("prefix must start and end with '/'")

    if destination.exists():
        shutil.rmtree(destination)
    destination.mkdir(parents=True)
    copied = 0

    for item in source.rglob("*"):
        relative = item.relative_to(source)
        target = destination / relative

        # The public preview is the adapted landing page plus the article and
        # project entries linked from it. The capture still remains complete in
        # clones/matthewtrent.me; this smaller deployment set keeps Pages below
        # its artifact limit without turning links from the visible page into
        # unrelated content.
        if relative.parts and relative.parts[0] in {"en", "zh", "tags"}:
            continue
        if relative.parts and relative.parts[0] == "blog" and len(relative.parts) > 1 and relative.parts[1] not in {"index.html", "index.xml"} and relative.parts[1] not in BLOG_ROUTES:
            continue
        if relative.parts and relative.parts[0] == "projects" and len(relative.parts) > 1 and relative.parts[1] not in {"index.html", "index.xml", "agricultural-qa-agent", "ecommerce-rag-search"}:
            continue
        if relative.parts[:2] == ("media", "gallery-thumb"):
            continue
        if relative.parts[:3] == ("media", "external", "raw.githubusercontent.com"):
            continue

        if item.is_dir():
            target.mkdir(parents=True, exist_ok=True)
            continue

        target.parent.mkdir(parents=True, exist_ok=True)
        if item.suffix.lower() in TEXT_EXTENSIONS:
            text = item.read_text(encoding="utf-8", errors="surrogateescape")
            target.write_text(rewrite_root_urls(text, prefix), encoding="utf-8")
        else:
            shutil.copy2(item, target)
        copied += 1

    # Keep the theme-center English preview URL valid without copying the
    # capture's separate English export (which only contains redirects and
    # several dozen megabytes of duplicate routes). The mirror's own language
    # switch remains available because this entry starts it in English.
    root_index = destination / "index.html"
    english_index = destination / "en" / "index.html"
    english_index.parent.mkdir(parents=True, exist_ok=True)
    english = root_index.read_text(encoding="utf-8")
    english = english.replace('<html lang="zh-CN"', '<html lang="en"', 1)
    english = english.replace(
        "<head>",
        "<head><script>try{localStorage.setItem('mirror-language','en')}catch(_){}</script>",
        1,
    )
    english_index.write_text(english, encoding="utf-8")
    copied += 1

    return copied


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--destination", type=Path, required=True)
    parser.add_argument("--prefix", default="/themes/matthewtrent/")
    args = parser.parse_args()

    copied = copy_preview(args.source, args.destination, args.prefix)
    print(f"Prepared Matthew Trent preview: {copied} files -> {args.destination}")


if __name__ == "__main__":
    main()
