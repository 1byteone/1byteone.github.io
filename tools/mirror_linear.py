"""Create an offline research snapshot of Linear's public homepage.

This downloads the publicly delivered page and first-party static dependencies
used by ``https://linear.app/homepage``. It is a static research snapshot:
authenticated APIs, telemetry, and server actions are intentionally excluded.
The output keeps the original host in the path for static.linear.app and
webassets.linear.app so references cannot collide.
"""

from __future__ import annotations

import argparse
import concurrent.futures
import hashlib
import json
import mimetypes
import posixpath
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlparse, urlunparse
from urllib.request import Request, urlopen

from bs4 import BeautifulSoup


ALLOWED_HOSTS = {"linear.app", "static.linear.app", "webassets.linear.app"}
SEED = "https://linear.app/homepage"
SKIP_PATHS = ("/api/", "/cdn-cgi/", "/_vercel/", "/analytics")
ASSET_EXTENSIONS = {
    ".css", ".js", ".mjs", ".json", ".map", ".png", ".jpg", ".jpeg",
    ".gif", ".webp", ".avif", ".svg", ".ico", ".woff", ".woff2", ".ttf",
    ".otf", ".mp4", ".webm", ".mov", ".wasm", ".txt", ".xml",
}
JS_IMPORT_RE = re.compile(r"(?:from\s*|import\s*\()\s*[\"'](\.?\.?/[^\"']+\.(?:js|mjs))[\"']")


def clean_url(raw: str, page_url: str) -> str | None:
    if not raw or raw.startswith(("#", "data:", "blob:", "javascript:", "mailto:", "tel:")):
        return None
    try:
        absolute = urljoin(page_url, raw)
        parsed = urlparse(absolute)
    except ValueError:
        # Minified bundles contain template placeholders that look URL-like.
        return None
    host = parsed.netloc.lower().split(":", 1)[0]
    if parsed.scheme not in {"http", "https"} or host not in ALLOWED_HOSTS:
        return None
    path = parsed.path or "/"
    if path.startswith(SKIP_PATHS):
        return None
    return urlunparse(("https", host, path, "", parsed.query, ""))


def is_html(url: str, content_type: str) -> bool:
    return "html" in content_type or not Path(urlparse(url).path).suffix


def local_file(root: Path, url: str, content_type: str = "") -> Path:
    parsed = urlparse(url)
    path = parsed.path or "/"
    # Keep CDN host namespaces distinct while preserving root-relative links.
    prefix = Path() if parsed.netloc == "linear.app" else Path(parsed.netloc)
    if path == "/":
        return root / prefix / "index.html"
    if is_html(url, content_type) and not Path(path).suffix:
        return root / prefix / path.lstrip("/") / "index.html"
    target = root / prefix / path.lstrip("/")
    # Image/video transforms use query parameters (width, DPR, format). Keep
    # variants separate so one responsive asset cannot overwrite another.
    if parsed.query and target.suffix:
        digest = hashlib.sha1(parsed.query.encode("utf-8")).hexdigest()[:10]
        target = target.with_name(f"{target.stem}__q-{digest}{target.suffix}")
    return target


def fetch(url: str) -> tuple[str, bytes, str]:
    req = Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; offline-research-mirror/1.0)",
            "Accept": "text/html,application/xhtml+xml,application/javascript,text/css,image/avif,image/webp,*/*;q=0.8",
        },
    )
    with urlopen(req, timeout=15) as response:
        return url, response.read(), response.headers.get_content_type()


def extract_urls(data: bytes, content_type: str, page_url: str) -> set[str]:
    text = data.decode("utf-8", "ignore")
    found: set[str] = set()
    if "html" in content_type:
        soup = BeautifulSoup(text, "html.parser")
        # Collect only the seed document's asset graph. Navigation links are
        # intentionally not crawled here; crawling every marketing route turns
        # a homepage snapshot into an unbounded whole-site crawler.
        tags = soup.find_all(["link", "script", "img", "source", "video", "audio", "iframe"])
        for tag in tags:
            for attr in ("href", "src", "poster", "action"):
                target = clean_url(tag.get(attr, ""), page_url)
                if target:
                    found.add(target)
            for item in tag.get("srcset", "").split(","):
                target = clean_url(item.strip().split(" ", 1)[0], page_url)
                if target:
                    found.add(target)
    if "css" in content_type or page_url.endswith(".css"):
        for match in re.finditer(r"url\(\s*['\"]?([^'\")]+)", text, re.I):
            target = clean_url(match.group(1), page_url)
            if target:
                found.add(target)
    if "javascript" in content_type or page_url.endswith((".js", ".mjs")):
        # Next's split chunks import sibling chunks with relative module
        # specifiers. Following these imports closes the public bundle graph
        # without crawling arbitrary navigation URLs or API endpoints.
        for raw in JS_IMPORT_RE.findall(text):
            target = clean_url(raw, page_url)
            if target:
                found.add(target)
    # Next.js manifests and route chunks often contain URLs as strings.
    # Do not recursively parse minified JavaScript. The document's module
    # preload/link tags are the authoritative public bundle graph and parsing
    # arbitrary strings would enqueue route placeholders and API endpoints.
    return found


