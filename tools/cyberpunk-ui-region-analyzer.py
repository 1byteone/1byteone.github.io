from __future__ import annotations

import json
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = ROOT / "assets/media/cyberpunk2077/ui/source"
OUTPUT_ROOT = ROOT / "assets/media/cyberpunk2077/ui/regions"
REPORT_JSON = OUTPUT_ROOT / "REGION_ANALYSIS.json"
REPORT_MD = OUTPUT_ROOT / "REGION_ANALYSIS.md"

ATLAS = {
    "icons": {
        "source": "icons-symbol-sheet.png",
        "background": "light",
        "min_area": 700,
        "min_width": 10,
        "min_height": 10,
        "close": 21,
        "dilate": 9,
    },
    "vertical": {
        "source": "hud-vertical-sheet.png",
        "background": "dark",
        "min_area": 180,
        "min_width": 8,
        "min_height": 8,
        "close": 17,
        "dilate": 7,
    },
    "wide": {
        "source": "hud-wide-sheet.png",
        "background": "dark",
        "min_area": 500,
        "min_width": 12,
        "min_height": 12,
        "close": 17,
        "dilate": 7,
    },
}


def load_font(size: int):
    for path in (Path("C:/Windows/Fonts/consola.ttf"), Path("C:/Windows/Fonts/arial.ttf")):
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


def foreground_mask(rgb: np.ndarray, kind: str) -> np.ndarray:
    if kind == "light":
        # Icons are dark/yellow ink on a warm near-white sheet.
        distance = np.abs(rgb.astype(np.int16) - np.array([244, 245, 240], dtype=np.int16)).sum(axis=2)
        mask = (distance > 28).astype(np.uint8)
    else:
        # HUD sheets are near-black with cyan, yellow and red ink.
        max_channel = rgb.max(axis=2)
        spread = rgb.max(axis=2).astype(np.int16) - rgb.min(axis=2).astype(np.int16)
        mask = ((max_channel > 48) & ((spread > 18) | (max_channel > 120))).astype(np.uint8)
    return mask


def detect_regions(rgb: np.ndarray, config: dict) -> tuple[np.ndarray, list[dict]]:
    mask = foreground_mask(rgb, config["background"])
    close_kernel = np.ones((config["close"], config["close"]), np.uint8)
    dilate_kernel = np.ones((config["dilate"], config["dilate"]), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, close_kernel, iterations=1)
    mask = cv2.dilate(mask, dilate_kernel, iterations=1)
    count, labels, stats, _ = cv2.connectedComponentsWithStats(mask, 8)
    regions: list[dict] = []
    height, width = mask.shape
    for component_id in range(1, count):
        x, y, w, h, area = [int(value) for value in stats[component_id]]
        if area < config["min_area"] or w < config["min_width"] or h < config["min_height"]:
            continue
        if x <= 1 or y <= 1 or x + w >= width - 1 or y + h >= height - 1:
            continue
        regions.append({"x": x, "y": y, "width": w, "height": h, "mask_area": area})
    regions.sort(key=lambda item: (item["y"], item["x"]))
    # Overlapping bounding boxes are connected as one ambiguity cluster. The
    # detector still reports every candidate box for inspection, but the
    # cluster count is the honest upper bound for spatially distinct areas.
    parent = list(range(len(regions)))

    def find(index: int) -> int:
        while parent[index] != index:
            parent[index] = parent[parent[index]]
            index = parent[index]
        return index

    def union(left: int, right: int) -> None:
        parent[find(right)] = find(left)

    overlap_pairs = []
    for left_index, left in enumerate(regions):
        lx1, ly1 = left["x"] + left["width"], left["y"] + left["height"]
        for right_index in range(left_index + 1, len(regions)):
            right = regions[right_index]
            width = min(lx1, right["x"] + right["width"]) - max(left["x"], right["x"])
            height = min(ly1, right["y"] + right["height"]) - max(left["y"], right["y"])
            if width > 0 and height > 0:
                overlap_pairs.append({"left": left_index, "right": right_index, "pixels": width * height})
                union(left_index, right_index)

    cluster_ids: dict[int, str] = {}
    for index, region in enumerate(regions, 1):
        region["id"] = f"region-{index:03d}"
        region["status"] = "candidate"
        root = find(index - 1)
        cluster_ids.setdefault(root, f"cluster-{len(cluster_ids) + 1:03d}")
        region["overlap_cluster"] = cluster_ids[root]
    cluster_sizes: dict[str, int] = {}
    for region in regions:
        cluster_sizes[region["overlap_cluster"]] = cluster_sizes.get(region["overlap_cluster"], 0) + 1
    for region in regions:
        region["overlap_cluster_size"] = cluster_sizes[region["overlap_cluster"]]
    # Keep diagnostics alongside regions for report generation.
    for region in regions:
        region["_overlap_pairs"] = overlap_pairs if region is regions[0] else []
    return mask, regions


def crop_regions(source: Image.Image, mask: np.ndarray, regions: list[dict], atlas: str) -> None:
    destination = OUTPUT_ROOT / atlas
    destination.mkdir(parents=True, exist_ok=True)
    source_rgba = source.convert("RGBA")
    for region in regions:
        x, y = region["x"], region["y"]
        w, h = region["width"], region["height"]
        padding = 6
        left, top = max(0, x - padding), max(0, y - padding)
        right, bottom = min(source.width, x + w + padding), min(source.height, y + h + padding)
        cropped = source_rgba.crop((left, top, right, bottom))
        cropped.save(destination / f"{region['id']}.png", optimize=True)
        region["atlas"] = atlas
        region["asset"] = f"{atlas}/{region['id']}.png"


