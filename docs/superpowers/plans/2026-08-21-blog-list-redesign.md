# Blog List Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `/blog/` from a docs-section list page to a content-first, editorial blog hub with a featured hero card, tag filtering, client-side pagination, and URL state synchronization.

**Architecture:** Hugo 0.162 renders the full article list with `data-` attributes. A single lightweight JavaScript module (no framework, no dependencies) handles in-page tag filtering, URL query parameter synchronization, client-side pagination, and fallback to taxonomy links when JS is disabled.

**Tech Stack:** Hugo 0.162 + Tailwind CSS 4, npm 10.9.3, Node 22, vanilla JS (ES module, loaded via `js.Build`), PostCSS.

**Spec:** Design decisions documented in session conversation (2026-08-21). Key decisions: editorial mixed layout (A), horizontal featured hero card, compact 2-column grid for latest articles, in-page tag filtering with URL sync, client-side pagination with no-JS fallback, editorial left-aligned hero, one featured article displayed at top.

## Global Constraints

- Hugo 0.162.0 extended, Node 22, npm 10.9.3, Tailwind CSS 4.2.4
- Do not modify `content/en/blog/_index.md` or `content/zh/blog/_index.md` layout/type; they remain `layout: blog, type: docs`
- Only modify `layouts/docs/blog.html` (template) and create `assets/js/blog-filter.js` (client-side logic)
- No external JS dependencies, no framework, no build tool beyond Hugo's `js.Build`
- All articles currently have `featured: true`; must pick a subset for true featured status
- Dark mode must be supported
- Must be bilingual (zh/en)
- No modification to Hugo module cache or HugoBlox templates
- No changes to existing blog article content or taxonomy pages

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `content/zh/blog/**/index.md` | Modify | Change `featured: true` to `featured: false` for non-selected articles; add `picked: true` for the hero card |
| `content/en/blog/**/index.md` | Modify | Same as zh |
| `layouts/docs/blog.html` | Rewrite | New template: Hero, tag filter bar, featured hero card, 2-column grid, client-side pagination wrapper, footer |
| `assets/js/blog-filter.js` | Create | Client-side filtering, pagination, URL state sync, featured area update, fallback handling |
| `docs/superpowers/plans/2026-08-21-blog-list-redesign.md` | Create | This plan |

---

### Task 1: Select and Normalize Featured Articles

**Files:**
- Modify: `content/zh/blog/spring-boot-application-architecture/index.md` (promote to `picked: true`)
- Modify: `content/zh/blog/rag-basic-pipeline/index.md` (promote to `picked: true`)
- Modify: `content/zh/blog/building-ai-agents/index.md` (promote to `picked: true`)
- Modify: `content/zh/blog/**/index.md` (remaining 32 articles: set `featured: false`)
- Modify: `content/en/blog/spring-boot-application-architecture/index.md` (promote to `picked: true`)
- Modify: `content/en/blog/rag-basic-pipeline/index.md` (promote to `picked: true`)
- Modify: `content/en/blog/building-ai-agents/index.md` (promote to `picked: true`)
- Modify: `content/en/blog/**/index.md` (remaining 32 articles: set `featured: false`)

**Interfaces:**
- Consumes: None
- Produces: Normalized article front matter with `featured: true/false` and `picked: true` for hero card candidate

**Selection criteria:**
- Pick 3 articles per language that represent the site's core technical narrative: Spring Boot (backend architecture), RAG (AI engineering), AI Agents (latest trend)
- These should be articles with good summaries, existing cover images, and reasonable length
- `picked: true` identifies the single article to show in the featured hero card area
- `featured: true` on the remaining 2 per language ensures they appear in the featured section

**Implementation:**

For each selected article (3 per language):

