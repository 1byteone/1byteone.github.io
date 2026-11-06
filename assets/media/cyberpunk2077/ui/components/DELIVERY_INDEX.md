# Cyberpunk UI crop delivery

## Source and counting

The three supplied atlases are preserved under `../source/`:

- `icons-symbol-sheet.png` — 2048x1365
- `hud-vertical-sheet.png` — 1024x1480
- `hud-wide-sheet.png` — 2800x1387

The region-first analyzer runs before semantic naming:

```powershell
python tools/cyberpunk-ui-region-analyzer.py
```

It currently identifies **61 icons**, **62 vertical**, and **20 wide** independent foreground regions. See `../regions/REGION_ANALYSIS.md`, the three `*-regions.png` maps, and `../regions/region-crops-preview.png` for the numbered evidence.

## Semantic library

`COMPONENT_MANIFEST.json` and `COMPONENT_MANIFEST.md` contain **114 named PNG crops** grouped by `icons/`, `vertical/`, and `wide/`:

- `runtime-used`: 8 components wired into the rendered theme.
- `reference-only`: 22 composite or source-label crops retained for visual reference.
- `candidate`: 84 isolated or semi-isolated crops awaiting a product-specific use decision.

Regenerate the semantic library with:

```powershell
python tools/cyberpunk-ui-component-slicer.py
```

## Runtime mapping

The eight runtime assets are declared in `layouts/partials/themes/cyberpunk2077/head.html` and consumed by `static/css/cyberpunk2077.css`:

| Asset | Surface |
| --- | --- |
| `icons/arrow-yellow.png` | primary navigation markers |
| `icons/status-square.png` | tag/status marker |
| `vertical/arrow-grid-01.png` | command and record arrows |
| `vertical/ring-03.png` | signal module readout |
| `vertical/rail-01.png` | project record rail |
| `wide/loading-stripe.png` | search and record progress rule |
| `wide/small-card-frame-01.png` | project metadata framing |

`UI_RUNTIME_ASSET_AUDIT.md` records the selector, intended use, and acceptance condition for each surface. Runtime screenshots were checked on `/`, the command dialog, `/blog/`, and `/projects/agricultural-qa-agent/` at the running preview URL `http://localhost:1314/`.

## Quality gate

- Hugo preview build: passed.
- `node --check static/js/cyberpunk2077.js`: passed.
- `git diff --check`: passed; only existing CRLF normalization warnings were reported by Git.
- Impeccable detector: unavailable in the current restricted environment because the user profile skill path is denied; no result is claimed.
