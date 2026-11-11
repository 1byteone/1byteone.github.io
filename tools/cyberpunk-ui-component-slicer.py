from __future__ import annotations

import json
from pathlib import Path
from typing import Iterable

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = ROOT / "assets/media/cyberpunk2077/ui/source"
OUTPUT_ROOT = ROOT / "assets/media/cyberpunk2077/ui/components"
PREVIEW_PATH = OUTPUT_ROOT / "component-slicer-preview.png"
MANIFEST_PATH = OUTPUT_ROOT / "COMPONENT_MANIFEST.json"
MANIFEST_MD_PATH = OUTPUT_ROOT / "COMPONENT_MANIFEST.md"

RUNTIME_USED = {
    "icons/arrow-yellow.png",
    "icons/status-square.png",
    "vertical/arrow-grid-01.png",
    "vertical/arrow-grid-05.png",
    "vertical/arrow-grid-09.png",
    "vertical/ring-03.png",
    "vertical/rail-01.png",
    "vertical/rail-03.png",
    "wide/loading-stripe.png",
    "wide/large-data-frame-01.png",
    "wide/small-card-frame-01.png",
    "icons/crosshair.png",
}

REFERENCE_ONLY = {
    "icons/code-block.png",
    "icons/corner-frame-top.png",
    "icons/heart-frame.png",
    "icons/dot-frame.png",
    "icons/chevron-strip.png",
    "icons/framed-slash-strip.png",
    "icons/checker-strip.png",
    "icons/multi-chevron.png",
    "wide/left-system-panel.png",
    "wide/center-chart-panel.png",
    "wide/warning-card.png",
    "wide/chart-area.png",
    "wide/radial-readout-01.png",
    "wide/radial-readout-02.png",
    "wide/radial-readout-03.png",
}


def box(x: int, y: int, width: int, height: int) -> tuple[int, int, int, int]:
    return (x, y, x + width, y + height)