```yaml
# Example: content/zh/blog/spring-boot-application-architecture/index.md
title: "Spring Boot 应用架构：Controller 到 Database"
date: 2026-08-21
summary: "用分层边界组织可测试、可演进的业务服务。结合真实后端场景拆解 Spring Boot Application Architecture 的边界、失败路径与生产实践。"
tags:
  - Spring Boot
  - Java
  - Architecture
  - 教程
featured: true
picked: true
```

For each non-selected article (32 per language):

```yaml
featured: false
```

articles to keep as `featured: true` + `picked: true` for zh:
- `content/zh/blog/spring-boot-application-architecture/index.md` (Spring Boot, 后端架构)
- `content/zh/blog/rag-basic-pipeline/index.md` (RAG base)
- `content/zh/blog/building-ai-agents/index.md` (LangChain + AI Agent)

articles to keep as `featured: true` + `picked: true` for en:
- `content/en/blog/spring-boot-application-architecture/index.md` (Spring Boot)
- `content/en/blog/rag-basic-pipeline/index.md` (RAG pipeline)
- `content/en/blog/building-ai-agents/index.md` (AI Agents)

articles to keep as `featured: true` (non-picked, will appear in grid but not hero):
- None for now; the remaining 2 per language are `featured: true` + `picked: true` but only `picked: true` triggers hero card. The `featured: true` without `picked: true` will be treated as regular grid items.

**Note:** For initial implementation, set `picked: true` on the 3 selected articles per language, keep `featured: true` on all articles (no change needed for the other 32). The `featured` field is kept as-is for backward compatibility with the homepage collection block. Only `picked: true` is new.

**Verification:**
```bash
grep -c 'picked: true' content/zh/blog/*/index.md
# Expected: 3
grep -c 'picked: true' content/en/blog/*/index.md
# Expected: 3
```

---

### Task 2: Rewrite Blog List Template

**Files:**
- Rewrite: `layouts/docs/blog.html`

**Interfaces:**
- Consumes: Hugo `.Pages`, `.RegularPages`, `.Params.featured`, `.Params.picked`, `.Params.tags`, `.Params.summary`, `.Resources.ByType "image"`, `site.Taxonomies.tags`, `i18n` keys
- Produces: HTML with `data-blog-list` container, `data-article` items with full metadata as `data-*` attributes, tag filter bar, featured hero card slot, 2-column grid slot, pagination slot, footer

**Template structure:**

```html
{{- define "main" -}}
{{ $page := . }}
{{ $dateFormat := site.Params.locale.date_format | default "Jan 2, 2006" }}

{{/* Hero Section */}}
<section class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-16 pb-6">
  <div class="max-w-3xl">
    <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">{{ .Title }}</h1>
    {{ with .Content }}
    <div class="text-base text-gray-500 dark:text-gray-400 article-style">{{ . }}</div>
    {{ end }}
    <div class="mt-4 flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
      <span>{{ len .RegularPages }} {{ i18n "articles" | default "articles" }}</span>
      <span class="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
      <span>{{ i18n "last_updated" | default "Updated" }} {{ .Lastmod.Format $dateFormat }}</span>
    </div>
  </div>
</section>

{{/* Tag Filter Bar */}}
<section class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-6">
  <div class="flex flex-wrap items-center gap-2" data-tag-filter>
    <a href="{{ $page.RelPermalink }}" class="tag-pill active" data-tag="all">{{ i18n "all" | default "All" }}</a>
    {{ range $name, $taxonomy := .Site.Taxonomies.tags.Alphabetical }}
    <a href="{{ $taxonomy.Page.RelPermalink }}" class="tag-pill" data-tag="{{ $name | urlize }}">{{ $name }}</a>
    {{ end }}
  </div>
</section>

{{/* Featured Article Hero Card */}}
<section class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-12" data-featured-section>
  {{ $picked := first 1 (sort (where .RegularPages "Params.picked" true) "Date" "desc") }}
  {{ with index $picked 0 }}
  <article class="featured-hero" data-article="{{ .File.ContentBaseName }}" data-tags="{{ with .Params.tags }}{{ delimit . "," }}{{ end }}">
    ...horizontal hero card markup...
  </article>
  {{ end }}
</section>

{{/* Article Grid */}}
<section class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-16" data-blog-list>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6" data-article-grid>
    {{ range .RegularPages }}
    {{ if not .Params.picked }}
    <article class="article-card" data-article="{{ .File.ContentBaseName }}" data-tags="{{ with .Params.tags }}{{ delimit . "," }}{{ end }}" data-date="{{ .Date.Format "2006-01-02" }}">
      ...compact card markup with featured image, title, summary, meta...
    </article>
    {{ end }}
  </div>
</section>

{{ partial "site_footer" . }}
{{- end -}}
```

