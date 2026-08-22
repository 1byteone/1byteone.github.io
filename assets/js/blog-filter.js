/**
 * Blog list filtering and pagination — no dependencies, no framework.
 *
 * Data contract (set by layouts/docs/blog.html):
 *   [data-blog-list]     — section wrapping the list, empty state, pagination
 *   [data-article-grid]  — grid of article cards
 *   [data-article]       — each article card; carries data-tags="a,b,c"
 *   [data-featured-section] — picked (hero) article card
 *   [data-tag-filter]    — container of [data-tag] pills
 *   [data-empty-state]   — shown when a filter yields nothing
 *   [data-pagination]    — populated with page-number buttons
 *   [data-article-count] — text node with total article count
 *   [data-last-updated]  — text node with last-updated date
 *
 * URL state: ?tag=<name>&page=<n> via history.pushState (no reload).
 */
(function () {
  'use strict';

  var PER_PAGE = 7;

  var grid = document.querySelector('[data-article-grid]');
  var featuredSection = document.querySelector('[data-featured-section]');
  var tagFilter = document.querySelector('[data-tag-filter]');
  var listSection = document.querySelector('[data-blog-list]');
  var emptyState = document.querySelector('[data-empty-state]');
  var paginationSlot = document.querySelector('[data-pagination]');
  var articleCountEl = document.querySelector('[data-article-count]');

  var allArticles = Array.prototype.slice.call(
    document.querySelectorAll('[data-article]')
  );

  var currentTag = 'all';
  var currentPage = 1;

  function searchParams() {
    if (typeof URLSearchParams !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    var params = {};
    var query = window.location.search.replace(/^\?/, '');
    if (!query) return params;
    query.split('&').forEach(function (pair) {
      var parts = pair.split('=');
      params[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1] || '');
    });
    return params;
  }

  function getParam(params, key) {
    if (params instanceof URLSearchParams) return params.get(key);
    return params[key];
  }

  function normalizeTag(value) {
    return String(value || '').trim().toLowerCase();
  }

  function matchesTag(article, tag) {
    if (tag === 'all') return true;
    var articleTags = String(article.getAttribute('data-tags') || '').split(',');
    for (var i = 0; i < articleTags.length; i++) {
      if (normalizeTag(articleTags[i]) === tag) return true;
    }
    return false;
  }

  function featuredIncluded(article) {
    // The picked/honor article lives only in [data-featured-section].
    return featuredSection && featuredSection.querySelector('[data-article]') === article;
  }

  function filteredArticles() {
    var out = [];
    allArticles.forEach(function (article) {
      if (matchesTag(article, currentTag)) {
        out.push(article);
      }
    });
    return out;
  }

  function showArticle(article, show) {
    article.style.display = show ? '' : 'none';
  }

  function applyState() {
    var filtered = filteredArticles();
    var totalArticles = filtered.length;
    var totalPages = Math.max(1, Math.ceil(totalArticles / PER_PAGE));
    if (currentPage > totalPages) currentPage = totalPages;

    // Hide everything first, then reveal the current page.
    allArticles.forEach(function (article) {
      showArticle(article, false);
    });
    var start = (currentPage - 1) * PER_PAGE;
    var pageSlice = filtered.slice(start, start + PER_PAGE);
    pageSlice.forEach(function (article) {
      showArticle(article, true);
    });

    // Update the hero section: hide when it would be filtered out.
    if (featuredSection) {
      var heroArticle = featuredSection.querySelector('[data-article]');
      var heroVisible = heroArticle && matchesTag(heroArticle, currentTag);
      featuredSection.style.display = heroVisible ? '' : 'none';
    }

    // Empty state.
    if (emptyState) {
      emptyState.classList.toggle('hidden', totalArticles !== 0);
    }

    // Pagination.
    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    if (!paginationSlot) return;
    if (totalPages <= 1) {
      paginationSlot.innerHTML = '';
      return;
    }

    var html = '<nav class="mt-12 flex items-center justify-center gap-1.5" aria-label="Pagination">';

    // Previous.
    if (currentPage > 1) {
      html +=
        '<a href="' + pageHref(currentPage - 1) + '" data-page="' + (currentPage - 1) +
        '" rel="prev" aria-label="Previous page" class="inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] hover:bg-gray-50 dark:hover:bg-white/[0.08] transition-colors duration-200">‹</a>';
    } else {
      html += '<span aria-hidden="true" class="inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm text-gray-300 dark:text-gray-600 cursor-default">‹</span>';
    }

    // Page numbers (smart ellipse).
    var neighbours = 1;
    for (var page = 1; page <= totalPages; page++) {
      var show =
        page === 1 ||
        page === totalPages ||
        (page >= currentPage - neighbours && page <= currentPage + neighbours);
      if (!show) {
        var lastSpan = html.lastIndexOf('</a>');
        var lastWasEllipsis = html.substr(lastSpan + 4, 1) === '…';
        if (!lastWasEllipsis) {
          html += '<span aria-hidden="true" class="px-1 text-sm text-gray-400 dark:text-gray-500">…</span>';
        }
        continue;
      }
      if (page === currentPage) {
        html += '<span aria-current="page" class="inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold bg-primary-600 text-white">' + page + '</span>';
      } else {
        html += '<a href="' + pageHref(page) + '" data-page="' + page + '" aria-label="Page ' + page + '" class="inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] hover:bg-gray-50 dark:hover:bg-white/[0.08] transition-colors duration-200">' + page + '</a>';
      }
    }

    // Next.
    if (currentPage < totalPages) {
      html +=
        '<a href="' + pageHref(currentPage + 1) + '" data-page="' + (currentPage + 1) +
        '" rel="next" aria-label="Next page" class="inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] hover:bg-gray-50 dark:hover:bg-white/[0.08] transition-colors duration-200">›</a>';
    } else {
      html += '<span aria-hidden="true" class="inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm text-gray-300 dark:text-gray-600 cursor-default">›</span>';
    }

    html += '</nav>';
    paginationSlot.innerHTML = html;

    // Attach click handlers that update state without reloading.
    Array.prototype.forEach.call(paginationSlot.querySelectorAll('[data-page]'), function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        goToPage(parseInt(link.getAttribute('data-page'), 10));
      });
    });
  }

  function pageHref(page) {
    var params = searchParams();
    var qs = '';
    if (currentTag !== 'all') params.tag = currentTag;
    else delete params.tag;
    if (page > 1) params.page = page;
    else delete params.page;
    qs = serializeParams(params);
    return qs ? window.location.pathname + '?' + qs : window.location.pathname;
  }

  function serializeParams(params) {
    var pairs = [];
    Object.keys(params).forEach(function (key) {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
      }
    });
    return pairs.join('&');
  }

  function selectTagPill(tag) {
    if (!tagFilter) return;
    Array.prototype.forEach.call(tagFilter.querySelectorAll('[data-tag]'), function (pill) {
      var active = pill.getAttribute('data-tag') === tag;
      pill.classList.toggle('bg-primary-600', active);
      pill.classList.toggle('text-white', active);
      pill.classList.toggle('border-primary-600', active);
      pill.classList.toggle('hover:bg-primary-50', !active);
      pill.classList.toggle('dark:hover:bg-primary-900/20', !active);
      pill.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function updateArticleCount(count) {
    if (!articleCountEl) return;
    var label = articleCountEl;
    // The count element contains "N 篇文章" / "N articles".
    var text = label.textContent || '';
    label.textContent = text.replace(/\d+/, String(count));
  }

  function goToPage(page) {
    currentPage = page;
    syncUrl();
    applyState();
  }

  function setTag(tag) {
    currentTag = tag;
    currentPage = 1;
    syncUrl();
    selectTagPill(tag);
    applyState();
  }

  function syncUrl() {
    var params = searchParams();
    if (currentTag !== 'all') params.set('tag', currentTag);
    else params.delete('tag');
    if (currentPage > 1) params.set('page', String(currentPage));
    else params.delete('page');
    var qs = params.toString();
    var url = qs ? window.location.pathname + '?' + qs : window.location.pathname;
    if (window.history && window.history.pushState) {
      window.history.pushState({ tag: currentTag, page: currentPage }, '', url);
    }
  }

  function readState() {
    var params = searchParams();
    currentTag = normalizeTag(getParam(params, 'tag')) || 'all';
    var page = parseInt(getParam(params, 'page'), 10);
    currentPage = isNaN(page) || page < 1 ? 1 : page;
  }

  function init() {
    readState();

    if (tagFilter) {
      Array.prototype.forEach.call(tagFilter.querySelectorAll('[data-tag]'), function (pill) {
        pill.addEventListener('click', function (e) {
          e.preventDefault();
          setTag(pill.getAttribute('data-tag'));
        });
      });
    }

    selectTagPill(currentTag);
    applyState();
    updateArticleCount(filteredArticles().length);

    // Keep a stamped count for the "all" label even when filtered.
    if (articleCountEl && !articleCountEl.hasAttribute('data-total')) {
      articleCountEl.setAttribute('data-total', String(allArticles.length));
    }
  }

  window.addEventListener('popstate', function () {
    readState();
    selectTagPill(currentTag);
    applyState();
    updateArticleCount(filteredArticles().length);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();