(function () {
  'use strict';

  var root = document.body;
  if (!root) return;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('alxian-js');

  function t(zh, en) {
    return root.dataset.lang === 'zh' ? zh : en;
  }
  var apiBase = (root.dataset.apiBase || '').replace(/\/+$/, '');
  function apiUrl(path) { return apiBase + path; }

  function readStorage(key) {
    try { return window.localStorage.getItem(key); } catch (_) { return null; }
  }

  function writeStorage(key, value) {
    try { window.localStorage.setItem(key, value); return true; } catch (_) { return false; }
  }

  function removeStorage(key) {
    try { window.localStorage.removeItem(key); } catch (_) {}
  }

  function setActive(button, selector) {
    document.querySelectorAll(selector).forEach(function (item) {
      item.classList.toggle('is-active', item === button);
    });
  }

  document.querySelectorAll('[data-filter]').forEach(function (button) {
    button.addEventListener('click', function () {
      setActive(button, '[data-filter]');
      var filter = button.getAttribute('data-filter');
      document.querySelectorAll('[data-entry-card]').forEach(function (card) {
        card.hidden = filter !== 'all' && card.dataset.featured !== 'true';
      });
    });
  });
  var entryCarousel = document.querySelector('.alxian-entry-grid.is-works');
  if (entryCarousel) {
    var carouselStep = function () { var card = entryCarousel.querySelector('[data-entry-card]'); return card ? card.getBoundingClientRect().width + 16 : Math.max(280, entryCarousel.clientWidth * .82); };
    var prevEntry = document.querySelector('[data-entry-carousel-prev]');
    var nextEntry = document.querySelector('[data-entry-carousel-next]');
    if (prevEntry) prevEntry.addEventListener('click', function () { entryCarousel.scrollBy({ left: -carouselStep(), behavior: reduceMotion ? 'auto' : 'smooth' }); });
    if (nextEntry) nextEntry.addEventListener('click', function () { entryCarousel.scrollBy({ left: carouselStep(), behavior: reduceMotion ? 'auto' : 'smooth' }); });
    entryCarousel.addEventListener('keydown', function (event) { if (event.key === 'ArrowLeft') entryCarousel.scrollBy({ left: -carouselStep(), behavior: 'smooth' }); if (event.key === 'ArrowRight') entryCarousel.scrollBy({ left: carouselStep(), behavior: 'smooth' }); });
    entryCarousel.setAttribute('tabindex', '0'); entryCarousel.setAttribute('aria-label', t('作品轮播，可使用左右方向键切换', 'Works carousel, use arrow keys to navigate'));
  }

  function setupReveals() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.alxian-reveal'));
    items.forEach(function (item, index) {
      item.style.setProperty('--alx-delay', (Math.min(index, 8) * 45) + 'ms');
    });
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (item) { item.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -9% 0px', threshold: 0.08 });
    items.forEach(function (item) { observer.observe(item); });
  }
  setupReveals();

  /* Blog parity: the reference loads article metadata from /api/blogs and
     opens the selected article in a scrollable reader. Hugo content remains
     the first render, so the page is useful on a static host as well. */
  function articleStorageKey(id) { return 'alxian-article-stats:' + id; }
  function articleCommentsKey(id) { return 'alxian-article-comments:' + id; }
  function articleViewedKey(id) { return 'alxian-article-viewed:' + id; }
  function parseJsonStorage(key, fallback) {
    try { var value = JSON.parse(readStorage(key) || ''); return value == null ? fallback : value; } catch (_) { return fallback; }
  }
  function safeArticleId(value) {
    return String(value || '').replace(/\.md$/i, '').replace(/^\/+|\/+$/g, '') || 'article';
  }
  function cssEscapeValue(value) {
    if (window.CSS && typeof window.CSS.escape === 'function') return window.CSS.escape(String(value));
    return String(value).replace(/[^a-zA-Z0-9_-]/g, function (character) { return '\\' + character; });
  }
  function articleApiPath(id, suffix) { return '/api/articles/' + encodeURIComponent(safeArticleId(id)) + suffix; }
  function clampArticleStats(payload) {
    payload = payload && payload.stats ? payload.stats : (payload || {});
    return {
      views: Math.max(0, Number(payload.views || payload.viewCount || 0) || 0),
      likes: Math.max(0, Number(payload.likes || payload.likeCount || 0) || 0),
      comments: Math.max(0, Number(payload.comments || payload.commentCount || 0) || 0),
      liked: Boolean(payload.liked)
    };
  }
  function localArticleStats(id) {
    var stats = clampArticleStats(parseJsonStorage(articleStorageKey(id), {}));
    var comments = parseJsonStorage(articleCommentsKey(id), []);
    stats.comments = Array.isArray(comments) ? comments.length : stats.comments;
    return stats;
  }
  function saveArticleStats(id, stats) { writeStorage(articleStorageKey(id), JSON.stringify(clampArticleStats(stats))); }
  function articleScopeStats(scope) {
    return {
      likes: scope.querySelector('[data-article-likes]'),
      views: scope.querySelector('[data-article-views]'),
      comments: scope.querySelector('[data-article-comments-count]'),
      likeButton: scope.querySelector('[data-article-like]')
    };
  }
  function renderArticleStats(scope, payload) {
    var stats = clampArticleStats(payload);
    var nodes = articleScopeStats(scope);
    if (nodes.likes) nodes.likes.textContent = String(stats.likes);
    if (nodes.views) nodes.views.textContent = String(stats.views);
    if (nodes.comments) nodes.comments.textContent = String(stats.comments);
    if (nodes.likeButton) {
      nodes.likeButton.setAttribute('aria-pressed', String(stats.liked));
      nodes.likeButton.classList.toggle('is-liked', stats.liked);
      var icon = nodes.likeButton.querySelector('span');
      if (icon) icon.textContent = stats.liked ? '♥' : '♡';
    }
    return stats;
  }
  function sanitizeArticleHtml(html) {
    var template = document.createElement('template');
    template.innerHTML = String(html || '');
    template.content.querySelectorAll('script,style,iframe,object,embed,form,input,button,textarea,select,video,audio,source').forEach(function (node) { node.remove(); });
    template.content.querySelectorAll('*').forEach(function (node) {
      Array.prototype.slice.call(node.attributes).forEach(function (attribute) {
        if (/^on/i.test(attribute.name)) node.removeAttribute(attribute.name);
      });
      if (node.tagName === 'A') {
        var href = node.getAttribute('href') || '';
        if (/^\s*(?:javascript|vbscript|data):/i.test(href)) node.removeAttribute('href');
        if (node.target === '_blank') node.setAttribute('rel', 'noopener noreferrer');
      }
    });
    return template.innerHTML;
  }
  function articleHeadingId(text, index) {
    var value = String(text || '').toLowerCase().trim().replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/[\s-]+/g, '-');
    return value || 'section-' + index;
  }
  function renderArticleToc(scope, body) {
    var aside = scope.querySelector('[data-blog-modal-toc], [data-article-toc]');
    if (!aside) return;
    var headings = Array.prototype.slice.call(body.querySelectorAll('h2,h3,h4'));
    var title = aside.querySelector('span');
    aside.innerHTML = '';
    if (title) aside.appendChild(title); else { title = document.createElement('span'); title.textContent = t('目录', 'ON THIS PAGE'); aside.appendChild(title); }
    if (!headings.length) {
      var empty = document.createElement('p'); empty.textContent = t('保持好奇，持续构建。', 'Stay curious. Keep building.'); aside.appendChild(empty); return;
    }
    var nav = document.createElement('nav');
    var list = document.createElement('ul');
    headings.forEach(function (heading, index) {
      if (!heading.id) heading.id = articleHeadingId(heading.textContent, index);
      var item = document.createElement('li');
      item.className = 'toc-level-' + heading.tagName.slice(1);
      var link = document.createElement('a'); link.href = '#' + heading.id; link.textContent = heading.textContent; item.appendChild(link); list.appendChild(item);
      link.addEventListener('click', function (event) { event.preventDefault(); heading.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); });
    });
    nav.appendChild(list); aside.appendChild(nav);
  }
  function markdownArticleHtml(markdown) {
    var source = String(markdown || '').replace(/\r\n?/g, '\n');
    if (!source.trim()) return '';
    var lines = source.split('\n');
    var html = []; var paragraph = []; var listType = '';
    function closeParagraph() { if (paragraph.length) { html.push('<p>' + inlineMarkdown(paragraph.join(' ')) + '</p>'); paragraph = []; } }
    function closeList() { if (listType) { html.push('</' + listType + '>'); listType = ''; } }
    function inlineMarkdown(value) {
      var escaped = value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      escaped = escaped.replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/__([^_]+)__/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>');
      return escaped.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, label, href) { var safeHref = /^\s*(?:javascript|vbscript|data):/i.test(href) ? '#' : href; return '<a href="' + safeHref.replace(/"/g, '&quot;') + '">' + label + '</a>'; });
    }
    var inCode = false; var code = [];
    lines.forEach(function (line, index) {
      if (/^\s*```/.test(line)) { if (inCode) { html.push('<pre><code>' + code.join('\n').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code></pre>'); code = []; inCode = false; } else { closeParagraph(); closeList(); inCode = true; } return; }
      if (inCode) { code.push(line); return; }
      var heading = line.match(/^\s*(#{1,4})\s+(.+?)\s*#*\s*$/);
      if (heading) { closeParagraph(); closeList(); var level = heading[1].length; var headingText = inlineMarkdown(heading[2]); html.push('<h' + level + ' id="' + articleHeadingId(heading[2], index) + '">' + headingText + '</h' + level + '>'); return; }
      var bullet = line.match(/^\s*[-*+]\s+(.+)$/); var ordered = line.match(/^\s*\d+[.)]\s+(.+)$/);
      if (bullet || ordered) { closeParagraph(); var nextType = ordered ? 'ol' : 'ul'; if (listType !== nextType) { closeList(); listType = nextType; html.push('<' + listType + '>'); } html.push('<li>' + inlineMarkdown((bullet || ordered)[1]) + '</li>'); return; }
      if (/^\s*>\s?/.test(line)) { closeParagraph(); closeList(); html.push('<blockquote>' + inlineMarkdown(line.replace(/^\s*>\s?/, '')) + '</blockquote>'); return; }
      if (!line.trim()) { closeParagraph(); closeList(); return; }
      paragraph.push(line.trim());
    });
    if (inCode) html.push('<pre><code>' + code.join('\n').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code></pre>');
    closeParagraph(); closeList(); return html.join('');
  }
  function normalizeArticle(item) {
    item = item || {};
    var id = safeArticleId(item.id || item.slug || item.filename || item.path || item.title);
    var content = item.contentHtml || item.html || item.renderedContent || '';
    if (!content && item.content) content = markdownArticleHtml(item.content);
    return { id: id, title: item.title || item.name || id, description: item.description || item.summary || '', content: content, date: item.date || item.createdAt || '', readTime: item.readTime || item.readingTime || '', tags: Array.isArray(item.tags) ? item.tags : [], featured: Boolean(item.featured || item.isFeatured), href: item.url || item.href || '' };
  }
  function updateBlogCardStats(id, stats) {
    document.querySelectorAll('[data-blog-card][data-blog-id="' + cssEscapeValue(id) + '"]').forEach(function (card) {
      ['views', 'likes', 'comments'].forEach(function (key) { var node = card.querySelector('[data-blog-stat="' + key + '"]'); if (node) node.textContent = String(stats[key]); });
    });
  }
  function fetchArticleStats(id, scope, onDone) {
    var local = localArticleStats(id);
    renderArticleStats(scope, local);
    return fetch(apiUrl(articleApiPath(id, '/stats')), { headers: { Accept: 'application/json' }, credentials: 'omit' }).then(function (response) { if (!response.ok) throw new Error('article stats unavailable'); return response.json(); }).then(function (payload) {
      var stats = renderArticleStats(scope, Object.assign({}, local, clampArticleStats(payload), { liked: Boolean(payload && payload.liked) }));
      saveArticleStats(id, stats); updateBlogCardStats(id, stats); if (onDone) onDone(stats); return stats;
    }).catch(function () { updateBlogCardStats(id, local); if (onDone) onDone(local); return local; });
  }
  function scheduleArticleView(id, scope) {
    if (readStorage(articleViewedKey(id))) return;
    window.setTimeout(function () {
      if (readStorage(articleViewedKey(id))) return;
      fetch(apiUrl(articleApiPath(id, '/view')), { method: 'POST', headers: { Accept: 'application/json' }, credentials: 'omit' }).then(function (response) { if (!response.ok) throw new Error('article view unavailable'); return response.json(); }).then(function (payload) {
        writeStorage(articleViewedKey(id), '1'); var stats = renderArticleStats(scope, payload); saveArticleStats(id, stats); updateBlogCardStats(id, stats);
      }).catch(function () {
        var stats = localArticleStats(id); stats.views += 1; writeStorage(articleViewedKey(id), '1'); saveArticleStats(id, stats); renderArticleStats(scope, stats); updateBlogCardStats(id, stats);
      });
    }, 20000);
  }
  function renderArticleComments(scope, comments) {
    var list = scope.querySelector('[data-article-comment-list]'); if (!list) return;
    list.innerHTML = '';
    if (!comments.length) { var empty = document.createElement('p'); empty.className = 'alxian-article-comments-empty'; empty.textContent = t('还没有评论，留下第一条吧。', 'No comments yet. Start the conversation.'); list.appendChild(empty); return; }
    comments.slice(-50).forEach(function (item) { var row = document.createElement('article'); row.className = 'alxian-article-comment'; var head = document.createElement('header'); var name = document.createElement('strong'); name.textContent = item.nickname || item.name || t('访客', 'Guest'); var date = document.createElement('time'); date.textContent = item.createdAt ? new Date(item.createdAt).toLocaleString() : ''; head.appendChild(name); head.appendChild(date); var body = document.createElement('p'); body.textContent = item.content || item.text || ''; row.appendChild(head); row.appendChild(body); list.appendChild(row); });
  }
  function loadArticleComments(id, scope) {
    var local = parseJsonStorage(articleCommentsKey(id), []); if (!Array.isArray(local)) local = [];
    renderArticleComments(scope, local); var localStats = localArticleStats(id); localStats.comments = local.length; renderArticleStats(scope, localStats);
    return fetch(apiUrl(articleApiPath(id, '/comments')), { headers: { Accept: 'application/json' }, credentials: 'omit' }).then(function (response) { if (!response.ok) throw new Error('article comments unavailable'); return response.json(); }).then(function (payload) {
      var comments = Array.isArray(payload) ? payload : payload && payload.comments; if (!Array.isArray(comments)) comments = [];
      renderArticleComments(scope, comments); var stats = localArticleStats(id); stats.comments = comments.length; saveArticleStats(id, stats); renderArticleStats(scope, stats); updateBlogCardStats(id, stats); return comments;
    }).catch(function () { return local; });
  }
  function setupArticleInteractions(scope, id) {
    if (!scope || !id || scope.dataset.articleInteractionsBound === 'true') return;
    scope.dataset.articleInteractionsBound = 'true'; id = safeArticleId(id); scope.dataset.articleCurrentId = id;
    function currentId() { return safeArticleId(scope.dataset.articleCurrentId || id); }
    var stats = fetchArticleStats(currentId(), scope); scheduleArticleView(currentId(), scope);
    var likeButton = scope.querySelector('[data-article-like]');
    if (likeButton) likeButton.addEventListener('click', function () {
      var articleId = currentId(); var current = localArticleStats(articleId); var nextLiked = !current.liked; current.liked = nextLiked; current.likes = Math.max(0, current.likes + (nextLiked ? 1 : -1)); saveArticleStats(articleId, current); renderArticleStats(scope, current); updateBlogCardStats(articleId, current);
      fetch(apiUrl(articleApiPath(articleId, '/like')), { method: nextLiked ? 'POST' : 'DELETE', headers: { Accept: 'application/json' }, credentials: 'omit' }).then(function (response) { if (!response.ok) throw new Error('article like unavailable'); return response.json(); }).then(function (payload) { var fresh = renderArticleStats(scope, payload); saveArticleStats(articleId, fresh); updateBlogCardStats(articleId, fresh); }).catch(function () {});
    });
    var commentsPanel = scope.querySelector('[data-article-comments-panel]'); var commentsToggle = scope.querySelector('[data-article-comments-toggle]'); var commentsClose = scope.querySelector('[data-article-comments-close]');
    function toggleComments(open) { if (!commentsPanel) return; if (commentsPanel.classList.contains('alxian-article-comments-page')) { commentsPanel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); loadArticleComments(currentId(), scope); return; } commentsPanel.hidden = !open; if (open) { loadArticleComments(currentId(), scope); var form = commentsPanel.querySelector('textarea'); if (form) form.focus(); } }
    if (commentsToggle) commentsToggle.addEventListener('click', function () { toggleComments(commentsPanel ? commentsPanel.hidden : true); });
    if (commentsClose) commentsClose.addEventListener('click', function () { toggleComments(false); });
    var form = scope.querySelector('[data-article-comment-form]');
    if (form) form.addEventListener('submit', function (event) {
      event.preventDefault(); var articleId = currentId(); var nickname = form.elements.nickname ? form.elements.nickname.value.trim() : ''; var content = form.elements.content ? form.elements.content.value.trim() : ''; var status = form.querySelector('[data-article-comment-status]');
      if (!content) { if (status) status.textContent = t('评论内容不能为空', 'Comment cannot be empty'); return; }
      if (Array.from(nickname).length > 24) { if (status) status.textContent = t('昵称不能超过 24 个字', 'Nickname is limited to 24 characters'); return; }
      var record = { nickname: nickname || t('访客', 'Guest'), content: content, createdAt: new Date().toISOString() }; var local = parseJsonStorage(articleCommentsKey(articleId), []); if (!Array.isArray(local)) local = []; local.push(record); writeStorage(articleCommentsKey(articleId), JSON.stringify(local.slice(-50))); renderArticleComments(scope, local); var localStats = localArticleStats(articleId); localStats.comments = local.length; saveArticleStats(articleId, localStats); renderArticleStats(scope, localStats); updateBlogCardStats(articleId, localStats); form.reset(); if (status) status.textContent = t('已保存到本地，等待同步', 'Saved locally; syncing…');
      fetch(apiUrl(articleApiPath(articleId, '/comments')), { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ nickname: nickname || undefined, content: content }), credentials: 'omit' }).then(function (response) { if (!response.ok) throw new Error('comment submit unavailable'); return response.text().catch(function () { return ''; }); }).then(function () { if (status) status.textContent = t('评论已发布', 'Comment published'); return loadArticleComments(articleId, scope); }).catch(function () { if (status) status.textContent = t('已保存在本浏览器', 'Saved in this browser'); });
    });
    return stats;
  }
  function setupSingleArticle() {
    var articlePage = document.querySelector('[data-article-page="true"]'); if (!articlePage) return;
    var id = articlePage.dataset.articleId; articlePage.dataset.articleCurrentId = id; var body = articlePage.querySelector('[data-article-body]'); if (body) renderArticleToc(articlePage, body);
    setupArticleInteractions(articlePage, id);
    var progress = document.createElement('div'); progress.className = 'alxian-reading-progress'; progress.setAttribute('aria-hidden', 'true'); progress.innerHTML = '<i></i>'; document.body.appendChild(progress);
    function updateProgress() { var max = document.documentElement.scrollHeight - window.innerHeight; progress.firstChild.style.width = (max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 0) + '%'; }
    window.addEventListener('scroll', updateProgress, { passive: true }); updateProgress();
  }
  function setupBlogList() {
    var blogPage = document.querySelector('[data-blog-list="true"]'); var grid = blogPage && blogPage.querySelector('.alxian-entry-grid.is-blog'); var modal = blogPage && blogPage.querySelector('[data-blog-modal]'); if (!blogPage || !grid || !modal) return;
    var cards = function () { return Array.prototype.slice.call(grid.querySelectorAll('[data-blog-card]')); };
    var articlesById = {};
    cards().forEach(function (card) { articlesById[safeArticleId(card.dataset.blogId)] = { id: safeArticleId(card.dataset.blogId), title: card.dataset.blogTitle, description: card.dataset.blogSummary, href: card.dataset.blogHref }; });
    var lastTrigger = null;
    function setModalOpen(open, trigger) { if (open && trigger) lastTrigger = trigger; modal.hidden = !open; modal.dataset.open = String(open); document.body.classList.toggle('alxian-article-modal-open', open); if (open) { var closeButton = modal.querySelector('.alxian-article-modal-close'); if (closeButton) closeButton.focus(); } else if (lastTrigger && typeof lastTrigger.focus === 'function') { lastTrigger.focus(); } }
    function modalArticleScope() { return modal; }
    function renderModalArticle(article) {
      var title = modal.querySelector('[data-blog-modal-title]'); var meta = modal.querySelector('[data-blog-modal-meta]'); var body = modal.querySelector('[data-blog-modal-body]'); if (title) title.textContent = article.title || ''; if (meta) { meta.innerHTML = ''; if (article.date) { var time = document.createElement('time'); time.textContent = String(article.date).slice(0, 10).replace(/-/g, '.'); meta.appendChild(time); } if (article.readTime) { var read = document.createElement('span'); read.textContent = typeof article.readTime === 'number' ? article.readTime + ' ' + t('分钟阅读', 'min read') : String(article.readTime); meta.appendChild(read); } } modal.dataset.articleCurrentId = safeArticleId(article.id); if (body) { body.innerHTML = sanitizeArticleHtml(article.content || '<p>' + (article.description || '') + '</p>'); renderArticleToc(modal, body); } setupArticleInteractions(modal, article.id); fetchArticleStats(article.id, modal); scheduleArticleView(article.id, modal); loadArticleComments(article.id, modal);
    }
    function fetchStaticArticle(card, article) { return fetch(article.href, { headers: { Accept: 'text/html' }, credentials: 'omit' }).then(function (response) { if (!response.ok) throw new Error('article page unavailable'); return response.text(); }).then(function (html) { var doc = new DOMParser().parseFromString(html, 'text/html'); var body = doc.querySelector('[data-article-body], .alxian-article-body'); if (!body) throw new Error('article content unavailable'); var heading = doc.querySelector('.alxian-single-heading h1'); var meta = doc.querySelector('.alxian-single-heading .alxian-entry-meta'); article.title = heading ? heading.textContent.trim() : article.title; article.content = body.innerHTML; article.date = meta && meta.querySelector('time') ? meta.querySelector('time').getAttribute('datetime') : ''; article.readTime = meta && meta.querySelectorAll('span').length ? meta.querySelectorAll('span')[0].textContent.trim() : ''; return article; }); }
    function openArticle(card, trigger) { var id = safeArticleId(card.dataset.blogId); var article = articlesById[id] || { id: id, title: card.dataset.blogTitle, description: card.dataset.blogSummary, href: card.dataset.blogHref }; setModalOpen(true, trigger); modal.querySelector('[data-blog-modal-title]').textContent = article.title || ''; modal.querySelector('[data-blog-modal-body]').innerHTML = '<p class="alxian-article-loading">' + t('正在加载文章…', 'Loading article…') + '</p>'; if (article.content) renderModalArticle(article); else fetchStaticArticle(card, article).then(renderModalArticle).catch(function () { setModalOpen(false); window.location.assign(article.href); }); }
    grid.addEventListener('click', function (event) { var link = event.target.closest('[data-blog-open]'); if (!link) return; var card = link.closest('[data-blog-card]'); if (!card) return; event.preventDefault(); openArticle(card, link); });
    modal.querySelectorAll('[data-blog-modal-close]').forEach(function (button) { button.addEventListener('click', function () { setModalOpen(false); }); });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !modal.hidden) { event.preventDefault(); setModalOpen(false); } });
    window.addEventListener('popstate', function () { if (modal && !modal.hidden) setModalOpen(false); });
    fetch(apiUrl('/api/blogs'), { headers: { Accept: 'application/json' }, credentials: 'omit' }).then(function (response) { if (!response.ok) throw new Error('blogs unavailable'); return response.json(); }).then(function (payload) {
      var items = Array.isArray(payload) ? payload : payload && payload.articles; if (!Array.isArray(items) || !items.length) return;
      items.map(normalizeArticle).forEach(function (article, index) {
        articlesById[article.id] = Object.assign(articlesById[article.id] || {}, article);
        var card = grid.querySelector('[data-blog-card][data-blog-id="' + cssEscapeValue(article.id) + '"]');
        if (!card) card = cards().find(function (candidate) { return candidate.dataset.blogTitle && candidate.dataset.blogTitle === article.title; });
        if (!card) {
          card = document.createElement('article'); card.className = 'alxian-entry-card alxian-reveal is-visible'; card.dataset.entryCard = 'true'; card.dataset.blogCard = 'true'; card.dataset.blogId = article.id; card.dataset.blogTitle = article.title; card.dataset.blogSummary = article.description; card.dataset.blogHref = article.href || '#'; card.dataset.featured = article.featured ? 'true' : 'false';
          var cover = document.createElement('a'); cover.className = 'alxian-entry-cover'; cover.href = article.href || '#'; cover.setAttribute('data-blog-open', ''); cover.setAttribute('aria-label', article.title); var placeholder = document.createElement('span'); placeholder.className = 'alxian-cover-placeholder'; placeholder.textContent = String(index + 1).padStart(2, '0'); cover.appendChild(placeholder); var arrow = document.createElement('i'); arrow.textContent = '↗'; cover.appendChild(arrow); card.appendChild(cover);
          var meta = document.createElement('div'); meta.className = 'alxian-entry-meta'; if (article.date) { var date = document.createElement('time'); date.textContent = String(article.date).slice(0, 10).replace(/-/g, '.'); meta.appendChild(date); } if (article.readTime) { var read = document.createElement('span'); read.textContent = article.readTime; meta.appendChild(read); } if (article.featured) { var featured = document.createElement('span'); featured.textContent = t('精选', 'FEATURED'); meta.appendChild(featured); } card.appendChild(meta);
          var heading = document.createElement('h2'); var headingLink = document.createElement('a'); headingLink.href = article.href || '#'; headingLink.setAttribute('data-blog-open', ''); headingLink.textContent = article.title; heading.appendChild(headingLink); card.appendChild(heading); var summary = document.createElement('p'); summary.textContent = article.description; card.appendChild(summary);
          if (article.tags.length) { var tags = document.createElement('div'); tags.className = 'alxian-entry-tags'; article.tags.slice(0, 4).forEach(function (tag) { var chip = document.createElement('span'); chip.textContent = tag; tags.appendChild(chip); }); card.appendChild(tags); }
          var engagement = document.createElement('div'); engagement.className = 'alxian-entry-stats'; engagement.setAttribute('aria-label', t('文章互动统计', 'Article engagement')); engagement.innerHTML = '<span><b data-blog-stat="views">—</b> ' + t('阅读', 'views') + '</span><span><b data-blog-stat="likes">—</b> ' + t('赞', 'likes') + '</span><span><b data-blog-stat="comments">—</b> ' + t('评', 'comments') + '</span>'; card.appendChild(engagement); grid.appendChild(card);
        } else { card.dataset.blogId = article.id; card.dataset.blogTitle = article.title; card.dataset.blogSummary = article.description; if (article.href) card.dataset.blogHref = article.href; if (article.featured) card.dataset.featured = 'true'; }
      });
      var ids = Object.keys(articlesById); if (!ids.length) return; return fetch(apiUrl('/api/articles/stats?ids=' + encodeURIComponent(ids.join(','))), { headers: { Accept: 'application/json' }, credentials: 'omit' }).then(function (response) { if (!response.ok) throw new Error('bulk stats unavailable'); return response.json(); }).then(function (statsPayload) { Object.keys(statsPayload || {}).forEach(function (id) { var stats = clampArticleStats(statsPayload[id]); saveArticleStats(id, stats); updateBlogCardStats(id, stats); }); });
    }).catch(function () { cards().forEach(function (card) { var id = safeArticleId(card.dataset.blogId); updateBlogCardStats(id, localArticleStats(id)); }); });
  }
  setupSingleArticle();
  setupBlogList();

  var query = new URLSearchParams(window.location.search).get('q');
  if (query) {
    var needle = query.toLowerCase();
    document.querySelectorAll('[data-entry-card], .alxian-resource-card').forEach(function (card) {
      card.hidden = card.textContent.toLowerCase().indexOf(needle) === -1;
    });
  }

  var resourceSearch = document.querySelector('[data-resource-search]');
  var resourceCards = document.querySelectorAll('[data-resource-card]');
  var resourceFilter = 'all';
  function updateResources() {
    var resourceNeedle = resourceSearch ? resourceSearch.value.toLowerCase().trim() : '';
    resourceCards.forEach(function (card) {
      var matchesType = resourceFilter === 'all' || card.dataset.resourceCategory === resourceFilter;
      var matchesText = !resourceNeedle || card.textContent.toLowerCase().indexOf(resourceNeedle) !== -1;
      card.hidden = !(matchesType && matchesText);
    });
  }
  document.querySelectorAll('[data-resource-filter]').forEach(function (button) {
    button.addEventListener('click', function () {
      setActive(button, '[data-resource-filter]');
      resourceFilter = button.dataset.resourceFilter;
      updateResources();
    });
  });
  if (resourceSearch) resourceSearch.addEventListener('input', updateResources);

  /* Resource parity: the reference presents its resource cards as a gentle
     orbit that can be paused for reading. The grid remains the resilient
     fallback; this enhancement is opt-in through the toolbar button. */
  var resourceGrid = document.querySelector('[data-resource-grid]');
  var resourceOrbitToggle = document.querySelector('[data-resource-orbit-toggle]');
  var resourceOrbitFrame = 0;
  var resourceOrbitStarted = 0;
  function renderResourceOrbit(now) {
    if (!resourceGrid || !resourceGrid.classList.contains('is-orbit')) { resourceOrbitFrame = 0; return; }
    var cards = Array.prototype.slice.call(resourceGrid.querySelectorAll('[data-resource-card]:not([hidden])'));
    var elapsed = (now - resourceOrbitStarted) / 1000;
    var radiusX = Math.min(310, Math.max(150, resourceGrid.clientWidth * .34));
    var radiusY = Math.min(100, Math.max(52, radiusX * .28));
    cards.forEach(function (card, index) {
      var angle = elapsed * .28 + index * (Math.PI * 2 / Math.max(cards.length, 1));
      var x = Math.cos(angle) * radiusX;
      var y = Math.sin(angle) * radiusY;
      var depth = (Math.sin(angle) + 1) / 2;
      card.style.transform = 'translate(calc(-50% + ' + x.toFixed(1) + 'px),calc(-50% + ' + y.toFixed(1) + 'px)) rotate(' + (Math.sin(angle) * 2.5).toFixed(2) + 'deg) scale(' + (.86 + depth * .14).toFixed(3) + ')';
      card.style.zIndex = String(Math.round(depth * 20));
      card.style.opacity = String(.56 + depth * .44);
    });
    resourceOrbitFrame = window.requestAnimationFrame(renderResourceOrbit);
  }
  if (resourceGrid && resourceOrbitToggle) {
    resourceOrbitToggle.addEventListener('click', function () {
      var orbiting = !resourceGrid.classList.contains('is-orbit');
      resourceGrid.classList.toggle('is-orbit', orbiting);
      resourceOrbitToggle.setAttribute('aria-pressed', String(orbiting));
      resourceOrbitToggle.textContent = orbiting ? t('暂停环绕', 'Pause orbit') : t('环绕', 'Orbit');
      if (orbiting) { resourceOrbitStarted = performance.now(); if (!resourceOrbitFrame) resourceOrbitFrame = requestAnimationFrame(renderResourceOrbit); }
      else { if (resourceOrbitFrame) cancelAnimationFrame(resourceOrbitFrame); resourceOrbitFrame = 0; resourceGrid.querySelectorAll('[data-resource-card]').forEach(function (card) { card.style.transform = ''; card.style.zIndex = ''; card.style.opacity = ''; }); }
    });
  }

  function setupFriends() {
    var list = document.querySelector('[data-friends-list]');
    var stats = document.querySelector('[data-friend-stats]');
    var modal = document.querySelector('[data-friend-modal]');
    var form = document.querySelector('[data-friend-apply-form]');
    var formStatus = document.querySelector('[data-friend-form-status]');
    var applicationStatus = document.querySelector('[data-friend-application-status]');
    var statsLoaded = false;
    if (!list && !stats && !modal) return;
    function statusText(zh, en) { return t(zh, en); }
    function setFormStatus(message, error) {
      if (!formStatus) return;
      formStatus.textContent = message || '';
      formStatus.classList.toggle('is-error', Boolean(error));
    }
    function updateStats(payload) {
      if (!stats || !payload) return;
      statsLoaded = true;
      stats.querySelectorAll('[data-friend-stat]').forEach(function (node) {
        var key = node.dataset.friendStat;
        if (payload[key] != null) node.textContent = String(payload[key]);
      });
    }
    function localStats() {
      if (statsLoaded) return;
      var visits = 0; var likes = 0;
      document.querySelectorAll('[data-friend-item]').forEach(function (card) {
        visits += Number(card.dataset.friendVisits || 0); likes += Number(card.dataset.friendLikes || 0);
      });
      updateStats({ totalVisits: visits, totalLikes: likes });
    }
    function attachCard(card, item) {
      if (!card) return;
      card.dataset.friendId = String(item.id || card.dataset.friendId || item.url || 'friend');
      card.dataset.friendUrl = item.url || card.dataset.friendUrl || '#';
      card.dataset.friendVisits = String(Number(item.visitCount || item.visits || card.dataset.friendVisits || 0));
      card.dataset.friendLikes = String(Number(item.likeCount || item.likes || card.dataset.friendLikes || 0));
      var img = card.querySelector('.alxian-friend-cover img');
      if (img && item.favicon) img.src = item.favicon;
      var nameNode = card.querySelector('.alxian-friend-card-copy strong');
      var descNode = card.querySelector('.alxian-friend-card-copy small');
      var urlNode = card.querySelector('.alxian-friend-card-url');
      if (nameNode) nameNode.textContent = item.name || item.url || statusText('未命名网站', 'Unnamed site');
      if (descNode) descNode.textContent = item.description || item.label || item.url || '';
      if (urlNode) urlNode.textContent = item.url || '';
      card.querySelectorAll('[data-friend-visit]').forEach(function (link) { link.href = item.url || '#'; });
      var likesNode = card.querySelector('[data-friend-like-count]');
      var visitsNode = card.querySelector('[data-friend-visit-count]');
      if (likesNode) likesNode.textContent = card.dataset.friendLikes;
      if (visitsNode) visitsNode.textContent = card.dataset.friendVisits;
      var created = card.querySelector('[data-friend-created]');
      if (created && item.createdAt) { var date = new Date(item.createdAt); if (!isNaN(date.getTime())) created.textContent = date.toLocaleDateString(); }
      card.querySelectorAll('[data-friend-visit]').forEach(function (link) {
        link.addEventListener('click', function () {
          var id = card.dataset.friendId;
          card.dataset.friendVisits = String(Number(card.dataset.friendVisits || 0) + 1);
          if (visitsNode) visitsNode.textContent = card.dataset.friendVisits;
          localStats();
          if (id && id.indexOf('static-') !== 0) fetch(apiUrl('/api/friends/' + encodeURIComponent(id) + '/visit'), { method: 'POST', credentials: 'omit' }).catch(function () {});
        });
      });
      var likeButton = card.querySelector('[data-friend-like]');
      if (likeButton && likeButton.dataset.bound !== 'true') {
        likeButton.dataset.bound = 'true';
        likeButton.addEventListener('click', function (event) {
          event.preventDefault(); event.stopPropagation();
          var id = card.dataset.friendId;
          if (likeButton.classList.contains('is-liked')) return;
          likeButton.classList.add('is-liked');
          card.dataset.friendLikes = String(Number(card.dataset.friendLikes || 0) + 1);
          if (likesNode) likesNode.textContent = card.dataset.friendLikes;
          localStats();
          if (id && id.indexOf('static-') !== 0) {
            fetch(apiUrl('/api/friends/' + encodeURIComponent(id) + '/like'), { method: 'POST', headers: { Accept: 'application/json' }, credentials: 'omit' }).then(function (response) { if (!response.ok) throw new Error('like unavailable'); return response.json(); }).then(function (payload) {
              if (payload && payload.likeCount != null) { card.dataset.friendLikes = String(payload.likeCount); if (likesNode) likesNode.textContent = card.dataset.friendLikes; localStats(); }
            }).catch(function () {});
          } else {
            var key = 'alxian-friend-liked-' + id; writeStorage(key, '1');
          }
        });
        if (readStorage('alxian-friend-liked-' + card.dataset.friendId)) likeButton.classList.add('is-liked');
      }
    }
    function renderApiFriends(payload) {
      if (!list || !Array.isArray(payload) || !payload.length) return;
      list.innerHTML = '';
      payload.filter(function (item) { return !item.status || item.status === 'approved' || item.status === 1; }).forEach(function (item, index) {
        var card = document.createElement('article');
        card.className = 'alxian-friend-card alxian-reveal is-visible';
        card.dataset.friendIndex = String(index + 1);
        card.innerHTML = '<a class="alxian-friend-card-main" href="#" target="_blank" rel="noopener noreferrer" data-friend-visit><span class="alxian-friend-cover"><img alt=""></span><span class="alxian-friend-card-copy"><strong></strong><small></small></span></a><div class="alxian-friend-card-meta"><span>♥ <b data-friend-like-count>0</b></span><span>↗ <b data-friend-visit-count>0</b></span><time data-friend-created>—</time></div><div class="alxian-friend-card-url"></div><div class="alxian-friend-card-actions"><button type="button" data-friend-like>♥ ' + statusText('点赞', 'Like') + '</button><a href="#" target="_blank" rel="noopener noreferrer" data-friend-visit>' + statusText('点此浏览', 'Visit') + ' ↗</a></div>';
        list.appendChild(card); attachCard(card, item);
      });
      localStats();
    }
    fetch(apiUrl('/api/friends/stats'), { headers: { Accept: 'application/json' }, credentials: 'omit' }).then(function (response) { if (!response.ok) throw new Error('friend stats unavailable'); return response.json(); }).then(updateStats).catch(localStats);
    if (list) list.querySelectorAll('[data-friend-item]').forEach(function (card) { attachCard(card, { id: card.dataset.friendId, name: card.dataset.friendName, url: card.dataset.friendUrl, description: card.dataset.friendDescription, visitCount: card.dataset.friendVisits, likeCount: card.dataset.friendLikes }); });
    fetch(apiUrl('/api/friends'), { headers: { Accept: 'application/json' }, credentials: 'omit' }).then(function (response) { if (!response.ok) throw new Error('friends unavailable'); return response.json(); }).then(renderApiFriends).catch(function () { localStats(); });

    var articlesList = document.querySelector('[data-friend-articles-list]');
    if (articlesList) fetch(apiUrl('/api/friends/articles'), { headers: { Accept: 'application/json' }, credentials: 'omit' }).then(function (response) { if (!response.ok) throw new Error('articles unavailable'); return response.json(); }).then(function (payload) {
      var articles = Array.isArray(payload) ? payload : payload && payload.articles;
      if (!Array.isArray(articles) || !articles.length) throw new Error('empty articles');
      articlesList.innerHTML = ''; articles.slice(0, 12).forEach(function (item) {
        var link = document.createElement('a'); link.className = 'alxian-friend-article'; link.href = item.url || '#'; link.target = '_blank'; link.rel = 'noopener noreferrer';
        link.innerHTML = '<div class="alxian-friend-article-head"><strong></strong><time></time></div><p></p>';
        link.querySelector('strong').textContent = item.siteName || item.name || item.author || statusText('朋友', 'Friend'); link.querySelector('time').textContent = item.publishDate || item.createdAt ? new Date(item.publishDate || item.createdAt).toLocaleDateString() : '';
        link.querySelector('p').textContent = item.articleTitle || item.title || item.description || '';
        articlesList.appendChild(link);
      });
    }).catch(function () { articlesList.innerHTML = '<p class="alxian-friend-articles-state">' + statusText('暂时没有获取到朋友文章', 'No friend articles are available yet') + '</p>'; });

    if (modal) {
      var openers = document.querySelectorAll('[data-friend-apply-open]'); var closers = modal.querySelectorAll('[data-friend-apply-close]');
      function openModal() { if (typeof modal.showModal === 'function') modal.showModal(); else modal.setAttribute('open', ''); var first = modal.querySelector('input'); if (first) window.setTimeout(function () { first.focus(); }, 0); }
      function closeModal() { if (typeof modal.close === 'function') modal.close(); else modal.removeAttribute('open'); setFormStatus(''); }
      openers.forEach(function (button) { button.addEventListener('click', openModal); }); closers.forEach(function (button) { button.addEventListener('click', closeModal); });
      modal.addEventListener('click', function (event) { if (event.target === modal) closeModal(); });
      var savedApplication = null; try { savedApplication = JSON.parse(readStorage('alxian-friend-application') || 'null'); } catch (_) {}
      function renderApplication(application) {
        if (!applicationStatus || !application) return;
        applicationStatus.hidden = false;
        var message = applicationStatus.querySelector('[data-friend-application-message]'); var idNode = applicationStatus.querySelector('[data-friend-application-id]');
        if (message) message.textContent = statusText('申请状态：' + (application.status || '审核中'), 'Application: ' + (application.status || 'pending'));
        if (idNode) idNode.textContent = application.id ? 'ID ' + application.id : statusText('静态回退 · 仅保存在本浏览器', 'Static fallback · saved in this browser');
      }
      renderApplication(savedApplication);
      var refreshStatus = document.querySelector('[data-friend-refresh-status]');
      function refreshApplication() {
        if (!savedApplication || !savedApplication.id || String(savedApplication.id).indexOf('local-') === 0) { if (savedApplication) renderApplication(savedApplication); return; }
        var paths = ['/api/friends/apply/' + encodeURIComponent(savedApplication.id), '/api/friends/application/' + encodeURIComponent(savedApplication.id)];
        function tryPath(index) {
          if (index >= paths.length) { renderApplication(savedApplication); return; }
          fetch(apiUrl(paths[index]), { headers: { Accept: 'application/json' }, credentials: 'omit' }).then(function (response) { if (!response.ok) throw new Error('application status unavailable'); return response.json(); }).then(function (payload) {
            savedApplication.status = payload.status || payload.application && payload.application.status || savedApplication.status;
            writeStorage('alxian-friend-application', JSON.stringify(savedApplication)); renderApplication(savedApplication);
          }).catch(function () { tryPath(index + 1); });
        }
        tryPath(0);
      }
      if (refreshStatus) refreshStatus.addEventListener('click', refreshApplication);
      refreshApplication();
      if (savedApplication && savedApplication.id && String(savedApplication.id).indexOf('local-') !== 0) window.setInterval(refreshApplication, 30000);
      if (form) form.addEventListener('submit', function (event) {
        event.preventDefault(); var submit = form.querySelector('[data-friend-apply-submit]'); var data = { name: form.elements.name.value.trim(), url: form.elements.url.value.trim(), description: form.elements.description.value.trim() };
        if (!data.name || !data.url || !data.description) { setFormStatus(statusText('请填写完整信息', 'Please complete every field'), true); return; }
        try { new URL(data.url); } catch (_) { setFormStatus(statusText('请输入有效的网址', 'Enter a valid URL'), true); return; }
        if (submit) submit.disabled = true; setFormStatus(statusText('正在提交...', 'Submitting...'));
        fetch(apiUrl('/api/friends/apply'), { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data), credentials: 'omit' }).then(function (response) { if (!response.ok) throw new Error('apply unavailable'); return response.json().catch(function () { return {}; }); }).then(function (payload) {
          savedApplication = { id: payload.id || payload.applicationId, status: payload.status || statusText('审核中', 'pending'), submittedAt: new Date().toISOString() }; writeStorage('alxian-friend-application', JSON.stringify(savedApplication)); renderApplication(savedApplication); setFormStatus(statusText('申请已提交，等待审核', 'Request submitted and queued for review')); window.setTimeout(closeModal, 900);
        }).catch(function () {
          savedApplication = { id: 'local-' + Date.now().toString(36), status: statusText('本地待审核', 'local pending'), submittedAt: new Date().toISOString(), data: data }; writeStorage('alxian-friend-application', JSON.stringify(savedApplication)); renderApplication(savedApplication); setFormStatus(statusText('当前未连接审核服务，已保存到本浏览器', 'Review service unavailable; saved in this browser')); window.setTimeout(closeModal, 1300);
        }).finally(function () { if (submit) submit.disabled = false; });
      });
    }
  }
  setupFriends();

  function setupGalleries() {
    document.querySelectorAll('[data-gallery]').forEach(function (gallery) {
      if (gallery.dataset.pagesGalleryBound === 'true') return;
      gallery.dataset.pagesGalleryBound = 'true';
      var images = Array.prototype.slice.call(gallery.querySelectorAll('img'));
      if (images.length < 2) return;

      var panel = gallery.parentNode;
      var button = panel && panel.querySelector('[data-gallery-next]');
      var index = parseInt(gallery.dataset.galleryIndex || '0', 10);
      if (isNaN(index)) index = 0;
      index = (index + images.length) % images.length;
      var touchStartX = 0;
      var touchStartY = 0;
      var touchActive = false;

      gallery.setAttribute('role', 'region');
      gallery.setAttribute('aria-roledescription', t('图库', 'gallery'));
      gallery.setAttribute('aria-label', t('个人图库，可使用左右方向键切换', 'Personal gallery, use arrow keys to switch'));
      if (gallery.tabIndex < 0) gallery.tabIndex = 0;

      function render(next) {
        index = (next + images.length) % images.length;
        gallery.dataset.galleryIndex = String(index);
        images.forEach(function (image, imageIndex) {
          var current = imageIndex === index;
          image.classList.toggle('is-current', current);
          image.setAttribute('aria-hidden', String(!current));
        });
        if (button) {
          button.innerHTML = '&#8249; &nbsp; ' + (index + 1) + ' / ' + images.length + ' &nbsp; &#8250;';
          button.setAttribute('aria-label', t('下一张图片', 'Next gallery image'));
        }
      }
      function move(delta) { render(index + delta); }

      render(index);
      if (button) {
        button.addEventListener('click', function (event) {
          event.preventDefault();
          move(1);
        });
      }
      gallery.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowRight' || event.key === 'PageDown') {
          event.preventDefault(); move(1);
        } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
          event.preventDefault(); move(-1);
        } else if (event.key === 'Home') {
          event.preventDefault(); render(0);
        } else if (event.key === 'End') {
          event.preventDefault(); render(images.length - 1);
        }
      });
      gallery.addEventListener('touchstart', function (event) {
        if (!event.touches || !event.touches.length) return;
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
        touchActive = true;
      }, { passive: true });
      gallery.addEventListener('touchend', function (event) {
        if (!touchActive || !event.changedTouches || !event.changedTouches.length) return;
        touchActive = false;
        var touch = event.changedTouches[0];
        var deltaX = touch.clientX - touchStartX;
        var deltaY = touch.clientY - touchStartY;
        if (Math.abs(deltaX) < 34 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
        event.preventDefault();
        move(deltaX < 0 ? 1 : -1);
      }, { passive: false });
    });
  }
  setupGalleries();

  var chatForm = document.querySelector('[data-chat-form]');
  var chatMessages = document.querySelector('[data-chat-messages]');
  var chatName = document.querySelector('[data-chat-name]');
  var chatRoom = 'lobby';
  function renderChatMessages(items) {
    if (!chatMessages || !Array.isArray(items)) return;
    chatMessages.innerHTML = '';
    items.slice(-100).forEach(function (item) {
      var message = document.createElement('div'); message.className = 'alxian-chat-message'; message.innerHTML = '<b></b><small></small><p></p>';
      message.querySelector('b').textContent = item.nickname || item.name || 'Guest'; message.querySelector('small').textContent = item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''; message.querySelector('p').textContent = item.content || item.message || '';
      chatMessages.appendChild(message);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  function loadChatRoom(roomId) {
    if (!chatMessages) return;
    fetch(apiUrl('/api/chat/messages?roomId=' + encodeURIComponent(roomId)), { headers: { Accept: 'application/json' }, credentials: 'omit' }).then(function (response) { if (!response.ok) throw new Error('chat API unavailable'); return response.json(); }).then(function (payload) { renderChatMessages(Array.isArray(payload) ? payload : payload.messages); }).catch(function () { chatMessages.dataset.room = roomId; });
  }
  fetch(apiUrl('/api/chat/rooms'), { headers: { Accept: 'application/json' }, credentials: 'omit' }).then(function (response) { if (!response.ok) throw new Error('rooms unavailable'); return response.json(); }).then(function (payload) {
    var rooms = Array.isArray(payload) ? payload : payload && payload.rooms;
    if (!Array.isArray(rooms)) return;
    var roomButtons = document.querySelector('.alxian-chat-rooms'); if (!roomButtons) return;
    roomButtons.innerHTML = '';
    rooms.slice(0, 6).forEach(function (room, index) { var button = document.createElement('button'); button.type = 'button'; button.dataset.chatRoom = room.id || room.slug || 'room-' + index; button.textContent = room.name || room.title || button.dataset.chatRoom; if (index === 0) button.classList.add('is-active'); roomButtons.appendChild(button); });
    roomButtons.querySelectorAll('[data-chat-room]').forEach(function (button) { button.addEventListener('click', function () { setActive(button, '[data-chat-room]'); chatRoom = button.dataset.chatRoom; loadChatRoom(chatRoom); }); });
    setActive(roomButtons.querySelector('button'), '[data-chat-room]');
    chatRoom = roomButtons.querySelector('button').dataset.chatRoom; loadChatRoom(chatRoom);
  }).catch(function () {});
  if (chatName) chatName.value = readStorage('alxian-chat-name') || '';
  if (chatName) chatName.addEventListener('change', function () {
    writeStorage('alxian-chat-name', chatName.value.trim());
  });
  document.querySelectorAll('[data-chat-room]').forEach(function (button) {
    button.addEventListener('click', function () {
      setActive(button, '[data-chat-room]');
      chatRoom = button.dataset.chatRoom;
      if (chatMessages) chatMessages.dataset.room = chatRoom;
      loadChatRoom(chatRoom);
    });
  });
  if (chatForm && chatMessages) chatForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var input = chatForm.querySelector('input[name="message"]');
    if (!input || !input.value.trim()) return;
    var messageValue = input.value.trim();
    var name = chatName && chatName.value.trim() ? chatName.value.trim() : t('访客', 'Guest');
    fetch(apiUrl('/api/chat/messages'), { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ roomId: chatRoom, nickname: name, content: messageValue }), credentials: 'omit' }).then(function (response) { if (!response.ok) throw new Error('chat send unavailable'); return response.json(); }).then(function (payload) { if (payload && payload.message) { var messages = Array.prototype.slice.call(chatMessages.querySelectorAll('.alxian-chat-message')).map(function (node) { return { nickname: node.querySelector('b').textContent, content: node.querySelector('p').textContent }; }); messages.push(payload.message); renderChatMessages(messages); } }).catch(function () {});
    var message = document.createElement('div');
    message.className = 'alxian-chat-message';
    var now = new Date();
    var time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    message.innerHTML = '<b></b><small></small><p></p>';
    message.querySelector('b').textContent = name;
    message.querySelector('small').textContent = time;
    message.querySelector('p').textContent = input.value.trim();
    chatMessages.appendChild(message);
    input.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });

  function setupComments() {
    var commentsButton = document.querySelector('[data-comments]');
    var commentPopover = document.querySelector('[data-comment-popover]');
    if (!commentsButton || !commentPopover || commentPopover.dataset.pagesCommentsBound === 'true') return;
    commentPopover.dataset.pagesCommentsBound = 'true';
    var textarea = commentPopover.querySelector('textarea');
    var sendComment = commentPopover.querySelector('[data-comment-send]');
    if (!textarea) return;
    var popoverId = commentPopover.id || 'alxian-comment-popover';
    commentPopover.id = popoverId;
    commentsButton.setAttribute('aria-controls', popoverId);
    commentsButton.setAttribute('aria-expanded', String(!commentPopover.hidden));

    var status = commentPopover.querySelector('[data-comment-status]');
    if (!status) {
      status = document.createElement('small');
      status.className = 'alxian-comment-status';
      status.setAttribute('data-comment-status', 'true');
      status.setAttribute('role', 'status');
      commentPopover.appendChild(status);
    }

    function setStatus(message, isError) {
      status.textContent = message;
      status.classList.toggle('is-error', Boolean(isError));
    }
    function setOpen(open, focus) {
      commentPopover.hidden = !open;
      commentPopover.dataset.open = String(open);
      commentsButton.setAttribute('aria-expanded', String(open));
      root.classList.toggle('alxian-comments-open', open);
      if (open && focus) window.setTimeout(function () { textarea.focus(); }, 0);
    }

    setStatus(t('输入内容会自动保存在本地', 'Your draft is saved locally while you type'));
    var draft = readStorage('alxian-comment-draft');
    if (draft) {
      textarea.value = draft;
      setStatus(t('草稿已从本地恢复', 'Draft restored from this browser'));
    }
    textarea.addEventListener('input', function () {
      var value = textarea.value;
      if (value.trim()) {
        if (writeStorage('alxian-comment-draft', value)) {
          setStatus(t('本地保存 · 草稿已更新', 'Saved locally · draft updated'));
        } else {
          setStatus(t('浏览器未允许本地保存', 'Local saving is unavailable'), true);
        }
      } else {
        removeStorage('alxian-comment-draft');
        setStatus(t('输入内容会自动保存在本地', 'Your draft is saved locally while you type'));
      }
    });
    commentsButton.addEventListener('click', function (event) {
      event.preventDefault();
      setOpen(commentPopover.hidden, true);
    });
    commentPopover.addEventListener('click', function (event) { event.stopPropagation(); });
    document.addEventListener('click', function (event) {
      if (!commentPopover.hidden && event.target !== commentsButton && !commentPopover.contains(event.target)) setOpen(false, false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !commentPopover.hidden) {
        event.preventDefault(); setOpen(false, false); commentsButton.focus();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && !commentPopover.hidden && sendComment) sendComment.click();
    });
    if (sendComment) sendComment.addEventListener('click', function () {
      var value = textarea.value.trim();
      if (!value) {
        setStatus(t('先写点内容，再发送', 'Write a note before sending'), true);
        textarea.focus();
        return;
      }
      var comments = [];
      try { comments = JSON.parse(readStorage('alxian-comments') || '[]'); } catch (_) { comments = []; }
      if (!Array.isArray(comments)) comments = [];
      comments.push({ text: value, createdAt: new Date().toISOString(), path: window.location.pathname });
      if (writeStorage('alxian-comments', JSON.stringify(comments.slice(-20)))) {
        removeStorage('alxian-comment-draft');
        textarea.value = '';
        setStatus(t('已保存到本地', 'Saved to this browser'));
      } else {
        setStatus(t('保存失败，请检查浏览器权限', 'Could not save in this browser'), true);
      }
    });
  }
  setupComments();

  function setupAnchors() {
    if (!root.classList.contains('alxian-page')) return;
    root.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        var selector = link.getAttribute('href');
        if (!selector || selector === '#') return;
        var target;
        try { target = document.querySelector(selector); } catch (_) { return; }
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        if (window.history && window.history.replaceState) window.history.replaceState(null, '', link.getAttribute('href'));
      });
    });
  }
  setupAnchors();

  function setupPageExit() {
    var leaving = false;
    root.querySelectorAll('a[href]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        if (leaving || event.defaultPrevented || event.button && event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (link.target && link.target !== '_self' || link.hasAttribute('download')) return;
        var href = link.getAttribute('href');
        if (!href || href.charAt(0) === '#' || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return;
        var destination;
        try { destination = new URL(link.href, window.location.href); } catch (_) { return; }
        if (destination.origin !== window.location.origin || destination.href === window.location.href) return;
        leaving = true;
        event.preventDefault();
        root.classList.add('is-leaving');
        root.setAttribute('data-page-transition', 'leaving');
        window.setTimeout(function () { window.location.assign(destination.href); }, reduceMotion ? 0 : 300);
      });
    });
    window.addEventListener('pageshow', function () {
      leaving = false;
      root.classList.remove('is-leaving');
      root.removeAttribute('data-page-transition');
    });
  }
  setupPageExit();
}());
