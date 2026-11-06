#!/usr/bin/env python3
"""Move repeated theme-preview media references back to the root Pages assets.

Each Hugo preview is rendered into public/themes/<id>/ with its own baseURL,
which otherwise copies the complete 100+ MB media tree for every preview. The
root build already contains the same media tree, so rewrite only the generated
preview references and remove the duplicate directories before uploading the
Pages artifact.
"""

from __future__ import annotations

import sys
from pathlib import Path


TEXT_SUFFIXES = {".html", ".css", ".js", ".json", ".xml", ".txt", ".map"}


def main() -> int:
    root = Path(sys.argv[1] if len(sys.argv) > 1 else "public")
    themes = root / "themes"
    if not themes.is_dir():
        print(f"skip: {themes} does not exist")
        return 0

    media_dirs = sorted(
        (path for path in themes.rglob("media") if path.is_dir()),
        key=lambda path: len(path.parts),
        reverse=True,
    )
    if not media_dirs:
        print("skip: no preview media directories found")
        return 0

    rewrites = 0
    removed_bytes = 0
    prefixes = []
    for media_dir in media_dirs:
        relative = media_dir.relative_to(root).as_posix()
        prefixes.append(f"/{relative}/")
        removed_bytes += sum(item.stat().st_size for item in media_dir.rglob("*") if item.is_file())

    for file_path in themes.rglob("*"):
        if not file_path.is_file() or file_path.suffix.lower() not in TEXT_SUFFIXES:
            continue
        if any(media_dir in file_path.parents for media_dir in media_dirs):
            continue
        original = file_path.read_bytes()
        updated = original
        for prefix in prefixes:
            updated = updated.replace(prefix.encode(), b"/media/")
            updated = updated.replace(prefix.lstrip("/").encode(), b"media/")
        if updated != original:
            file_path.write_bytes(updated)
            rewrites += 1

    for media_dir in media_dirs:
        for item in sorted(media_dir.rglob("*"), reverse=True):
            if item.is_file() or item.is_symlink():
                item.unlink()
            elif item.is_dir():
                item.rmdir()
        media_dir.rmdir()

    print(f"deduplicated {len(media_dirs)} preview media trees; rewrote {rewrites} files; removed {removed_bytes} bytes")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
