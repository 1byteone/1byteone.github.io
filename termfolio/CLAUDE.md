# Waleed Alhamed — Personal Website

## Overview

Terminal/CLI-themed personal website built with Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS. Features a journal (blog), about page, contact page, and interactive terminal components.

**Live URL**: https://waleedalghamdi.com

## Tech Stack

- **Framework**: Next.js 15 (App Router, static export via `next build`)
- **UI**: React 19, Tailwind CSS 3, custom CSS variables (`--term-*` design tokens)
- **Content**: Local markdown files in `content/posts/` with gray-matter frontmatter
- **Markdown pipeline**: unified → remark-parse → remark-gfm → remark-rehype → rehype-slug → rehype-highlight → rehype-react
- **Email**: Resend API (newsletter subscribe + new-post notifications)
- **Comments**: Giscus (GitHub Discussions)
- **Analytics**: Vercel Analytics + Speed Insights
- **Fonts**: IBM Plex Mono (UI), Source Serif 4 (reading), Noto Naskh Arabic (Arabic posts)

## Project Structure

```
app/
  page.tsx          — Home page (boot terminal, hero, recent posts)
  about/page.tsx    — About/resume page
  blog/page.tsx     — Journal listing (search, heatmap, filters)
  blog/[slug]/      — Individual blog post (reading controls, ToC, comments)
  contact/page.tsx  — Contact page (Cal.com embed, newsletter)
  not-found.tsx     — Custom 404 page
  sitemap.ts        — Dynamic sitemap generation
  robots.ts         — Robots.txt configuration
  api/subscribe/    — Newsletter subscription endpoint (Resend)
  api/notify/       — New-post notification endpoint (Resend, secret-protected)
  layout.tsx        — Root layout (fonts, theme provider, analytics)
  globals.css       — CSS variables, themes, RTL styles

components/
  boot-terminal.tsx      — Interactive terminal with commands (snake, pokedex, etc.)
  markdown-render.tsx    — Markdown-to-React renderer (unified pipeline)
  reading-controls.tsx   — Reading theme, font size, focus mode, progress bar
  table-of-contents.tsx  — Sidebar ToC with scroll tracking
  writing-heatmap.tsx    — Vertical GitHub-style writing activity heatmap
  journal-client.tsx     — Client-side journal page (filters, tag cloud, sidebar)
  blog-post-card.tsx     — Blog post card component
  halftone-image.tsx     — Canvas-based halftone image effect
  newsletter-signup.tsx  — Email subscription form
  terminal-footer.tsx    — Site-wide footer
  minimal-nav.tsx        — Site-wide navigation

lib/
  posts.ts              — Markdown post loader (getAllPosts, getPostBySlug, headings)
  format-post-date.ts   — Date formatting utility

content/
  posts/*.md            — Blog posts (frontmatter: title, date, tags, status, language)
  site.ts               — Site configuration (name, bio, experience, skills, socials)
```

## Design System

### CSS Variables (Design Tokens)

All colors use `--term-*` CSS custom properties defined in `globals.css`:
- `--term-black`, `--term-darker`, `--term-dark` — backgrounds
- `--term-white`, `--term-gray` — text
- `--term-line` — borders
- `--term-cyan`, `--term-cyan-bright` — accent/links
- `--term-green`, `--term-amber` — semantic colors

### Reading Themes

Three reading themes for blog posts, implemented via CSS variable scoping:
- **Terminal** (default) — dark terminal aesthetic
- **Light** — `.reading-theme-light` overrides all `--term-*` variables
- **Sepia** — `.reading-theme-sepia` overrides all `--term-*` variables

To add a new theme: add a `.reading-theme-<name>` class in `globals.css` that overrides the `--term-*` variables. All components automatically pick up the new values.

### RTL / Arabic Support

Posts with `language: "ar"` in frontmatter render RTL:
- `dir="rtl"` and `lang="ar"` on the `.post-content` wrapper
- `.font-arabic` class applies `Noto Naskh Arabic` font
- RTL-specific CSS handles list padding, blockquote borders, text alignment
- Heading IDs use `github-slugger` (same as `rehype-slug`) for ToC alignment

## Content Management

### Adding a Blog Post

Create a `.md` file in `content/posts/`:

```yaml
---
title: "Post Title"
date: "2026-01-15"
author: "Waleed Alhamed"
excerpt: "Brief description"
coverImage: "/images/blog/cover.jpg"
tags: ["strategy", "technology"]
status: "published"    # "draft" posts are hidden
language: "en"         # "ar" for Arabic RTL
---

Markdown content here...
```

### Frontmatter Fields

| Field | Required | Default | Notes |
|-------|----------|---------|-------|
| title | yes | "Untitled" | |
| date | yes | now | ISO date string |
| author | no | "Waleed Alhamed" | |
| excerpt | no | "" | Used in cards and OG tags |
| coverImage | no | none | Path relative to public/ |
| tags | no | [] | Array of strings |
| status | yes | "draft" | Must be "published" to show |
| language | no | "en" | "ar" enables RTL |

## API Routes

### POST /api/subscribe
- Adds email to Resend audience
- Rate limited: 5 requests/minute per IP
- Anti-enumeration: "already exists" returns success

### POST /api/notify
- Sends new-post email to all subscribers
- Requires `x-notify-secret` header matching `NOTIFY_SECRET` env var
- Rate limited: 2 requests/hour per IP
- HTML-escapes all user content in email template

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | yes | Resend API key for email |
| `RESEND_AUDIENCE_ID` | yes | Resend audience ID |
| `RESEND_FROM_EMAIL` | no | Sender email (default: `Waleed <noreply@walhamed.com>`) |
| `NOTIFY_SECRET` | yes | Secret for notify endpoint auth |
| `NEXT_PUBLIC_SITE_URL` | no | Site URL (default: `https://waleedalghamdi.com`) |
| `NEXT_PUBLIC_NASA_API_KEY` | no | NASA APOD widget API key |

## Commands

```bash
npm run dev        # Development server
npm run build      # Production build
npm run lint       # ESLint
npm run typecheck  # TypeScript check (no emit)
npm run check      # Lint + typecheck + build
```

## Security

- HSTS + CSP headers configured in `next.config.mjs`
- Rate limiting on all API routes (in-memory, per-IP)
- Timing-safe secret comparison on notify endpoint
- HTML escaping in email templates
- Input validation with length limits on all endpoints
- Anti-enumeration on subscribe (duplicate emails return success)
