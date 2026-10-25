# Theme And Styling System

## Active Visual Language

The current UI is CLI-first, not editorial-first.

- Shell chrome uses mono typography, borders, rows, rules, and file-like framing.
- Long-form article content uses a calmer serif reading surface inside `.post-content`.
- The site is dark-first and built around the `term-*` palette.

## Styling Stack

- Tailwind config: `tailwind.config.ts`
- Global stylesheet: `app/globals.css`
- App shell/fonts: `app/layout.tsx`, `app/fonts.ts`

## Active Tokens

Primary active color tokens in `tailwind.config.ts`:

- `term-black`
- `term-darker`
- `term-dark`
- `term-cyan`
- `term-cyan-bright`
- `term-blue`
- `term-white`
- `term-gray`
- `term-green`
- `term-amber`
- `term-line`

## Active Typography

- UI chrome: `IBM Plex Mono` via `app/fonts.ts`
- Reading surface: `Source Serif 4` via `app/fonts.ts`

Use mono for:

- nav
- prompts
- metadata
- tables
- command labels
- footer status bars

Use serif primarily for:

- article body text inside `.post-content`

## Reusable Active Helpers

Defined in `app/globals.css`:

- `.cli-frame`
- `.cli-panel`
- `.cli-topline`
- `.cli-rule`
- `.cli-link`
- `.cli-table-row`
- `.cli-table-row--active`
- `.cli-soft-copy`
- `.cli-reading`
- `.cli-kbd`
- `.cli-statusbar`

## Motion And Effects

The active redesign still uses the older terminal animation vocabulary sparingly:

- `animate-noise`
- `animate-scan`

The goal is subtle terminal atmosphere, not heavy neon or glitch overload.

## Important Reality

- `app/globals.css` now reflects the active CLI-first system directly instead of carrying the older mixed XP/retro sheet.
- The main remaining styling maintenance issue is duplicated page-shell structure, not legacy CSS bloat.

## Practical Guidance

- Prefer extending the active CLI helpers rather than adding new one-off card systems.
- Keep shell framing square or lightly rounded.
- Let the blog body stay calmer than the homepage shell.
- Avoid drifting into generic SaaS aesthetics or overusing glass, blur, or gradient-heavy treatments.

For page intent and design iteration constraints, use `docs/DESIGN_HANDOFF.md`.
