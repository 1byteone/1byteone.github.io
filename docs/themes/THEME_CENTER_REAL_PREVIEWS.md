# Theme Center Real Preview Assets

The Theme Center uses screenshots of the locally built theme homepages. These are page captures, not generated illustrations or hand-built SVG mockups.

## Capture specification

- Browser: Chromium through Playwright
- Source viewport: 1440 × 760 CSS pixels, device scale factor 1
- Published asset: WebP, 1199 × 633 pixels, quality 86
- Capture state: first stable homepage view after the page has painted
- Source pages: each theme's local Hugo preview build; Termfolio uses the checked-in `termfolio/out` static export
- Date captured: 2026-11-06

## Assets

| Theme ID | Asset | Local source route |
| --- | --- | --- |
| `lzw-archive` | `/images/theme-center/lzw-archive.webp` | `/themes/lzw-archive/` |
| `cyberpunk2077` | `/images/theme-center/cyberpunk2077.webp` | `/themes/cyberpunk2077/` |
| `ai-terminal` | `/images/theme-center/ai-terminal.webp` | `/themes/engineer-terminal/` |
| `astro-tui-portfolio` | `/images/theme-center/astro-tui-portfolio.webp` | `/themes/engineer-terminal/astro-tui-portfolio/` |
| `termfolio` | `/images/theme-center/termfolio.webp` | `/themes/engineer-terminal/termfolio/` |
| `emil-pixel-terminal` | `/images/theme-center/emil-pixel-terminal.webp` | `/themes/engineer-terminal/emil-pixel-terminal/` |
| `minimal` | `/images/theme-center/minimal.webp` | `/themes/minimal/` |
| `astro-blog` | `/images/theme-center/astro-blog.webp` | `/themes/minimal/astro-blog/` |
| `astropaper` | `/images/theme-center/astropaper.webp` | `/themes/minimal/astropaper/` |
| `astro-erudite` | `/images/theme-center/astro-erudite.webp` | `/themes/minimal/astro-erudite/` |
| `pudding` | `/images/theme-center/pudding.webp` | `/themes/minimal/pudding/` |
| `miniblog` | `/images/theme-center/miniblog.webp` | `/themes/minimal/miniblog/` |
| `oil` | `/images/theme-center/oil.webp` | `/themes/oil/` |
| `alxian` | `/images/theme-center/alxian.webp` | `/themes/alxian/` |
| `bloggpt` | `/images/theme-center/bloggpt.webp` | `/themes/bloggpt/` |

These captures document the project's own adapted themes for navigation and discovery. They are not copies of external reference-site screenshots. The source themes retain their individual asset provenance and licenses.

Themes without a working local homepage do not receive a fabricated screenshot. The card shows an explicit preview-in-progress state until a real page is available.

## Regeneration

Build the theme previews under a shared local static root, start the preview server on port `1330`, then run:

```powershell
node tools/theme-center/capture-real-previews.cjs
```

The script writes source captures and a request report under the current user's temporary directory. Convert approved captures to the fixed WebP dimensions before replacing published assets.
