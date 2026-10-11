# Project Documentation

This directory contains documentation that is useful for maintaining and
delivering the site. Hugo source files remain at the repository root because
their paths are part of the framework convention.

## Sections

- [`architecture/THEME_ARCHITECTURE.md`](architecture/THEME_ARCHITECTURE.md): shared content model,
  theme boundaries, routing, and multi-theme delivery.
- [`design/ALXIAN_DESIGN.md`](design/ALXIAN_DESIGN.md): visual reference and design tokens
  for the Alxian theme.
- [`integrations/ALXIAN_API_INTEGRATION.md`](integrations/ALXIAN_API_INTEGRATION.md): optional API
  contracts and browser fallbacks used by Alxian interactions.
- [`delivery/`](delivery/): completed deliverables and acceptance notes.
- [`operations/`](operations/): deployment and toolchain maintenance notes.
- [`history/`](history/): historical implementation goals retained for
  traceability.

## Source of truth

Published content lives in `content/zh` and `content/en`. Shared profile and
theme data lives in `data/`. Theme templates live in
`layouts/partials/themes/<theme-id>/`, while theme CSS and JavaScript remain
under `static/` for stable public asset URLs.