def build_map(rgb: np.ndarray, regions: list[dict], atlas: str) -> Path:
    image = Image.fromarray(rgb).convert("RGB")
    draw = ImageDraw.Draw(image)
    font = load_font(max(12, min(22, image.width // 100)))
    for region in regions:
        x, y, w, h = region["x"], region["y"], region["width"], region["height"]
        draw.rectangle((x, y, x + w, y + h), outline="#ff3b56", width=max(2, image.width // 1000))
        draw.rectangle((x, y, x + min(120, w), y + 22), fill="#0b0d12")
        draw.text((x + 4, y + 3), region["id"], fill="#e6ff00", font=font)
    path = OUTPUT_ROOT / f"{atlas}-regions.png"
    image.save(path, optimize=True)
    return path


def build_preview(records: list[dict]) -> Path:
    entries = [entry for record in records for entry in record["regions"]]
    tile_w, tile_h, columns = 220, 150, 5
    rows = (len(entries) + columns - 1) // columns
    canvas = Image.new("RGB", (tile_w * columns, tile_h * rows), "#0b0d12")
    draw = ImageDraw.Draw(canvas)
    title_font, meta_font = load_font(11), load_font(9)
    for index, entry in enumerate(entries):
        image = Image.open(OUTPUT_ROOT / entry["asset"]).convert("RGBA")
        image.thumbnail((tile_w - 16, tile_h - 42))
        x, y = (index % columns) * tile_w, (index // columns) * tile_h
        canvas.paste(image, (x + (tile_w - image.width) // 2, y + 22), image)
        draw.rectangle((x, y, x + tile_w - 1, y + tile_h - 1), outline="#343943", width=2)
        draw.text((x + 6, y + 5), f"{entry['atlas']} / {entry['id']}", fill="#e6ff00", font=title_font)
        draw.text((x + 6, y + tile_h - 16), f"{entry['width']}x{entry['height']}", fill="#56d8cf", font=meta_font)
    path = OUTPUT_ROOT / "region-crops-preview.png"
    canvas.save(path, optimize=True)
    return path


def main() -> None:
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
    records: list[dict] = []
    for atlas, config in ATLAS.items():
        source_path = SOURCE_ROOT / config["source"]
        with Image.open(source_path) as source:
            rgb = np.array(source.convert("RGB"))
            mask, regions = detect_regions(rgb, config)
            crop_regions(source, mask, regions, atlas)
        map_path = build_map(rgb, regions, atlas)
        overlap_pairs = regions[0].pop("_overlap_pairs", []) if regions else []
        records.append({
            "atlas": atlas,
            "source": config["source"],
            "width": int(rgb.shape[1]),
            "height": int(rgb.shape[0]),
            "candidate_box_count": len(regions),
            "overlap_pair_count": len(overlap_pairs),
            "overlap_cluster_count": len({region["overlap_cluster"] for region in regions}),
            "overlap_pairs": overlap_pairs,
            "map": map_path.name,
            "regions": regions,
        })
    REPORT_JSON.write_text(json.dumps(records, ensure_ascii=True, indent=2), encoding="utf-8")
    lines = [
        "# Cyberpunk UI region candidate analysis",
        "",
        "This detector produces candidate bounding boxes, not guaranteed independent UI components. Intersecting boxes are grouped into overlap clusters and require manual review before a crop is called reusable.",
        "",
        "| Atlas | Source | Size | Candidate boxes | Overlap pairs | Spatial clusters | Map |",
        "| --- | --- | --- | ---: | --- |",
    ]
    for record in records:
        lines.append(f"| `{record['atlas']}` | `{record['source']}` | `{record['width']}x{record['height']}` | **{record['candidate_box_count']}** | {record['overlap_pair_count']} | {record['overlap_cluster_count']} | `{record['map']}` |")
    lines += ["", "## Region records", "", "Each crop lives under `ui/regions/<atlas>/region-###.png`. Boxes in one overlap cluster are not counted as independent regions.", ""]
    for record in records:
        lines += [f"### {record['atlas']} ({record['candidate_box_count']} candidate boxes, {record['overlap_cluster_count']} spatial clusters)", "", "| ID | Cluster | Bbox | Mask area | Crop |", "| --- | --- | --- | ---: | --- |"]
        for region in record["regions"]:
            lines.append(f"| `{region['id']}` | `{region['overlap_cluster']}` ({region['overlap_cluster_size']} boxes) | `x={region['x']}, y={region['y']}, w={region['width']}, h={region['height']}` | {region['mask_area']} | `{region['asset']}` |")
        lines.append("")
    REPORT_MD.write_text("\n".join(lines), encoding="utf-8")
    preview = build_preview(records)
    print(json.dumps({"candidate_boxes": {r["atlas"]: r["candidate_box_count"] for r in records}, "overlap_clusters": {r["atlas"]: r["overlap_cluster_count"] for r in records}, "report": str(REPORT_MD), "preview": str(preview)}, ensure_ascii=True))


if __name__ == "__main__":
    main()
