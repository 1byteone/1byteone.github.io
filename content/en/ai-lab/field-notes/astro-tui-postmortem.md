---
title: "Moving Astro TUI Into Hugo: Preserve Interaction Semantics, Not The Framework Shell"
date: 2026-10-27
summary: "How the Astro/Tailwind terminal portfolio was adapted to Hugo while preserving interactions, connecting shared content, and keeping static deployment manageable."
lab_category: field-notes
cover: media/ai-lab/open-doodles-covers/streaming-lifecycle.png
cover_alt: "An editorial illustration representing interaction states and content flows as connected nodes."
cover_credit: "Pablo Stanley / Open Doodles (CC0 1.0)"
translationKey: theme-astro-tui-postmortem
source_page: "theme-center/"
authors: [me]
---

> **Delivery date: 2026-10-27.** Commit `b54b953` delivered the Astro TUI theme with the shared theme center. It is a verifiable milestone, not a claim that upstream Astro and Hugo share a component runtime.

## Copying A Screen Is Easy; Connecting Real Data Is The Work

The reference implementation uses Astro/Tailwind, while site content and publication flow use Hugo. A visual-only copy would leave article and project output hard-coded. Adding another Node-rendered site for one theme would create a second source of truth for the gallery, default theme, locale routes, and deployment paths. The task was to port **interaction semantics and information structure**, not the framework boundary.

## Adaptation

Hugo partials render the terminal window, CLI/GUI panels, status bar, modal layer, and content lists. Articles and projects come from site data, with local routes generated through `relLangURL` and page permalinks. The standalone `astro-tui.js` script owns command history, CLI/GUI state, palette switching, CRT/SFX toggles, the Matrix overlay, and Radio/Snake/Pong widgets. The `help` output must match command dispatch; a button that only draws without updating state is a nonfunctional demo.

Article pages use a theme-specific single template, while archive pages enumerate the section. Missing local covers use an explicit fallback instead of treating a remote preview URL as an asset. Locale conditions generate terminal labels and prompts; controls, status text, and destinations must be checked together rather than translating only the page title.

## Before, After, And Remaining Work

Before integration, the terminal was a standalone visual mock. Afterwards, CLI commands reach real local articles and projects, CLI/GUI can switch, palettes can change, and widgets/overlays have real behavior. The report that “images do not show” exposed a mix-up between design references and content assets. Local paths and the article-resource model make cover rendering independent of the original site's remote host.

The delivery commit integrated the theme and gallery into Hugo, but per-route checks for script loading, third-party failure fallbacks, mobile keyboard input, and reduced-motion remain useful. A transferable method is to list `view state × triggering input × resulting state × route/data source` before porting components. For a Feynman review, explain the path from CLI input to data to link without mentioning Astro or Hugo, then explain why a local offline article asset is more reliable than a development-time hotlink.
