#!/usr/bin/env python3
"""Prefix root-relative Termfolio links for a GitHub Pages sub-path."""

from __future__ import annotations

import os
import re
from pathlib import Path


base_path = os.environ.get("TERMFOLIO_BASE_PATH", "").rstrip("/")
output_dir = Path("out")
if not base_path or not output_dir.is_dir():
    raise SystemExit(0)

# Only rewrite public asset strings. Rewriting every slash in a JavaScript
# bundle corrupts regular-expression literals such as /https?:\\/\\//.
pattern = re.compile(
    r"(?P<lead>[\"'`])/(?P<path>(?:images/|noise\.png(?:[?#][^\"'`]*)?|engineer-terminal-avatar\.png(?:[?#][^\"'`]*)?|placeholder[^\"'`]*|cv\.pdf(?:[?#][^\"'`]*)?))"
)

for file_path in output_dir.rglob("*"):
    if not file_path.is_file() or file_path.suffix.lower() not in {".html", ".txt", ".js", ".css", ".json", ".xml"}:
        continue
    try:
        source = file_path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        continue
    rewritten = pattern.sub(lambda match: f"{match.group('lead')}{base_path}/{match.group('path')}", source)
    if rewritten != source:
        file_path.write_text(rewritten, encoding="utf-8")
