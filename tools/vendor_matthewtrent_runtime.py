"""Vendor the SvelteKit runtime assets exposed by the captured response headers."""

from __future__ import annotations

import json
import posixpath
import re
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen

from bs4 import BeautifulSoup


ROOT = Path("clones/matthewtrent.me")
BASE = "https://matthewtrent.me"
HEADERS = Path(".firecrawl/matthewtrent-headers.txt")
SOURCE_HTML = Path(".firecrawl/matthewtrent-live.html")
IMPORT_RE = re.compile(r"(?:import|from)\(\s*[\"']([^\"']+)[\"']\s*\)|\bfrom\s*[\"']([^\"']+)[\"']")


def local_path(path: str) -> Path:
    return ROOT / path.lstrip("/")


def first_party_path(raw: str, base: str = BASE + "/") -> str | None:
    absolute = urljoin(base, raw)
    parsed = urlparse(absolute)
    if parsed.netloc.lower() not in {"matthewtrent.me", "www.matthewtrent.me"}:
        return None
    path = parsed.path or "/"
    if not path.startswith("/_app/"):
        return None
    return path


def seed_paths() -> set[str]:
    paths: set[str] = set()
    if HEADERS.exists():
        text = HEADERS.read_text(encoding="utf-8", errors="ignore")
        for raw in re.findall(r"<([^>]+)>", text):
            path = first_party_path(raw)
            if path:
                paths.add(path)
    if SOURCE_HTML.exists():
        text = SOURCE_HTML.read_text(encoding="utf-8", errors="ignore")
        for match in IMPORT_RE.finditer(text):
            raw = match.group(1) or match.group(2)
            path = first_party_path(raw)
            if path:
                paths.add(path)
    return paths


def download(path: str) -> bytes | None:
    url = BASE + path
    request = Request(url, headers={"User-Agent": "Mozilla/5.0 (compatible; local-mirror/1.0)"})
    try:
        with urlopen(request, timeout=45) as response:
            data = response.read()
            target = local_path(path)
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(data)
            return data
    except Exception as exc:  # noqa: BLE001 - record an unavailable chunk and continue.
        failures.append({"path": path, "error": str(exc)})
        return None


def rewrite_inline_imports(paths: set[str]) -> int:
    changed = 0
    for page in ROOT.rglob("*.html"):
        if page.name.endswith(".source.html"):
            continue
        soup = BeautifulSoup(page.read_text(encoding="utf-8", errors="ignore"), "html.parser")
        page_changed = False
        for script in soup.find_all("script"):
            text = script.string
            if not text:
                continue

            def replace(match: re.Match[str]) -> str:
                raw = match.group(1) or match.group(2)
                path = first_party_path(raw, BASE + "/")
                if not path or path not in paths:
                    return match.group(0)
                target = local_path(path).resolve()
                relative = posixpath.relpath(target.as_posix(), page.parent.resolve().as_posix())
                replacement = relative.replace("\\", "/")
                if not replacement.startswith((".", "/")):
                    replacement = "./" + replacement
                quote = "'" if "'" in match.group(0) and '"' not in match.group(0) else '"'
                if match.group(1) is not None:
                    return f"import({quote}{replacement}{quote})"
                return f"from {quote}{replacement}{quote}"

            rewritten = IMPORT_RE.sub(replace, text)
            if rewritten != text:
                script.string = rewritten
                page_changed = True
        if page_changed:
            page.write_bytes(soup.encode(formatter="html5"))
            changed += 1
    return changed


failures: list[dict[str, str]] = []


def main() -> None:
    queue = list(seed_paths())
    seen: set[str] = set()
    downloaded: set[str] = set()
    while queue:
        path = queue.pop(0)
        if path in seen:
            continue
        seen.add(path)
        data = download(path)
        if data is None:
            continue
        downloaded.add(path)
        if path.endswith(".js"):
            text = data.decode("utf-8", "ignore")
            base = BASE + path
            for match in IMPORT_RE.finditer(text):
                raw = match.group(1) or match.group(2)
                child = first_party_path(raw, base)
                if child and child not in seen:
                    queue.append(child)
    changed = rewrite_inline_imports(downloaded)
    manifest = {
        "source": BASE,
        "seedAssets": len(seed_paths()),
        "downloadedAssets": len(downloaded),
        "htmlFilesRewritten": changed,
        "failures": failures,
    }
    (ROOT / "RUNTIME_MANIFEST.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(json.dumps(manifest))


if __name__ == "__main__":
    main()
