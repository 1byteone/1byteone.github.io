# Runtime UI asset audit

This audit maps the cropped atlas components to the Cyberpunk 2077 theme surface. It is intentionally separate from the crop manifest so a reviewer can verify visual use in the rendered pages. The region-first pass is recorded in `../regions/REGION_ANALYSIS.md` and identifies 61 icon, 62 vertical, and 20 wide foreground regions before semantic naming.

| Surface | Recommended cropped component | Selector or template | Status | Acceptance check |
| --- | --- | --- | --- | --- |
| Primary navigation marker | `icons/arrow-yellow.png` | `.cp77-nav a::before` in `static/css/cyberpunk2077.css` | runtime-used | Marker is one isolated symbol; no neighboring icon pixels. |
| Archive aside focus marker | `icons/crosshair.png` | `.cp77-index-aside::after` | runtime-used | Low-opacity focus reticle stays behind the archive metadata. |
| Header tools and language control | clean frame fallback | `.cp77-icon-button`, `.cp77-mode-button`, `.cp77-lang` | candidate | Frame remains inside each control at desktop and mobile widths. |
| Primary CTA | clean frame fallback | `.cp77-button::before` | candidate | Text stays above the frame; source `BUTTON` copy is never reused. |
| Command dialog corner | clean modal corner fallback | `.cp77-command-dialog::before` | candidate | Corner decoration stays within the dialog clip path. |
| Search input loading rule | `wide/loading-stripe.png` | `.cp77-command-input` | runtime-used | Rule is decorative only and does not block typing or overflow. |
| Command result arrow | `vertical/arrow-grid-05.png` | `.cp77-command-result::before` | runtime-used | Arrow is a single glyph and aligns with the result row. |
| Record row arrow | `vertical/arrow-grid-09.png` | `.cp77-row-arrow` | runtime-used | Row affordance uses a distinct crop from the command result marker. |
| Record row status rail | `vertical/rail-01.png` | `.cp77-record-row::before` | runtime-used | Rail is bounded to the row and does not include adjacent rail fragments. |
| Record row progress line | `wide/loading-stripe.png` | `.cp77-record-row::after` | runtime-used | Stripe remains a thin line and does not scale into a full panel. |
| Journal rail | `vertical/rail-03.png` | `.cp77-journal-row::after` | runtime-used | Cyan rail is layered as a bounded journal rule. |
| Tag/status marker | `icons/status-square.png` | `.cp77-tag-row span::before` | runtime-used | Marker does not contain warning text when used as a compact tag. |
| Project metadata frame | `wide/small-card-frame-01.png` | `.cp77-project-meta > div::after` | runtime-used | Frame is behind metadata content and does not crop the value. |
| Signal module radial readout | `vertical/ring-03.png` | `.cp77-signal-module::after` | runtime-used | Ring is isolated and remains legible on the dark panel. |
| Signal module frame | `wide/large-data-frame-01.png` | `.cp77-signal-module::before` | runtime-used | Frame is a low-opacity background accent and never covers the readout. |
| Warning/error callout | `vertical/warning-strip-02.png` | candidate status block | candidate | Available as a reviewed crop; no warning state is present in the current content model, so it is not falsely wired as runtime chrome. |

## Status vocabulary

- `runtime-used`: referenced by a template or CSS variable in the rendered theme and checked in a screenshot.
- `reference-only`: retained for visual reference because the crop contains source copy or an unsuitable composite.
- `candidate`: isolated crop is available but has not yet been wired to a page.

## Verification sequence

1. Build the standalone Cyberpunk preview with Hugo.
2. Check `/` for header, CTA, signal module, record rows, tags, and progress rules.
3. Open the command dialog with `Ctrl/Cmd+K` and verify its corner, search rule, result marker, and close control.
4. Open `/projects/agricultural-qa-agent/` and verify project signal, metadata frames, status markers, and adjacent navigation.
5. Repeat at a mobile viewport. Reject any crop that contains a neighboring control, source `BUTTON` copy, or an overflow outside its host element.

## Final evidence

- `component-slicer-preview.png`: semantic crop library (114 named PNGs).
- `../regions/region-crops-preview.png`: region-first crop output (143 numbered candidates).
- `../regions/REGION_ANALYSIS.md`: source dimensions, independent-region counts, bboxes, and crop paths.
- `COMPONENT_MANIFEST.json`: exact source coordinates and `runtime-used`, `candidate`, or `reference-only` state.