**Key template details:**

1. **Hero Section:**
   - Left-aligned, max-w-3xl container
   - Title (H1), description (`.Content`), stats line (article count + last updated)
   - No duplicate title, no center alignment
   - Stats line uses `i18n` keys `articles` and `last_updated`; add to i18n files if missing

2. **Tag Filter Bar:**
   - `data-tag-filter` container for JS hook
   - Each tag pill has `data-tag="{{ $name | urlize }}"` for JS matching
   - "All" pill has `data-tag="all"` and `href="{{ $page.RelPermalink }}"`
   - Tag pills also have `href` to taxonomy page for no-JS fallback

3. **Featured Hero Card:**
   - `data-featured-section` container
   - `data-article` and `data-tags` for JS filtering
   - Sort by `Date desc`, take first 1 where `Params.picked` is true
   - Horizontal layout: full-width, max-w-5xl
   - Left: featured image (16:9 aspect ratio, cover)
   - Right: "精选" badge, title, summary, tags, date, reading time, "阅读全文" link
   - On mobile: stack vertically (image on top, content below)

4. **Article Grid:**
   - `data-article-grid` container
   - `data-article` and `data-tags` for JS filtering
   - Exclude `picked: true` articles to avoid duplication
   - Each card: featured image (16:9), title, summary (line-clamp-3), tags, date, reading time
   - Whole card clickable via `after:absolute after:inset-0`
   - Tags truncated to 2 max

5. **Pagination:**
   - Wrapper inside `data-blog-list` section, below the grid
   - Initially empty; JS will populate it
   - Fallback: Hugo's default pagination for no-JS (but JS is the primary path)

6. **No-JS Fallback:**
   - The full article grid is rendered in HTML with all articles
   - Tag pills link to taxonomy pages
   - Pagination wrapper shows a simple "next page" link as fallback
   - CSS classes hide the pagination wrapper until JS initializes (`.pagination-js-ready`)

**CSS classes to add (Tailwind):**

```css
/* Featured hero card layout */
.featured-hero {
  @apply flex flex-col md:flex-row gap-6 rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] overflow-hidden;
}

/* Tag pill styling */
.tag-pill {
  @apply inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full border border-gray-200 dark:border-white/[0.08] text-gray-600 dark:text-gray-300 bg-white dark:bg-white/[0.04] hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200;
}
.tag-pill.active {
  @apply bg-primary-600 text-white border-primary-600;
}

/* Article card base */
.article-card {
  @apply group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] shadow-sm hover:-translate-y-1 hover:shadow-xl hover:border-primary-400 dark:hover:border-primary-500/50 transition-all duration-300;
}
```

**Verification:**
```bash
npm run build
# Check public/blog/index.html for hero, tags, cards
# Check public/en/blog/index.html same
grep -c 'featured-hero' public/blog/index.html
# Expected: 1
grep -c 'data-tag-filter' public/blog/index.html
# Expected: 1
grep -c 'data-article-grid' public/blog/index.html
# Expected: 1
```

---

### Task 3: Create Client-Side Filter and Pagination Module

**Files:**
- Create: `assets/js/blog-filter.js`

