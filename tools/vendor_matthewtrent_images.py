"""Download public image URLs referenced by the static Matthew Trent mirror.

Only image elements are vendored. Video/audio URLs, APIs, analytics, and normal
external links remain external and are reported in VENDORED_ASSETS.json.
"""

from __future__ import annotations

import hashlib
import json
import mimetypes
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import unquote, urlparse
from urllib.request import Request, urlopen

from bs4 import BeautifulSoup


ROOT = Path("clones/matthewtrent.me")
OUT = ROOT / "media" / "external"
HOSTS = {
    "raw.githubusercontent.com",
    "mosaic.scdn.co",
    "image-cdn-fa.spotifycdn.com",
    "image-cdn-ak.spotifycdn.com",
    "api.dicebear.com",
    "github.com",
}
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif", ".svg"}
SKIP_EXTENSIONS = {".mp4", ".mov", ".webm", ".mp3", ".wav"}


def iter_image_urls() -> list[str]:
    urls: set[str] = set()
    for page in ROOT.rglob("*.html"):
        if page.name.endswith(".source.html"):
            continue
        soup = BeautifulSoup(page.read_text(encoding="utf-8", errors="ignore"), "html.parser")
        for tag in soup.find_all(["img", "source", "video"]):
            for attr in ("src", "poster", "srcset"):
                value = tag.get(attr)
                if not value:
                    continue
                candidates = value.split(",") if attr == "srcset" else [value]
                for candidate in candidates:
                    raw = candidate.strip().split(" ")[0]
                    parsed = urlparse(raw)
                    ext = Path(parsed.path).suffix.lower()
                    if parsed.netloc.lower() in HOSTS and ext not in SKIP_EXTENSIONS:
                        urls.add(raw)
        for tag in soup.find_all("meta"):
            value = tag.get("content", "")
            if not value.startswith(("http://", "https://")):
                continue
            parsed = urlparse(value)
            ext = Path(parsed.path).suffix.lower()
            is_image_meta = tag.get("property", "").lower() in {"og:image", "og:image:url"} or tag.get("name", "").lower() == "twitter:image"
            if is_image_meta and parsed.netloc.lower() in HOSTS and ext not in SKIP_EXTENSIONS:
                urls.add(value)
    return sorted(urls)


def extension_for(url: str, content_type: str) -> str:
    ext = Path(urlparse(url).path).suffix.lower()
    if ext in IMAGE_EXTENSIONS:
        return ext
    guessed = mimetypes.guess_extension(content_type.split(";", 1)[0].strip())
    return ".svg" if "svg" in content_type else (guessed or ".jpg")


def download(url: str) -> dict[str, object]:
    parsed = urlparse(url)
    host_dir = re.sub(r"[^a-z0-9.-]+", "-", parsed.netloc.lower())
    digest = hashlib.sha1(url.encode("utf-8")).hexdigest()[:12]
    try:
        request = Request(url, headers={"User-Agent": "Mozilla/5.0 (compatible; local-mirror/1.0)"})
        with urlopen(request, timeout=45) as response:
            data = response.read()
            content_type = response.headers.get("Content-Type", "application/octet-stream")
        ext = extension_for(url, content_type)
        name = unquote(Path(parsed.path).name) or "asset"
        name = re.sub(r"[^A-Za-z0-9._-]+", "-", name)
        if not Path(name).suffix:
            name += ext
        target = OUT / host_dir / f"{digest}-{name}"
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
        return {"url": url, "local": target.relative_to(ROOT).as_posix(), "bytes": len(data), "contentType": content_type}
    except Exception as exc:  # noqa: BLE001 - preserve failed URLs in the manifest.
        return {"url": url, "error": str(exc)}


def rewrite(mapping: dict[str, str]) -> int:
    changed = 0
    for page in ROOT.rglob("*.html"):
        if page.name.endswith(".source.html"):
            continue
        soup = BeautifulSoup(page.read_text(encoding="utf-8", errors="ignore"), "html.parser")
        page_changed = False
        for tag in soup.find_all(["img", "source", "video"]):
            for attr in ("src", "poster", "srcset"):
                value = tag.get(attr)
                if not value:
                    continue
                candidates = value.split(",") if attr == "srcset" else [value]
                rewritten: list[str] = []
                for candidate in candidates:
                    bits = candidate.strip().split()
                    raw = bits[0]
                    if raw in mapping:
                        local = (ROOT / mapping[raw]).resolve()
                        bits[0] = Path(__import__("posixpath").relpath(local.as_posix(), page.parent.resolve().as_posix())).as_posix()
                        page_changed = True
                    rewritten.append(" ".join(bits))
                tag[attr] = ", ".join(rewritten) if attr == "srcset" else rewritten[0]
        for tag in soup.find_all("meta"):
            value = tag.get("content", "")
            if value in mapping:
                local = (ROOT / mapping[value]).resolve()
                tag["content"] = Path(__import__("posixpath").relpath(local.as_posix(), page.parent.resolve().as_posix())).as_posix()
                page_changed = True
            elif tag.get("property", "").lower() in {"og:image", "og:image:url"} or tag.get("name", "").lower() == "twitter:image":
                parsed = urlparse(value)
                if parsed.netloc.lower() in {"matthewtrent.me", "www.matthewtrent.me"}:
                    local = (ROOT / parsed.path.lstrip("/")).resolve()
                    if local.exists():
                        tag["content"] = Path(__import__("posixpath").relpath(local.as_posix(), page.parent.resolve().as_posix())).as_posix()
                        page_changed = True
        for tag in list(soup.find_all("script")):
            src = tag.get("src", "")
            if "cloudflareinsights.com" in src or "evolution.js" in src:
                tag.decompose()
                page_changed = True
        for tag in list(soup.find_all("link")):
            href = tag.get("href", "")
            if "api.dicebear.com" in href or "cloudflareinsights.com" in href:
                tag.decompose()
                page_changed = True
        if page_changed:
            page.write_bytes(soup.encode(formatter="html5"))
            changed += 1
    return changed


def main() -> None:
    urls = iter_image_urls()
    manifest_path = ROOT / "VENDORED_ASSETS.json"
    existing_results: list[dict[str, object]] = []
    if manifest_path.exists():
        try:
            existing_results = json.loads(manifest_path.read_text(encoding="utf-8")).get("results", [])
        except json.JSONDecodeError:
            existing_results = []
    existing_mapping = {str(item["url"]): str(item["local"]) for item in existing_results if "local" in item}
    results: list[dict[str, object]] = list(existing_results)
    pending = [url for url in urls if url not in existing_mapping]
    with ThreadPoolExecutor(max_workers=6) as pool:
        futures = {pool.submit(download, url): url for url in pending}
        for future in as_completed(futures):
            result = future.result()
            results.append(result)
            print(result, flush=True)
    mapping = {str(item["url"]): str(item["local"]) for item in results if "local" in item}
    changed = rewrite(mapping)
    manifest = {
        "source": "https://matthewtrent.me/",
        "imageUrlsFound": len(set(urls) | set(existing_mapping)),
        "imagesVendored": len(mapping),
        "htmlFilesRewritten": changed,
        "results": sorted(results, key=lambda item: str(item["url"])),
        "notVendored": [
            "video and audio media",
            "analytics and API responses",
            "live visitor cursors/presence",
            "Spotify playback and MattGPT interactions",
        ],
    }
    (ROOT / "VENDORED_ASSETS.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(json.dumps({"found": len(urls), "vendored": len(mapping), "rewritten": changed}))


if __name__ == "__main__":
    main()
