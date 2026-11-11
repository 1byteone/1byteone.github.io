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


def _path_pattern(prefix: str) -> re.Pattern[str]:
    escaped_prefix = re.escape(prefix.lstrip("/"))
    # Requiring a path separator, extension, query, fragment, or string end
    # after the first segment avoids mistaking a regex closing slash such as
    # ``/g`` for a root URL.
    return re.compile(
        rf"(?<![A-Za-z0-9+_.-])/(?![/>])(?!{escaped_prefix})"
        rf"(?=[A-Za-z0-9_.~:-]+(?:/|[.?#]|$))"
    )


def _rewrite_js(value: str, prefix: str) -> str:
    """Rewrite URLs in JS strings while preserving regex literals/comments."""

    path_pattern = _path_pattern(prefix)
    output: list[str] = []
    index = 0
    length = len(value)
    previous_kind = "start"

    def regex_allowed() -> bool:
        return previous_kind in {
            "start",
            "(",
            "[",
            "{",
            "=",
            ":",
            ",",
            ";",
            "!",
            "&",
            "|",
            "?",
            "~",
            "^",
            ">",
            "word:return",
            "word:case",
            "word:throw",
            "word:else",
            "word:do",
            "word:typeof",
            "word:void",
            "word:delete",
            "word:yield",
            "word:await",
        }

    while index < length:
        char = value[index]
        if char in "'\"`":
            quote = char
            end = index + 1
            escaped = False
            while end < length:
                current = value[end]
                if escaped:
                    escaped = False
                elif current == "\\":
                    escaped = True
                elif current == quote:
                    end += 1
                    break
                end += 1
            literal = value[index:end]
            output.append(path_pattern.sub(prefix, literal))
            previous_kind = "string"
            index = end
            continue

        if char == "/" and index + 1 < length and value[index + 1] == "/":
            end = value.find("\n", index + 2)
            if end == -1:
                end = length
            output.append(value[index:end])
            index = end
            previous_kind = "comment"
            continue

        if char == "/" and index + 1 < length and value[index + 1] == "*":
            end = value.find("*/", index + 2)
            end = length if end == -1 else end + 2
            output.append(value[index:end])
            index = end
            previous_kind = "comment"
            continue

        if char == "/" and regex_allowed():
            end = index + 1
            in_class = False
            escaped = False
            while end < length:
                current = value[end]
                if escaped:
                    escaped = False
                elif current == "\\":
                    escaped = True
                elif current == "[":
                    in_class = True
                elif current == "]":
                    in_class = False
                elif current == "/" and not in_class:
                    end += 1
                    while end < length and value[end].isalpha():
                        end += 1
                    break
                elif current in "\r\n":
                    break
                end += 1
            output.append(value[index:end])
            index = end
            previous_kind = "regex"
            continue

        if char.isspace():
            output.append(char)
            index += 1
            continue

        if char.isalpha() or char in "_$":
            end = index + 1
            while end < length and (value[end].isalnum() or value[end] in "_$"):
                end += 1
            word = value[index:end]
            output.append(word)
            previous_kind = f"word:{word}" if word in {
                "return", "case", "throw", "else", "do", "typeof", "void", "delete", "yield", "await"
            } else "word"
            index = end
            continue

        output.append(char)
        previous_kind = char
        index += 1

    return "".join(output)


def _rewrite_css(value: str, prefix: str) -> str:
    path_pattern = _path_pattern(prefix)
    rewritten = re.sub(
        r"(\burl\(\s*)([\"']?)(/[^\"')\s]+)",
        lambda match: f"{match.group(1)}{match.group(2)}{path_pattern.sub(prefix, match.group(3))}",
        value,
        flags=re.IGNORECASE,
    )
    return re.sub(
        r"([\"'])(/[^\"']+)",
        lambda match: f"{match.group(1)}{path_pattern.sub(prefix, match.group(2))}",
        rewritten,
    )


def _rewrite_html(value: str, prefix: str) -> str:
    parts: list[str] = []
    cursor = 0
    block_pattern = re.compile(r"<(script|style)\b[^>]*>(.*?)</\1\s*>", re.IGNORECASE | re.DOTALL)
    path_pattern = _path_pattern(prefix)
    for match in block_pattern.finditer(value):
        outside = value[cursor : match.start()]
        outside = re.sub(
            r"([\"'])(/[^\"']+)",
            lambda item: f"{item.group(1)}{path_pattern.sub(prefix, item.group(2))}",
            outside,
        )
        parts.append(outside)
        block_type = match.group(1).lower()
        content = match.group(2)
        opening = match.group(0)[: match.start(2) - match.start()]
        # Script/style tags are matched as blocks, so their root-relative
        # attributes must be rewritten separately from their contents.
        opening = re.sub(
            r'(["\'])(/[^"\']+)',
            lambda item: f"{item.group(1)}{path_pattern.sub(prefix, item.group(2))}",
            opening,
        )
        parts.append(opening)
        parts.append(_rewrite_js(content, prefix) if block_type == "script" else _rewrite_css(content, prefix))
        parts.append(match.group(0)[match.end(2) - match.start() :])
        cursor = match.end()
    tail = value[cursor:]
    tail = re.sub(
        r"([\"'])(/[^\"']+)",
        lambda item: f"{item.group(1)}{path_pattern.sub(prefix, item.group(2))}",
        tail,
    )
    parts.append(tail)
    return "".join(parts)


def rewrite_root_urls(value: str, prefix: str, extension: str = "") -> str:
    """Prefix local root URLs without changing JavaScript regex literals."""

    if extension == ".js":
        return _rewrite_js(value, prefix)
    if extension == ".css":
        return _rewrite_css(value, prefix)
    if extension == ".html":
        return _rewrite_html(value, prefix)
    path_pattern = _path_pattern(prefix)
    return re.sub(
        r"([\"'`])(/[^\"'`]+)",
        lambda match: f"{match.group(1)}{path_pattern.sub(prefix, match.group(2))}",
        value,
    )


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
            target.write_text(rewrite_root_urls(text, prefix, item.suffix.lower()), encoding="utf-8")
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
