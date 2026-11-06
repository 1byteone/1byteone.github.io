# Routes Reference

## Shared Frame

- Global app shell: `app/layout.tsx`
- Arabic shell: `app/ar/layout.tsx`
- Global CSS: `app/globals.css`
- Shared nav: `components/minimal-nav.tsx`
- Shared terminal: `components/boot-terminal.tsx`
- Theme dropdown: `components/theme-picker.tsx`
- Shared footer: `components/terminal-footer.tsx`
- Locale copy: `content/locale.ts`

## `/` - Home

- File: `app/page.tsx`
- Role:
  - CLI-first landing page
  - ASCII identity block
  - boot terminal and command parser
  - profile/professional signal
  - useful tools preview
  - recent journal entries
  - lab and contact paths
- Key dependencies:
  - `components/boot-terminal.tsx`
  - `components/utility-dock.tsx`
  - `components/live-clock.tsx`
  - `components/halftone-image.tsx`
  - `components/star-field.tsx`
  - `lib/posts.ts`
  - `content/site.ts`
  - `content/lab.ts`

## `/ar` - Arabic Home

- File: `app/ar/page.tsx`
- Role:
  - Arabic mirror of the home experience
  - Arabic copy and typography
  - English terminal commands preserved
- Key dependencies:
  - `content/locale.ts`
  - `components/boot-terminal.tsx`
  - `components/utility-dock.tsx`

## `/blog` - Journal Archive

- File: `app/blog/page.tsx`
- Role:
  - searchable notebook/archive
  - tag filtering and post discovery
  - writing heatmap and feature panels
- Key dependencies:
  - `components/journal-client.tsx`
  - `components/search-posts.tsx`
  - `components/blog-post-card.tsx`
  - `components/writing-heatmap.tsx`
  - `lib/posts.ts`
  - `lib/format-post-date.ts`

## `/ar/blog` - Arabic Notebook Archive

- File: `app/ar/blog/page.tsx`
- Role:
  - Arabic notebook surface
  - keeps the concept of a personal "daftar" rather than literal blog translation
- Key dependencies:
  - `content/locale.ts`
  - `lib/posts.ts`
  - `components/journal-client.tsx`

## `/blog/[slug]` - Journal Entry

- File: `app/blog/[slug]/page.tsx`
- Role:
  - renders a markdown post
  - keeps terminal metadata and navigation
  - adds digest cards, reading controls, ToC, related posts, and comments
- Key dependencies:
  - `components/markdown-render.tsx`
  - `components/article-digest.tsx`
  - `components/reading-controls.tsx`
  - `components/table-of-contents.tsx`
  - `components/terminal-comment-section.tsx`
  - `lib/posts.ts`

## `/ar/blog/[slug]` - Arabic Journal Entry

- File: `app/ar/blog/[slug]/page.tsx`
- Role:
  - Arabic route chrome for a post
  - respects the post's own language while localizing controls and shell copy
- Key dependencies:
  - `content/locale.ts`
  - `components/markdown-render.tsx`
  - `components/article-digest.tsx`
  - `components/reading-controls.tsx`

## `/about` - Dossier

- File: `app/about/page.tsx`
- Role:
  - profile summary
  - experience
  - education
  - credentials and certifications
  - skills
- Key behavior:
  - reads like a structured resume file, not a marketing page

## `/ar/about` - Arabic Dossier

- File: `app/ar/about/page.tsx`
- Role:
  - Arabic version of the same factual resume coverage
  - should not drop education or certifications from the English page
- Key dependency:
  - `content/locale.ts`

## `/lab` - Lab Bench

- File: `app/lab/page.tsx`
- Role:
  - public experiments and playful builds
  - intentionally not formal case studies
- Key dependencies:
  - `components/lab-bench.tsx`
  - `content/lab.ts`

## `/ar/lab` - Arabic Lab Bench

- File: `app/ar/lab/page.tsx`
- Role:
  - Arabic lab surface
  - copy frames the area as spare-time experiments and scribbles