def icon_components() -> Iterable[tuple[str, tuple[int, int, int, int], str, str | None]]:
    """Explicit visual boxes for the staggered white icon atlas.

    The source is not a regular grid: several symbols sit above or below
    their neighbours. Explicit boxes prevent the old row-start heuristic from
    pulling adjacent symbols into the same exported component.
    """
    items = [
        ("arrow-down-right", box(78, 60, 152, 154), "navigation marker or back affordance", None),
        ("arrow-down-left", box(240, 60, 148, 154), "navigation marker or back affordance", None),
        ("bars-left", box(388, 60, 76, 125), "section ornament", None),
        ("code-block", box(458, 60, 410, 128), "technical section ornament", None),
        ("bars-right", box(868, 60, 72, 125), "section ornament", None),
        ("corner-frame-top", box(938, 58, 164, 94), "focus frame ornament", None),
        ("crosshair", box(1110, 58, 122, 94), "system focus marker", None),
        ("square-grid", box(1228, 58, 122, 100), "system index marker", None),
        ("tall-bars", box(1360, 58, 126, 282), "data density marker", None),
        ("diamond-matrix", box(1475, 88, 164, 250), "signal status marker", None),
        ("chevron-top", box(1637, 48, 150, 138), "direction marker", None),
        ("chevron-bottom", box(1637, 188, 150, 164), "direction marker", None),
        ("corner-marker-left", box(1784, 56, 72, 76), "compact command affordance", None),
        ("corner-marker-right", box(1884, 56, 76, 76), "compact command affordance", None),
        ("asterisk", box(940, 144, 148, 122), "status or warning marker", None),
        ("heart-frame", box(1108, 156, 112, 144), "status marker", None),
        ("dot-frame", box(1250, 156, 100, 144), "compact telemetry marker", None),
        ("slash-strip", box(1098, 296, 260, 66), "section divider", None),
        ("arrow-yellow", box(80, 220, 154, 164), "primary navigation marker", None),
        ("arrow-black", box(244, 218, 150, 164), "secondary navigation marker", None),
        ("warning-lightning", box(420, 228, 132, 132), "warning state marker", "nearest"),
        ("warning-striped", box(548, 228, 116, 132), "warning state marker", "nearest"),
        ("warning-exclamation", box(660, 228, 130, 132), "warning state marker", "nearest"),
        ("status-square", box(790, 220, 132, 154), "system status marker", None),
        ("lower-corner-markers", box(1784, 278, 180, 82), "compact command affordance", None),
        ("crossed-signal", box(82, 418, 206, 208), "signal status marker", None),
        ("shield-frame", box(298, 430, 218, 190), "project dossier marker", None),
        ("bolt-disc", box(518, 428, 174, 184), "system status marker", None),
        ("triad-frame", box(708, 426, 220, 192), "project dossier marker", None),
        ("square-connectors", box(944, 426, 202, 194), "system status marker", None),
        ("four-chevron", box(1150, 426, 188, 188), "direction marker", None),
        ("globe-frame", box(1348, 426, 192, 188), "system index marker", None),
        ("radial-cross", box(1540, 418, 232, 210), "telemetry marker", None),
        ("spoke-wheel", box(1762, 416, 206, 214), "telemetry marker", None),
        ("chevron-strip", box(96, 676, 478, 150), "archive progress rail", None),
        ("framed-slash-strip", box(610, 676, 460, 150), "archive progress rail", None),
        ("checker-strip", box(1060, 676, 420, 150), "archive progress rail", None),
        ("multi-chevron", box(1480, 668, 310, 164), "navigation divider", None),
        ("arrow-tail", box(1784, 694, 164, 112), "navigation marker", None),
        ("add-circle", box(68, 876, 204, 142), "add or expand affordance", None),
        ("x-toggle", box(292, 876, 164, 142), "toggle state marker", None),
        ("linked-circles", box(516, 884, 190, 126), "status grouping marker", None),
        ("half-disc", box(760, 884, 100, 126), "status grouping marker", None),
        ("double-chevron", box(960, 900, 120, 96), "navigation marker", None),
        ("corner-rail", box(1150, 878, 220, 130), "layout divider", None),
        ("expand-frame", box(1380, 878, 120, 140), "expand control", None),
        ("direction-cross", box(1500, 862, 164, 180), "direction control", None),
        ("overlap-squares", box(1720, 876, 80, 140), "system status marker", None),
        ("linked-diamonds", box(1800, 876, 194, 140), "system status marker", None),
        ("diamond-yellow", box(62, 1036, 268, 278), "project status marker", None),
        ("diamond-outline", box(350, 1036, 244, 278), "project status marker", None),
        ("circuit-cross", box(602, 1048, 242, 244), "system status marker", None),
        ("loading-ring", box(850, 1048, 252, 246), "loading state marker", None),
        ("stylized-x", box(1090, 1048, 236, 244), "system status marker", None),
        ("broken-ring", box(1340, 1038, 230, 266), "loading state marker", None),
        ("hex-cluster", box(1552, 1050, 232, 244), "system status marker", None),
        ("bracket-mark", box(1780, 1050, 218, 244), "archive index marker", None),
    ]
    yield from items


