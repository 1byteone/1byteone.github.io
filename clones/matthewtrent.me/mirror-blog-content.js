(function () {
  'use strict';

  if (!/^\/blog(?:\/|$)/.test(window.location.pathname)) return;

  var articles = [
    ['building-ai-agents', '使用 LangChain 构建 AI 智能体：工具集成与多轮对话', 'media/blog-library/article-covers/building-ai-agents.jpg'],
    ['building-rag-pipeline', '使用 LangChain 构建 RAG 管道：从文档处理到向量搜索', 'media/blog-library/article-covers/rag-basic-pipeline.jpg'],
    ['hallucination-prevention', 'RAG 系统中的三层幻觉预防：实践指南', 'media/blog-library/article-covers/agriculture-rag.jpg'],
    ['fastapi-ai-streaming-api', 'FastAPI AI Streaming API：用 SSE 交付增量结果', 'media/blog-library/article-covers/fastapi-ai-streaming.jpg'],
    ['fastapi-async-dependency-injection', 'FastAPI Async 与依赖注入：避免阻塞事件循环', 'media/blog-library/article-covers/fastapi-ai-streaming.jpg'],
    ['fastapi-project-architecture', 'FastAPI 项目架构：从路由到领域服务的分层设计', 'media/blog-library/article-covers/fastapi-ai-streaming.jpg'],
    ['fastapi-request-response-pydantic', 'FastAPI 请求与响应：用 Pydantic 建立可靠契约', 'media/blog-library/article-covers/fastapi-ai-streaming.jpg'],
    ['java-core-architecture', 'Java 核心架构：从源码到 JVM 执行', 'media/blog-library/article-covers/java-high-concurrency.jpg'],
    ['java-concurrency', 'Java 并发模型：线程池、锁与可见性', 'media/blog-library/article-covers/java-high-concurrency.jpg'],
    ['java-collections-hashmap', 'Java 集合与 HashMap：从 key 到 bucket', 'media/blog-library/article-covers/java-high-concurrency.jpg'],
    ['jvm-memory-gc', 'JVM 内存与 GC：对象从 Eden 到回收', 'media/blog-library/article-covers/java-high-concurrency.jpg'],
    ['langchain-core-architecture', 'LangChain 核心架构：Runnable、模型与可组合链', 'media/blog-library/article-covers/building-ai-agents.jpg'],
    ['langchain-memory-multiturn', 'LangChain Memory：设计可控的多轮对话状态', 'media/blog-library/article-covers/building-ai-agents.jpg'],
    ['langchain-prompt-chain', 'LangChain Prompt Chain：让提示词成为可维护的程序', 'media/blog-library/article-covers/building-ai-agents.jpg'],
    ['langchain-tool-calling-agent', 'LangChain Tool Calling Agent：把决策与执行分开', 'media/blog-library/article-covers/building-ai-agents.jpg'],
    ['mysql-architecture', 'MySQL 内部架构：SQL 层到 InnoDB', 'media/blog-library/article-covers/java-high-concurrency.jpg'],
    ['mysql-high-concurrency-architecture', '生产级 MySQL 高并发架构：缓存、读写分离与分片', 'media/blog-library/article-covers/java-high-concurrency.jpg'],
    ['mysql-index-btree', 'MySQL 索引与 B+Tree：让查询走 Fast Path', 'media/blog-library/article-covers/java-high-concurrency.jpg'],
    ['mysql-transaction-mvcc', 'MySQL 事务与 MVCC：一致性读如何成立', 'media/blog-library/article-covers/java-high-concurrency.jpg'],
    ['openai-api-fundamentals', 'OpenAI API 基础：请求、消息、参数与可靠性', 'media/blog-library/article-covers/building-ai-agents.jpg']
  ];

  var fallbackCover = '/media/blog-library/article-covers/rag-basic-pipeline.jpg';
  var applied = false;

  function ensureStyle() {
    if (document.getElementById('mirror-blog-content-style')) return;
    var style = document.createElement('style');
    style.id = 'mirror-blog-content-style';
    style.textContent = [
      '.mirror-blog-cover{display:block;width:100%;height:100%;object-fit:cover;filter:saturate(.78) contrast(1.06);image-rendering:auto}',
      '.ed3-acc__thumb:has(.mirror-blog-cover){overflow:hidden;background:#e8e8e8}',
      '.ed3-article__body.markdown-viewer{max-width:68ch;min-width:0;overflow-wrap:anywhere;font-family:var(--font-body,system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif);font-size:clamp(1rem,1.2vw,1.08rem);line-height:1.95;color:var(--color-text,#202020)}',
      '.ed3-article__body.markdown-viewer h1,.ed3-article__body.markdown-viewer h2,.ed3-article__body.markdown-viewer h3,.ed3-article__body.markdown-viewer h4{font-family:inherit;color:var(--color-text-heading,#111);letter-spacing:-.02em;line-height:1.28;font-weight:650}',
      '.ed3-article__body.markdown-viewer h1{font-size:clamp(1.7rem,3vw,2.2rem);margin:3rem 0 1.1rem}',
      '.ed3-article__body.markdown-viewer h2{font-size:clamp(1.35rem,2.2vw,1.7rem);margin:2.8rem 0 1rem;padding-top:.35rem;border-top:1px solid color-mix(in srgb,currentColor 14%,transparent)}',
      '.ed3-article__body.markdown-viewer h3{font-size:clamp(1.15rem,1.8vw,1.35rem);margin:2.1rem 0 .75rem}',
      '.ed3-article__body.markdown-viewer p{margin:0 0 1.25rem}',
      '.ed3-article__body.markdown-viewer ul,.ed3-article__body.markdown-viewer ol{margin:0 0 1.35rem;padding-left:1.5rem}',
      '.ed3-article__body.markdown-viewer li{margin:.45rem 0;padding-left:.25rem}',
      '.ed3-article__body.markdown-viewer li::marker{color:var(--color2,#fd010c)}',
      '.ed3-article__body.markdown-viewer pre{margin:1.6rem 0;padding:1.1rem 1.2rem;overflow:auto;background:#f3f3f3;border:1px solid color-mix(in srgb,#111 14%,transparent);font: .88rem/1.7 ui-monospace,SFMono-Regular,Consolas,"Liberation Mono",monospace;white-space:pre}',
      '.ed3-article__body.markdown-viewer code{font-family:ui-monospace,SFMono-Regular,Consolas,"Liberation Mono",monospace;font-size:.9em;background:#f1f1f1;padding:.16em .35em}',
      '.ed3-article__body.markdown-viewer pre code{padding:0;background:transparent}',
      '.ed3-article__body.markdown-viewer blockquote{margin:1.6rem 0;padding:.75rem 1rem;border-left:3px solid var(--color2,#fd010c);background:#fafafa;color:#555}',
      '.ed3-article__body.markdown-viewer img{display:block;max-width:100%;height:auto;margin:1.6rem auto}',
      '.ed3-article__body.markdown-viewer table{display:block;max-width:100%;overflow:auto;border-collapse:collapse;margin:1.6rem 0}',
      '.ed3-article__body.markdown-viewer th,.ed3-article__body.markdown-viewer td{padding:.55rem .75rem;border:1px solid #d7d7d7;text-align:left;vertical-align:top}',
      '.ed3-article__body.markdown-viewer th{background:#f5f5f5;font-weight:650}',
      '.ed3-article__body.markdown-viewer a{color:inherit;text-decoration:underline;text-decoration-color:color-mix(in srgb,currentColor 38%,transparent);text-underline-offset:.16em}',
      '.ed3-article__main{min-width:0}',
      '@media(max-width:700px){.ed3-article__body.markdown-viewer{font-size:1rem;line-height:1.85}.ed3-article__body.markdown-viewer h2{margin-top:2.2rem}.ed3-article__body.markdown-viewer pre{font-size:.8rem;margin-inline:-.25rem}}'
    ].join('');
    document.head.appendChild(style);
  }

  function setText(selector, value) {
    var node = document.querySelector(selector);
    if (node) node.textContent = value;
  }

  function addReload(anchor) {
    if (!anchor || !anchor.getAttribute('href')) return;
    var href = anchor.getAttribute('href');
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#|javascript:)/i.test(href)) return;
    anchor.setAttribute('data-sveltekit-reload', '');
    anchor.removeAttribute('data-sveltekit-preload-data');
  }

  function applyArticleRows() {
    var rows = Array.prototype.slice.call(document.querySelectorAll('li[data-entry-id]'));
    rows.slice(0, articles.length).forEach(function (row, index) {
      var article = articles[index];
      var link = row.querySelector('.ed3-acc__left--link, a[href*="/blog/"]');
      var title = row.querySelector('.ed3-acc__left-text');
      if (link) {
        link.href = '/blog/' + article[0] + '/index.html';
        addReload(link);
      }
      if (title) title.textContent = article[1];

      var thumb = row.querySelector('.ed3-acc__thumb');
      if (!thumb) return;
      var image = thumb.querySelector('img.mirror-blog-cover');
      if (!image) {
        image = document.createElement('img');
        image.className = 'mirror-blog-cover';
        image.alt = article[1];
        image.loading = 'lazy';
        image.decoding = 'async';
        thumb.replaceChildren(image);
      }
      image.src = '/' + article[2];
    });
  }

  function apply() {
    ensureStyle();
    document.documentElement.lang = 'zh-CN';
    document.title = '技术文章 · 杨劲松';
    document.querySelectorAll('.ed3__announce-text').forEach(function (node) {
      node.textContent = '技术文章与工程记录 · RAG / Agent / Java / Python';
    });
    var nav = document.querySelectorAll('.ed3__appbar-link__label');
    ['首页', '技术文章', '简历', '社交', '更多', 'AI 助手'].forEach(function (label, index) {
      if (nav[index]) nav[index].textContent = label;
    });
    var tabs = document.querySelectorAll('.ed3-blog-tabs__tab');
    ['文章', '系列', '随想'].forEach(function (label, index) {
      if (tabs[index]) {
        var full = tabs[index].querySelector('.ed3-blog-tabs__full');
        var compact = tabs[index].querySelector('.ed3-blog-tabs__compact');
        if (full) full.textContent = label;
        if (compact) compact.textContent = index === 2 ? '随想' : label;
        if (!full && !compact) tabs[index].textContent = label;
      }
    });
    setText('.ed3-check__label', '显示全部文章');
    setText('.ed3-blog-search__label', '搜索：');
    var input = document.querySelector('.ed3-blog-search');
    if (input) {
      input.placeholder = '按标题、标签或主题搜索';
      input.setAttribute('aria-label', '搜索文章');
    }
    setText('.ed3-blog-title__text', '技术文章');
    document.querySelectorAll('.ed3-share-link').forEach(function (node) {
      node.setAttribute('aria-label', '复制本文链接');
      node.title = '复制本文链接';
    });
    document.querySelectorAll('.ed3-article__body .mirror-article-caption').forEach(function (node) {
      node.setAttribute('lang', 'zh-CN');
    });
    document.querySelectorAll('.ed3-article__body pre').forEach(function (node) {
      node.setAttribute('tabindex', '0');
    });
    applyArticleRows();
    document.querySelectorAll('a[href="/blog"], a[href="/blog/"]').forEach(addReload);
    applied = true;
  }

  function boot() {
    apply();
    window.setTimeout(apply, 300);
    window.setTimeout(apply, 1200);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
