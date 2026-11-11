from __future__ import annotations

import json
from collections import Counter
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
UI_ROOT = ROOT / "assets/media/cyberpunk2077/ui"
REGION_REPORT = UI_ROOT / "regions/REGION_ANALYSIS.json"
MANIFEST = UI_ROOT / "components/COMPONENT_MANIFEST.json"
REPORT_JSON = UI_ROOT / "components/UI_ASSET_QA.json"
REPORT_MD = UI_ROOT / "components/UI_ASSET_QA.md"


def overlap_pairs(regions: list[dict]) -> list[dict]:
    pairs: list[dict] = []
    for index, left in enumerate(regions):
        lx0, ly0 = left["x"], left["y"]
        lx1, ly1 = lx0 + left["width"], ly0 + left["height"]
        for right in regions[index + 1 :]:
            rx0, ry0 = right["x"], right["y"]
            rx1, ry1 = rx0 + right["width"], ry0 + right["height"]
            width = max(0, min(lx1, rx1) - max(lx0, rx0))
            height = max(0, min(ly1, ry1) - max(ly0, ry0))
            if width and height:
                pairs.append({"left": left["id"], "right": right["id"], "pixels": width * height})
    return pairs


def main() -> None:
    discovery = json.loads(REGION_REPORT.read_text(encoding="utf-8"))
    components = json.loads(MANIFEST.read_text(encoding="utf-8"))

    missing: list[str] = []
    empty: list[str] = []
    for entry in components:
        asset = UI_ROOT / "components" / entry["asset"]
        if not asset.exists():
            missing.append(entry["asset"])
            continue
        with Image.open(asset) as image:
            if image.width == 0 or image.height == 0:
                empty.append(entry["asset"])

    discovery_summary = {
        record["atlas"]: {
            "candidate_boxes": record["candidate_box_count"],
            "bbox_overlaps": record["overlap_pair_count"],
            "spatial_clusters": record["overlap_cluster_count"],
        }
        for record in discovery
    }
    status_counts = Counter(entry["status"] for entry in components)
    atlas_counts = Counter(entry["atlas"] for entry in components)
    runtime_assets = [entry["asset"] for entry in components if entry["status"] == "runtime-used"]
    payload = {
        "discovery": discovery_summary,
        "candidate_box_total": sum(item["candidate_boxes"] for item in discovery_summary.values()),
        "reviewed_total": len(components),
        "reusable_total": len(components) - status_counts["reference-only"],
        "status_counts": dict(status_counts),
        "atlas_counts": dict(atlas_counts),
        "runtime_asset_count": len(runtime_assets),
        "runtime_assets": runtime_assets,
        "missing_assets": missing,
        "empty_assets": empty,
        "quality_gate": "passed" if not missing and not empty else "failed",
    }
    REPORT_JSON.write_text(json.dumps(payload, ensure_ascii=True, indent=2), encoding="utf-8")

    lines = [
        "# Cyberpunk UI asset QA",
        "",
        "This report separates automatic discovery from reviewed component delivery. Discovery regions are evidence for counting; reviewed components are the assets allowed into the UI runtime.",
        "",
        "## Count before crop",
        "",
        "| Atlas | Candidate boxes | Overlap pairs | Spatial clusters | Reviewed crops |",
        "| --- | ---: | ---: | ---: | ---: |",
    ]
    for atlas in ("icons", "vertical", "wide"):
        lines.append(
            f"| `{atlas}` | {discovery_summary[atlas]['candidate_boxes']} | {discovery_summary[atlas]['bbox_overlaps']} | {discovery_summary[atlas]['spatial_clusters']} | {atlas_counts[atlas]} |"
        )
    lines.extend(
        [
            "",
            f"**Candidate boxes total:** {payload['candidate_box_total']} candidate regions.  ",
            f"**Reviewed delivery:** {payload['reviewed_total']} named crops, of which {payload['reusable_total']} are reusable controls and {status_counts['reference-only']} remain reference-only composite panels.",
            "",
            "Candidate boxes are retained as diagnostic evidence. Intersecting boxes are grouped into spatial clusters and are not counted as independent controls. The component slicer uses reviewed source boxes, transparent trimming, and separate reference-only labels for composite panels.",
            "",
            "## Runtime proof",
            "",
            f"The theme references **{payload['runtime_asset_count']}** cropped components from `ui/components/` through `layouts/partials/themes/cyberpunk2077/head.html` and `static/css/cyberpunk2077.css`.",
            "",
            "| Check | Result |",
            "| --- | --- |",
            f"| Component files present | {'PASS' if not missing else 'FAIL'} |",
            f"| Component dimensions valid | {'PASS' if not empty else 'FAIL'} |",
            f"| Runtime asset set | {payload['runtime_asset_count']} reviewed crops |",
            "",
            "## Evidence files",
            "",
            "- `regions/region-crops-preview.png` — discovery map and candidate crop evidence.",
            "- `components/component-slicer-preview.png` — reviewed semantic component library.",
            "- `COMPONENT_MANIFEST.md` — exact source boxes, status, and intended use.",
            "- `UI_RUNTIME_ASSET_AUDIT.md` — selector-level runtime acceptance checks.",
        ]
    )
    REPORT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps({"quality_gate": payload["quality_gate"], "candidate_box_total": payload["candidate_box_total"], "reviewed_total": payload["reviewed_total"], "runtime_asset_count": payload["runtime_asset_count"], "report": str(REPORT_MD)}, ensure_ascii=True))


if __name__ == "__main__":
    main()
