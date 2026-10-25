# AI Context - termfolio

Primary repo context for future AI sessions.

For design-specific iteration guidance, also read `docs/DESIGN_HANDOFF.md`.

## Project Snapshot

- Stack: Next.js App Router, React 19, TypeScript, Tailwind CSS.
- Purpose: personal portfolio, journal/notebook, experiment lab, digital card, and no-login utility tools.
- Identity: CLI-first shell, terminal command language, dark atmospheric frame, readable editorial article surfaces.
- Content model: local markdown and TypeScript config files. There is no active CMS or database dependency for posts.
- Bilingual model: English routes plus Arabic routes under `/ar`. Arabic UI uses Thmanyah fonts; terminal commands stay in English.
- Default theme: `vercel` through `components/theme-picker.tsx`.

## Active Architecture

- Global shell: `app/layout.tsx`
  - loads `app/globals.css`
  - mounts `ThemeProvider`
  - mounts Vercel Analytics and Speed Insights
  - loads font variables from `app/fonts.ts`
- Arabic shell: `app/ar/layout.tsx`
  - sets Arabic `lang` and `dir`
  - keeps the same visual system and terminal language
- Core routes:
  - `app/page.tsx`
  - `app/about/page.tsx`
  - `app/blog/page.tsx`
  - `app/blog/[slug]/page.tsx`
  - `app/contact/page.tsx`
  - `app/lab/page.tsx`
  - `app/tools/page.tsx`
  - `app/tools/[slug]/page.tsx`
  - `app/tools/splitter/page.tsx`
  - `app/card/page.tsx`
- Arabic route mirrors:
  - `app/ar/page.tsx`
  - `app/ar/about/page.tsx`
  - `app/ar/blog/page.tsx`
  - `app/ar/blog/[slug]/page.tsx`
  - `app/ar/contact/page.tsx`
  - `app/ar/lab/page.tsx`
  - `app/ar/tools/page.tsx`
  - `app/ar/tools/[slug]/page.tsx`
  - `app/ar/tools/splitter/page.tsx`
  - `app/ar/card/page.tsx`

## Current Product Shape

- `/` is a CLI-style landing page with a boot terminal, profile signal, useful tools, lab links, and recent journal entries.
- `/blog` is a searchable notebook/archive. Arabic copy calls it "the notebook" rather than a corporate blog.
- `/blog/[slug]` renders markdown posts with reading controls, digest cards, table of contents, related posts, and comments.
- `/about` is a resume/dossier page. `/ar/about` should preserve the same substance as English, including education and certifications.
- `/lab` is a playground for public experiments. It is not a formal project or case-study section.
- `/tools` is a practical no-login utility index.
- `/tools/splitter` is a richer bill splitter with payers, amounts paid, portions, tax/service, and a settlement message.
- `/card` is a digital business card with vCard, QR, WhatsApp, LinkedIn, and wallet support.
- `/contact` is direct contact plus booking and newsletter.

## Data Layer

Primary post file: `lib/posts.ts`

- Reads `content/posts/*.md`.
- Uses `gray-matter` for frontmatter.
- Filters to `status: "published"`.
- Extracts headings with `github-slugger`.
- Exposes `getAllPosts()`, `getPostBySlug(slug)`, `getPostsByTag(tag)`, and `getAllTags()`.

Other content sources:

- `content/site.ts` - English identity, resume, socials, terminal config, and metadata.
- `content/locale.ts` - Arabic UI copy, Arabic resume content, and route labels.
- `content/lab.ts` - lab experiments and utility tool registry.
- `content/card.md` - digital card and vCard content.

## Rendering Pipeline

- Journal archive: `components/journal-client.tsx`
- Search: `components/search-posts.tsx`
- Post route: `app/blog/[slug]/page.tsx`
- Arabic post route: `app/ar/blog/[slug]/page.tsx`
- Markdown renderer: `components/markdown-render.tsx`
- Reading controls: `components/reading-controls.tsx`
- Digest cards: `components/article-digest.tsx`
- TOC: `components/table-of-contents.tsx`
- Comments: `components/terminal-comment-section.tsx`

## Tools And Utilities

- Terminal command parser: `components/boot-terminal.tsx`
- Tools index and shared UI: `components/everyday-tool-client.tsx`
- Bill splitter: `components/splitter-client.tsx`
- Tool registry: `content/lab.ts`
- Shortener endpoint: `app/api/tools/shorten/route.ts`
- Digital card UI: `components/card-client.tsx`
- vCard and wallet endpoints:
  - `app/api/card/vcard/route.ts`
  - `app/api/card/wallet/route.ts`

Current public tools:

- Bill splitter
- Short link
- QR generator
- WhatsApp link
- Calendar `.ics` generator
- Image shrinker
- Share-card maker

## Source Of Truth Files

Inspect these first before route, content, or UI changes:

- `app/layout.tsx`
- `app/ar/layout.tsx`
- `app/fonts.ts`
- `app/globals.css`
- `tailwind.config.ts`
- `content/site.ts`
- `content/locale.ts`
- `content/lab.ts`
- `content/card.md`
- `lib/posts.ts`
- `components/minimal-nav.tsx`
- `components/boot-terminal.tsx`
- `components/theme-picker.tsx`
- `components/terminal-footer.tsx`
- `components/article-digest.tsx`
- `components/reading-controls.tsx`
- `components/everyday-tool-client.tsx`
- `components/splitter-client.tsx`

## Current Known Gaps

- Giscus comments require public env vars. Without them, the UI falls back instead of breaking.
- Newsletter and notification routes require Resend env vars.
- Wallet passes require `WALLETWALLET_API_KEY`; vCard works without it.
- Short links use an external no-login shortener through `/api/tools/shorten`; the site does not store short links.
- Arabic chrome is original Arabic copy, but markdown posts are not automatically translated.
- Future cleanup can remove older Notion helper files if they are no longer imported.

## AI Working Rules

- Preserve the CLI-first identity unless the user explicitly asks for a redesign.
- Keep terminal commands and terminal prompt copy in English across languages.
- Keep Arabic copy polished and natural, not literal translation.
- Do not present lab items as formal projects or case studies.
- Keep the tools useful without account creation or server-side storage unless explicitly requested.
- When editing contact/about Arabic, preserve the same factual coverage as the English resume page.

## Validation Commands

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run check`
