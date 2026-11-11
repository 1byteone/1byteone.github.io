(function () {
  'use strict';

  var homeCovers = [
    '/media/blog-library/article-covers/rag-basic-pipeline.jpg',
    '/media/blog-library/article-covers/building-ai-agents.jpg',
    '/media/blog-library/article-covers/java-high-concurrency.jpg',
    '/media/blog-library/article-covers/fastapi-ai-streaming.jpg',
    '/media/blog-library/article-covers/agriculture-rag.jpg',
    '/media/blog-library/article-covers/rag-basic-pipeline.jpg'
  ];

  var projectRoutes = {
    '农业知识问答 Agent': '/projects/agricultural-qa-agent/index.html',
    '分布式微云商城': '/projects/ecommerce-rag-search/index.html',
    'AI 工程博客内容系统': '/blog/ai-engineering-blog-content-system/index.html',
    'Agent 工具实验室': '/blog/langchain-tool-calling-agent/index.html',
    'RAG 检索优化': '/blog/rag-retriever-optimization/index.html',
    '后端工程工作台': '/blog/spring-boot-production-architecture/index.html'
  };

  var projectCovers = {
    '农业知识问答 Agent': '/media/blog-library/article-covers/agriculture-rag.jpg',
    '分布式微云商城': '/media/misc_landing_page/project-mall-backend.png',
    'AI 工程博客内容系统': '/media/blog-library/article-covers/rag-basic-pipeline.jpg',
    'Agent 工具实验室': '/media/blog-library/article-covers/building-ai-agents.jpg',
    'RAG 检索优化': '/media/blog-library/article-covers/rag-basic-pipeline.jpg',
    '后端工程工作台': '/media/blog-library/article-covers/java-high-concurrency.jpg'
  };

  var languageCopy = {
    zh: {
      viewAll: '查看全部文章',
      home: '首页',
      blog: '技术文章',
      resume: '简历',
      social: '社交',
      radio: '电台',
      playRadio: '播放电台',
      pauseRadio: '暂停电台',
      previousPlaylist: '上一个歌单',
      nextPlaylist: '下一个歌单',
      assistant: 'AI 助手',
      noViewers: '暂无访客',
      role: 'AI 应用工程师',
      more: '显示更多',
      expand: '展开全部',
      close: '收起全部',
      random: '随机文章',
      collect: '全球收集',
      privacy: '隐私与联系'
    },
    en: {
      viewAll: 'View all articles',
      home: 'Home',
      blog: 'Writing',
      resume: 'Résumé',
      social: 'Social',
      radio: 'Radio',
      playRadio: 'Play radio',
      pauseRadio: 'Pause radio',
      previousPlaylist: 'Previous playlist',
      nextPlaylist: 'Next playlist',
      assistant: 'AI assistant',
      noViewers: 'No live viewers',
      role: 'AI application engineer',
      more: 'Show more',
      expand: 'Expand all',
      close: 'Close all',
      random: 'Random article',
      collect: 'Collect globally',
      privacy: 'Privacy and contact'
    }
  };

  var articleRoutes = {
    '使用 LangChain 构建 RAG 管道': '/blog/rag-basic-pipeline/index.html',
    'AI Agent 的工具调用与状态管理': '/blog/langchain-tool-calling-agent/index.html',
    'Spring Boot 请求链路：从入口到响应': '/blog/spring-boot-request-lifecycle/index.html',
    'AI 工程博客内容系统': '/blog/ai-engineering-blog-content-system/index.html',
    'RAG 检索器优化：召回、重排与证据': '/blog/rag-retriever-optimization/index.html',
    'Java 高并发与缓存一致性': '/blog/mysql-high-concurrency-architecture/index.html',
    '使用 LangChain 构建 AI 智能体：工具集成与多轮对话': '/blog/building-ai-agents/index.html',
    '使用 LangChain 构建 RAG 管道：从文档处理到向量搜索': '/blog/building-rag-pipeline/index.html',
    'RAG 系统中的三层幻觉预防：实践指南': '/blog/hallucination-prevention/index.html',
    'FastAPI AI Streaming API：用 SSE 交付增量结果': '/blog/fastapi-ai-streaming-api/index.html',
    'FastAPI Async 与依赖注入：避免阻塞事件循环': '/blog/fastapi-async-dependency-injection/index.html',
    'FastAPI 项目架构：从路由到领域服务的分层设计': '/blog/fastapi-project-architecture/index.html',
    'FastAPI 请求与响应：用 Pydantic 建立可靠契约': '/blog/fastapi-request-response-pydantic/index.html',
    'Java 核心架构：从源码到 JVM 执行': '/blog/java-core-architecture/index.html',
    'Java 并发模型：线程池、锁与可见性': '/blog/java-concurrency/index.html',
    'Java 集合与 HashMap：从 key 到 bucket': '/blog/java-collections-hashmap/index.html',
    'JVM 内存与 GC：对象从 Eden 到回收': '/blog/jvm-memory-gc/index.html',
    'LangChain 核心架构：Runnable、模型与可组合链': '/blog/langchain-core-architecture/index.html',
    'LangChain Memory：设计可控的多轮对话状态': '/blog/langchain-memory-multiturn/index.html',
    'LangChain Prompt Chain：让提示词成为可维护的程序': '/blog/langchain-prompt-chain/index.html',
    'LangChain Tool Calling Agent：把决策与执行分开': '/blog/langchain-tool-calling-agent/index.html',
    'MySQL 内部架构：SQL 层到 InnoDB': '/blog/mysql-architecture/index.html',
    '生产级 MySQL 高并发架构：缓存、读写分离与分片': '/blog/mysql-high-concurrency-architecture/index.html',
    'MySQL 索引与 B+Tree：让查询走 Fast Path': '/blog/mysql-index-btree/index.html',
    'MySQL 事务与 MVCC：一致性读如何成立': '/blog/mysql-transaction-mvcc/index.html',
    'OpenAI API 基础：请求、消息、参数与可靠性': '/blog/openai-api-fundamentals/index.html'
  };

  function lang() {
    return document.documentElement.dataset.mirrorLanguage === 'en' ? 'en' : 'zh';
  }

  function copy(key) {
    return languageCopy[lang()][key];
  }

  function text(node, value) {
    if (node && node.textContent !== value) node.textContent = value;
  }

  function addReload(anchor) {
    if (!anchor || !anchor.getAttribute('href')) return;
    var href = anchor.getAttribute('href');
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#|javascript:)/i.test(href)) return;
    anchor.setAttribute('data-sveltekit-reload', '');
    anchor.removeAttribute('data-sveltekit-preload-data');
  }

  function ensureStyle() {
    if (document.getElementById('mirror-polish-style')) return;
    var style = document.createElement('style');
    style.id = 'mirror-polish-style';
    style.textContent = [
      '.mirror-home-cover{display:block;width:100%;height:100%;object-fit:cover;filter:saturate(.82) contrast(1.05)}',
      '.ed3-acc__thumb:has(.mirror-home-cover){overflow:hidden;background:#e8e8e8}',
      '.mirror-static-role{display:inline-block;white-space:nowrap;font-variant-ligatures:none}',
      '.ed3__byline-name,.ed3__byline-role,.sf-map-trigger{display:inline-block!important;position:relative!important;vertical-align:baseline!important;white-space:nowrap!important}',
      '.ed3__byline-name .bn__text{display:inline-block!important;position:relative!important;visibility:visible!important;opacity:1!important;transform:none!important;white-space:nowrap!important}',
      '.ed3__byline-name [data-mirror-hidden="true"],.ed3__byline-name .bn__layer,.ed3__byline-name .bn__face--alt{display:none!important;visibility:hidden!important;opacity:0!important}',
      '.ed3__byline-role>.visually-hidden{display:block!important;position:absolute!important;width:1px!important;height:1px!important;overflow:hidden!important;clip:rect(0 0 0 0)!important}',
      '.ed3__byline-role>[data-personal-role]{display:inline-block!important;position:relative!important;visibility:visible!important;opacity:1!important;transform:none!important;white-space:nowrap!important}',
      '.ed3__byline-role> :not(.visually-hidden):not([data-personal-role]){display:none!important}',
      '.mirror-legacy-hidden{display:none!important}',
      '.mirror-project-link-duplicate{display:none!important}',
      '.site-footer-wrapper{display:none!important}',
      '.gb__word--rest{display:none!important}',
      '.rcp__consent>span{display:none!important}',
      '.mirror-local-link{cursor:pointer}',
      /* The mirror has no live printer/viewer service. Keep the local contact
         illustration visible and remove the source site's never-ending wait. */
      '.rcp__desk-wait,.rcp__loading,.loading-state.svelte-1x9jsnj{display:none!important}',
      '.rcp__setup-img{display:block!important;visibility:visible!important;opacity:1!important}',
      /* The exported chrome keeps the source pointer-events contract, which
         leaves static pages with an inert menu after hydration has ended. */
      '.ed3__chrome .ed3__appbar,.ed3__chrome .ed3__appbar-inner,.ed3__chrome .ed3__appbar-glass-shell,.ed3__chrome .ed3__appbar-nav,.ed3__chrome .ed3__links-dock,.ed3__chrome .ed3__links-panel,.ed3__chrome .ed3__appbar-link,.ed3__chrome .ed3__links-row{pointer-events:auto!important}',
      '[data-mirror-hidden="true"]{display:none!important}',
      '.tkt-card__flag{display:none!important}',
      '.ed3__section-title__word[data-mirror-label],.ed3__section-title__muted[data-mirror-label],.ed3__section-tabs__tab[data-mirror-label],.ed3__blog-all[data-mirror-label],.ed3__appbar-link__label[data-mirror-label],.ed3__announce-text[data-mirror-label],.ed3__cursors-quick__label[data-mirror-label]{color:var(--ed3-ink,#0e0e0e)!important;text-shadow:none!important}',
      // The source roll effect adds a second language layer on hover. Keep only that layer visible until it closes.
      '.ed3__section-title__label.roll--open>[data-mirror-label]{opacity:0!important}',
      '.ed3__section-title__label.roll--open>.ed3__section-title__word,.ed3__section-title__label.roll--open>.ed3__section-title__muted{visibility:hidden!important;opacity:0!important}',
      '.roll__layer.mirror-localized-roll>:not(.mirror-roll-copy){visibility:hidden!important}',
      '.roll__layer.mirror-localized-roll>.mirror-roll-copy{position:absolute;inset:0;display:block;white-space:nowrap;pointer-events:none;visibility:visible!important;opacity:0;transform:translateY(.12em);animation:mirror-roll-localized-in .18s ease-out forwards}',
      '.mirror-roll-copy>.ed3__section-title__word,.mirror-roll-copy>.ed3__section-title__muted{visibility:visible!important}',
      '@keyframes mirror-roll-localized-in{to{opacity:1;transform:translateY(0)}}',
      '.ed3__section-title__word[data-mirror-label]::after,.ed3__section-title__muted[data-mirror-label]::after,.ed3__section-tabs__tab[data-mirror-label]::after,.ed3__blog-all[data-mirror-label]::after,.ed3__appbar-link__label[data-mirror-label]::after,.ed3__announce-text[data-mirror-label]::after,.ed3__cursors-quick__label[data-mirror-label]::after{content:none!important}',
      '.mirror-gallery-image{background:#e8e8e8;contain:layout paint}',
      /* The exported article HTML loses Svelte\'s scoped class. Reapply the readable Markdown surface here. */
      '.ed3-article__body.markdown-viewer{max-width:68ch;min-width:0;overflow-wrap:anywhere;font-family:var(--font-body,system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif);font-size:clamp(1rem,1.2vw,1.08rem);line-height:1.95;color:var(--color-text,#202020)}',
      '.ed3-article__body.markdown-viewer h1,.ed3-article__body.markdown-viewer h2,.ed3-article__body.markdown-viewer h3,.ed3-article__body.markdown-viewer h4{font-family:inherit;color:var(--color-text-heading,#111);letter-spacing:-.02em;line-height:1.28;font-weight:650}',
      '.ed3-article__body.markdown-viewer h1{font-size:clamp(1.7rem,3vw,2.2rem);margin:3rem 0 1.1rem}',
      '.ed3-article__body.markdown-viewer h2{font-size:clamp(1.35rem,2.2vw,1.7rem);margin:2.8rem 0 1rem;padding-top:.35rem;border-top:1px solid color-mix(in srgb,currentColor 14%,transparent)}',
      '.ed3-article__body.markdown-viewer h3{font-size:clamp(1.15rem,1.8vw,1.35rem);margin:2.1rem 0 .75rem}',
      '.ed3-article__body.markdown-viewer p{margin:0 0 1.25rem}',
      '.ed3-article__body.markdown-viewer ul,.ed3-article__body.markdown-viewer ol{margin:0 0 1.35rem;padding-left:1.5rem}',
      '.ed3-article__body.markdown-viewer li{margin:.45rem 0;padding-left:.25rem}',
      '.ed3-article__body.markdown-viewer li::marker{color:var(--color2,#fd010c)}',
      '.ed3-article__body.markdown-viewer pre{margin:1.6rem 0;padding:1.1rem 1.2rem;overflow:auto;background:#f3f3f3;border:1px solid color-mix(in srgb,#111 14%,transparent);font:.88rem/1.7 ui-monospace,SFMono-Regular,Consolas,"Liberation Mono",monospace;white-space:pre}',
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
      ,'.polaroid-life video[src*="beanie-boomerang"]{display:none!important}'
    ].join('');
    document.head.appendChild(style);
  }

  function hide(node) {
    if (!node) return;
    node.classList.add('mirror-legacy-hidden');
    node.setAttribute('aria-hidden', 'true');
  }

  function removeLegacyRows(sectionId) {
    var heading = document.getElementById(sectionId);
    var section = heading && heading.closest('section');
    if (!section) return;
    section.querySelectorAll('.idx__row').forEach(function (row) {
      var hit = row.querySelector('.idx__hit-label, .idx__hit');
      if (hit && /^Show details for/i.test(hit.textContent.trim())) row.remove();
    });
    section.querySelectorAll('button').forEach(function (button) {
      var value = button.textContent.trim();
      if (/^Show \d+ more earlier/i.test(value)) button.remove();
      if (/^Expand all$/i.test(value)) text(button, copy('expand'));
      if (/^Close all$/i.test(value)) text(button, copy('close'));
    });
  }

  function cleanRole() {
    var role = document.querySelector('.ed3__byline-role');
    if (!role) return;
    role.classList.add('mirror-static-role');
    var value = lang() === 'en' ? 'AI Application Engineer' : 'AI 应用工程师';
    var visual = role.querySelector(':scope > [data-personal-role]');
    if (!visual) {
      visual = document.createElement('span');
      visual.dataset.personalRole = 'true';
      visual.setAttribute('aria-hidden', 'true');
    }
    if (role.dataset.mirrorRoleText !== value || visual.textContent !== value) {
      visual.textContent = value;
      role.replaceChildren(visual);
      role.dataset.mirrorRoleText = value;
    } else if (role.children.length !== 1 || role.children[0] !== visual) {
      role.replaceChildren(visual);
    }
    role.setAttribute('aria-label', value);
  }

  // The captured home page hydrates the byline several times.  Keep one
  // canonical visual node for each personal value so a stale animated layer
  // can never paint on top of the localized copy during hydration or a
  // language switch.
  function cleanHeroByline() {
    var name = document.querySelector('.ed3__byline-name');
    if (name) {
      var nameText = name.querySelector('.bn__text');
      if (!nameText) {
        nameText = document.createElement('span');
        nameText.className = 'bn__text';
        name.appendChild(nameText);
      }
      if (nameText.textContent !== '杨劲松') nameText.textContent = '杨劲松';
      nameText.setAttribute('aria-hidden', 'true');
      name.querySelectorAll('*').forEach(function (node) {
        if (node !== nameText && !node.contains(nameText)) node.setAttribute('data-mirror-hidden', 'true');
      });
      name.setAttribute('aria-label', '杨劲松');
    }
    cleanRole();
    var locationLabel = document.querySelector('.sf-map-trigger');
    if (locationLabel) {
      if (locationLabel.textContent.trim() !== '江西') locationLabel.textContent = '江西';
      locationLabel.setAttribute('aria-label', '江西，中国');
      locationLabel.removeAttribute('role');
      locationLabel.removeAttribute('tabindex');
      locationLabel.removeAttribute('aria-expanded');
    }
  }

  function watchHeroByline() {
    if (!window.MutationObserver || !document.body || document.documentElement.dataset.mirrorBylineObserver) return;
    document.documentElement.dataset.mirrorBylineObserver = 'true';
    var timer = 0;
    var observer = new MutationObserver(function (records) {
      var touched = records.some(function (record) {
        var target = record.target && (record.target.nodeType === 1 ? record.target : record.target.parentElement);
        return !!(target && target.closest && target.closest('.ed3__byline'));
      });
      if (!touched) return;
      clearTimeout(timer);
      timer = setTimeout(function () { cleanHeroByline(); }, 32);
    });
    observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['class', 'style', 'aria-label'] });
  }

  function configureLocalizedRoll(label) {
    if (!label) return;
    var layer = label.querySelector(':scope > .roll__layer');
    if (!layer) return;
    var word = label.querySelector(':scope > .ed3__section-title__word');
    var muted = label.querySelector(':scope > .ed3__section-title__muted');
    if (word) word.setAttribute('data-mirror-label', 'true');
    if (muted) muted.setAttribute('data-mirror-label', 'true');
    var copy = layer.querySelector(':scope > .mirror-roll-copy');
    if (!label.classList.contains('roll--open')) {
      layer.classList.remove('mirror-localized-roll');
      if (copy) copy.remove();
      return;
    }
    if (lang() !== 'zh') {
      layer.classList.remove('mirror-localized-roll');
      if (copy) copy.remove();
      return;
    }
    layer.classList.add('mirror-localized-roll');
    var value = label.getAttribute('data-mirror-roll-text') || label.getAttribute('data-heading-text') || '';
    if (!value) return;
    if (!copy) {
      copy = document.createElement('span');
      copy.className = 'mirror-roll-copy';
      copy.setAttribute('aria-hidden', 'true');
      layer.appendChild(copy);
    }
    if (copy.dataset.mirrorRollText === value) return;
    copy.dataset.mirrorRollText = value;
    copy.replaceChildren();
    if (word) copy.appendChild(word.cloneNode(true));
    if (muted) {
      copy.appendChild(document.createTextNode(' '));
      copy.appendChild(muted.cloneNode(true));
    }
  }

  function prepareRollHeadings() {
    if (!document.documentElement.dataset.mirrorRollWidthBound) {
      document.documentElement.dataset.mirrorRollWidthBound = 'true';
      document.addEventListener('pointerover', function (event) {
        var target = event.target && event.target.nodeType === 1 ? event.target : event.target && event.target.parentElement;
        var label = target && target.closest && target.closest('.ed3__section-title__label.roll[data-heading-text]');
        if (!label || label.contains(event.relatedTarget)) return;

        var source = label.getAttribute('data-mirror-roll-text') || label.getAttribute('data-heading-text') || '';
        var sample = label.querySelector('.ed3__section-title__word') || label;
        var style = window.getComputedStyle(sample);
        var context = document.createElement('canvas').getContext('2d');
        if (!context) return;
        context.font = [style.fontStyle, style.fontWeight, style.fontSize, style.fontFamily].join(' ');
        var letterSpacing = Number.parseFloat(style.letterSpacing) || 0;
        var width = context.measureText(source).width + letterSpacing * Array.from(source).length + 16;
        if (width > label.getBoundingClientRect().width + 1) label.style.width = Math.ceil(width) + 'px';
      }, true);
    }

    if (!window.MutationObserver) return;
    document.querySelectorAll('.ed3__section-title__label.roll').forEach(function (label) {
      if (label.dataset.mirrorRollWidthObserver) return;
      if (!label.getAttribute('data-mirror-roll-text')) {
        var heading = label.getAttribute('data-heading-text') || label.textContent.trim();
        if (heading) label.setAttribute('data-mirror-roll-text', heading);
      }
      configureLocalizedRoll(label);
      label.dataset.mirrorRollWidthObserver = 'true';
      var originalWidth = label.style.getPropertyValue('width');
      var originalPriority = label.style.getPropertyPriority('width');
      var observer = new MutationObserver(function () {
        configureLocalizedRoll(label);
        if (label.classList.contains('roll--open')) return;
        if (originalWidth) label.style.setProperty('width', originalWidth, originalPriority);
        else label.style.removeProperty('width');
      });
      observer.observe(label, { attributes: true, attributeFilter: ['class', 'data-mirror-roll-text'], childList: true });
    });
  }

  function cleanHomeBlog() {
    var list = document.querySelector('.ed3-acc[aria-label="文章列表"]');
    if (list) {
      list.querySelectorAll('li[data-entry-id]').forEach(function (row, index) {
        var link = row.querySelector('.ed3-acc__left--link, a[href*="/blog/"]');
        var title = link ? link.textContent.replace(/\s+/g, ' ').trim() : '';
        var route = articleRoutes[title];
        if (link && route) {
          if (link.getAttribute('href') !== route) link.href = route;
          addReload(link);
        }
        var thumb = row.querySelector('.ed3-acc__thumb');
        if (!thumb) return;
        var image = thumb.querySelector('img.mirror-home-cover');
        if (!image) {
          image = document.createElement('img');
          image.className = 'mirror-home-cover';
          image.loading = 'lazy';
          image.decoding = 'async';
          thumb.replaceChildren(image);
        }
        var cover = homeCovers[index % homeCovers.length];
        if (image.getAttribute('src') !== cover) image.src = cover;
        image.alt = (link ? link.textContent.trim() : '技术文章') + '文章封面';
        row.querySelectorAll('.ed3-acc__right').forEach(function (dateNode) {
          if (lang() === 'en') return;
          var value = dateNode.textContent.trim();
          var relative = value.match(/^(\d+)\s+(day|month|year)s?\s+ago$/i);
          if (relative) {
            var units = { day: '天', month: '个月', year: '年' };
            text(dateNode, relative[1] + units[relative[2].toLowerCase()] + '前');
          } else if (/^just now$/i.test(value)) {
            text(dateNode, '刚刚');
          }
        });
      });
    }

    document.querySelectorAll('.ed3__blog-all').forEach(function (node) {
      var link = node;
      if (node.tagName !== 'A') {
        link = document.createElement('a');
        Array.prototype.slice.call(node.attributes).forEach(function (attr) { link.setAttribute(attr.name, attr.value); });
        node.replaceWith(link);
      }
      if (link.getAttribute('href') !== '/blog/index.html') link.href = '/blog/index.html';
      link.classList.add('mirror-local-link');
      link.setAttribute('data-mirror-label', copy('viewAll'));
      link.setAttribute('aria-label', copy('viewAll'));
      text(link, copy('viewAll'));
      addReload(link);
    });
  }

  function cleanProjects() {
    document.querySelectorAll('.wk__card').forEach(function (card) {
      var titleNode = card.querySelector('.wk__title');
      var title = titleNode ? titleNode.textContent.trim() : '';
      var route = projectRoutes[title];
      if (!route) return;

      var media = card.querySelector('.wk__media');
      var cover = projectCovers[title];
      if (media && cover) {
        var video = media.querySelector('video');
        if (video) {
          var image = document.createElement('img');
          image.className = 'wk__img';
          image.loading = 'lazy';
          image.decoding = 'async';
          image.src = cover;
          image.alt = title;
          video.replaceWith(image);
        }
        var existing = media.querySelector('img.wk__img');
        if (existing) {
          if (existing.getAttribute('src') !== cover) existing.src = cover;
          existing.alt = title;
        }
      }

      var anchors = Array.prototype.slice.call(card.querySelectorAll('a'));
      anchors.forEach(function (anchor, index) {
        if (anchor.getAttribute('href') !== route) anchor.href = route;
        anchor.target = '';
        anchor.removeAttribute('rel');
        anchor.classList.add('mirror-local-link');
        if (index === 0) {
          anchor.classList.remove('mirror-project-link-duplicate');
          anchor.removeAttribute('aria-hidden');
          anchor.tabIndex = 0;
          var projectLabel = lang() === 'en' ? 'Open project' : '查看项目';
          if (anchor.textContent !== projectLabel) anchor.textContent = projectLabel;
        } else {
          anchor.classList.add('mirror-project-link-duplicate');
          anchor.setAttribute('aria-hidden', 'true');
          anchor.tabIndex = -1;
          if (anchor.textContent) anchor.textContent = '';
        }
        addReload(anchor);
      });
    });
  }

  function cleanExternalLinks() {
    document.querySelectorAll('a').forEach(function (anchor) {
      var href = anchor.getAttribute('href') || '';
      var legacyBlog = href.match(/^\/blog\/(a|s|page)(?:\/([^/?#]+))?/i);
      if (legacyBlog) {
        var row = anchor.closest('.ed3-acc__item, .ed3-related__item, li');
        var rowLinks = row ? Array.prototype.slice.call(row.querySelectorAll('a[href*="/blog/"]')) : [];
        var rowPrimary = rowLinks.find(function (candidate) { return candidate !== anchor && !candidate.classList.contains('ed3-share-link'); });
        var rowTitle = rowPrimary ? rowPrimary.textContent.replace(/\s+/g, ' ').trim() : '';
        var localSibling = row && Array.prototype.slice.call(row.querySelectorAll('a[href*="/blog/"]')).find(function (candidate) {
          var candidateHref = candidate.getAttribute('href') || '';
          return candidate !== anchor && !/^\/blog\/(?:a|s|page)(?:\/|$)/i.test(candidateHref);
        });
        anchor.href = articleRoutes[rowTitle] || (localSibling ? localSibling.getAttribute('href') : '/blog/index.html');
        anchor.removeAttribute('target');
        anchor.removeAttribute('rel');
        anchor.classList.add('mirror-local-link');
        addReload(anchor);
        return;
      }
      if (anchor.closest('.tkt-card') && /^https?:/i.test(href)) {
        anchor.href = '#education';
        anchor.removeAttribute('target');
        anchor.removeAttribute('rel');
        anchor.classList.add('mirror-local-link');
        return;
      }
      if (/^\/blog\/\/$/.test(href) || href === '/blog//') {
        anchor.href = '/index.html';
        anchor.textContent = copy('home');
        addReload(anchor);
      }
      if (/mattrltrent|matthewtrent\.me|confesi\.com|kurlox\.com|onlineacademic|vanbelle\.com|pub\.dev|discord\.gg|instagram\.com\/matthewrltrent|linkedin\.com\/in\/mattrltrent|youtu\.be/i.test(href)) {
        if (anchor.closest('.wk__card')) return;
        if (anchor.closest('.ed3-footer__channels')) {
          if (anchor.getAttribute('href') !== 'mailto:yjs_0831@qq.com') anchor.href = 'mailto:yjs_0831@qq.com';
          text(anchor, lang() === 'en' ? 'Contact' : '联系我');
          anchor.removeAttribute('target');
          anchor.removeAttribute('rel');
          return;
        }
        if (/^https?:/i.test(href)) {
          if (anchor.getAttribute('href') !== '#contact') anchor.href = '#contact';
          text(anchor, lang() === 'en' ? 'Contact' : '联系我');
          anchor.removeAttribute('target');
          anchor.removeAttribute('rel');
        }
      }
    });
  }

  function cleanNavigation() {
    var labels = [copy('home'), copy('blog'), copy('resume')];
    var routes = ['/index.html', '/blog/index.html', '/resume-yang-jinsong.html'];
    function patchGroup(links, labelSelector) {
      Array.prototype.slice.call(links, 0, 3).forEach(function (anchor, index) {
        if (anchor.getAttribute('href') !== routes[index]) anchor.href = routes[index];
        anchor.setAttribute('aria-label', labels[index]);
        anchor.classList.add('mirror-local-link');
        var label = anchor.querySelector(labelSelector);
        if (label) text(label, labels[index]);
        addReload(anchor);
      });
    }
    document.querySelectorAll('.ed3__appbar-nav').forEach(function (nav) {
      patchGroup(nav.querySelectorAll(':scope > a'), '.ed3__appbar-link__label');
    });
    document.querySelectorAll('.ed3__links-panel').forEach(function (panel) {
      patchGroup(panel.querySelectorAll('.ed3__nav-row'), '.ed3__links-row__label');
      var seen = new Set();
      panel.querySelectorAll('.ed3__links-row').forEach(function (row) {
        var labelNode = row.querySelector('.ed3__links-row__label');
        var label = labelNode ? labelNode.textContent.replace(/\s+/g, ' ').trim().toLowerCase() : '';
        var href = row.getAttribute('href') || '';
        if (!label || !href) return;
        var key = href + '|' + label;
        if (seen.has(key)) {
          row.classList.add('mirror-legacy-hidden');
          row.setAttribute('aria-hidden', 'true');
          row.tabIndex = -1;
        } else {
          seen.add(key);
        }
      });
    });
    document.querySelectorAll('.ed3__appbar-link__label').forEach(function (node) {
      if (node.textContent.trim() === '博客') text(node, copy('blog'));
      if (node.textContent.trim() === 'Blog') text(node, copy('blog'));
    });
  }

  function cleanNumbers() {
    var numbers = document.getElementById('by-the-numbers');
    if (!numbers) return;
    var section = numbers.closest('section');
    section.querySelectorAll('.idx__row').forEach(function (row) {
      var value = row.textContent || '';
      if (/Weekly top|Peak WPM|portfolio viewers|portfolio referrers|non-human traffic|AI citations/i.test(value)) row.remove();
    });
    section.querySelectorAll('.idx__sub').forEach(function (node) {
      if (/Peak WPM/i.test(node.textContent)) text(node, lang() === 'en' ? 'Maintained blog · 1byteone.github.io' : '持续维护的博客 · 1byteone.github.io');
    });
    section.querySelectorAll('[aria-label="Countries"]').forEach(function (node) {
      node.setAttribute('aria-label', lang() === 'en' ? 'Project category' : '项目分类');
    });
    section.querySelectorAll('.catch-mode__select').forEach(function (node) {
      node.setAttribute('aria-label', lang() === 'en' ? 'Project category' : '项目分类');
    });
    section.querySelectorAll('.catch-mode__pick u').forEach(function (node) {
      text(node, lang() === 'en' ? 'Countries' : '国家');
    });
  }

  function cleanIndexNav() {
    var map = {
      'Me': '我',
      'Experience': '经历',
      'By the Numbers': '工程记录',
      'Blog & Writing': '博客与写作',
      'Featured Projects': '精选项目',
      '57 Other Projects': '其他项目',
      'Education & Favorite Classes': '教育经历',
      'Skills & Competencies': '技能栈',
      'Ethical Hacking': '安全研究',
      'Competitions & Hackathons': '竞赛与实践',
      'What Others Say': '他人评价',
      'Portfolio Evolution': '作品演进',
      'Spotify': '音乐',
      'Misc.': '其他',
      'As a Kid': '童年经历',
      'Get in Contact via Printed Receipt': '保持联系',
      'Or be More Traditional (& Boring)': '传统联系'
    };
    document.querySelectorAll('.ed3-article__toc-line').forEach(function (button) {
      var value = button.getAttribute('aria-label') || button.textContent.trim();
      if (map[value]) button.setAttribute('aria-label', map[value]);
    });
    document.querySelectorAll('[aria-label="On this page"], [aria-label="本页目录"]').forEach(function (node) {
      node.setAttribute('aria-label', lang() === 'en' ? 'On this page' : '本页目录');
    });
  }

  function cleanEvolutionTable() {
    var marker = document.getElementById('portfolio-evolution');
    var section = marker && marker.closest('section');
    if (!section) return;
    var labels = {
      'Median time a visit spent with the page in front of someone and still reading.': '访问停留中位数',
      'Share of all visits that opened one page, scrolled none of it and pressed nothing.': '单页离开率',
      'Average number of pages a visit opened, counting the first.': '平均浏览页数',
      'Median share of the homepage a visit scrolled, across visits that opened it.': '首页滚动比例',
      'Median distance in pixels a visit scrolled down the homepage, across visits that opened it.': '首页滚动距离',
      'Median share of an article a visit scrolled, across visits that opened one.': '文章阅读比例',
      'Median distance in pixels a visit scrolled into an article, across visits that opened one.': '文章阅读距离',
      'Share of all visits that opened any of my socials.': '社交入口打开率',
      'Share of all visits that opened my résumé.': '简历入口打开率',
      'Share of all visits that tried to contact me, whether by copying my email, sending my contact form, or sending a message to my printer.': '联系入口打开率',
      'Visits that landed on the homepage vs. visits that landed on an article, as home : article.': '首页与文章访问比',
      'Of visits that landed anywhere but an article, the share that went on to open one.': '继续阅读比例',
      'Of visits that opened an article, the share that copied its link with the share button.': '文章分享比例',
      'Share of all visits that opened my GitHub.': 'GitHub 打开率',
      'Share of all visits that opened my LinkedIn.': '社交平台打开率',
      'Share of all visits that opened my X.': '社交平台打开率',
      'Share of all visits that opened my Instagram.': '社交平台打开率',
      'Share of all visits that opened my Discord.': '社交平台打开率',
      'Share of all visits that opened my Spotify.': '音乐入口打开率',
      'Share of automated visits made by an AI assistant opening a page to answer someone.': 'AI 引用访问率',
      'Share of automated visits made by a link preview unfurling a shared link.': '链接预览访问率',
      'Visits by people vs. visits by anything automated, as human : non-human.': '真人与自动化访问比'
    };
    section.querySelectorAll('table button').forEach(function (button) {
      var value = button.getAttribute('aria-label') || button.title || button.textContent.trim();
      if (labels[value]) {
        button.setAttribute('aria-label', labels[value]);
        button.setAttribute('title', labels[value]);
        text(button, labels[value]);
      }
      if (/^Show details for/i.test(value)) button.setAttribute('aria-label', '查看版本详情');
      if (/^Archived site/i.test(value)) text(button, '历史版本记录');
    });
    var metricLabelsZh = ['停留中位数', '单页离开率', '平均浏览页数', '首页滚动比例', '首页滚动距离', '文章阅读比例', '文章阅读距离', '社交入口打开率', '简历入口打开率', '联系入口打开率', '首页与文章访问比', '继续阅读比例', '文章分享比例', 'GitHub 打开率', 'LinkedIn 打开率', 'X 打开率', 'Instagram 打开率', 'Discord 打开率', 'Spotify 打开率', 'AI 引用访问率', '链接预览访问率', '真人与自动化访问比'];
    var metricLabelsEn = ['Time per visit', 'Bounce rate %', 'Pages per visit', 'Home scroll %', 'Home scroll px', 'Article scroll %', 'Article scroll px', 'Opened any social %', 'Opened résumé %', 'Contacted me %', 'Landed on home vs. article ratio', 'Found an article %', 'Shared an article %', 'Opened GitHub %', 'Opened LinkedIn %', 'Opened X %', 'Opened Instagram %', 'Opened Discord %', 'Opened Spotify %', 'AI citations %', 'Link previews %', 'Human vs. non-human ratio'];
    section.querySelectorAll('.ed3-evo__metric-label').forEach(function (node, index) {
      var value = lang() === 'en' ? metricLabelsEn[index] : metricLabelsZh[index];
      if (value) text(node, value);
      var tip = node.closest('.ed3-tip-trigger');
      if (tip && value) tip.setAttribute('aria-label', value);
    });
    if (lang() === 'zh') {
      section.querySelectorAll('.ed3-evo__cell--version').forEach(function (node) { text(node, '版本'); });
      var details = {
        'Static HTML, CSS and JS.': '静态 HTML、CSS 与 JavaScript。',
        'Next.js, with a blog.': 'Next.js 博客版本。',
        'SvelteKit redesign.': 'SvelteKit 交互重构。'
      };
      section.querySelectorAll('.ed3-evo__detail').forEach(function (node) {
        if (details[node.textContent.trim()]) text(node, details[node.textContent.trim()]);
      });
      section.querySelectorAll('.ed3-evo__row').forEach(function (row) {
        row.querySelectorAll('*').forEach(function (node) {
          if (node.children.length) return;
          if (/present/i.test(node.textContent)) text(node, node.textContent.replace(/present/ig, '至今'));
          if (lang() === 'zh') {
            var value = node.textContent;
            if (/\bvs\b/i.test(value)) text(node, value.replace(/\bvs\b/ig, '对比'));
            else if (/\bup from\b/i.test(value)) text(node, value.replace(/\bup from\b/ig, '高于'));
            else if (/\bSame as\b/i.test(value)) text(node, value.replace(/\bSame as\b/ig, '与其相同'));
          }
        });
      });
      section.querySelectorAll('[aria-label]').forEach(function (node) {
        var label = node.getAttribute('aria-label') || '';
        if (/\bup from\b/i.test(label)) label = label.replace(/\bup from\b/ig, '高于');
        if (/\bSame as\b/i.test(label)) label = label.replace(/\bSame as\b/ig, '与其相同');
        if (label !== node.getAttribute('aria-label')) node.setAttribute('aria-label', label);
      });
    }
  }

  function cleanFooter() {
    document.querySelectorAll('.ed3-footer__objective').forEach(function (item, index) {
      var headings = [
        ['招聘与合作', 'Recruiting and collaboration'],
        ['一起构建', 'Build together'],
        ['阅读与反馈', 'Reading and feedback']
      ];
      var descriptions = [
        ['正在寻找 Java 后端或 AI 应用开发者？', 'Looking for a Java backend or AI application engineer?'],
        ['欢迎交流 RAG、Agent、微服务和中文技术内容系统。', 'Open to conversations about RAG, agents, microservices, and technical writing.'],
        ['发现文章中的问题，或想聊聊你的项目，都欢迎来信。', 'Found an issue in an article or want to discuss a project? Send me a note.']
      ];
      var heading = item.querySelector('.ed3-footer__objective-tag');
      if (heading) {
        var headingText = lang() === 'en' ? headings[index][1] : headings[index][0];
        if (heading.textContent !== headingText) text(heading, headingText);
      }
      var desc = item.querySelector('.ed3-footer__objective-desc');
      if (desc) {
        var link = desc.querySelector('a');
        if (link) {
          if (link.getAttribute('href') !== 'mailto:yjs_0831@qq.com') link.href = 'mailto:yjs_0831@qq.com';
          text(link, lang() === 'en' ? 'Contact me' : '联系我');
          link.removeAttribute('target');
          link.removeAttribute('rel');
        }
        var descriptionText = lang() === 'en' ? descriptions[index][1] + ' ' : descriptions[index][0] + ' ';
        var contactLink = index < 2 ? link : null;
        var expectedDescription = descriptionText + (contactLink ? contactLink.textContent : '');
        if (desc.textContent !== expectedDescription) desc.replaceChildren(document.createTextNode(descriptionText), contactLink || document.createTextNode(''));
      }
    });
    document.querySelectorAll('.ed3-footer__objective-select').forEach(function (node) { node.remove(); });
    document.querySelectorAll('.ed3-footer__objective .ed3-footer__channels').forEach(hide);
    document.querySelectorAll('.ed3-footer a[href="/privacy"], .ed3-footer a[href="/privacy/"]').forEach(function (anchor) {
      if (anchor.getAttribute('href') !== '#contact') anchor.href = '#contact';
      text(anchor, copy('privacy'));
    });
    var channelSeen = new Set();
    document.querySelectorAll('.ed3-footer__channels .ed3-footer__channel').forEach(function (anchor) {
      if (anchor.getAttribute('href') !== 'mailto:yjs_0831@qq.com') anchor.href = 'mailto:yjs_0831@qq.com';
      anchor.removeAttribute('target');
      anchor.removeAttribute('rel');
      var href = anchor.getAttribute('href') || '';
      if (!href || channelSeen.has(href)) {
        anchor.classList.add('mirror-legacy-hidden');
        anchor.setAttribute('aria-hidden', 'true');
        anchor.tabIndex = -1;
      } else {
        channelSeen.add(href);
      }
    });
  }

  function cleanSecondarySections() {
    var kid = document.getElementById('as-a-kid');
    if (kid) {
      kid.closest('section').querySelectorAll('.sphere-media').forEach(hide);
      var lede = kid.closest('section').querySelector('.ed3__lede');
      text(lede, lang() === 'en' ? 'I keep a long record of learning, projects, and life, with a bias toward making things.' : '把学习、项目和生活整理成长期记录；在代码之外，保持好奇，也保持动手。');
      kid.closest('section').querySelectorAll('.polaroid-life__hint, .mhint__set--pointer').forEach(function (node) {
        text(node, lang() === 'en' ? 'Drag, click, or scroll to browse the local archive' : '拖动、点击或横向滚动，浏览本地图集');
      });
      kid.closest('section').querySelectorAll('.mhint__set--touch').forEach(hide);
      kid.closest('section').querySelectorAll('img').forEach(function (image) { image.alt = '工程记录图集'; });
    }

    var misc = document.getElementById('misc');
    if (misc) {
      var music = misc.closest('section').querySelector('.ed3__music');
      if (music) {
        var button = music.querySelector('button');
        if (button) text(button, lang() === 'en' ? 'Open project repository ↗' : '打开项目仓库 ↗');
        music.querySelectorAll('p').forEach(function (node) { text(node, lang() === 'en' ? 'Source code, Chinese articles, and engineering scripts are updated in the repository.' : '项目源码、中文文章与工程脚本持续更新。'); });
      }
    }

    var shelfLabels = {
      "matt's coffee shop": 'Java 并发练习',
      'privilege of pressure': '压力下的工程',
      'demanding excellence': '追求卓越',
      countryish: '家乡与记录',
      'the web': '网络与产品',
      'playing ping-pong with your boomer': '和家人打乒乓',
      'as we fall.': '代码与生活',
      'university is fun!': '大学学习',
      nebulosity: '星云',
      'run, boy, run': '持续奔跑',
      'proj. academia': '学术项目',
      expeditionary: '探索',
      'AGAIN!?': '再来一次',
      'slowly.': '慢慢来',
      'portfolio suggestions': '作品集建议'
    };
    document.querySelectorAll('.shelf__spine-text').forEach(function (node) {
      var value = node.textContent.trim();
      if (lang() === 'zh' && shelfLabels[value]) text(node, shelfLabels[value]);
    });
    document.querySelectorAll('.shelf__book').forEach(function (node) {
      if (lang() !== 'zh') return;
      var aria = node.getAttribute('aria-label') || '';
      var match = aria.match(/^Select (expeditionary|AGAIN!\?|slowly\.|portfolio suggestions)/i);
      var names = { expeditionary: '探索', 'AGAIN!?': '再来一次', 'slowly.': '慢慢来', 'portfolio suggestions': '作品集建议' };
      if (match && names[match[1]]) node.setAttribute('aria-label', '选择 ' + names[match[1]] + ' · 歌曲列表');
    });

    var contact = document.getElementById('contact');
    if (contact) {
      var section = contact.closest('section');
      var lede = section.querySelector('.rsec__lede');
      if (lede) {
        var country = lede.querySelector('button');
        if (country) text(country, copy('collect'));
        var contactText = lang() === 'en' ? 'Building a backend, AI application, or technical content project? Leave a note and I will read it.' : '如果你正在做 Java 后端、AI 应用或技术内容项目，欢迎留下消息，我会认真阅读。 ';
        var expectedContact = contactText + (country ? country.textContent : '');
        if (lede.textContent !== expectedContact) lede.replaceChildren(document.createTextNode(contactText), country || document.createTextNode(''));
      }
      var textarea = section.querySelector('textarea');
      var input = section.querySelector('input[type="text"]');
      var consent = section.querySelector('.rcp__consent');
      var send = section.querySelector('.rcp__send-label');
      var fine = section.querySelector('.rcp__fine');
      if (textarea) textarea.placeholder = lang() === 'en' ? 'Feedback, questions, or a project note' : '反馈、问题，或想交流的项目';
      if (input) input.placeholder = lang() === 'en' ? 'Email or name (optional)' : '邮箱或姓名（可选）';
      if (consent) {
        var checkbox = consent.querySelector('input[type="checkbox"]');
        var consentText = lang() === 'en' ? 'Allow this note to be shown publicly' : '允许公开展示这条留言';
        if (consent.querySelector('span') || consent.textContent.trim() !== consentText) {
          consent.replaceChildren();
          if (checkbox) consent.appendChild(checkbox);
          consent.appendChild(document.createTextNode(consentText));
        }
      }
      var contactVisual = section.querySelector('.rcp__setup-img');
      if (contactVisual) {
        if (contactVisual.getAttribute('src') !== '/media/misc_landing_page/receipt-yang-jinsong.svg') {
          contactVisual.src = '/media/misc_landing_page/receipt-yang-jinsong.svg';
        }
        contactVisual.alt = lang() === 'en' ? 'A local engineering contact receipt for Yang Jinsong' : '杨劲松的工程联系回执';
      }
      if (send) text(send, lang() === 'en' ? 'Send note (local preview)' : '提交留言（本地预览）');
      if (fine) text(fine, lang() === 'en' ? 'This static mirror opens your default mail client when you submit.' : '这是本地静态镜像，提交后会调用你的默认邮箱客户端。');
    }

    var education = document.getElementById('education');
    if (education) education.closest('section').querySelectorAll('.ed3__education-classes').forEach(hide);

    var security = document.getElementById('ethical-hacking');
    if (security) {
      security.closest('section').querySelectorAll('[class*="disclosure-reply"], .ed3-reply').forEach(function (node) {
        text(node, lang() === 'en' ? 'Engineering checklist: logs, permissions, dependencies, and failure paths.' : '工程检查清单：日志、权限、依赖与异常路径。');
      });
    }

    var recs = document.getElementById('what-others-say');
    if (recs) {
      var quotes = lang() === 'en' ? [
        'Define the problem with clear boundaries, inputs, outputs, and measurable signals.',
        'Use logs, load tests, failure samples, and traces to locate the real issue.',
        'Turn project trade-offs into Chinese notes, diagrams, and reusable code.'
      ] : [
        '用边界、输入输出和可验证指标定义任务，再选择合适的技术。',
        '通过日志、压测、错误样本和链路记录，定位问题而不是猜问题。',
        '把一次项目中的取舍沉淀为中文文章、图解和可复用代码。'
      ];
      recs.closest('section').querySelectorAll('.ed3-recs__text').forEach(function (node, index) { text(node, '“ ' + quotes[index % quotes.length] + ' ”'); });
      recs.closest('section').querySelectorAll('.ed3-recs__more').forEach(function (node) { text(node, copy('more')); });
    }

    var evolution = document.getElementById('portfolio-evolution');
    if (evolution) {
      var headers = ['版本', '停留中位数', '单页离开率', '平均浏览页数', '首页滚动比例', '首页滚动距离', '文章阅读比例', '文章阅读距离', '社交入口', '简历入口', '联系入口', '首页与文章', '继续阅读', '文章分享', 'GitHub', 'LinkedIn', 'X', 'Instagram', 'Discord', 'Spotify', 'AI 引用', '链接预览', '真人与自动化'];
      evolution.closest('section').querySelectorAll('table button').forEach(function (node, index) { if (headers[index]) text(node, headers[index]); });
    }
  }

  function cleanRadioControlLabels() {
    var radio = document.querySelector('.ed3-bottom-dock__radio');
    if (!radio) return;
    radio.querySelectorAll('.ed3-bottom-dock__btn').forEach(function (node, index) {
      var playing = node.getAttribute('aria-pressed') === 'true';
      node.setAttribute('aria-label', index === 0 ? copy('previousPlaylist') : index === 1 ? copy(playing ? 'pauseRadio' : 'playRadio') : copy('nextPlaylist'));
    });
  }

  function cleanVisibleLabels() {
    var ariaCopy = {
      Site: '站点',
      'Contact Form': '联系表单',
      'Open on Hover': '悬停打开',
      'Sound Effects': '音效',
      Player: '播放器',
      Radio: '电台',
      'Polaroid gallery': '本地图集',
      'Canada to United States': '江西',
      'By the numbers views': '工程记录视图',
      Series: '专题',
      'Portfolio metrics across versions': '各版本指标',
      'View v3 Era — click to interact': '查看第三版，点击交互',
      "I'm not listening right now, so you can't set a song.": '当前未播放歌曲，暂时无法设置',
      'Set My Current Song': '设为当前歌曲',
      'Suggest a Song (Adds to Playlist)': '推荐歌曲（加入播放列表）',
      'Site footer': '站点页脚',
      'Site links': '站点链接',
      'Received $23k+ due to early graduation.': '提前毕业相关提示',
      "At peak; they've shrunk since I stopped posting.": '历史峰值提示'
    };
    document.querySelectorAll('[aria-label]').forEach(function (node) {
      var value = node.getAttribute('aria-label') || '';
      if (lang() === 'zh' && ariaCopy[value]) node.setAttribute('aria-label', ariaCopy[value]);
      if (lang() === 'zh' && (/^Received \$23k\+/i.test(value) || /^At peak;/i.test(value))) hide(node);
    });
    document.querySelectorAll('.ed3-live-viewers, .ed3-live-viewers__sr, [aria-label="No live viewers"], [aria-label="暂无访客"]').forEach(function (node) { text(node, copy('noViewers')); node.setAttribute('aria-label', copy('noViewers')); });
    document.querySelectorAll('.ed3__cursors-quick__label').forEach(function (node) { text(node, lang() === 'en' ? 'Cursor effects' : '动效指针'); node.setAttribute('data-mirror-label', lang() === 'en' ? 'Cursor effects' : '动效指针'); });
    document.querySelectorAll('.ed3-acc[aria-label="Loose Thoughts"], .ed3-acc[aria-label="工程随笔"]').forEach(function (node) {
      if (lang() === 'zh') node.setAttribute('aria-label', '工程随笔');
    });
    document.querySelectorAll('.ed3-acc__right').forEach(function (dateNode) {
      if (lang() === 'en') return;
      var value = dateNode.textContent.trim();
      var relative = value.match(/^(\d+)\s+(day|month|year)s?\s+ago$/i);
      if (relative) {
        var units = { day: '天', month: '个月', year: '年' };
        text(dateNode, relative[1] + units[relative[2].toLowerCase()] + '前');
      } else if (/^just now$/i.test(value)) {
        text(dateNode, '刚刚');
      }
    });
    document.querySelectorAll('.ed3-bottom-dock__radio .ed3__appbar-link__label').forEach(function (node) { text(node, copy('radio')); });
    document.querySelectorAll('.ed3-bottom-dock__slot-inner').forEach(function (node) { text(node, copy('assistant')); });
    cleanRadioControlLabels();
    document.querySelectorAll('.ed3__appbar-link__label').forEach(function (node) {
      var value = node.textContent.trim();
      if (/^Resume$|^Résumé$/i.test(value)) text(node, copy('resume'));
      if (/^Blog$/i.test(value)) text(node, copy('blog'));
      if (/^Home$/i.test(value)) text(node, copy('home'));
      if (/^MattGPT$|Summarize with MattGPT/i.test(value)) text(node, copy('assistant'));
    });
    document.querySelectorAll('button').forEach(function (button) {
      var value = button.textContent.trim();
      if (/^Show more$/i.test(value)) text(button, copy('more'));
      if (/^Show \d+ more projects$/i.test(value)) text(button, copy('more') + '项目');
      if (/^Expand all$/i.test(value)) text(button, copy('expand'));
      if (/^Close all$/i.test(value)) text(button, copy('close'));
      if (/^Cringey or random articles!/i.test(value)) text(button, copy('random'));
      if (/^every country$/i.test(value)) text(button, copy('collect'));
      if (/^At peak;/i.test(value)) hide(button);
    });
  }

  function cleanBlogChrome() {
    var blog = document.querySelector('.ed3-blog-tabs, .ed3-acc[aria-label="Articles"], .ed3-acc[aria-label="文章列表"]');
    if (!blog) return;
    if (lang() === 'zh' && /\/blog(?:\/|$)/.test(window.location.pathname)) document.title = '技术文章 · 杨劲松';
    var labels = lang() === 'en'
      ? { articles: 'Articles', series: 'Series', thoughts: 'Loose thoughts', all: 'Show all articles', random: 'Random articles', search: 'Search articles', heading: 'Writing' }
      : { articles: '文章', series: '专题', thoughts: '工程随笔', all: '显示全部文章', random: '随机文章', search: '搜索文章', heading: '技术文章' };
    document.querySelectorAll('.ed3-blog-tabs__tab').forEach(function (node, index) {
      text(node, index === 0 ? labels.articles : index === 1 ? labels.series : labels.thoughts);
    });
    document.querySelectorAll('label, span').forEach(function (node) {
      var value = node.textContent.trim();
      if (value === 'Show all articles' || value === '显示全部文章') text(node, labels.all);
    });
    document.querySelectorAll('button').forEach(function (button) {
      var value = button.textContent.trim();
      if (/^Cringey or random articles!?$/i.test(value)) text(button, labels.random);
    });
    document.querySelectorAll('input[type="search"], input[placeholder*="Search"], input[placeholder*="搜索"]').forEach(function (input) {
      input.placeholder = labels.search;
      input.setAttribute('aria-label', labels.search);
    });
    document.querySelectorAll('.ed3__blog-all').forEach(function (node) {
      var link = node.tagName === 'A' ? node : node.querySelector('a');
      if (link) {
        link.href = '/blog/index.html';
        text(link, copy('viewAll'));
        addReload(link);
      }
    });
    document.querySelectorAll('.ed3-acc[aria-label="Articles"] .ed3-acc__item, .ed3-acc[aria-label="文章列表"] .ed3-acc__item').forEach(function (row) {
      var links = Array.prototype.slice.call(row.querySelectorAll('a[href*="/blog/"]'));
      var primary = links.find(function (candidate) { return !candidate.classList.contains('ed3-share-link'); }) || links[0];
      var title = primary ? primary.textContent.replace(/\s+/g, ' ').trim() : '';
      var route = articleRoutes[title] || (primary && !/^\/blog\/(?:a|s|page)(?:\/|$)/i.test(primary.getAttribute('href') || '') ? primary.getAttribute('href') : '/blog/index.html');
      if (primary && route && primary.getAttribute('href') !== route) primary.href = route;
      row.querySelectorAll('a.ed3-share-link, a[href*="/blog/a/"]').forEach(function (copyLink) {
        copyLink.href = route;
        copyLink.removeAttribute('target');
        copyLink.removeAttribute('rel');
        addReload(copyLink);
      });
      row.querySelectorAll('.ed3-acc__right').forEach(function (dateNode) {
        var match = dateNode.textContent.trim().match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\.\s+(\d{1,2}),\s+(\d{4})$/i);
        if (!match || lang() === 'en') return;
        var months = { Jan: '1月', Feb: '2月', Mar: '3月', Apr: '4月', May: '5月', Jun: '6月', Jul: '7月', Aug: '8月', Sep: '9月', Oct: '10月', Nov: '11月', Dec: '12月' };
        text(dateNode, match[3] + '年' + months[match[1].slice(0, 3)] + match[2] + '日');
      });
    });
    document.querySelectorAll('.ed3-blog-tabs, .ed3-acc[aria-label="Articles"], .ed3-acc[aria-label="文章列表"]').forEach(function (node) {
      node.querySelectorAll('.ed3__section-title__word, h1, h2').forEach(function (heading) {
        if (/^(Blog|Writing|Articles|技术文章)$/i.test(heading.textContent.trim())) text(heading, labels.heading);
      });
    });
  }

  function cleanArticleChrome() {
    var articleCopy = lang() === 'en' ? {
      announce: 'Engineering notes · RAG / agents / Java / Python',
      articles: 'Articles', series: 'Series', thoughts: 'Loose thoughts',
      contact: 'Keep in touch', contactMuted: '(open to conversation)',
      print: 'Message', collect: 'Archive',
      receipt: 'New message #1', clerk: 'Owner', order: 'Reference', date: 'Date',
      reply: 'Reply-to', message: 'Message', total: 'Status · local preview'
    } : {
      announce: '工程记录 · RAG / Agent / Java / Python',
      articles: '文章', series: '专题', thoughts: '工程随笔',
      contact: '保持联系', contactMuted: '（欢迎交流）',
      print: '留言', collect: '收集',
      receipt: '新留言 #1', clerk: '负责人', order: '编号', date: '日期',
      reply: '回复方式', message: '留言', total: '状态 · 本地预览'
    };
    document.querySelectorAll('.ed3__announce-text').forEach(function (node) { text(node, articleCopy.announce); });
    document.querySelectorAll('.ed3__appbar-link--settings .ed3__appbar-link__label').forEach(function (node) { text(node, lang() === 'en' ? 'More' : '更多'); });
    document.querySelectorAll('.ed3__appbar-link--ask .ed3__appbar-link__label, .ed3__links-row[aria-label="MattGPT"] .ed3__links-row__label').forEach(function (node) { text(node, copy('assistant')); });
    document.querySelectorAll('.ed3__appbar-link--links .ed3__appbar-link__label--wide').forEach(function (node) { text(node, lang() === 'en' ? 'Socials' : '社交'); });
    document.querySelectorAll('.ed3__appbar-link--links .ed3__appbar-link__label--narrow').forEach(function (node) { text(node, lang() === 'en' ? 'Menu' : '菜单'); });
    document.querySelectorAll('.ed3-blog-tabs__tab').forEach(function (node, index) { text(node, index === 0 ? articleCopy.articles : index === 1 ? articleCopy.series : articleCopy.thoughts); });
    document.querySelectorAll('.ed3-share-link').forEach(function (node) {
      node.setAttribute('aria-label', lang() === 'en' ? 'Copy article link' : '复制本文链接');
      node.title = lang() === 'en' ? 'Copy article link' : '复制本文链接';
    });
    document.querySelectorAll('.ed3-article__toc-line').forEach(function (node) {
      if (node.getAttribute('aria-label') === 'Top') node.setAttribute('aria-label', lang() === 'en' ? 'Top' : '顶部');
    });
    var contact = document.getElementById('contact');
    var contactSection = contact && contact.closest('section');
    if (contactSection) {
      var heading = contactSection.querySelector('.ed3__section-title__word');
      var muted = contactSection.querySelector('.ed3__section-title__muted');
      if (heading) text(heading, articleCopy.contact);
      if (muted) text(muted, articleCopy.contactMuted);
      var tabs = contactSection.querySelectorAll('.ed3__section-tabs__tab');
      if (tabs[0]) text(tabs[0], articleCopy.print);
      if (tabs[1]) text(tabs[1], articleCopy.collect);
      contactSection.querySelectorAll('.rcp__band-name').forEach(function (node) { text(node, articleCopy.receipt); });
      contactSection.querySelectorAll('.rcp__row').forEach(function (node) {
        var value = node.textContent.trim();
        if (/Order/i.test(value)) text(node, articleCopy.order + ' · 本地留言');
        else if (/Date/i.test(value)) text(node, articleCopy.date + ' · 当前');
        else if (/Clerk|Matt/i.test(value)) text(node, articleCopy.clerk + ' · 杨劲松');
        else if (/Reply-to/i.test(value)) text(node, articleCopy.reply);
        var cells = node.querySelectorAll(':scope > span');
        if (cells.length >= 2 && lang() === 'zh') {
          var left = cells[0].textContent.trim();
          var right = cells[1].textContent.trim();
          var cellMap = { Order: '编号', Date: '日期', Clerk: '负责人', Message: '留言', 'Reply-to': '回复方式', Lines: '字数', Shareable: '可公开', 'Total due': '状态' };
          if (cellMap[left]) text(cells[0], cellMap[left]);
          if (right === 'My paper budget') text(cells[1], '本地预览');
        }
      });
      contactSection.querySelectorAll('.rcp__item').forEach(function (node) { text(node, /Reply-to/i.test(node.textContent) ? '1 × ' + articleCopy.reply : '1 × ' + articleCopy.message); });
      contactSection.querySelectorAll('.rcp__from').forEach(function (node) { text(node, lang() === 'en' ? 'A local engineering note' : '一条本地工程留言'); });
      contactSection.querySelectorAll('.rcp__text--empty').forEach(function (node) { text(node, lang() === 'en' ? 'No content yet' : '暂无内容'); });
      contactSection.querySelectorAll('.rcp__thanks').forEach(function (node) { text(node, lang() === 'en' ? 'I try to answer every thoughtful note' : '我会尽量回复每一封认真写来的留言'); });
      contactSection.querySelectorAll('.rcp__code').forEach(function (node) { text(node, '*YJS-001*'); });
      contactSection.querySelectorAll('*').forEach(function (node) {
        if (node.children.length) return;
        var value = node.textContent.trim();
        var replacements = {
          'MESSAGE': lang() === 'en' ? 'MESSAGE' : '留言',
          'REPLY-TO': lang() === 'en' ? 'REPLY-TO' : '回复方式',
          'LINES': lang() === 'en' ? 'LINES' : '字数',
          'SHAREABLE': lang() === 'en' ? 'SHAREABLE' : '可公开',
          'TOTAL DUE': lang() === 'en' ? 'STATUS' : '状态',
          'MY PAPER BUDGET': lang() === 'en' ? 'LOCAL PREVIEW' : '本地预览',
          'Connecting...': lang() === 'en' ? 'Ready' : '已就绪'
        };
        if (Object.prototype.hasOwnProperty.call(replacements, value)) text(node, replacements[value]);
      });
      contactSection.querySelectorAll('.rcp__fine p').forEach(function (node) {
        if (lang() === 'zh') text(node, '本地静态镜像，提交后会调用你的默认邮箱客户端。');
      });
    }
    document.querySelectorAll('.ed3__section-title__word').forEach(function (node) {
      if (/^Or be More Traditional/i.test(node.textContent.trim())) text(node, lang() === 'en' ? 'Traditional contact' : '传统联系');
    });
    document.querySelectorAll('.ed3__section-title__muted').forEach(function (node) {
      if (/Boring/i.test(node.textContent)) text(node, lang() === 'en' ? '(a quieter route)' : '（欢迎交流）');
    });
    document.querySelectorAll('.ed3-footer__feedback').forEach(function (node) { text(node, lang() === 'en' ? 'Stay curious, keep building.' : '保持好奇，持续构建。'); });
    document.querySelectorAll('.ed3-footer__credit').forEach(function (node) {
      if (/Copyright|Privacy|杨劲松 ©/.test(node.textContent)) text(node, lang() === 'en' ? 'Yang Jinsong © 2026 / Engineering blog' : '杨劲松 © 2026 / 中文技术博客');
    });
    document.querySelectorAll('.ed3-footer a').forEach(function (node) {
      if (/Privacy/i.test(node.textContent)) { node.href = '#contact'; text(node, copy('privacy')); }
    });
  }

  function clean() {
    ensureStyle();
    document.documentElement.lang = lang() === 'en' ? 'en' : 'zh-CN';
    prepareRollHeadings();
    cleanHeroByline();
    watchHeroByline();
    cleanNavigation();
    cleanHomeBlog();
    cleanProjects();
    cleanNumbers();
    cleanIndexNav();
    cleanEvolutionTable();
    if (window.__mirrorContentPatched) {
      removeLegacyRows('experience');
      removeLegacyRows('other-projects');
      removeLegacyRows('competitions');
    }
    cleanExternalLinks();
    cleanFooter();
    cleanSecondarySections();
    cleanVisibleLabels();
    cleanBlogChrome();
    cleanArticleChrome();
    document.documentElement.classList.add('mirror-polished');
  }

  function boot() {
    clean();
    [180, 500, 1000, 2000, 3600, 5200, 7600].forEach(function (delay) { window.setTimeout(clean, delay); });
    if (window.MutationObserver && document.documentElement) {
      var languageObserver = new MutationObserver(function () { clean(); });
      languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mirror-language'] });
      if (document.body) {
        var blogTimer = 0;
        var blogObserver = new MutationObserver(function (records) {
          if (!records.some(function (record) {
            var target = record.target.nodeType === 1 ? record.target : record.target.parentElement;
            return !!(target && target.closest && target.closest('.ed3-blog-tabs, .ed3-acc'));
          })) return;
          clearTimeout(blogTimer);
          blogTimer = setTimeout(function () { cleanBlogChrome(); }, 40);
        });
        blogObserver.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['href', 'aria-label', 'class'] });
        var surfaceTimer = 0;
        var surfaceObserver = new MutationObserver(function (records) {
          if (!records.some(function (record) {
            var target = record.target.nodeType === 1 ? record.target : record.target.parentElement;
            return !!(target && target.closest && target.closest('.rcp, #contact, .ed3-evo, .shelf, .ed3-acc'));
          })) return;
          clearTimeout(surfaceTimer);
          surfaceTimer = setTimeout(function () {
            cleanHomeBlog();
            cleanEvolutionTable();
            cleanSecondarySections();
            cleanArticleChrome();
            cleanVisibleLabels();
          }, 48);
        });
        surfaceObserver.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['href', 'aria-label', 'class', 'src'] });
        var footerObserver = new MutationObserver(function (records) {
          if (records.some(function (record) {
            var target = record.target.nodeType === 1 ? record.target : record.target.parentElement;
            return !!(target && target.closest('.ed3-footer__objective-desc'));
          })) cleanFooter();
        });
        footerObserver.observe(document.body, { subtree: true, childList: true, characterData: true });
        var radioObserver = new MutationObserver(function (records) {
          if (records.some(function (record) { return record.target.closest('.ed3-bottom-dock__radio'); })) cleanRadioControlLabels();
        });
        radioObserver.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['aria-pressed'] });
        var navigationObserver = new MutationObserver(function (records) {
          var changedNavigationLink = records.some(function (record) {
            return record.target.matches('a') && record.target.closest('.ed3__appbar-nav, .ed3__links-panel');
          });
          if (changedNavigationLink) cleanNavigation();
        });
        navigationObserver.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['href'] });
      }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
