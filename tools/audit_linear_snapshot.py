"""Audit local references in the public Linear snapshot."""

from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse

from bs4 import BeautifulSoup


ROOT = Path("clones/linear.app")
SKIP = ("#", "data:", "blob:", "javascript:", "mailto:", "tel:")
URL_RE = re.compile(r"(?:href|src|poster|action)=[\"']([^\"']+)[\"']", re.I)
CSS_RE = re.compile(r"url\(\s*[\"']?([^\"')]+)", re.I)
IMPORT_RE = re.compile(r"(?:from\s*|import\s*\()\s*([\"'])(\.?\.?/[^\"']+\.(?:js|mjs|css))\1")


def is_external(value: str) -> bool:
    return value.startswith(("http://", "https://", "//"))


def resolve(source: Path, value: str) -> Path:
    return (source.parent / value.split("?", 1)[0].split("#", 1)[0]).resolve()


def main() -> int:
    files = [path for path in ROOT.rglob("*") if path.is_file()]
    known = {path.resolve() for path in files}
    missing: list[dict[str, str]] = []
    external = Counter()
    local_refs = 0
    html_count = css_count = js_count = 0

    for source in files:
        suffix = source.suffix.lower()
        if suffix not in {".html", ".css", ".js", ".mjs"}:
            continue
        text = source.read_text(encoding="utf-8", errors="ignore")
        values: list[str] = []
        if suffix == ".html":
            html_count += 1
            soup = BeautifulSoup(text, "html.parser")
            for tag in soup.find_all(True):
                for attr in ("href", "src", "poster", "action"):
                    if tag.get(attr):
                        values.append(tag[attr])
                if tag.get("srcset"):
                    values.extend(item.strip().split(" ", 1)[0] for item in tag["srcset"].split(","))
        elif suffix == ".css":
            css_count += 1
            values.extend(CSS_RE.findall(text))
        else:
            js_count += 1
            values.extend(match[1] for match in IMPORT_RE.findall(text))

        for value in values:
            if not value or value.startswith(SKIP):
                continue
            if value.startswith("%23"):
                # A Next/CSS source template token such as `%23a`, not a
                # browser request for a local asset.
                continue
            if value in {".", "./", "../"} or " " in value and not value.startswith(("./", "../")):
                continue
            if is_external(value):
                parsed = urlparse(value if not value.startswith("//") else f"https:{value}")
                external[parsed.netloc or "(protocol-relative)"] += 1
                continue
            if value.startswith("/"):
                # Root-relative paths in a static subdirectory are unresolved
                # by design; count them as external-like runtime references.
                external["root-relative-runtime"] += 1
                continue
            local_refs += 1
            target = resolve(source, value)
            if target not in known:
                missing.append({"source": str(source.relative_to(ROOT)), "reference": value})

    report = {
        "snapshot": str(ROOT),
        "files": len(files),
        "html": html_count,
        "css": css_count,
        "javascript": js_count,
        "localReferences": local_refs,
        "missingLocalReferences": len(missing),
        "missing": missing,
        "externalReferences": dict(external),
        "interpretation": {
            "localReferences": "References resolvable inside the snapshot directory.",
            "externalReferences": "Runtime/API/CDN references intentionally kept or unavailable offline.",
            "privateSource": "The snapshot contains browser-delivered public files, not Linear's private source repository.",
        },
    }
    target = ROOT / "LINEAR_SNAPSHOT_AUDIT.json"
    target.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({
        "files": len(files),
        "html": html_count,
        "css": css_count,
        "javascript": js_count,
        "localReferences": local_refs,
        "missingLocalReferences": len(missing),
        "externalReferences": dict(external),
        "report": str(target),
    }, ensure_ascii=False))
    return 0 if not missing else 1


if __name__ == "__main__":
    raise SystemExit(main())
