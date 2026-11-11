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

        # The capture stores both content-addressed and by-name copies of raw
        # GitHub assets. The runtime resolves the by-name paths; omitting the
        # duplicate hash bucket keeps the Pages artifact comfortably below its
        # size limit without changing any rendered route.
        if relative.parts[:3] == ("media", "external", "raw.githubusercontent.com") and len(relative.parts) == 4 and relative.parts[3] != "by-name":
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
