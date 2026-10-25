# Integrations And Environment Variables

## Integration Map

- Local markdown content
  - Files: `content/posts/*.md`, `lib/posts.ts`
  - Purpose: journal/notebook content source
  - Required env: none
- Site, Arabic, lab, and card config
  - Files: `content/site.ts`, `content/locale.ts`, `content/lab.ts`, `content/card.md`
  - Purpose: identity, resume, route copy, tools registry, lab experiments, and digital card data
  - Required env: none
- Resend
  - Files: `app/api/subscribe/route.ts`, `app/api/notify/route.ts`, `components/newsletter-signup.tsx`
  - Purpose: newsletter subscriptions and protected new-post notifications
- Giscus comments
  - File: `components/terminal-comment-section.tsx`
  - Purpose: comments on post pages through GitHub Discussions
- Cal.com
  - Files: `content/site.ts`, `components/cal-embed.tsx`, `app/contact/page.tsx`
  - Purpose: booking and scheduling links
- TinyURL/no-login shortener
  - File: `app/api/tools/shorten/route.ts`
  - Purpose: short link helper for `/tools/short-link`
- WalletWallet
  - Files: `app/api/card/wallet/route.ts`, `components/card-client.tsx`
  - Purpose: optional Apple Wallet pass for the digital card
- NASA APOD
  - Files: `app/api/apod/route.ts`, `components/apod-widget.tsx`
  - Purpose: astronomy/photo widget when enabled
- Vercel Analytics and Speed Insights
  - File: `app/layout.tsx`
  - Purpose: analytics and performance telemetry

There is no active Notion CMS requirement. Posts are read from markdown files in the repo.

## Environment Variables

| Variable | Used In | Required For Live Route | Notes |
| --- | --- | --- | --- |
| `RESEND_API_KEY` | `app/api/subscribe/route.ts`, `app/api/notify/route.ts` | Newsletter/notifications only | Required to add subscribers and send new-post emails. |
| `RESEND_AUDIENCE_ID` | `app/api/subscribe/route.ts` | Newsletter only | Resend audience/list ID. |
| `NOTIFY_SECRET` | `app/api/notify/route.ts` | Notifications only | Protects the notification endpoint. |
| `RESEND_FROM_EMAIL` | `app/api/notify/route.ts` | No | Optional sender override. |
| `NEXT_PUBLIC_SITE_URL` | metadata, email links, public URLs | No | Overrides `siteConfig.siteUrl` when provided. |
| `NEXT_PUBLIC_GISCUS_REPO` | `components/terminal-comment-section.tsx` | Comments only | Missing values trigger a fallback instead of a broken widget. |
| `NEXT_PUBLIC_GISCUS_REPO_ID` | `components/terminal-comment-section.tsx` | Comments only | Same as above. |
| `NEXT_PUBLIC_GISCUS_CATEGORY` | `components/terminal-comment-section.tsx` | Comments only | Same as above. |
| `NEXT_PUBLIC_GISCUS_CATEGORY_ID` | `components/terminal-comment-section.tsx` | Comments only | Same as above. |
| `NEXT_PUBLIC_NASA_API_KEY` | `app/api/apod/route.ts` | No | Optional APOD widget key. |
| `WALLETWALLET_API_KEY` | `app/api/card/wallet/route.ts` | Wallet only | Optional Apple Wallet pass generation. |

## Current Fallback Behavior

- Markdown posts
  - Drafts are filtered out by `lib/posts.ts`.
  - If a post is missing, the route returns `notFound()`.
- Comments
  - If any required Giscus value is missing, the comments component falls back gracefully.
- Newsletter
  - If Resend config is missing, subscription/notification endpoints return controlled errors.
- Short links
  - The shortener stores nothing locally. Failures are handled by the tool UI.
- Digital card
  - vCard generation is local.
  - Wallet pass generation requires `WALLETWALLET_API_KEY`.
- Arabic site
  - Arabic route chrome and UI copy are local in `content/locale.ts`.
  - Blog posts are not machine-translated automatically.

## Scripts

Use the package scripts as the source of truth:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run check`

## Current Risks

- Giscus depends on GitHub Discussions being configured correctly.
- The short-link tool depends on an external shortener being reachable.
- Wallet pass support depends on WalletWallet API availability and credentials.
- Some older Notion helper files may still exist as cleanup candidates, but they are not the active content path.
