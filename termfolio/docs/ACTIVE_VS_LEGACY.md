# Active Vs Legacy Code Map

Use this when deciding what is part of the current product and what is older drift.

## Definitely Active

### Routes

- `app/layout.tsx`
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
- `app/ar/layout.tsx`
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
- `app/loading.tsx`
- `app/about/loading.tsx`
- `app/blog/loading.tsx`
- `app/not-found.tsx`
- `app/sitemap.ts`
- `app/robots.ts`
- `app/icon.tsx`

### API Routes

- `app/api/subscribe/route.ts`
- `app/api/notify/route.ts`
- `app/api/tools/shorten/route.ts`
- `app/api/card/vcard/route.ts`
- `app/api/card/wallet/route.ts`
- `app/api/apod/route.ts`

### Shared Components In Active Route Flow

- `components/minimal-nav.tsx`
- `components/boot-terminal.tsx`
- `components/theme-picker.tsx`
- `components/theme-provider.tsx`
- `components/live-clock.tsx`
- `components/terminal-footer.tsx`
- `components/star-field.tsx`
- `components/halftone-image.tsx`
- `components/utility-dock.tsx`
- `components/journal-client.tsx`
- `components/search-posts.tsx`
- `components/blog-post-card.tsx`
- `components/writing-heatmap.tsx`
- `components/markdown-render.tsx`
- `components/article-digest.tsx`
- `components/reading-controls.tsx`
- `components/table-of-contents.tsx`
- `components/terminal-comment-section.tsx`
- `components/newsletter-signup.tsx`
- `components/lab-bench.tsx`
- `components/everyday-tool-client.tsx`
- `components/splitter-client.tsx`
- `components/card-client.tsx`
- `components/cal-embed.tsx`
- `components/apod-widget.tsx`
- `components/spotify-widget.tsx`
- `components/star-map.tsx`
- `components/world-map.tsx`
- `components/typing-game.tsx`
- `components/snake-game.tsx`
- `components/pokedex.tsx`
- `components/terminal-dashboard.tsx`
- `components/post-engagement.tsx`

### Active Style, Config, And Data Files

- `app/fonts.ts`
- `app/globals.css`
- `tailwind.config.ts`
- `next.config.mjs`
- `package.json`
- `tsconfig.json`
- `tsconfig.typecheck.json`
- `content/site.ts`
- `content/locale.ts`
- `content/lab.ts`
- `content/card.md`
- `content/posts/*.md`
- `lib/posts.ts`
- `lib/format-post-date.ts`
- `lib/card.ts`
- `lib/vcard.ts`

## Likely Legacy Or Cleanup Candidates

Confirm imports before deleting anything.

- `lib/notion.ts` - old CMS path; current posts use `lib/posts.ts`.
- `lib/notion-simple.ts` - old CMS helper.
- `components/notion-render.tsx` - old Notion renderer; current posts use `components/markdown-render.tsx`.
- `app/actions/subscribe.ts` - older action path; active subscription endpoint is `app/api/subscribe/route.ts`.
- `app/actions/newsletter.ts` - older action path; active notification endpoint is `app/api/notify/route.ts`.
- Any old Notion test/check scripts if still present in the repo.

## Important Drift To Remember

- The repo is now local markdown first, not Notion first.
- The terminal component is `components/boot-terminal.tsx`, not `components/interactive-terminal.tsx`.
- The Arabic site is a real route tree under `/ar`, not just RTL article support.
- The lab is for experiments and should not be renamed back to projects/case studies.
- The tools are part of the portfolio strategy: useful surfaces that bring visitors back without accounts.

## Safe Cleanup Strategy

1. Confirm active imports from `app/*` first.
2. Remove unused legacy files in small batches.
3. Run `npm run check` after each cleanup batch.
4. Update `README.md`, `docs/ROUTES.md`, and this file when the active set changes.
