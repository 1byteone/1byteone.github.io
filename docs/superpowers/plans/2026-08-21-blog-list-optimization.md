# Blog List Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the blog list page from a functional card layout to an SEO-optimized, performance-tuned, accessibility-compliant content hub with polished UX micro-interactions.

**Architecture:** All changes are confined to `layouts/docs/blog.html` (template) and `assets/js/blog-filter.js` (client-side). No new Hugo modules, no external JS dependencies, no changes to HugoBlox templates or module cache.

**Tech Stack:** Hugo 0.162 + Tailwind CSS 4, npm 10.9.3, Node 22, vanilla JS.

**Spec:** Audit findings from 2026-08-21 session — SEO gaps (missing `rel="prev"`/`rel="next"` in `<head>`, missing `itemListElement` JSON-LD), performance gaps (PNG images, no `srcset`), accessibility gaps (no `role` attributes, H1→H3 heading jump, missing `alt` on 2 images), UX gaps (no back-to-top, no animation on filter transition).

## Global Constraints

- Hugo 0.162.0 extended, Node 22, npm 10.9.3, Tailwind CSS 4.2.4
- Only modify `layouts/docs/blog.html` (template) and `assets/js/blog-filter.js` (client-side JS)
- No external JS dependencies, no framework
- Dark mode must be supported
- Must be bilingual (zh/en)
- No modification to Hugo module cache or HugoBlox templates
- Existing `data-*` attribute contract between template and JS must be preserved
- All existing i18n keys must be used; no new i18n keys needed

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `layouts/docs/blog.html` | Modify | SEO meta in `<head>`, image optimization, semantic HTML, JSON-LD, structured data |
| `assets/js/blog-filter.js` | Modify | Back-to-top button, scroll-to-top on pagination, filter transition animation, `rel="prev"`/`rel="next"` in head |

---

### Task 1: SEO meta tags and structured data

**Files:**
- Modify: `layouts/docs/blog.html`

**Changes:**

1. **Add `rel="prev"`/`rel="next"` to `<head>`**
   - HugoBlox's `baseof.html` already handles `<head>`, but we can inject these via the template's `define "main"` block by using `{{ .Store }}` or by appending to the page's head via a deferred partial.
   - Since Hugo templates cannot inject into `<head>` from a `define "main"` block in a standard baseof, the approach is: add a `{{ define "head" }}` block override in the template, or use a deferred partial.
   - Actually, HugoBlox's `baseof.html` uses `{{ block "head" . }}{{ end }}`. If we define `{{- define "head" -}}` in our template, it will inject into `<head>`.
   - Check HugoBlox `baseof.html` to confirm the block name.

2. **Add `BreadcrumbList` JSON-LD**
   - Home > Blog
   - Inject via `{{ define "head" }}` block

3. **Add `articleSection` and `keywords` to article cards**
   - Use `itemprop` attributes on article cards

**Implementation details:**

```html
{{- define "head" -}}
{{ $page := . }}
{{/* Pagination prev/next for SEO */}}
{{ if $page.Paginator }}
  {{ if $page.Paginator.HasPrev }}
  <link rel="prev" href="{{ $page.Paginator.Prev.URL | absURL }}">
  {{ end }}
  {{ if $page.Paginator.HasNext }}
  <link rel="next" href="{{ $page.Paginator.Next.URL | absURL }}">
  {{ end }}
{{ end }}
{{/* BreadcrumbList JSON-LD */}}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": {{ i18n "home" | default "Home" | jsonify }},
    "item": "{{ site.BaseURL }}"
  },{
    "@type": "ListItem",
    "position": 2,
    "name": {{ $page.Title | jsonify }},
    "item": "{{ $page.Permalink }}"
  }]
}
</script>
{{- end -}}
```

**Note:** The `{{ define "head" }}` override approach works only if HugoBlox's `baseof.html` calls `{{ block "head" . }}{{ end }}`. We need to verify this. If not, we can use a deferred partial or inject the schema via the footer area with a `<script>` tag.

**Fallback:** If `define "head"` is not available, inject JSON-LD and meta tags as a `<script>` block at the end of the template (before `</body>`) — Google still processes it.

---

### Task 2: Semantic HTML, microdata, and accessibility

**Files:**
- Modify: `layouts/docs/blog.html`

**Changes:**

1. **Add `role` attributes to major sections**
   - `role="main"` on the main content section
   - `role="navigation"` on the tag filter bar
   - `role="article"` on each article card (implicit with `<article>`, but explicit is better)
   - `role="feed"` on the article grid

2. **Fix heading hierarchy**
   - Current: H1 → H2 (featured) → H3 (grid cards) → but grid cards use H3 directly after H1
   - Fix: Keep H1 for page title, H2 for featured article title, H3 for grid article titles
   - This is actually the current structure, which is correct. The issue is that the `<h1>` in the page content duplicates the `<h1>` in the page header. Audit confirmed H1 → H2 → H3 is correct.

