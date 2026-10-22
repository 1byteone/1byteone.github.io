(function () {
  const root = document.documentElement;
  const storedTheme = (() => {
    try { return localStorage.getItem('bloggpt-theme'); } catch (_) { return null; }
  })();
  if (storedTheme === 'dark' || storedTheme === 'light') root.dataset.theme = storedTheme;

  function setTheme(theme) {
    root.dataset.theme = theme;
    try { localStorage.setItem('bloggpt-theme', theme); } catch (_) {}
  }

  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    button.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
  });

  const openSidebar = () => {
    root.classList.add('bloggpt-sidebar-open');
    if (window.innerWidth > 700) {
      root.classList.remove('bloggpt-sidebar-collapsed');
      try { localStorage.setItem('bloggpt-sidebar', 'expanded'); } catch (_) {}
    }
  };
  const closeSidebar = () => root.classList.remove('bloggpt-sidebar-open');
  document.querySelectorAll('[data-sidebar-toggle]').forEach((button) => button.addEventListener('click', openSidebar));
  document.querySelectorAll('[data-sidebar-close]').forEach((button) => button.addEventListener('click', closeSidebar));
  document.querySelectorAll('[data-sidebar-collapse]').forEach((button) => button.addEventListener('click', () => {
    root.classList.toggle('bloggpt-sidebar-collapsed');
    try { localStorage.setItem('bloggpt-sidebar', root.classList.contains('bloggpt-sidebar-collapsed') ? 'collapsed' : 'expanded'); } catch (_) {}
  }));
  try {
    if (localStorage.getItem('bloggpt-sidebar') === 'collapsed' && window.innerWidth > 700) root.classList.add('bloggpt-sidebar-collapsed');
  } catch (_) {}

  const dialog = document.querySelector('[data-search-dialog]');
  const dialogInput = dialog && dialog.querySelector('[data-dialog-search]');
  const dialogResults = dialog && dialog.querySelector('[data-dialog-results]');
  const allItems = Array.from(document.querySelectorAll('[data-dialog-search-item]'));
  const searchItems = (query, items = allItems) => {
    const normalized = query.trim().toLowerCase();
    let visible = 0;
    items.forEach((item) => {
      const matches = !normalized || (item.dataset.searchText || '').toLowerCase().includes(normalized);
      item.hidden = !matches;
      if (matches) visible += 1;
    });
    const empty = document.querySelector('[data-search-empty], [data-list-empty]');
    if (empty) empty.hidden = visible !== 0;
  };
  const openSearch = () => {
    if (!dialog) return;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    if (dialogInput) { dialogInput.value = ''; dialogInput.focus(); }
    renderDialogResults('');
  };
  const renderDialogResults = (query) => {
    if (!dialogResults) return;
    const normalized = query.trim().toLowerCase();
    const rows = allItems.filter((item) => !normalized || (item.dataset.searchText || '').toLowerCase().includes(normalized)).slice(0, 10);
    dialogResults.innerHTML = rows.length ? rows.map((item) => {
      const link = item.matches('a[href]') ? item : item.querySelector('a[href]');
      const title = item.querySelector('.bloggpt-dialog-index-title, .bloggpt-post-title, h2 a');
      const summary = item.querySelector('.bloggpt-dialog-index-summary, p');
      return link ? `<a class="bloggpt-dialog-result" href="${link.href}"><strong>${title ? title.textContent.trim() : 'Article'}</strong><small>${summary ? summary.textContent.slice(0, 110) : ''}</small></a>` : '';
    }).join('') : `<p class="bloggpt-empty">${document.body.dataset.lang === 'zh' ? '没有匹配的文章。' : 'No matching notes.'}</p>`;
  };
  document.querySelectorAll('[data-search-open]').forEach((button) => button.addEventListener('click', openSearch));
  if (dialogInput) dialogInput.addEventListener('input', () => renderDialogResults(dialogInput.value));
  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openSearch(); }
    if (event.key === 'Escape') closeSidebar();
  });

  const homeInput = document.querySelector('[data-search-input]');
  const currentLang = document.body && document.body.dataset.lang === 'zh' ? 'zh' : 'en';
  const navigateCommand = (query) => {
    const normalized = (query || '').trim().toLowerCase();
    if (normalized === '/random') {
      const candidates = Array.from(document.querySelectorAll('[data-search-item] a[href], [data-list-card] a[href]'));
      if (candidates.length) {
        const target = candidates[Math.floor(Math.random() * candidates.length)];
        window.location.href = target.href;
      } else {
        const randomLink = document.querySelector('.bloggpt-composer-random');
        if (randomLink) window.location.href = randomLink.href;
      }
      return true;
    }
    if (normalized === '/theme') { setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'); return true; }
    if (normalized === '/lang') {
      const languageLink = document.querySelector('.bloggpt-sidebar-actions a[lang]');
      if (languageLink) window.location.href = languageLink.href;
      return true;
    }
    const routes = { '/categories': 'categories/', '/archives': 'archives/', '/status': 'status/', '/search': 'search/' };
    if (routes[normalized]) { window.location.href = new URL(routes[normalized], window.location.href).href; return true; }
    return false;
  };
  if (homeInput) {
    homeInput.addEventListener('input', () => searchItems(homeInput.value, Array.from(document.querySelectorAll('[data-search-item]'))));
    homeInput.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const value = homeInput.value.trim();
      if (navigateCommand(value)) return;
      if (value && !document.querySelector('[data-search-item]')) {
        window.location.href = new URL(`search/?q=${encodeURIComponent(value)}`, window.location.href).href;
        return;
      }
      searchItems(value, Array.from(document.querySelectorAll('[data-search-item]')));
    });
  }
  document.querySelectorAll('[data-query]').forEach((button) => button.addEventListener('click', () => {
    if (!homeInput) return;
    const query = button.dataset.query || '';
    if (navigateCommand(query)) return;
    homeInput.value = query;
    homeInput.dispatchEvent(new Event('input', { bubbles: true }));
    homeInput.focus();
  }));
  const listInput = document.querySelector('[data-list-search]');
  const listCards = Array.from(document.querySelectorAll('[data-list-card]'));
  let activeFilter = 'all';
  const updateList = () => {
    const normalized = listInput ? listInput.value.trim().toLowerCase() : '';
    let visible = 0;
    listCards.forEach((card) => {
      const matchesQuery = !normalized || (card.dataset.searchText || '').toLowerCase().includes(normalized);
      const matchesFilter = activeFilter !== 'featured' || card.dataset.featured === 'true';
      card.hidden = !(matchesQuery && matchesFilter);
      if (!card.hidden) visible += 1;
    });
    const empty = document.querySelector('[data-list-empty]');
    if (empty) empty.hidden = visible !== 0;
  };
  if (listInput) listInput.addEventListener('input', updateList);
  if (listInput) {
    const queryValue = new URLSearchParams(window.location.search).get('q');
    if (queryValue) { listInput.value = queryValue; updateList(); }
  }
  document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach((item) => item.classList.toggle('is-active', item === button));
    activeFilter = button.dataset.filter || 'all';
    updateList();
  }));
  document.querySelectorAll('[data-copy-link]').forEach((button) => button.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(window.location.href); button.textContent = '✓ Copied'; } catch (_) { button.textContent = 'Copy failed'; }
    window.setTimeout(() => { button.textContent = '⌘ Copy link'; }, 1800);
  }));
  const resourceInput = document.querySelector('[data-resource-search]');
  const resourceCards = Array.from(document.querySelectorAll('[data-resource-card]'));
  if (resourceInput) resourceInput.addEventListener('input', () => {
    const query = resourceInput.value.trim().toLowerCase();
    let visible = 0;
    resourceCards.forEach((card) => { const match = !query || (card.dataset.searchText || '').toLowerCase().includes(query); card.hidden = !match; if (match) visible += 1; });
    const empty = document.querySelector('[data-resource-empty]');
    if (empty) empty.hidden = visible !== 0;
  });
  const friendInput = document.querySelector('[data-friend-search]');
  const friendCards = Array.from(document.querySelectorAll('[data-friend-card]'));
  if (friendInput) friendInput.addEventListener('input', () => {
    const query = friendInput.value.trim().toLowerCase();
    let visible = 0;
    friendCards.forEach((card) => { const match = !query || (card.dataset.searchText || '').toLowerCase().includes(query); card.hidden = !match; if (match) visible += 1; });
    const empty = document.querySelector('[data-friend-empty]');
    if (empty) empty.hidden = visible !== 0;
  });
})();
