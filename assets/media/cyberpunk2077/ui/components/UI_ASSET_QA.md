# Cyberpunk UI asset QA

This report separates automatic discovery from reviewed component delivery. Discovery regions are evidence for counting; reviewed components are the assets allowed into the UI runtime.

## Count before crop

| Atlas | Candidate boxes | Overlap pairs | Spatial clusters | Reviewed crops |
| --- | ---: | ---: | ---: | ---: |
| `icons` | 61 | 10 | 51 | 57 |
| `vertical` | 62 | 3 | 59 | 44 |
| `wide` | 20 | 0 | 20 | 16 |

**Candidate boxes total:** 143 candidate regions.  
**Reviewed delivery:** 117 named crops, of which 95 are reusable controls and 22 remain reference-only composite panels.

Candidate boxes are retained as diagnostic evidence. Intersecting boxes are grouped into spatial clusters and are not counted as independent controls. The component slicer uses reviewed source boxes, transparent trimming, and separate reference-only labels for composite panels.

## Runtime proof

The theme references **12** cropped components from `ui/components/` through `layouts/partials/themes/cyberpunk2077/head.html` and `static/css/cyberpunk2077.css`.

| Check | Result |
| --- | --- |
| Component files present | PASS |
| Component dimensions valid | PASS |
| Runtime asset set | 12 reviewed crops |

## Evidence files

- `regions/region-crops-preview.png` — discovery map and candidate crop evidence.
- `components/component-slicer-preview.png` — reviewed semantic component library.
- `COMPONENT_MANIFEST.md` — exact source boxes, status, and intended use.
- `UI_RUNTIME_ASSET_AUDIT.md` — selector-level runtime acceptance checks.