def rewrite_text(root: Path, data: bytes, source_url: str, current: Path, content_types: dict[str, str]) -> bytes:
    text = data.decode("utf-8", "ignore")

    def replace(value: str) -> str:
        target = clean_url(value, source_url)
        if not target or target not in content_types:
            return value
        return Path(posixpath.relpath(local_file(root, target, content_types[target]).as_posix(), current.parent.as_posix())).as_posix()

    if "html" in content_types.get(source_url, ""):
        soup = BeautifulSoup(text, "html.parser")
        for tag in soup.find_all(["a", "link", "script", "img", "source", "video", "audio", "iframe"]):
            for attr in ("href", "src", "poster"):
                if tag.get(attr):
                    tag[attr] = replace(tag[attr])
            if tag.get("srcset"):
                items = []
                for item in tag["srcset"].split(","):
                    bits = item.strip().split()
                    if bits:
                        bits[0] = replace(bits[0])
                    items.append(" ".join(bits))
                tag["srcset"] = ", ".join(items)
        # A base tag makes route-relative navigation work from /homepage/.
        if soup.head and not soup.head.find("base"):
            base = soup.new_tag("base", href="./")
            soup.head.insert(0, base)
        return soup.encode(formatter="html5")
    # Rewrite CSS url() and JS string references without touching application code.
    return re.sub(r"(?P<prefix>url\(\s*['\"]?)(?P<url>[^'\")]+)", lambda m: m.group("prefix") + replace(m.group("url")), text).encode("utf-8")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="clones/linear.app")
    parser.add_argument("--seed", default=SEED)
    parser.add_argument("--workers", type=int, default=12)
    args = parser.parse_args()
    root = Path(args.output)
    root.mkdir(parents=True, exist_ok=True)
    seed = clean_url(args.seed, SEED)
    if not seed:
        raise SystemExit("seed must be a public linear.app URL")

    queue = [seed]
    seen: set[str] = set()
    blobs: dict[str, tuple[bytes, str]] = {}
    errors: list[dict[str, str]] = []

    while queue:
        batch = [u for u in queue if u not in seen][: args.workers * 2]
        if not batch:
            break
        seen.update(batch)
        with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
            futures = {pool.submit(fetch, u): u for u in batch}
            for future in concurrent.futures.as_completed(futures):
                url = futures[future]
                try:
                    fetched, data, content_type = future.result()
                except Exception as exc:  # noqa: BLE001 - preserve a complete error report.
                    errors.append({"url": url, "error": str(exc)})
                    continue
                normalized = urlunparse(("https", urlparse(fetched).netloc.lower(), urlparse(fetched).path or "/", "", urlparse(fetched).query, ""))
                blobs[normalized] = (data, content_type)
                print(f"downloaded {len(blobs):04d} {content_type:28s} {normalized}", flush=True)
                for discovered in extract_urls(data, content_type, normalized):
                    if discovered not in seen and discovered not in queue:
                        queue.append(discovered)

    content_types = {url: ct for url, (_, ct) in blobs.items()}
    for url, (data, content_type) in blobs.items():
        target = local_file(root, url, content_type)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(rewrite_text(root, data, url, target, content_types) if ("html" in content_type or "css" in content_type) else data)
    # Make /index.html a deterministic entry point as well as /homepage/.
    home = local_file(root, seed, content_types.get(seed, "text/html"))
    if home.exists():
        # Keep a root entry point in sync with /homepage/. The homepage file is
        # one directory deeper, so its relative CDN paths need one `../`
        # removed when copied to the snapshot root.
        root_html = home.read_text(encoding="utf-8", errors="ignore")
        for prefix in ("static.linear.app", "webassets.linear.app", "static"):
            root_html = root_html.replace(f"../{prefix}", prefix)
        root_html = root_html.replace("../favicon", "favicon").replace("../index.html", "index.html")
        (root / "index.html").write_text(root_html, encoding="utf-8")

    manifest = {
        "source": seed,
        "capturedAt": datetime.now(timezone.utc).isoformat(),
        "downloaded": len(blobs),
        "errors": errors,
        "routes": sorted(url for url, ct in content_types.items() if "html" in ct),
        "hosts": sorted({urlparse(url).netloc for url in blobs}),
        "offlineLimitations": [
            "Authenticated/API/server actions are not included.",
            "Cloudflare /cdn-cgi/ media is excluded when robots or access controls reject it.",
            "The snapshot contains delivered public assets, not Linear's private source repository.",
        ],
    }
    (root / "MIRROR_MANIFEST.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps({"downloaded": len(blobs), "errors": len(errors), "root": str(root)}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
