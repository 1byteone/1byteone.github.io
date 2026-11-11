# UI/UX and Motion Audit

Audit date: 2026-11-02 · Scope: Cyberpunk theme routes and shared motion behavior · Browser: local Chrome / Playwright · Build: Hugo Extended 0.162.0

## Verdict

**CONDITIONAL PASS.** The current source tree builds successfully, all six routes return 200 in desktop, tablet, and mobile samples, there is no horizontal overflow, and the final browser run recorded zero console errors and zero request failures. The result remains conditional because screen-reader behavior, physical devices, INP, memory, GPU cost, and long-session cleanup were not measured; reduced-motion transition scope remains a review item.

## Scorecard

| Dimension | Score | Finding |
| --- | ---: | --- |
| UI/UX | 4/5 | Clear branded hierarchy, real résumé/project/article records, and distinct editorial/profile surfaces. |
| Motion | 3/5 | Boot, reveal, parallax, target-lock, map/timeline, and media behaviors are implemented; reduced-motion scope needs one more review pass. |
| Accessibility | 3/5 | Search/dialog, menu, map tabs, focus styling, pressed state, and reduced-motion bypass are present; assistive technology was not run. |
| Performance | 3/5 | Local samples show roughly 61–62 FPS and low CLS; INP, memory, GPU, battery, and physical mobile cost are NOT MEASURED. |
| Overall | 3.25/5 | Release candidate with explicit measurement limits and one P2 review item. |

## Verified coverage

- Hugo Extended 0.162.0 production build succeeded: 262 Chinese pages, 253 English pages, 739 static files.
- `/`, `/blog/`, `/projects/`, `/hobby/`, `/tech-stack/`, and `/about/` returned HTTP 200 at 1440×900, 1024×768, and 390×844.
- All 18 regular route/viewport samples had `scrollWidth === viewportWidth`, zero console errors, zero request failures, and zero undersized visible targets under the audit's interactive-layer filter.
- Search opened with 12 results, Escape closed it, and focus returned.
- Mobile navigation synchronized `aria-expanded` and opened/closed successfully.
- About target-lock, engineering map selection, and terminal `help` were exercised; target-lock reported `SIGNAL: STABLE` and exposes `aria-pressed`.
- Reduced-motion emulation matched the media query, skipped the boot overlay, hid video, and kept `motionReady=false`.
- Headless frame samples: 61–62 FPS in these local runs. Body-text rendered contrast is **NOT MEASURED** because the current automated sample does not composite photo/transparent surfaces; token contrast is not a conformance claim.

## Open review

**AUD-004 — Reduced-motion scope.** The global near-zero animation/transition rule reliably removes nonessential motion, but a future pass should narrow it to authored motion selectors while preserving immediate state and focus feedback.

## Not measured / not tested

- INP, memory growth, battery consumption, GPU cost, physical-device behavior, screen-reader behavior, and long-session cleanup.
- Exhaustive WCAG 2.2 AA contrast across every text/background combination, every keyboard path, and all language routes.
- Deployed CI result; only the workflow-compatible local Hugo build was run.

## Release decision

Ship as **CONDITIONAL PASS** with the P2 reduced-motion scope review tracked. No P0 or P1 issue remains open.
