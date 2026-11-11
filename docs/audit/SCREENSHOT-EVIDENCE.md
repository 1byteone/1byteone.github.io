# Screenshot and Test Evidence

Audit date: 2026-11-02. Evidence was captured with local Chrome through Playwright against a Hugo Extended 0.162.0 production build. Viewports are emulated CSS pixels: desktop 1440×900, tablet 1024×768, mobile 390×844.

## Route coverage

| Route | Desktop | Tablet | Mobile | HTTP | Notes |
| --- | --- | --- | --- | --- | --- |
| `/` | [Desktop](evidence/home-desktop.png) | [Tablet](evidence/home-tablet.png) | [Mobile](evidence/home-mobile.png) | 200 | Search opened, 12 results rendered, Escape closed and focus returned. |
| `/blog/` | [Desktop](evidence/blog-desktop.png) | [Tablet](evidence/blog-tablet.png) | [Mobile](evidence/blog-mobile.png) | 200 | Archive rows and cover paths sampled; lazy images were checked by HEAD and returned 200. |
| `/projects/` | [Desktop](evidence/projects-desktop.png) | [Tablet](evidence/projects-tablet.png) | [Mobile](evidence/projects-mobile.png) | 200 | Project records and links sampled. |
| `/hobby/` | [Desktop](evidence/hobby-desktop.png) | [Tablet](evidence/hobby-tablet.png) | [Mobile](evidence/hobby-mobile.png) | 200 | Five content channels, local image assets, story/music records inspected. |
| `/tech-stack/` | [Desktop](evidence/tech-stack-desktop.png) | [Tablet](evidence/tech-stack-tablet.png) | [Mobile](evidence/tech-stack-mobile.png) | 200 | Archive listing sampled. |
| `/about/` | [Desktop](evidence/about-desktop.png) | [Tablet](evidence/about-tablet.png) | [Mobile](evidence/about-mobile.png) | 200 | Résumé, timeline, map, capability, project, terminal, and contact regions inspected. |

## Final regression

- 18 regular route/viewport samples: HTTP 200, zero console errors, zero request failures, no horizontal overflow, and zero undersized visible touch candidates.
- The audit excludes hidden `details`, hidden dialog content, and non-interactive body links from touch-size counts.
- Search, mobile menu, target-lock, map selection, terminal `help`, and reduced-motion were exercised.

## Not measured / not tested

- Screen reader / voice control, physical mobile hardware, INP, memory, GPU, battery, long-session cleanup, exhaustive WCAG 2.2 AA, and deployed CI.
- FPS and LCP/CLS are local lab samples only and are not release guarantees.
- Rendered body-text contrast across translucent and photo-backed surfaces: **NOT MEASURED**.
