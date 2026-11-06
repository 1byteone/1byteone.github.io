(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  if (!body || !body.classList.contains('ai-product-studio')) return;

  const isChinese = (root.lang || '').toLowerCase().startsWith('zh');
  const labels = isChinese
    ? { openMenu: '打开导航菜单', closeMenu: '关闭导航菜单', dark: '切换浅色模式', light: '切换深色模式', noResults: '没有找到匹配的档案。', copy: '复制代码', copied: '已复制', copyFailed: '复制失败', toc: '本页目录' }
    : { openMenu: 'Open navigation menu', closeMenu: 'Close navigation menu', dark: 'Switch to light mode', light: 'Switch to dark mode', noResults: 'No matching records found.', copy: 'Copy code', copied: 'Copied', copyFailed: 'Copy failed', toc: 'On this page' };

  const shortcutLabel = document.querySelector('[data-aps-shortcut]');
  if (shortcutLabel && !/Mac|iPhone|iPad/.test(navigator.platform || '')) shortcutLabel.textContent = 'Ctrl K';

  const safelyRead = (key) => {
    try { return window.localStorage.getItem(key); } catch { return null; }
  };
  const safelyWrite = (key, value) => {
    try { window.localStorage.setItem(key, value); } catch { /* Storage can be unavailable in private contexts. */ }
  };

  // Mobile navigation: expose state to assistive technology and close on selection,
  // outside interaction, Escape, or when the desktop layout returns.
  const menuToggle = document.querySelector('[data-aps-menu-toggle]');
  const navigation = document.querySelector('[data-aps-nav]');
  const setMenuOpen = (open, returnFocus) => {
    if (!menuToggle || !navigation) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? labels.closeMenu : labels.openMenu);
    navigation.classList.toggle('is-open', open);
    if (!open && returnFocus) menuToggle.focus();
  };

  if (menuToggle && navigation) {
    menuToggle.addEventListener('click', () => {
      setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
    });
    navigation.addEventListener('click', (event) => {
      if (event.target.closest('a')) setMenuOpen(false);
    });
    document.addEventListener('pointerdown', (event) => {
      if (menuToggle.getAttribute('aria-expanded') === 'true' && !event.target.closest('[data-aps-header]')) {
        setMenuOpen(false);
      }
    });
    const desktopLayout = window.matchMedia('(min-width: 921px)');
    desktopLayout.addEventListener?.('change', (event) => {
      if (event.matches) setMenuOpen(false);
    });
  }

  // Theme mode is deliberately scoped to this theme and persists per browser.
  const modeToggle = document.querySelector('[data-aps-mode-toggle]');
  const modeKey = 'ai-product-studio-mode-v1';
  const applyMode = (mode) => {
    const normalized = mode === 'dark' ? 'dark' : 'light';
    root.dataset.apsMode = normalized;
    if (modeToggle) {
      const dark = normalized === 'dark';
      modeToggle.setAttribute('aria-pressed', String(dark));
      modeToggle.setAttribute('aria-label', dark ? labels.dark : labels.light);
      modeToggle.title = dark ? labels.dark : labels.light;
    }
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = normalized === 'dark' ? '#151515' : '#f5f3ed';
  };
  applyMode(safelyRead(modeKey) || 'light');
  modeToggle?.addEventListener('click', () => {
    const next = root.dataset.apsMode === 'dark' ? 'light' : 'dark';
    applyMode(next);
    safelyWrite(modeKey, next);
  });

  // Lightweight in-page search uses the Hugo-rendered route index. Results are
  // created with DOM APIs so article titles and summaries remain plain text.
  const searchDialog = document.querySelector('[data-aps-search-dialog]');
  const searchInput = document.querySelector('[data-aps-search-input]');
  const searchResults = document.querySelector('[data-aps-search-results]');
  const searchSource = document.querySelector('[data-aps-search-source]');
  const searchTriggers = Array.from(document.querySelectorAll('[data-aps-search-open]'));
  const searchItems = searchSource
    ? Array.from(searchSource.querySelectorAll('a')).map((link) => ({
      href: link.href,
      title: link.dataset.title || link.textContent.trim(),
      section: link.dataset.section || '',
      summary: link.dataset.summary || ''
    }))
    : [];
  let searchReturnFocus = null;
  let selectedSearchIndex = -1;

  const normalizeText = (value) => (value || '').toLocaleLowerCase().normalize('NFKC').trim();
  const getSearchResultLinks = () => searchResults ? Array.from(searchResults.querySelectorAll('[data-aps-search-result]')) : [];
  const selectSearchResult = (index) => {
    const links = getSearchResultLinks();
    if (!links.length) { selectedSearchIndex = -1; return; }
    selectedSearchIndex = (index + links.length) % links.length;
    links.forEach((link, linkIndex) => {
      link.setAttribute('aria-selected', String(linkIndex === selectedSearchIndex));
    });
    links[selectedSearchIndex].scrollIntoView({ block: 'nearest' });
  };

  const renderSearchResults = () => {
    if (!searchResults || !searchInput) return;
    const query = normalizeText(searchInput.value);
    const matches = query
      ? searchItems.map((item) => {
        const haystack = normalizeText([item.title, item.section, item.summary].join(' '));
        const title = normalizeText(item.title);
        const score = title === query ? 0 : title.startsWith(query) ? 1 : title.includes(query) ? 2 : haystack.includes(query) ? 3 : 9;
        return { item, score };
      }).filter((entry) => entry.score < 9).sort((a, b) => a.score - b.score || a.item.title.localeCompare(b.item.title, isChinese ? 'zh-Hans' : 'en')).slice(0, 10)
      : [];

    searchResults.replaceChildren();
    selectedSearchIndex = -1;
    if (!query) return;
    if (!matches.length) {
      const empty = document.createElement('p');
      empty.className = 'aps-search-empty';
      empty.textContent = labels.noResults;
      searchResults.append(empty);
      return;
    }

    matches.forEach(({ item }) => {
      const link = document.createElement('a');
      link.className = 'aps-search-result';
      link.href = item.href;
      link.dataset.apsSearchResult = '';
      link.setAttribute('aria-selected', 'false');
      const title = document.createElement('strong');
      title.textContent = item.title;
      const meta = document.createElement('small');
      meta.textContent = [item.section && item.section.toUpperCase(), item.summary].filter(Boolean).join(' · ');
      link.append(title, meta);
      searchResults.append(link);
    });
  };

  const openSearch = (trigger) => {
    if (!searchDialog || typeof searchDialog.showModal !== 'function') return;
    if (searchDialog.open) return;
    searchReturnFocus = trigger || document.activeElement;
    searchDialog.showModal();
    searchInput?.focus();
  };
  const closeSearch = () => {
    if (searchDialog?.open) searchDialog.close();
  };

  searchTriggers.forEach((trigger) => trigger.addEventListener('click', () => openSearch(trigger)));
  searchInput?.addEventListener('input', renderSearchResults);
  searchResults?.addEventListener('click', (event) => {
    if (event.target.closest('[data-aps-search-result]')) closeSearch();
  });
  searchDialog?.addEventListener('close', () => {
    if (searchInput) searchInput.value = '';
    renderSearchResults();
    if (searchReturnFocus instanceof HTMLElement && searchReturnFocus.isConnected) searchReturnFocus.focus();
  });

  // Scroll reveals only activate when motion is allowed and the API is available.
  // Without JS, or under reduced motion, the CSS leaves all content visible.
  const revealItems = Array.from(document.querySelectorAll('[data-aps-reveal]'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let revealObserver = null;
  const revealImmediately = () => {
    revealObserver?.disconnect();
    revealObserver = null;
    body.classList.remove('aps-reveal-enabled');
    revealItems.forEach((item) => item.classList.add('is-visible'));
  };
  const enableReveals = () => {
    if (reducedMotion.matches || !('IntersectionObserver' in window)) { revealImmediately(); return; }
    revealItems.forEach((item, index) => {
      item.style.setProperty('--aps-reveal-delay', Math.min(index % 5, 4) * 45 + 'ms');
    });
    body.classList.add('aps-reveal-enabled');
    revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -4% 0px', threshold: 0.08 });
    revealItems.forEach((item) => revealObserver.observe(item));
  };
  enableReveals();
  reducedMotion.addEventListener?.('change', () => {
    if (reducedMotion.matches) revealImmediately();
    else {
      revealItems.forEach((item) => item.classList.remove('is-visible'));
      enableReveals();
    }
  });

  // Evidence cards are article records, not fabricated benchmark entries.
  const filterButtons = Array.from(document.querySelectorAll('[data-aps-experiment-filter]'));
  const experimentCards = Array.from(document.querySelectorAll('[data-aps-experiment-card]'));
  const emptyExperiments = document.querySelector('[data-aps-experiment-empty]');
  const matchesTopic = (card, topic) => {
    if (topic === 'all') return true;
    const value = normalizeText(card.dataset.topic);
    if (topic === 'rag') return /rag|retriev/.test(value);
    if (topic === 'agent') return value.includes('agent');
    if (topic === 'tool') return /tool|function.?call/.test(value);
    return value.includes(topic);
  };
  filterButtons.forEach((button) => button.addEventListener('click', () => {
    const topic = button.dataset.apsExperimentFilter || 'all';
    filterButtons.forEach((filter) => filter.setAttribute('aria-pressed', String(filter === button)));
    let visible = 0;
    experimentCards.forEach((card) => {
      const show = matchesTopic(card, topic);
      card.hidden = !show;
      card.classList.toggle('is-hidden', !show);
      if (show) visible += 1;
    });
    if (emptyExperiments) emptyExperiments.hidden = visible !== 0;
  }));

  // The product surface keeps a small amount of state visible like a real
  // product workspace: view tabs change the active context, while the board
  // filter narrows cards without changing their layout.
  const surface = document.querySelector('[data-aps-surface]');
  if (surface) {
    const surfaceViews = Array.from(surface.querySelectorAll('[data-aps-surface-view]'));
    const surfaceFilters = Array.from(surface.querySelectorAll('[data-aps-surface-filter]'));
    const issueCards = Array.from(surface.querySelectorAll('[data-aps-issue-state]'));
    const setSurfaceView = (view, focus = false) => {
      const active = surfaceViews.find((item) => item.dataset.apsSurfaceView === view) || surfaceViews[0];
      if (!active) return;
      surfaceViews.forEach((item) => item.setAttribute('aria-selected', String(item === active)));
      surface.dataset.apsSurfaceCurrent = active.dataset.apsSurfaceView;
      if (focus) active.focus();
    };
    surfaceViews.forEach((button, index) => {
      button.addEventListener('click', () => setSurfaceView(button.dataset.apsSurfaceView));
      button.addEventListener('keydown', (event) => {
        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? surfaceViews.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + surfaceViews.length) % surfaceViews.length;
        setSurfaceView(surfaceViews[next].dataset.apsSurfaceView, true);
      });
    });
    surfaceFilters.forEach((button) => button.addEventListener('click', () => {
      const filter = button.dataset.apsSurfaceFilter || 'all';
      surfaceFilters.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      issueCards.forEach((card) => {
        const visible = filter === 'all' || card.dataset.apsIssueState === filter;
        card.hidden = !visible;
      });
    }));
  }

  // The studio method is a real tabbed workbench: every stage owns a panel,
  // keyboard arrows move through the workflow, and the URL can address a stage.
  const workflowTabs = Array.from(document.querySelectorAll('[data-aps-workflow-tab]'));
  const workflowPanels = Array.from(document.querySelectorAll('[data-aps-workflow-panel]'));
  const setWorkflowStage = (id, moveFocus = false) => {
    const tab = workflowTabs.find((item) => item.dataset.apsWorkflowTab === id) || workflowTabs[0];
    if (!tab) return;
    const activeId = tab.dataset.apsWorkflowTab;
    workflowTabs.forEach((item) => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });
    workflowPanels.forEach((panel) => {
      panel.hidden = panel.dataset.apsWorkflowPanel !== activeId;
    });
    if (moveFocus) tab.focus();
  };
  if (workflowTabs.length) {
    workflowTabs.forEach((tab, index) => {
      tab.addEventListener('click', () => setWorkflowStage(tab.dataset.apsWorkflowTab));
      tab.addEventListener('keydown', (event) => {
        if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? workflowTabs.length - 1 : (index + (event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1) + workflowTabs.length) % workflowTabs.length;
        setWorkflowStage(workflowTabs[next].dataset.apsWorkflowTab, true);
      });
    });
    const hashStage = window.location.hash.replace(/^#/, '').replace(/^stage-/, '');
    setWorkflowStage(workflowTabs.some((tab) => tab.dataset.apsWorkflowTab === hashStage) ? hashStage : workflowTabs[0].dataset.apsWorkflowTab);
  }

  // The hero scene borrows the restrained pointer parallax used by product
  // studios: it stays within a few pixels and is disabled on touch/reduced motion.
  const sceneFrame = document.querySelector('.aps-scene-frame');
  if (sceneFrame && !reducedMotion.matches && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const resetScene = () => {
      sceneFrame.style.setProperty('--aps-scene-x', '0px');
      sceneFrame.style.setProperty('--aps-scene-y', '0px');
    };
    sceneFrame.addEventListener('pointermove', (event) => {
      const bounds = sceneFrame.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - .5) * 8;
      const y = ((event.clientY - bounds.top) / bounds.height - .5) * 8;
      sceneFrame.style.setProperty('--aps-scene-x', `${x.toFixed(2)}px`);
      sceneFrame.style.setProperty('--aps-scene-y', `${y.toFixed(2)}px`);
    });
    sceneFrame.addEventListener('pointerleave', resetScene);
    resetScene();
  }

  // Code controls work on secure contexts and fall back to a temporary selection
  // for local previews opened over plain HTTP.
  const copyCode = async (text) => {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    field.style.pointerEvents = 'none';
    document.body.append(field);
    field.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch { copied = false; }
    field.remove();
    return copied;
  };
  document.querySelectorAll('.aps-prose pre').forEach((pre) => {
    if (pre.querySelector('[data-aps-copy-code]')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'aps-copy-code';
    button.dataset.apsCopyCode = '';
    button.textContent = isChinese ? '复制' : 'COPY';
    button.setAttribute('aria-label', labels.copy);
    button.setAttribute('aria-live', 'polite');
    pre.append(button);
    button.addEventListener('click', async () => {
      const code = pre.querySelector('code');
      let copied = false;
      try { copied = await copyCode(code ? code.textContent : pre.textContent.replace(button.textContent, '')); } catch { copied = false; }
      button.textContent = copied ? labels.copied : labels.copyFailed;
      button.setAttribute('aria-label', copied ? labels.copied : labels.copyFailed);
      window.setTimeout(() => {
        button.textContent = isChinese ? '复制' : 'COPY';
        button.setAttribute('aria-label', labels.copy);
      }, 1600);
    });
  });

  // A small reading progress indicator and current section state for the sticky TOC.
  const progressBar = document.querySelector('[data-aps-reading-progress]');
  let progressFrame = 0;
  const updateProgress = () => {
    progressFrame = 0;
    if (!progressBar) return;
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const amount = max ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 0;
    progressBar.style.width = amount + '%';
  };
  const scheduleProgress = () => {
    if (!progressBar || progressFrame) return;
    progressFrame = window.requestAnimationFrame(updateProgress);
  };
  if (progressBar) {
    window.addEventListener('scroll', scheduleProgress, { passive: true });
    window.addEventListener('resize', scheduleProgress, { passive: true });
    updateProgress();
  }

  const tocLinks = Array.from(document.querySelectorAll('.aps-article-aside a[href^="#"]'));
  const tocHeadings = tocLinks.map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1)))).filter(Boolean);
  if (tocHeadings.length && 'IntersectionObserver' in window && !reducedMotion.matches) {
    const linkById = new Map(tocLinks.map((link) => [decodeURIComponent(link.hash.slice(1)), link]));
    const tocObserver = new IntersectionObserver((entries) => {
      const active = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!active) return;
      tocLinks.forEach((link) => link.removeAttribute('aria-current'));
      linkById.get(active.target.id)?.setAttribute('aria-current', 'location');
    }, { rootMargin: '-12% 0px -72% 0px', threshold: 0 });
    tocHeadings.forEach((heading) => tocObserver.observe(heading));
  }

  // Keyboard affordances: Ctrl/⌘+K opens search, arrows move through results,
  // Enter follows the active result, and Escape closes transient UI.
  document.addEventListener('keydown', (event) => {
    const target = event.target;
    const editing = target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openSearch(target instanceof HTMLElement ? target : null);
      return;
    }
    if (searchDialog?.open && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
      selectSearchResult(selectedSearchIndex + (event.key === 'ArrowDown' ? 1 : -1));
      return;
    }
    if (searchDialog?.open && event.key === 'Enter' && selectedSearchIndex >= 0) {
      const selected = getSearchResultLinks()[selectedSearchIndex];
      if (selected) { event.preventDefault(); window.location.assign(selected.href); }
      return;
    }
    if (event.key === 'Escape' && searchDialog?.open) {
      event.preventDefault();
      closeSearch();
      return;
    }
    if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false, true);
    } else if (!editing && event.key === '/' && !searchDialog?.open) {
      event.preventDefault();
      openSearch(target instanceof HTMLElement ? target : null);
    }
  });
})();
