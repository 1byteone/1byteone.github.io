"""Mirror the public, first-party surface of matthewtrent.me.

The mirror is an offline inspection artifact, not a production replacement for
the original SvelteKit application. It keeps raw responses for audit work and
rewrites a second copy of HTML so same-origin assets resolve inside the mirror.
Third-party services and API endpoints are recorded but intentionally not
downloaded.
"""

from __future__ import annotations

import argparse
import json
import mimetypes
import posixpath
import re
import sys
from pathlib import Path
from urllib.parse import urljoin, urlparse, urlunparse
from urllib.request import Request, urlopen

from bs4 import BeautifulSoup


HOST = "matthewtrent.me"
BASE = f"https://{HOST}"
SKIP_PREFIXES = ("/api/", "/admin")
ASSET_EXTENSIONS = {
    ".css",
    ".js",
    ".mjs",
    ".json",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".avif",
    ".svg",
    ".ico",
    ".webmanifest",
    ".woff",
    ".woff2",
    ".ttf",
    ".otf",
    ".mp3",
    ".wav",
    ".mp4",
    ".webm",
    ".pdf",
    ".txt",
    ".xml",
}


def fetch(url: str) -> tuple[bytes, str, str]:
    req = Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; static-audit-mirror/1.0)",
            "Accept": "text/html,application/xhtml+xml,application/xml,image/avif,image/webp,*/*;q=0.8",
        },
    )
    with urlopen(req, timeout=45) as response:
        return response.read(), response.headers.get_content_type(), response.geturl()


def clean_url(raw: str, page_url: str) -> str | None:
    if not raw or raw.startswith(("#", "data:", "javascript:", "mailto:", "tel:", "blob:")):
        return None
    absolute = urljoin(page_url, raw)
    parsed = urlparse(absolute)
    if parsed.scheme not in {"http", "https"} or parsed.netloc.lower() not in {HOST, f"www.{HOST}"}:
        return None
    path = parsed.path or "/"
    if path.startswith(SKIP_PREFIXES):
        return None
    return urlunparse(("https", HOST, path, "", "", ""))


def page_file(root: Path, url: str, content_type: str) -> Path:
    path = urlparse(url).path or "/"
    if path == "/":
        return root / "index.html"
    if content_type == "application/pdf" or Path(path).suffix.lower() in ASSET_EXTENSIONS:
        return root / path.lstrip("/")
    return root / path.lstrip("/") / "index.html"


def local_href(root: Path, current_file: Path, target_url: str, content_type: str = "") -> str:
    target = page_file(root, target_url, content_type)
    return Path(posixpath.relpath(target.as_posix(), current_file.parent.as_posix())).as_posix()


def extract_urls(data: bytes, content_type: str, page_url: str) -> set[str]:
    text = data.decode("utf-8", "ignore")
    urls: set[str] = set()
    if "html" in content_type or page_url.endswith(("/", ".html")):
        soup = BeautifulSoup(text, "html.parser")
        for tag in soup.find_all(["a", "link", "script", "img", "source", "video", "audio", "iframe", "form"]):
            for attr in ("href", "src", "poster", "action"):
                value = tag.get(attr)
                cleaned = clean_url(value, page_url) if value else None
                if cleaned:
                    urls.add(cleaned)
            for value in tag.get("srcset", "").split(","):
                cleaned = clean_url(value.strip().split(" ")[0], page_url)
                if cleaned:
                    urls.add(cleaned)
    if "css" in content_type or page_url.endswith(".css"):
        for match in re.finditer(r"url\(\s*['\"]?([^'\")]+)", text, re.I):
            cleaned = clean_url(match.group(1), page_url)
            if cleaned:
                urls.add(cleaned)
    return urls