3. **Add `itemprop` microdata to article cards**
   - `itemscope itemtype="https://schema.org/Article"` on `<article>`
   - `itemprop="headline"` on title
   - `itemprop="description"` on summary
   - `itemprop="image"` on featured image
   - `itemprop="datePublished"` on date
   - `itemprop="author"` on author
   - `itemprop="keywords"` on tags

4. **Ensure all images have `alt` text**
   - Check: the 2 missing `alt` images are from Chinese-encoded titles that get truncated
   - Fix: Use `{{ $item.Title | plainify }}` instead of raw `$item.Title` for `alt` attribute

5. **Add `sr-only` text for screen readers**
   - Add visually hidden labels for tag filter and pagination

---

### Task 3: Image optimization and performance

**Files:**
- Modify: `layouts/docs/blog.html`

**Changes:**

1. **Use WEBP format via Hugo's image processing**
   - Hugo automatically outputs WEBP when using `.Fill` with `.RelPermalink` if the config enables it
   - Check: `config/_default/hugo.yaml` has `imaging.resampleFilter: lanczos` and `quality: 90`
   - HugoBlox handles WEBP conversion automatically through its image processing pipeline
   - The current template uses `.Fill "918x517 Smart"` which Hugo processes, but the output format depends on the source image
   - To force WEBP: use `.Fill "918x517 Smart webp"` — but this requires Hugo 0.134+
   - Actually, Hugo 0.162 supports format hint: `.Fill "918x517 Smart webp"`
   - Add `format="webp"` to the Fill call

2. **Add `srcset` and `sizes` for responsive images**
   - Generate multiple sizes: 480w, 768w, 918w
   - Use `.Resize` for each size
   - Add `srcset` attribute with widths

3. **Add explicit `width` and `height` to images**
   - Already present (`width="{{ .Width }}" height="{{ .Height }}"`), but need to ensure they're set on the `<img>` tag

**Implementation:**

```html
{{ $image := "" }}
{{ with $item.Resources.ByType "image" }}
  {{ with .GetMatch "*featured*" }}
    {{ $imageSmall := .Fill "480x270 Smart" }}
    {{ $imageMedium := .Fill "768x432 Smart" }}
    {{ $imageLarge := .Fill "918x517 Smart" }}
    {{ $image = $imageLarge }}
    {{ $srcset := printf "%s 480w, %s 768w, %s 918w" $imageSmall.RelPermalink $imageMedium.RelPermalink $imageLarge.RelPermalink }}
  {{ end }}
{{ end }}
{{ with $image }}
<a href="{{ $link }}" class="block aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-white/[0.06]" {{ $target | safeHTMLAttr }}>
  <img src="{{ .RelPermalink }}" srcset="{{ $srcset }}" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 459px" alt="{{ $item.Title | plainify }}" loading="lazy" width="{{ .Width }}" height="{{ .Height }}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
</a>
{{ end }}
```

---

### Task 4: UX enhancements and JS improvements

**Files:**
- Modify: `assets/js/blog-filter.js`

**Changes:**

1. **Add back-to-top button**
   - Show when scrolling past 500px
   - Smooth scroll to top
   - Fade in/out with opacity transition
   - Accessible: `aria-label="Back to top"`

2. **Add filter transition animation**
   - When filtering, add a brief CSS transition class to articles
   - Use `opacity` and `transform` transition
   - Duration: 200ms

3. **Scroll to grid on pagination change**
   - Already implemented (`scrollIntoView`), but ensure it targets the grid, not the whole page

4. **Add `rel="prev"`/`rel="next"` to `<head>` dynamically**
   - When JS initializes, check current page
   - Add `<link rel="prev">` and `<link rel="next">` to `<head>`
   - Update on page change

---

### Task 5: Integration verification

**Steps:**

1. `npm ci --ignore-scripts` — clean dependency install
2. `npm run build` — Hugo build + Pagefind indexing
3. Check build log for errors (no `ERROR`, no `SetInMap`, no `nil map`, no `not a Node.js script`)
4. Verify generated routes:
   - `public/blog/index.html` — zh blog list
   - `public/en/blog/index.html` — en blog list
5. For each blog list HTML:
   - `rel="prev"`/`rel="next"` in `<head>` (or in body for JSON-LD)
   - `BreadcrumbList` JSON-LD present
   - `itemprop="headline"` on article cards
   - `itemscope itemtype="http://schema.org/Article"` on article cards
   - `srcset` attribute on images
   - `role="feed"` on article grid
   - All images have `alt` attribute
   - Back-to-top button present in JS
   - No `ERROR` in build log
6. `git diff --check` — no whitespace errors
7. Final `npm ci --ignore-scripts` — lockfile unchanged