- Key dependencies:
  - `components/lab-bench.tsx`
  - `content/lab.ts`
  - `content/locale.ts`

## `/tools` - Tools Index

- File: `app/tools/page.tsx`
- Role:
  - index of useful no-login tools
  - practical return hook for visitors
- Key dependencies:
  - `components/everyday-tool-client.tsx`
  - `content/lab.ts`

## `/ar/tools` - Arabic Tools Index

- File: `app/ar/tools/page.tsx`
- Role:
  - Arabic tools index
  - same tools, Arabic UI copy
- Key dependencies:
  - `components/everyday-tool-client.tsx`
  - `content/locale.ts`
  - `content/lab.ts`

## `/tools/[slug]` - Utility Tool

- File: `app/tools/[slug]/page.tsx`
- Slugs:
  - `short-link`
  - `qr`
  - `whatsapp`
  - `event`
  - `image`
  - `share-card`
- Role:
  - renders a specific tool from the registry
- Key dependencies:
  - `components/everyday-tool-client.tsx`
  - `content/lab.ts`
  - `app/api/tools/shorten/route.ts` for short links

## `/ar/tools/[slug]` - Arabic Utility Tool

- File: `app/ar/tools/[slug]/page.tsx`
- Role:
  - Arabic UI for the same utility tools
- Key dependencies:
  - `components/everyday-tool-client.tsx`
  - `content/locale.ts`
  - `content/lab.ts`

## `/tools/splitter` - Bill Splitter

- File: `app/tools/splitter/page.tsx`
- Role:
  - split a shared bill with tax and service
  - track who paid and how much
  - track portions per person
  - generate a clear settlement message
- Key dependency:
  - `components/splitter-client.tsx`

## `/ar/tools/splitter` - Arabic Bill Splitter

- File: `app/ar/tools/splitter/page.tsx`
- Role:
  - Arabic UI for the bill splitter
  - uses clearer wording around portions and payment
- Key dependency:
  - `components/splitter-client.tsx`

## `/card` - Digital Card

- File: `app/card/page.tsx`
- Role:
  - public digital business card
  - vCard download
  - QR and WhatsApp
  - LinkedIn and social links
  - optional Apple Wallet pass
- Key dependencies:
  - `components/card-client.tsx`
  - `content/card.md`
  - `lib/card.ts`
  - `lib/vcard.ts`
  - `app/api/card/vcard/route.ts`
  - `app/api/card/wallet/route.ts`

## `/ar/card` - Arabic Digital Card

- File: `app/ar/card/page.tsx`
- Role:
  - Arabic digital card surface
  - same underlying card data
- Key dependencies:
  - `components/card-client.tsx`
  - `content/card.md`

## `/contact` - Contact Channel

- File: `app/contact/page.tsx`
- Role:
  - direct contact
  - booking
  - newsletter signup
- Key dependencies:
  - `components/cal-embed.tsx`
  - `components/newsletter-signup.tsx`
  - `content/site.ts`

## `/ar/contact` - Arabic Contact Channel

- File: `app/ar/contact/page.tsx`
- Role:
  - Arabic contact copy
  - same contact and booking affordances
- Key dependencies:
  - `content/locale.ts`
  - `components/newsletter-signup.tsx`

## API Routes

- `app/api/subscribe/route.ts` - newsletter subscription through Resend
- `app/api/notify/route.ts` - protected new-post notification endpoint
- `app/api/tools/shorten/route.ts` - short link helper
- `app/api/card/vcard/route.ts` - `.vcf` generation
- `app/api/card/wallet/route.ts` - optional wallet pass generation
- `app/api/apod/route.ts` - NASA APOD widget proxy/helper

## Navigation Contract

Route labels and destinations are shared across:

- `content/locale.ts`
- `components/minimal-nav.tsx`
- `components/boot-terminal.tsx`
- `components/terminal-footer.tsx`
- `content/lab.ts`

If a route label, slug, or destination changes, update those files together.