def rewrite_html(root: Path, html: bytes, source_url: str, current_file: Path, content_types: dict[str, str]) -> bytes:
    soup = BeautifulSoup(html, "html.parser")
    # Prevent a local mirror from attempting to post analytics or mutate the source site.
    for script in soup.find_all("script"):
        src = script.get("src", "")
        if (
            "/api/" in src
            or "analytics" in src
            or "cloudflareinsights.com" in src
            or src.endswith("evolution.js")
        ):
            script.decompose()
        elif script.string and "__sveltekit_" not in script.string and ("/api/analytics" in script.string or "visitorId" in script.string):
            script.decompose()
    for link in soup.find_all("link"):
        href = link.get("href", "")
        if "api.dicebear.com" in href or "cloudflareinsights.com" in href:
            link.decompose()
    for tag in soup.find_all(["a", "link", "script", "img", "source", "video", "audio", "iframe", "form"]):
        raw_values = [tag.get(attr, "") for attr in ("href", "src", "poster", "action")]
        if any(value.startswith("/api/") or value.startswith("/cdn-cgi/l/email-protection") for value in raw_values):
            tag.decompose()
            continue
        for attr in ("href", "src", "poster", "action"):
            value = tag.get(attr)
            cleaned = clean_url(value, source_url) if value else None
            if cleaned and cleaned in content_types:
                tag[attr] = local_href(root, current_file, cleaned, content_types[cleaned])
        if tag.get("srcset"):
            rewritten = []
            for item in tag["srcset"].split(","):
                bits = item.strip().split()
                cleaned = clean_url(bits[0], source_url)
                if cleaned and cleaned in content_types:
                    bits[0] = local_href(root, current_file, cleaned, content_types[cleaned])
                rewritten.append(" ".join(bits))
            tag["srcset"] = ", ".join(rewritten)
    base = soup.new_tag("base", href="./")
    if soup.head:
        soup.head.insert(0, base)
    return soup.encode(formatter="html5")


def load_seed_urls(map_file: Path | None) -> list[str]:
    paths = {
        "/",
        "/blog",
        "/resume",
        "/privacy",
        "/credits",
        "/llms.txt",
        "/rss.xml",
        "/site.webmanifest",
        "/robots.txt",
        "/sitemap.xml",
    }
    if map_file and map_file.exists():
        payload = json.loads(map_file.read_text(encoding="utf-8"))
        for item in payload.get("data", {}).get("links", []):
            raw = item.get("url") if isinstance(item, dict) else item
            if not raw:
                continue
            parsed = urlparse(raw)
            if parsed.netloc.lower().replace("www.", "") == HOST:
                paths.add(parsed.path or "/")
    return [f"{BASE}{path}" for path in sorted(paths)]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="clones/matthewtrent.me")
    parser.add_argument("--map", default=".firecrawl/matthewtrent-map.json")
    args = parser.parse_args()
    root = Path(args.output)
    root.mkdir(parents=True, exist_ok=True)
    queue = load_seed_urls(Path(args.map))
    seen: set[str] = set()
    blobs: dict[str, tuple[bytes, str]] = {}
    errors: list[dict[str, str]] = []

    while queue:
        url = queue.pop(0)
        if url in seen:
            continue
        seen.add(url)
        try:
            data, content_type, final_url = fetch(url)
        except Exception as exc:  # noqa: BLE001 - mirror should continue after one unavailable asset.
            errors.append({"url": url, "error": str(exc)})
            continue
        normalized = urlunparse(("https", HOST, urlparse(final_url).path or "/", "", "", ""))
        blobs[normalized] = (data, content_type)
        for discovered in extract_urls(data, content_type, normalized):
            if discovered not in seen and discovered not in queue:
                queue.append(discovered)
        print(f"{len(blobs):04d} {content_type:24s} {normalized}", flush=True)

    content_types = {url: ct for url, (_, ct) in blobs.items()}
    manifest = {
        "source": BASE,
        "capturedAt": __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat(),
        "pagesAndAssets": len(blobs),
        "routes": sorted(url for url, (_, content_type) in blobs.items() if "html" in content_type),
        "errors": errors,
        "thirdPartyReferences": [],
    }
    for url, (data, content_type) in blobs.items():
        target = page_file(root, url, content_type)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
        if "html" in content_type:
            target.write_bytes(rewrite_html(root, data, url, target, content_types))
    (root / "MIRROR_MANIFEST.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(json.dumps({"downloaded": len(blobs), "errors": len(errors), "root": str(root)}))
    return 0


if __name__ == "__main__":
    sys.exit(main())