def build_specs() -> list[dict]:
    specs: list[dict] = []

    # Key out the warm white sheet background and alpha-trim each explicit
    # symbol. Hazard triangles use a largest-component filter because their
    # source silhouettes physically overlap by a few pixels.
    for name, source_box, usage, cleanup in icon_components():
        specs.append(
            {
                "atlas": "icons",
                "name": name,
                "source": "icons-symbol-sheet.png",
                "box": source_box,
                "key": (244, 245, 240),
                "trim": True,
                "padding": 6,
                "cleanup": cleanup,
                "usage": usage,
            }
        )

    vertical_items = [
        # The rails are separate horizontal controls in the source sheet;
        # keeping their height tight prevents the next rail from leaking in.
        ("rail-01", box(35, 642, 265, 40), "section index rail or sidebar rule"),
        ("rail-02", box(35, 700, 265, 40), "record row progress rail"),
        ("rail-03", box(35, 748, 265, 42), "record row progress rail"),
        ("rail-04", box(35, 800, 265, 44), "project metadata signal strip"),
        ("rail-05", box(35, 855, 265, 42), "project metadata signal strip"),
        ("rail-06", box(35, 908, 265, 44), "journal row loading rule"),
        ("rail-07", box(35, 960, 265, 50), "journal row loading rule"),
        ("rail-gdrp", box(12, 1018, 300, 80), "project telemetry rail"),
        ("ring-01", box(300, 630, 130, 112), "system status indicator"),
        ("ring-02", box(435, 630, 130, 112), "secondary status indicator"),
        ("ring-03", box(300, 748, 130, 112), "compact telemetry indicator"),
        ("ring-04", box(435, 748, 110, 112), "compact telemetry indicator"),
        ("ring-05", box(300, 860, 130, 112), "progress indicator"),
        ("ring-06", box(435, 860, 110, 112), "progress indicator"),
        ("arrow-grid-01", box(550, 640, 65, 80), "navigation arrow"),
        ("arrow-grid-02", box(620, 640, 70, 80), "navigation arrow"),
        ("arrow-grid-03", box(700, 640, 70, 72), "navigation arrow"),
        ("arrow-grid-04", box(780, 640, 70, 72), "navigation arrow"),
        ("arrow-grid-05", box(550, 715, 65, 72), "command result arrow"),
        ("arrow-grid-06", box(625, 715, 65, 72), "command result arrow"),
        ("arrow-grid-07", box(700, 715, 70, 72), "command result arrow"),
        ("arrow-grid-08", box(780, 715, 72, 72), "command result arrow"),
        ("arrow-grid-09", box(550, 795, 65, 78), "record row arrow"),
        ("arrow-grid-10", box(625, 795, 65, 78), "record row arrow"),
        ("arrow-grid-11", box(700, 795, 70, 78), "record row arrow"),
        ("arrow-grid-12", box(780, 795, 72, 78), "record row arrow"),
        ("button-01-reference", box(864, 646, 155, 72), "reference only: source button frame with label placeholder"),
        ("button-02-reference", box(872, 726, 143, 64), "reference only: source button frame with label placeholder"),
        ("button-03-reference", box(872, 806, 143, 60), "reference only: source button frame with label placeholder"),
        ("button-04-reference", box(872, 884, 143, 62), "reference only: source button frame with label placeholder"),
        ("button-05-reference", box(880, 974, 135, 58), "reference only: source button frame with label placeholder"),
        ("button-06-reference", box(880, 1058, 135, 54), "reference only: source button frame with label placeholder"),
        ("button-07-reference", box(880, 1130, 135, 64), "reference only: source button frame with label placeholder"),
        ("warning-strip-01", box(543, 1024, 305, 48), "warning or danger state"),
        ("warning-strip-02", box(545, 1072, 145, 46), "warning state"),
        ("warning-strip-03", box(700, 1072, 150, 46), "danger state"),
        ("warning-strip-04", box(545, 1118, 145, 46), "warning state"),
        ("warning-strip-05", box(700, 1118, 150, 46), "danger state"),
        ("loading-panel", box(198, 1180, 178, 92), "loading or async operation state"),
        ("label-rail-01", box(15, 1208, 190, 34), "metadata label and value"),
        ("label-rail-02", box(15, 1242, 190, 36), "metadata label and value"),
        ("label-rail-03", box(15, 1278, 190, 42), "metadata label and value"),
        ("label-rail-04", box(15, 1320, 175, 52), "metadata label and value"),
        ("label-rail-05", box(15, 1372, 190, 58), "metadata label and value"),
    ]
    for name, source_box, usage in vertical_items:
        specs.append(
            {
                "atlas": "vertical",
                "name": name,
                "source": "hud-vertical-sheet.png",
                "box": source_box,
                "key": None,
                "trim": False,
                "padding": 0,
                "usage": usage,
            }
        )

    wide_items = [
        ("top-scanline", box(10, 10, 2780, 42), "global header scanline"),
        ("left-system-panel", box(30, 60, 590, 890), "signal module background"),
        ("center-chart-panel", box(635, 235, 730, 710), "journal signal trace"),
        ("large-data-frame-01", box(1380, 55, 340, 190), "article or project dossier frame"),
        ("large-data-frame-02", box(1730, 55, 255, 190), "article or project dossier frame; isolated frame only"),
        ("small-card-frame-01", box(2092, 208, 163, 62), "metadata card frame; isolated top-right capsule"),
        ("small-card-frame-02", box(1976, 280, 168, 64), "metadata card frame; isolated compact label"),
        ("small-card-frame-03", box(1968, 372, 194, 66), "metadata card frame; isolated telemetry label"),
        ("small-card-frame-04", box(1976, 458, 198, 64), "metadata card frame; isolated progress label"),
        ("small-card-frame-05", box(1984, 548, 200, 72), "metadata card frame; isolated signal label"),
        ("loading-stripe", box(1990, 670, 310, 35), "loading or progress primitive"),
        ("warning-card", box(1430, 800, 520, 180), "error or warning callout"),
        ("chart-area", box(2300, 760, 500, 190), "metric or signal chart; isolated chart only"),
        ("radial-readout-01", box(2345, 1075, 125, 125), "circular telemetry state; isolated upper ring"),
        ("radial-readout-02", box(2495, 1075, 125, 125), "circular telemetry state; isolated upper ring"),
        ("radial-readout-03", box(2645, 1075, 150, 125), "circular telemetry state; isolated upper ring"),
    ]
    for name, source_box, usage in wide_items:
        specs.append(
            {
                "atlas": "wide",
                "name": name,
                "source": "hud-wide-sheet.png",
                "box": source_box,
                "key": (27, 18, 37),
                "key_tolerance": 17,
                "trim": True,
                "padding": 2,
                "usage": usage,
            }
        )
    return specs


