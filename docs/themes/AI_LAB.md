# AI Lab

AI Lab is a bilingual research and engineering archive at `/ai-lab/`. It is an independent section module, not a site-wide visual theme. The theme registry exposes it from Theme Center while keeping `default_selectable: false`, so browsing the archive never changes the site's default presentation.

## Routes

| Route | Purpose |
| --- | --- |
| `/ai-lab/` | Overview, six research tracks, archive search, and benchmark state |
| `/ai-lab/experiments/` | Experiment records and plans |
| `/ai-lab/research/` | Research notes and technical analysis |
| `/ai-lab/engineering/` | Architecture and implementation records |
| `/ai-lab/benchmarks/` | Evaluation protocols and measured results when available |
| `/ai-lab/playground/` | Browser-local text and JSON workbench |
| `/ai-lab/field-notes/` | Debugging and engineering postmortems |

The same paths are available under `/en/ai-lab/` in English.

## Content model

Put records under `content/{zh,en}/ai-lab/<track>/`. Each article declares `lab_category`; experiments additionally use an identifier and a status from `planned`, `running`, `completed`, `failed`, or `archived`. Optional metadata includes `model`, `dataset`, `method`, `metrics`, `repository`, `demo`, and `source_page`.

The head partial validates categories, statuses, and experiment ID uniqueness per language during Hugo builds. Missing `status` means the article is published, not that an experiment completed. Only measured values belong in `metrics`. Planned runs render an explicit empty state instead of sample numbers.

Category labels and descriptions live in `data/ai_lab.yaml`. Keep translated content aligned between the two language directories. The `lab-math` shortcode renders TeX with KaTeX; `lab-diagram` renders Mermaid syntax. Fenced code blocks receive line numbers and a copy control on AI Lab pages. These CDN-backed renderers are only loaded on article pages.

## Presentation and interactions

`layouts/ai-lab/list.html` renders the standalone homepage shell and dashboard, `category.html` renders track archives, and `single.html` renders research records. Shared fragments live in `layouts/partials/ai-lab/`; design tokens and responsive styles are in `static/css/ai-lab.css`, while filtering, theme persistence, carousel behavior, local playground validation, and reading progress are in `static/js/ai-lab.js`.

Search, track filtering, status filtering, light/dark mode, keyboard `/` search focus, code copy, a table of contents, Mermaid, KaTeX, and the local JSON parser work without a model API key. The playground never sends input over the network. Reduced-motion preferences are honored.

Archive controls also support recent/title/reading-time sorting, list/grid views, URL-backed state, and browser history restoration. The homepage canvas draws animated tiles from the local reference sprite, pauses for reduced-motion preferences, and adds restrained pointer parallax. Featured records rotate automatically; keyboard arrows and touch swipes change the story, and the visible pause control remains at the stage's lower-right corner.

Article front matter can include featured, featured_order, cover, cover_alt, and cover_credit. Covers are built from existing local assets through Hugo image processing, with an explicit fallback when no source image exists. The AI Lab templates do not use remote image generation or third-party image hotlinks.

Five local homepage reference images from Anthropic are stored under assets/media/ai-lab/anthropic-home/. Identifiable source URLs and SHA-256 hashes are recorded in assets/data/ai-lab-anthropic-home-assets.json. The homepage design reference and screenshot are documented in docs/design/AI_LAB_ANTHROPIC_HOME_DESIGN.md. The user authorized local reuse for this project; attribution does not establish asset-specific reuse or redistribution rights. Homepage cards link internally.

## Local verification

```powershell
hugo server --bind 127.0.0.1 --port 1319
hugo --renderToMemory --baseURL https://1byteone.github.io/
node --check static/js/ai-lab.js
```

Current benchmark results are intentionally empty until a fixed dataset and reproducible runs exist.