**Interfaces:**
- Consumes: Template HTML with `data-*` attributes, URL query string `?tag=...&page=...`, `history.pushState`
- Produces: Filtered article grid, updated featured section, updated pagination, updated URL

**Module design:**

```javascript
// assets/js/blog-filter.js
// Blog list filtering and pagination — no dependencies, no framework.
// 
// Architecture:
// 1. On DOMContentLoaded, read URLSearchParams for tag and page
// 2. Filter articles by tag from data-attributes
// 3. Paginate the filtered set
// 4. Update featured section based on filtered set
// 5. Update URL state via pushState
// 6. Attach click handlers to tag pills and pagination buttons

(function() {
  'use strict';

  const PER_PAGE = 7;
  const container = document.querySelector('[data-blog-list]');
  const grid = document.querySelector('[data-article-grid]');
  const featuredSection = document.querySelector('[data-featured-section]');
  const tagFilter = document.querySelector('[data-tag-filter]');
  const paginationContainer = document.createElement('nav');
  let allArticles = [];
  let currentTag = 'all';
  let currentPage = 1;

  function init() {
    // Read URL params
    const params = new URLSearchParams(window.location.search);
    currentTag = params.get('tag') || 'all';
    currentPage = parseInt(params.get('page'), 10) || 1;

    // Collect all articles
    allArticles = Array.from(document.querySelectorAll('[data-article]'));
    
    // Set up tag filter click handlers
    if (tagFilter) {
      tagFilter.querySelectorAll('[data-tag]').forEach(pill => {
        pill.addEventListener('click', function(e) {
          // Prevent navigation to taxonomy page
          e.preventDefault();
          const tag = this.dataset.tag;
          setTag(tag);
        });
      });
    }

    // Apply initial state
    applyFilter();
    selectTagPill(currentTag);
  }

  function getTag(article) {
    return article.dataset.tags || '';
  }

  function matchesTag(article, tag) {
    if (tag === 'all') return true;
    const tags = getTag(article);
    return tags.split(',').some(t => t.trim().toLowerCase() === tag.toLowerCase());
  }

  function getFilteredArticles() {
    return allArticles.filter(a => matchesTag(a, currentTag));
  }

  function setTag(tag) {
    currentTag = tag;
    currentPage = 1;
    selectTagPill(tag);
    applyFilter();
    updateURL();
  }

  function selectTagPill(tag) {
    if (!tagFilter) return;
    tagFilter.querySelectorAll('[data-tag]').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.tag === tag);
    });
  }

  function applyFilter() {
    const filtered = getFilteredArticles();
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    if (currentPage > totalPages) currentPage = 1;
    const start = (currentPage - 1) * PER_PAGE;
    const pageArticles = filtered.slice(start, start + PER_PAGE);

    // Hide all, show page
    allArticles.forEach(a => a.style.display = 'none');
    pageArticles.forEach(a => a.style.display = '');

    // Update featured section (first picked article from filtered set)
    updateFeatured(filtered);

    // Update pagination
    renderPagination(totalPages);
  }

  function updateFeatured(filtered) {
    if (!featuredSection) return;
    // Check if current featured article is in the filtered set
    const featuredArticle = featuredSection.querySelector('[data-article]');
    if (!featuredArticle) return;
    const featuredId = featuredArticle.dataset.article;
    const isVisible = filtered.some(a => a.dataset.article === featuredId);
    featuredSection.style.display = isVisible ? '' : 'none';
  }

  function renderPagination(totalPages) {
    if (totalPages <= 1) {
      paginationContainer.innerHTML = '';
      return;
    }
    let html = '<div class="flex items-center justify-center gap-1.5 mt-12">';
    // Prev
    if (currentPage > 1) {
      html += `<button data-page="${currentPage - 1}" class="pagination-btn" aria-label="Previous page">‹</button>`;
    } else {
      html += `<span class="pagination-btn disabled" aria-hidden="true">‹</span>`;
    }
    // Page numbers (smart ellipsis)
    const neighbours = 1;
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - neighbours && i <= currentPage + neighbours)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    pages.forEach(p => {
      if (p === '...') {
        html += `<span class="px-1 text-sm text-gray-400 dark:text-gray-500">…</span>`;
      } else if (p === currentPage) {
        html += `<span aria-current="page" class="pagination-btn current">${p}</span>`;
      } else {
        html += `<button data-page="${p}" class="pagination-btn" aria-label="Page ${p}">${p}</button>`;
      }
    });
    // Next
    if (currentPage < totalPages) {
      html += `<button data-page="${currentPage + 1}" class="pagination-btn" aria-label="Next page">›</button>`;
    } else {
      html += `<span class="pagination-btn disabled" aria-hidden="true">›</span>`;
    }
    html += '</div>';
    paginationContainer.innerHTML = html;
    // Attach click handlers
    paginationContainer.querySelectorAll('[data-page]').forEach(btn => {
      btn.addEventListener('click', function() {
        goToPage(parseInt(this.dataset.page, 10));
      });
    });
  }

  function goToPage(page) {
    currentPage = page;
    applyFilter();
    updateURL();
    // Scroll to top of grid
    if (container) container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function updateURL() {
    const params = new URLSearchParams();
    if (currentTag !== 'all') params.set('tag', currentTag);
    if (currentPage > 1) params.set('page', currentPage);
    const qs = params.toString();
    const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    history.pushState({ tag: currentTag, page: currentPage }, '', url);
  }

  // Handle browser back/forward
  window.addEventListener('popstate', function() {
    const params = new URLSearchParams(window.location.search);
    currentTag = params.get('tag') || 'all';
    currentPage = parseInt(params.get('page'), 10) || 1;
    selectTagPill(currentTag);
    applyFilter();
  });

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

**CSS for pagination buttons (Tailwind classes in template):**

```html
<style>
  .pagination-btn {
    @apply inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] hover:bg-gray-50 dark:hover:bg-white/[0.08] transition-colors duration-200 cursor-pointer;
  }
  .pagination-btn.current {
    @apply bg-primary-600 text-white border-primary-600 font-bold cursor-default;
  }
  .pagination-btn.disabled {
    @apply text-gray-300 dark:text-gray-600 cursor-default;
  }