def load_font(size: int):
    for path in (Path("C:/Windows/Fonts/consola.ttf"), Path("C:/Windows/Fonts/arial.ttf")):
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


def crop_component(source_path: Path, spec: dict, destination: Path) -> None:
    with Image.open(source_path) as source_image:
        image = source_image.convert("RGBA")
    cropped = image.crop(spec["box"])
    if spec.get("cleanup") == "nearest" and spec["key"]:
        # Adjacent warning symbols share a rectangular neighborhood in the
        # source sheet. Select the connected source component whose centroid
        # is closest to this crop's center before applying the key color.
        source_rgb = np.array(image.convert("RGB"))
        key_r, key_g, key_b = spec["key"]
        source_mask = (np.abs(source_rgb.astype(np.int16) - np.array([key_r, key_g, key_b], dtype=np.int16)).sum(axis=2) > 30).astype(np.uint8)
        count, labels, stats, centroids = cv2.connectedComponentsWithStats(source_mask, 8)
        x0, y0, x1, y1 = spec["box"]
        center = np.array(((x0 + x1) / 2, (y0 + y1) / 2))
        candidates = []
        for label in range(1, count):
            area = stats[label, cv2.CC_STAT_AREA]
            if area < 500:
                continue
            centroid = centroids[label]
            if x0 - 20 <= centroid[0] <= x1 + 20 and y0 - 20 <= centroid[1] <= y1 + 20:
                candidates.append((float(np.linalg.norm(centroid - center)), label))
        if candidates:
            selected = min(candidates)[1]
            alpha = (labels[y0:y1, x0:x1] == selected).astype(np.uint8) * 255
            cropped.putalpha(Image.fromarray(alpha, mode="L"))
    if spec["key"]:
        key_rgb = np.array(spec["key"], dtype=np.int16)
        rgba = np.array(cropped, dtype=np.uint8)
        distance = np.abs(rgba[:, :, :3].astype(np.int16) - key_rgb).sum(axis=2)
        keyed = distance <= spec.get("key_tolerance", 30)
        rgba[keyed, 3] = 0
        if spec.get("cleanup") != "nearest":
            rgba[~keyed, 3] = 255
        cropped = Image.fromarray(rgba, mode="RGBA")
    if spec.get("cleanup") == "largest":
        alpha = np.array(cropped.getchannel("A"), dtype=np.uint8)
        count, labels, stats, _ = cv2.connectedComponentsWithStats((alpha > 0).astype(np.uint8), 8)
        if count > 1:
            largest = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
            alpha[labels != largest] = 0
            cropped.putalpha(Image.fromarray(alpha, mode="L"))
    if spec["trim"]:
        alpha = cropped.getchannel("A")
        bounds = alpha.getbbox()
        if bounds:
            padding = spec["padding"]
            cropped = cropped.crop(
                (
                    max(0, bounds[0] - padding),
                    max(0, bounds[1] - padding),
                    min(cropped.width, bounds[2] + padding),
                    min(cropped.height, bounds[3] + padding),
                )
            )
    destination.parent.mkdir(parents=True, exist_ok=True)
    try:
        cropped.save(destination, optimize=True)
    except OSError:
        # Windows can transiently reject replacement of a file being indexed
        # by the local preview server. Remove the old artifact and retry.
        if destination.exists():
            destination.unlink()
        cropped.save(destination, optimize=True)


