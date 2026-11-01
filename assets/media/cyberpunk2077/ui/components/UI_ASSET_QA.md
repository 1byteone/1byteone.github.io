# Cyberpunk UI asset QA

This report separates automatic discovery from reviewed component delivery. Discovery regions are evidence for counting; reviewed components are the assets allowed into the UI runtime.

## Count before crop

| Atlas | Discovery candidates | Discovery bbox overlaps | Reviewed crops |
| --- | ---: | ---: | ---: |
| `icons` | 61 | 10 | 57 |
| `vertical` | 62 | 3 | 44 |
| `wide` | 20 | 0 | 16 |

**Candidate boxes total:** 143 candidate regions.  
**Reviewed delivery:** 117 named crops, of which 95 are reusable controls and 22 remain reference-only composite panels.

Discovery overlaps are retained as a diagnostic signal; they are not copied into the runtime library. The component slicer uses reviewed source boxes, transparent trimming for the icon atlas, and separate reference-only labels for composite panels.

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