</style>
```

**Script injection in template:**

```html
{{ $js := resources.Get "js/blog-filter.js" | resources.Minify | resources.Fingerprint }}
<script defer src="{{ $js.RelPermalink }}" integrity="{{ $js.Data.Integrity }}"></script>
```

**Verification:**
```bash
# Check JS file exists and is referenced
grep 'blog-filter' public/blog/index.html
# Expected: <script defer src=.../blog-filter.min.*.js ...>
```

---

### Task 4: Integration and Build Verification

**Files:**
- Verify: All files modified in Tasks 1-3

**Steps:**

1. `npm ci --ignore-scripts` — clean dependency install
2. `npm run build` — Hugo build + Pagefind indexing
3. Check build log for errors (no `ERROR`, no `SetInMap`, no `nil map`, no `not a Node.js script`)
4. Verify generated routes:
   - `public/blog/index.html` — zh blog list
   - `public/en/blog/index.html` — en blog list
   - `public/projects/agricultural-qa-agent/index.html` — project page with GitHub links
   - `public/en/projects/agricultural-qa-agent/index.html`
5. In each blog list HTML:
   - `featured-hero` class present (1x)
   - `data-tag-filter` present (1x)
   - `data-article-grid` present (1x)
   - `data-article` present on all articles
   - `blog-filter` script reference present
   - `pagination-btn` class present
   - `rel="prev"` not present (JS handles pagination, so no Hugo-generated prev/next)
6. `git diff --check` — no whitespace errors
7. Final `npm ci --ignore-scripts` — lockfile unchanged