def build_preview(entries: list[dict]) -> None:
    tile_w, tile_h = 280, 180
    columns = 4
    rows = (len(entries) + columns - 1) // columns
    canvas = Image.new("RGB", (tile_w * columns, tile_h * rows), "#0b0d12")
    draw = ImageDraw.Draw(canvas)
    label_font = load_font(12)
    atlas_font = load_font(10)
    for index, entry in enumerate(entries):
        image = Image.open(OUTPUT_ROOT / entry["asset"]).convert("RGBA")
        image.thumbnail((tile_w - 18, tile_h - 48))
        x = (index % columns) * tile_w
        y = (index // columns) * tile_h
        image_x = x + (tile_w - image.width) // 2
        image_y = y + 28 + (tile_h - 38 - image.height) // 2
        canvas.paste(image, (image_x, image_y), image)
        draw.rectangle((x, y, x + tile_w - 1, y + tile_h - 1), outline="#343943", width=2)
        draw.text((x + 8, y + 7), entry["name"], fill="#e6ff00", font=label_font)
        draw.text((x + 8, y + tile_h - 19), entry["atlas"].upper(), fill="#56d8cf", font=atlas_font)
    canvas.save(PREVIEW_PATH, optimize=True)


def write_manifest(entries: list[dict]) -> None:
    MANIFEST_PATH.write_text(json.dumps(entries, ensure_ascii=True, indent=2), encoding="utf-8")
    lines = [
        "# Cyberpunk UI component library",
        "",
        "Generated from the three user-supplied UI atlases. Every entry is a standalone PNG with its source atlas, exact crop box, and intended UI usage.",
        "",
        "| Asset | Atlas | Source box | Status | Intended use |",
        "| --- | --- | --- | --- | --- |",
    ]
    for entry in entries:
        x0, y0, x1, y1 = entry["box"]
        lines.append(f"| `{entry['asset']}` | `{entry['atlas']}` | `x={x0}, y={y0}, w={x1 - x0}, h={y1 - y0}` | **{entry['status']}** | {entry['usage']} |")
    lines.extend(
        [
            "",
            "## Review workflow",
            "",
            "Region-first analysis: `../regions/REGION_ANALYSIS.md` records the discovery pass (61 icon, 62 vertical, and 20 wide candidates) before semantic naming. The reviewed library contains 114 named crops; composite source panels remain reference-only until they are split into single controls.",
            "",
            "1. Review `component-slicer-preview.png` and the category folders.",
            "2. `runtime-used` entries are wired into the rendered theme and verified in the runtime audit. `reference-only` entries retain composite source content and must not be wired as a control background. `candidate` entries need visual review before use.",
            "3. Add only a reviewed single-control crop to the theme CSS and verify the home page, command dialog, archive rows, and project dossier at desktop and mobile widths.",
            "",
            "Regenerate with `python tools/cyberpunk-ui-component-slicer.py`.",
        ]
    )
    MANIFEST_MD_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    specs = build_specs()
    entries: list[dict] = []
    for spec in specs:
        source_path = SOURCE_ROOT / spec["source"]
        destination = OUTPUT_ROOT / spec["atlas"] / f"{spec['name']}.png"
        crop_component(source_path, spec, destination)
        entry = {key: value for key, value in spec.items() if key not in {"source", "key", "key_tolerance", "trim", "padding"}}
        entry["box"] = list(spec["box"])
        entry["asset"] = str(destination.relative_to(OUTPUT_ROOT)).replace("\\", "/")
        entry["status"] = (
            "runtime-used" if entry["asset"] in RUNTIME_USED
            else "reference-only" if entry["asset"] in REFERENCE_ONLY or "reference" in entry["name"]
            else "candidate"
        )
        entries.append(entry)
    write_manifest(entries)
    build_preview(entries)
    print(f"Generated {len(entries)} components in {OUTPUT_ROOT}")
    print(f"Preview: {PREVIEW_PATH}")


if __name__ == "__main__":
    main()
