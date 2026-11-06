(() => {
  const root = document.documentElement;
  const themeKey = 'ai-lab-color-mode';
  const syncThemeButtons = () => {
    document.querySelectorAll('[data-lab-theme-toggle]').forEach((button) => {
      button.setAttribute('aria-pressed', String(root.dataset.theme === 'dark'));
    });
  };
  const setTheme = (theme) => {
    root.dataset.theme = theme;
    try { localStorage.setItem(themeKey, theme); } catch (_) { /* Storage can be disabled. */ }
    syncThemeButtons();
  };

  document.querySelectorAll('[data-lab-theme-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
    });
  });
  syncThemeButtons();

  const menuButton = document.querySelector('[data-lab-menu-toggle]');
  const mainNav = document.querySelector('#al-main-nav');
  const siteHeader = document.querySelector('.al-ref-header');
  const closeMenu = () => {
    if (!menuButton || !mainNav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('is-open');
  };
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    mainNav?.classList.toggle('is-open', open);
  });
  mainNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.querySelectorAll('.al-ref-dropdown, .al-ref-site-menu').forEach((dropdown) => {
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)');
    let closeTimer = 0;
    dropdown.addEventListener('toggle', () => {
      dropdown.querySelector('summary')?.setAttribute('aria-expanded', String(dropdown.open));
      if (dropdown.open) {
        document.querySelectorAll('.al-ref-dropdown[open], .al-ref-site-menu[open]').forEach((other) => {
          if (other !== dropdown) other.open = false;
        });
      }
    });
    dropdown.addEventListener('pointerenter', (event) => {
      if (!dropdown.matches('.al-ref-dropdown') || !supportsHover.matches || event.pointerType === 'touch') return;
      window.clearTimeout(closeTimer);
      dropdown.open = true;
    });
    dropdown.addEventListener('pointerleave', () => {
      if (!dropdown.matches('.al-ref-dropdown') || !supportsHover.matches) return;
      window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(() => {
        if (!dropdown.matches(':focus-within')) dropdown.open = false;
      }, 120);
    });
    dropdown.addEventListener('focusout', () => {
      window.setTimeout(() => {
        if (!dropdown.matches(':focus-within') && !dropdown.matches(':hover')) dropdown.open = false;
      }, 0);
    });
  });
  document.addEventListener('click', (event) => {
    document.querySelectorAll('.al-ref-dropdown[open], .al-ref-site-menu[open]').forEach((dropdown) => {
      if (!dropdown.contains(event.target)) dropdown.open = false;
    });
    document.querySelectorAll('[data-home-related][open]').forEach((disclosure) => {
      if (!disclosure.contains(event.target)) disclosure.open = false;
    });
  });
  document.querySelectorAll('[data-home-related]').forEach((disclosure) => {
    const summary = disclosure.querySelector('summary');
    disclosure.addEventListener('toggle', () => {
      summary?.setAttribute('aria-expanded', String(disclosure.open));
      if (!disclosure.open) return;
      document.querySelectorAll('[data-home-related][open]').forEach((other) => {
        if (other !== disclosure) other.open = false;
      });
    });
    disclosure.querySelector('[data-close-home-related]')?.addEventListener('click', () => {
      disclosure.open = false;
      summary?.setAttribute('aria-expanded', 'false');
      summary?.focus({ preventScroll: true });
    });
    summary?.setAttribute('aria-expanded', String(disclosure.open));
  });
  if (siteHeader) siteHeader.dataset.scrolled = String(window.scrollY > 20);
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (siteHeader) siteHeader.dataset.scrolled = String(currentScrollY > 20);
  }, { passive: true });

  const languageSwitch = document.querySelector('[data-lab-language-switch]');
  languageSwitch?.addEventListener('click', () => {
    const target = new URL(languageSwitch.href, window.location.href);
    const current = new URLSearchParams(window.location.search);
    ['q', 'track', 'status', 'sort', 'view'].forEach((key) => {
      if (current.has(key)) target.searchParams.set(key, current.get(key));
    });
    languageSwitch.href = target.pathname + target.search + target.hash;
  });

  const searchDialog = document.querySelector('[data-lab-search-dialog]');
  const globalSearch = document.querySelector('[data-lab-global-search]');
  const searchResults = document.querySelector('[data-lab-search-results]');
  const closeSearch = () => {
    if (searchDialog?.open) searchDialog.close();
  };
  searchDialog?.addEventListener('close', () => {
    document.querySelector('[data-lab-search-open]')?.focus({ preventScroll: true });
  });
  const openSearch = () => {
    if (!searchDialog) {
      const archiveSearch = document.querySelector('[data-lab-search]');
      if (archiveSearch) {
        document.querySelector('[data-lab-archive-disclosure]')?.setAttribute('open', '');
        archiveSearch.focus();
        archiveSearch.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    if (!searchDialog.open) searchDialog.showModal();
    window.setTimeout(() => globalSearch?.focus(), 20);
  };
  document.querySelectorAll('[data-lab-search-open]').forEach((button) => button.addEventListener('click', openSearch));
  searchDialog?.addEventListener('click', (event) => {
    if (event.target === searchDialog) closeSearch();
  });
  let searchIndex = [];
  try {
    const node = document.querySelector('[data-lab-search-index]');
    searchIndex = node ? JSON.parse(node.textContent || '[]') : [];
  } catch (_) {
    searchIndex = [];
  }
  globalSearch?.addEventListener('input', () => {
    if (!searchResults) return;
    const query = globalSearch.value.trim().toLocaleLowerCase();
    searchResults.replaceChildren();
    if (query.length < 2) return;
    const matches = searchIndex.filter((item) => `${item.title} ${item.summary} ${item.category}`.toLocaleLowerCase().includes(query)).slice(0, 8);
    if (!matches.length) {
      const empty = document.createElement('p');
      empty.className = 'al-ref-search-empty';
      empty.textContent = root.lang.startsWith('zh') ? '没有找到匹配的研究记录。' : 'No matching research records found.';
      searchResults.append(empty);
      return;
    }
    matches.forEach((item) => {
      const link = document.createElement('a');
      link.className = 'al-ref-search-result';
      link.href = item.url;
      const title = document.createElement('strong');
      title.textContent = item.title;
      const detail = document.createElement('small');
      detail.textContent = `${item.category} · ${item.date} · ${item.summary}`;
      link.append(title, detail);
      searchResults.append(link);
    });
  });

  const controls = document.querySelector('[data-lab-controls]');
  const archive = document.querySelector('[data-lab-records]');
  if (controls && archive) {
    const search = controls.querySelector('[data-lab-search]');
    const category = controls.querySelector('[data-category-filter]');
    const status = controls.querySelector('[data-status-filter]');
    const sort = controls.querySelector('[data-sort-filter]');
    const count = controls.querySelector('[data-result-count]');
    const cards = [...archive.querySelectorAll('[data-lab-record]')];
    const empty = document.querySelector('[data-lab-empty]');
    const fixedTrack = controls.dataset.fixedTrack || '';
    const validSorts = new Set(['recent', 'title', 'reading']);
    const validViews = new Set(['list', 'grid']);
    const validTracks = new Set(category ? Array.from(category.options, (option) => option.value) : []);
    const validStatuses = new Set(status ? Array.from(status.options, (option) => option.value) : []);

    const readState = () => {
      const params = new URLSearchParams(window.location.search);
      if (search) search.value = params.get('q') || '';
      if (category) {
        const requestedTrack = params.get('track') || 'all';
        category.value = validTracks.has(requestedTrack) ? requestedTrack : 'all';
      }
      if (status) {
        const requestedStatus = params.get('status') || 'all';
        status.value = validStatuses.has(requestedStatus) ? requestedStatus : 'all';
      }
      if (sort) sort.value = validSorts.has(params.get('sort')) ? params.get('sort') : 'recent';
      const view = validViews.has(params.get('view')) ? params.get('view') : 'list';
      archive.dataset.view = view;
      controls.querySelectorAll('[data-view-choice]').forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.viewChoice === view));
      });
    };

    const writeState = (historyMode = 'replace') => {
      const params = new URLSearchParams(window.location.search);
      const values = {
        q: search?.value.trim() || '',
        track: category?.value || '',
        status: status?.value || '',
        sort: sort?.value || 'recent',
        view: archive.dataset.view || 'list',
      };
      Object.entries(values).forEach(([key, value]) => {
        const isDefault = (key === 'track' || key === 'status') && value === 'all';
        if (!value || isDefault || ((key === 'sort' && value === 'recent') || (key === 'view' && value === 'list'))) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      const query = params.toString();
      const next = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
      const current = window.location.pathname + window.location.search + window.location.hash;
      if (next === current) return;
      const method = historyMode === 'push' ? 'pushState' : 'replaceState';
      window.history[method]({ aiLabArchive: true }, '', next);
    };

    const sortCards = (mode) => {
      const sorted = [...cards].sort((a, b) => {
        if (mode === 'title') return (a.dataset.title || a.textContent).localeCompare(b.dataset.title || b.textContent, root.lang);
        if (mode === 'reading') return Number(b.dataset.reading || 0) - Number(a.dataset.reading || 0);
        return (b.dataset.date || '').localeCompare(a.dataset.date || '');
      });
      sorted.forEach((card) => archive.append(card));
    };

    const update = (persist = true, historyMode = 'replace') => {
      const query = (search?.value || '').trim().toLocaleLowerCase();
      const selectedTrack = fixedTrack || category?.value || 'all';
      const selectedStatus = status?.value || 'all';
      const visibleCards = cards.filter((card) => {
        const matches = (!query || (card.dataset.search || '').toLocaleLowerCase().includes(query))
          && (selectedTrack === 'all' || card.dataset.category === selectedTrack)
          && (selectedStatus === 'all' || card.dataset.status === selectedStatus);
        card.hidden = !matches;
        return matches;
      });
      sortCards(sort?.value || 'recent');
      if (count) count.textContent = `${String(visibleCards.length).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
      if (empty) empty.hidden = visibleCards.length !== 0;
      if (persist) writeState(historyMode);
    };

    readState();
    update(false);
    writeState();
    search?.addEventListener('input', () => update(true, 'replace'));
    category?.addEventListener('change', () => update(true, 'push'));
    status?.addEventListener('change', () => update(true, 'push'));
    sort?.addEventListener('change', () => update(true, 'push'));
    controls.querySelectorAll('[data-view-choice]').forEach((button) => {
      button.addEventListener('click', () => {
        const view = button.dataset.viewChoice;
        if (!validViews.has(view)) return;
        archive.dataset.view = view;
        controls.querySelectorAll('[data-view-choice]').forEach((item) => {
          item.setAttribute('aria-pressed', String(item === button));
        });
        update(true, 'push');
      });
    });
    document.querySelector('[data-clear-filters]')?.addEventListener('click', () => {
      if (search) search.value = '';
      if (category) category.value = 'all';
      if (status) status.value = 'all';
      if (sort) sort.value = 'recent';
      archive.dataset.view = 'list';
      controls.querySelectorAll('[data-view-choice]').forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.viewChoice === 'list'));
      });
      update(true, 'push');
    });
    window.addEventListener('popstate', () => {
      readState();
      update(false);
      writeState();
    });
  }

  const focusSearch = () => {
    const disclosure = document.querySelector('[data-lab-archive-disclosure]');
    if (window.location.hash === '#archive-tools' && disclosure) disclosure.open = true;
    const search = document.querySelector('[data-lab-search]');
    if (!search) return;
    search.focus({ preventScroll: true });
    if (window.location.hash === '#archive-tools') {
      search.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    }
  };
  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#archive') document.querySelector('[data-lab-archive-disclosure]')?.setAttribute('open', '');
    if (window.location.hash === '#archive-tools') window.setTimeout(focusSearch, 0);
  });
  if (window.location.hash === '#archive') document.querySelector('[data-lab-archive-disclosure]')?.setAttribute('open', '');
  if (window.location.hash === '#archive-tools') {
    document.querySelector('[data-lab-archive-disclosure]')?.setAttribute('open', '');
    window.setTimeout(focusSearch, 0);
  }

  document.querySelectorAll('[data-home-sizzle]').forEach((stage) => {
    const canvas = stage.querySelector('[data-home-art]');
    const track = stage.closest('[data-home-sizzle-track]');
    const stories = [...stage.querySelectorAll('[data-home-story]')];
    const storyLayer = stage.querySelector('[data-home-story-layer]');
    const context = canvas?.getContext?.('2d') || null;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const heroes = new Image();
    const tiles = new Image();
    const atlasColumns = 12;
    const atlasRows = 10;
    const atlasCellSize = 276;
    const artCells = (stage.dataset.artCells || '7').split(',')
      .map((value) => Number.parseInt(value.trim(), 10))
      .filter((value) => Number.isFinite(value) && value >= 0 && value < 10);
    let visible = true;
    let heroesReady = false;
    let tilesReady = false;
    let frame = 0;
    let progress = 0;
    let targetProgress = 0;
    let width = 0;
    let height = 0;
    let ratio = 1;
    let activeStory = -1;
    let tileLayout = [];
    let storyClearZones = [];

    const clamp01 = (value) => Math.max(0, Math.min(1, value));
    const smooth = (value) => {
      const t = clamp01(value);
      return t * t * (3 - 2 * t);
    };
    const easeOut = (value) => {
      const t = clamp01(value);
      return 1 - ((1 - t) ** 3);
    };
    const ready = () => heroesReady;
    const setStory = (index) => {
      if (index === activeStory) return;
      activeStory = index;
      stories.forEach((story, storyIndex) => {
        const active = storyIndex === index;
        story.dataset.active = String(active);
        story.classList.toggle('is-active', active);
        story.setAttribute('aria-hidden', String(!active));
      });
    };
    const setPhase = (name, showStory = name === 'stories') => {
      stage.dataset.phase = name;
      if (storyLayer) {
        storyLayer.dataset.visible = String(showStory);
        storyLayer.inert = !showStory;
      }
    };
    const clearStoryZone = () => {
      if (!storyLayer || storyLayer.dataset.visible !== 'true') return;
      const activeIndex = stories.findIndex((story) => story.dataset.active === 'true');
      const zone = storyClearZones[activeIndex];
      if (!zone) return;
      const centerX = zone.x + zone.width / 2;
      const centerY = zone.y + zone.height / 2;
      const radiusX = Math.max(1, zone.width * 0.62);
      const radiusY = Math.max(1, zone.height * 0.78);
      context.save();
      context.globalCompositeOperation = 'destination-out';
      context.translate(centerX, centerY);
      context.scale(radiusX, radiusY);
      const aperture = context.createRadialGradient(0, 0, 0.44, 0, 0, 1);
      aperture.addColorStop(0, 'rgba(0, 0, 0, 1)');
      aperture.addColorStop(0.72, 'rgba(0, 0, 0, .98)');
      aperture.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = aperture;
      context.beginPath();
      context.arc(0, 0, 1, 0, Math.PI * 2);
      context.fill();
      context.restore();
    };
    const resize = () => {
      const bounds = canvas?.getBoundingClientRect();
      if (!canvas || !bounds?.width || !bounds.height) return;
      width = bounds.width;
      height = bounds.height;
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      const stageBounds = stage.getBoundingClientRect();
      const inset = Math.min(18, width * 0.035);
      storyClearZones = stories.map((story) => {
        const storyBounds = story.getBoundingClientRect();
        const x = Math.max(0, storyBounds.left - stageBounds.left - inset);
        const y = Math.max(0, storyBounds.top - stageBounds.top - inset);
        return {
          x,
          y,
          width: Math.min(width - x, storyBounds.width + inset * 2),
          height: Math.min(height - y, storyBounds.height + inset * 2),
        };
      });
      const columns = Math.max(5, Math.ceil(width / 94));
      const rows = Math.max(3, Math.ceil(height / 94));
      const tileCount = columns * rows;
      const size = Math.max(width / columns, height / rows);
      const offsetX = (width - columns * size) / 2;
      const offsetY = (height - rows * size) / 2;
      const centerX = width / 2;
      const centerY = height / 2;
      const random = (seed) => {
        const value = Math.sin((seed + 1) * 127.1 + 311.7) * 43758.5453123;
        return value - Math.floor(value);
      };
      tileLayout = Array.from({ length: tileCount }, (_, position) => {
        const index = position % (atlasColumns * atlasRows);
        const column = index % columns;
        const row = Math.floor(index / columns);
        const x = offsetX + column * size;
        const y = offsetY + row * size;
        const dx = x + size / 2 - centerX;
        const dy = y + size / 2 - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = Math.sqrt((width / 2) ** 2 + (height / 2) ** 2) || 1;
        return {
          index,
          sourceX: (index % atlasColumns) * atlasCellSize,
          sourceY: Math.floor(index / atlasColumns) * atlasCellSize,
          x,
          y,
          size,
          dx,
          dy,
          delay: distance / maxDistance,
          scatterAngle: random(index + 1) * Math.PI * 2,
          scatterScale: 0.72 + random(index + 121) * 0.58,
          jitterX: (random(index + 241) - 0.5) * size * 0.46,
          jitterY: (random(index + 361) - 0.5) * size * 0.46,
        };
      });
      tileLayout.sort((a, b) => a.delay - b.delay || a.index - b.index);
      if (ready()) drawFrame(reducedMotion.matches ? 0.56 : progress);
    };
    const drawHero = (alpha, zoom) => {
      if (alpha <= 0.001 || !heroesReady || !artCells.length) return;
      const cellIndex = artCells[0];
      const cellSize = heroes.naturalWidth / 4;
      const size = Math.min(width * 0.36, height * 0.68) * zoom;
      context.globalAlpha = alpha;
      context.drawImage(heroes, (cellIndex % 4) * cellSize, Math.floor(cellIndex / 4) * cellSize,
        cellSize, cellSize, (width - size) / 2, (height - size) / 2, size, size);
      context.globalAlpha = 1;
    };
    const drawTile = (tile, x, y, size, alpha) => {
      if (alpha <= 0.001 || size <= 0.5 || !tilesReady) return;
      context.globalAlpha = alpha;
      context.drawImage(tiles, tile.sourceX, tile.sourceY, atlasCellSize, atlasCellSize, x, y, size, size);
      context.globalAlpha = 1;
    };
    const drawAssemblingTiles = (value) => {
      const centerX = width / 2;
      const centerY = height / 2;
      tileLayout.forEach((tile, order) => {
        const reveal = easeOut((value - (0.075 + tile.delay * 0.19)) / 0.24);
        if (reveal <= 0) return;
        const size = Math.max(1, tile.size * reveal);
        const x = centerX + (tile.x + tile.size / 2 - centerX) * reveal - size / 2;
        const y = centerY + (tile.y + tile.size / 2 - centerY) * reveal - size / 2;
        drawTile(tile, x, y, size, reveal);
      });
    };
    const drawScatteringTiles = (value) => {
      const centerX = width / 2;
      const centerY = height / 2;
      const clearRadius = Math.min(width, height) * 0.56;
      tileLayout.forEach((tile) => {
        const stagger = tile.delay * 0.075;
        const scatter = smooth((value - stagger) / (1 - stagger));
        const distance = Math.sqrt(tile.dx * tile.dx + tile.dy * tile.dy);
        const angle = distance > 1 ? Math.atan2(tile.dy, tile.dx) : tile.scatterAngle;
        const expansionRadius = Math.max(clearRadius, distance * 1.12 + tile.size * 0.34);
        const targetX = centerX + Math.cos(angle) * expansionRadius - tile.size / 2 + tile.jitterX;
        const targetY = centerY + Math.sin(angle) * expansionRadius - tile.size / 2 + tile.jitterY;
        const size = tile.size * (1 + (tile.scatterScale - 1) * scatter);
        const x = tile.x + (targetX - tile.x) * scatter - (size - tile.size) / 2;
        const y = tile.y + (targetY - tile.y) * scatter - (size - tile.size) / 2;
        const alpha = 1 - scatter * 0.08;
        drawTile(tile, x, y, size, alpha);
      });
    };
    const drawAmbientTiles = (value) => {
      if (!tilesReady || !tileLayout.length) return;
      const slots = [
        [0.06, 0.08, 0.19], [0.24, 0.16, 0.16], [0.47, 0.07, 0.21],
        [0.73, 0.14, 0.17], [0.9, 0.08, 0.2], [0.08, 0.64, 0.18],
        [0.84, 0.61, 0.2], [0.55, 0.71, 0.16],
      ];
      const fade = 1 - smooth((value - 0.16) / 0.22);
      slots.forEach(([x, y, scale], slot) => {
        const tile = tileLayout[(slot * 17 + 9) % tileLayout.length];
        const size = Math.min(width, height) * scale;
        const drift = Math.sin((value * 2.2 + slot) * Math.PI) * size * 0.035;
        drawTile(tile, width * x - size / 2 + drift, height * y - size / 2, size, fade * (0.76 + slot * 0.025));
      });
    };
    const drawFrame = (value) => {
      if (!context || !ready() || !width || !height) return;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      if (reducedMotion.matches) {
        if (tilesReady) tileLayout.forEach((tile) => drawTile(tile, tile.x, tile.y, tile.size, 1));
        else drawHero(1, 1);
        setStory(0);
        setPhase('mosaic', true);
        clearStoryZone();
        return;
      }

      const p = clamp01(value);
      if (p < 0.1) setPhase('seed', false);
      else if (p < 0.46) setPhase('assemble');
      else if (p < 0.58) setPhase('mosaic', true);
      else if (p < 0.84) setPhase('scatter');
      else setPhase('stories');

      const heroFade = smooth((p - 0.06) / 0.1);
      drawAmbientTiles(p);
      drawHero(tilesReady ? 1 - heroFade : 1, 1 + Math.min(p, 0.085) * 0.12);
      if (tilesReady && p >= 0.08 && p < 0.46) drawAssemblingTiles(clamp01((p - 0.08) / 0.38));
      else if (tilesReady && p >= 0.46 && p < 0.58) drawAssemblingTiles(1);
      else if (tilesReady && p >= 0.58) drawScatteringTiles(clamp01((p - 0.58) / 0.22));
      if (p >= .84 && stories.length) {
        const storyIndex = Math.min(stories.length - 1, Math.floor(((p - .84) / .16) * stories.length));
        setStory(storyIndex);
      } else if (p >= .46 && stories.length && targetProgress < .84) {
        setStory(0);
      }
      clearStoryZone();
    };
    const stop = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
    };
    let lastDrawAt = 0;
    const draw = (timestamp) => {
      frame = 0;
      if (!context || !ready() || !width || !height || !visible || document.hidden) return;
      if (reducedMotion.matches) {
        progress = 0.56;
        targetProgress = 0.56;
        drawFrame(0.56);
        return;
      }
      if (timestamp - lastDrawAt < 1000 / 30 && Math.abs(targetProgress - progress) > .002) {
        frame = window.requestAnimationFrame(draw);
        return;
      }
      lastDrawAt = timestamp;
      progress += (targetProgress - progress) * .16;
      if (Math.abs(targetProgress - progress) < .001) progress = targetProgress;
      drawFrame(progress);
      if (Math.abs(targetProgress - progress) > .001) frame = window.requestAnimationFrame(draw);
    };
    const start = () => {
      stop();
      if (!visible || document.hidden || !ready()) return;
      lastDrawAt = 0;
      if (!reducedMotion.matches) frame = window.requestAnimationFrame(draw);
    };
    const setTarget = (value) => { targetProgress = clamp01(value); start(); };
    const syncScrollProgress = () => {
      if (!track) return;
      const range = Math.max(1, track.offsetHeight - window.innerHeight);
      const value = clamp01(-track.getBoundingClientRect().top / range);
      stage.dataset.scrollProgress = value.toFixed(3);
      if (reducedMotion.matches) {
        targetProgress = value;
        drawFrame(.56);
      } else {
        setTarget(value);
      }
    };
    stage.addEventListener('pointermove', (event) => {
      if (!width || !height) return;
      const bounds = stage.getBoundingClientRect();
      const x = clamp01((event.clientX - bounds.left) / Math.max(1, bounds.width));
      const y = clamp01((event.clientY - bounds.top) / Math.max(1, bounds.height));
      stage.style.setProperty('--al-pointer-x', `${((x - .5) * 2).toFixed(3)}`);
      stage.style.setProperty('--al-pointer-y', `${((y - .5) * 2).toFixed(3)}`);
    });
    stage.addEventListener('pointerleave', () => {
      stage.style.setProperty('--al-pointer-x', '0');
      stage.style.setProperty('--al-pointer-y', '0');
    });
    stage.addEventListener('keydown', (event) => {
      if (!track) return;
      const range = Math.max(1, track.offsetHeight - window.innerHeight);
      const behavior = reducedMotion.matches ? 'auto' : 'smooth';
      if (event.key === 'ArrowDown' || event.key === 'PageDown') {
        event.preventDefault();
        window.scrollBy({ top: Math.max(120, window.innerHeight * .72), behavior });
      }
      if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        event.preventDefault();
        window.scrollBy({ top: -Math.max(120, window.innerHeight * .72), behavior });
      }
      if (event.key === 'Home') {
        event.preventDefault();
        window.scrollTo({ top: Math.max(0, window.scrollY + track.getBoundingClientRect().top), behavior });
      }
      if (event.key === 'End') {
        event.preventDefault();
        window.scrollTo({ top: Math.max(0, window.scrollY + track.getBoundingClientRect().top + range), behavior });
      }
    });
    window.addEventListener('scroll', syncScrollProgress, { passive: true });
    document.addEventListener('visibilitychange', start);
    reducedMotion.addEventListener?.('change', start);
    if ('ResizeObserver' in window && canvas) new ResizeObserver(resize).observe(canvas);
    else window.addEventListener('resize', resize, { passive: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible) start();
        else stop();
      }, { rootMargin: '120px' }).observe(stage);
    }
    const onImageReady = () => {
      if (!ready()) return;
      stage.removeAttribute('data-art-error');
      stage.dataset.artReady = 'true';
      resize();
      progress = 0;
      targetProgress = 0;
      syncScrollProgress();
      start();
    };
    heroes.addEventListener('load', () => { heroesReady = true; onImageReady(); }, { once: true });
    heroes.addEventListener('error', () => { stage.dataset.artError = 'true'; if (storyLayer) { storyLayer.dataset.visible = 'true'; storyLayer.inert = false; } stop(); }, { once: true });
    tiles.addEventListener('load', () => { tilesReady = true; onImageReady(); }, { once: true });
    tiles.addEventListener('error', () => { tilesReady = false; if (heroesReady) onImageReady(); }, { once: true });
    heroes.decoding = 'async';
    tiles.decoding = 'async';
    heroes.src = stage.dataset.artSrc || '';
    tiles.src = stage.dataset.tilesSrc || '';
    resize();
    if (heroes.complete && heroes.naturalWidth) heroesReady = true;
    if (tiles.complete && tiles.naturalWidth) tilesReady = true;
    if (ready()) onImageReady();
    syncScrollProgress();
  });

  document.querySelectorAll('[data-image-frame] img').forEach((image) => {
    const frame = image.closest('[data-image-frame]');
    const reveal = () => frame?.classList.add('is-loaded');
    const decode = () => {
      if (typeof image.decode !== 'function') { reveal(); return; }
      image.decode().then(reveal).catch(() => {
        if (image.naturalWidth) reveal();
        else frame?.classList.add('is-error');
      });
    };
    if (image.complete && image.naturalWidth) decode();
    else image.addEventListener('load', decode, { once: true });
    image.addEventListener('error', () => frame?.classList.add('is-error'), { once: true });
  });

  // A lightweight, local Canvas UI-inspired particle reveal for editorial imagery.
  // The semantic <img> remains visible and readable at all times; canvas is an
  // optional, aria-hidden interaction layer and is only rasterized on intent.
  document.querySelectorAll('[data-canvas-image]').forEach((host) => {
    const image = host.querySelector('img');
    const canvas = host.querySelector('[data-canvas-image-layer]');
    const context = canvas?.getContext?.('2d', { alpha: true });
    if (!image || !canvas || !context) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const scratch = document.createElement('canvas');
    const scratchContext = scratch.getContext('2d', { willReadFrequently: true });
    let pixels = null;
    let pixelWidth = 0;
    let pixelHeight = 0;
    let width = 0;
    let height = 0;
    let ratio = 1;
    let pointer = { x: 0, y: 0 };
    let active = false;
    let visible = true;
    let frame = 0;
    let motionStartedAt = 0;

    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };
    const clear = () => {
      if (!width || !height) return;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
    };
    const preparePixels = () => {
      if (!image.complete || !image.naturalWidth || !scratchContext) return false;
      const bounds = host.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return false;
      width = bounds.width;
      height = bounds.height;
      ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      scratch.width = Math.max(1, Math.round(Math.min(width, 640)));
      scratch.height = Math.max(1, Math.round(scratch.width * height / width));
      const sourceAspect = image.naturalWidth / image.naturalHeight;
      const targetAspect = scratch.width / scratch.height;
      let sx = 0;
      let sy = 0;
      let sw = image.naturalWidth;
      let sh = image.naturalHeight;
      if (sourceAspect > targetAspect) {
        sw = image.naturalHeight * targetAspect;
        sx = (image.naturalWidth - sw) / 2;
      } else {
        sh = image.naturalWidth / targetAspect;
        sy = (image.naturalHeight - sh) / 2;
      }
      scratchContext.clearRect(0, 0, scratch.width, scratch.height);
      scratchContext.drawImage(image, sx, sy, sw, sh, 0, 0, scratch.width, scratch.height);
      try {
        pixels = scratchContext.getImageData(0, 0, scratch.width, scratch.height).data;
        pixelWidth = scratch.width;
        pixelHeight = scratch.height;
        host.dataset.canvasReady = 'true';
        return true;
      } catch {
        pixels = null;
        delete host.dataset.canvasReady;
        return false;
      }
    };
    const sampleColor = (x, y) => {
      const px = Math.max(0, Math.min(pixelWidth - 1, Math.floor(x / Math.max(1, width) * pixelWidth)));
      const py = Math.max(0, Math.min(pixelHeight - 1, Math.floor(y / Math.max(1, height) * pixelHeight)));
      const offset = (py * pixelWidth + px) * 4;
      return [pixels[offset], pixels[offset + 1], pixels[offset + 2], pixels[offset + 3]];
    };
    const render = (timestamp = performance.now()) => {
      frame = 0;
      if (!active || !visible || document.hidden || !pixels || !width || !height) return;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = 'screen';
      const radius = Math.min(122, Math.max(48, Math.min(width, height) * 0.31));
      const elapsed = reducedMotion.matches ? 1 : Math.max(0, Math.min(1, (timestamp - motionStartedAt) / 440));
      const settle = 1 - (1 - elapsed) ** 3;
      const halo = context.createRadialGradient(pointer.x, pointer.y, radius * 0.08, pointer.x, pointer.y, radius);
      halo.addColorStop(0, 'rgba(255,255,255,0.18)');
      halo.addColorStop(0.72, 'rgba(255,255,255,0.075)');
      halo.addColorStop(1, 'rgba(255,255,255,0)');
      context.fillStyle = halo;
      context.beginPath();
      context.arc(pointer.x, pointer.y, radius, 0, Math.PI * 2);
      context.fill();

      const step = width < 420 ? 8 : 9;
      const startX = Math.floor((pointer.x - radius) / step) * step;
      const startY = Math.floor((pointer.y - radius) / step) * step;
      for (let y = startY; y <= pointer.y + radius; y += step) {
        for (let x = startX; x <= pointer.x + radius; x += step) {
          const dx = x + step / 2 - pointer.x;
          const dy = y + step / 2 - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance > radius || x < 0 || y < 0 || x >= width || y >= height) continue;
          const [red, green, blue, alpha] = sampleColor(x, y);
          if (alpha < 24) continue;
          const seed = Math.sin((Math.round(x / step) + 1) * 127.1 + (Math.round(y / step) + 1) * 311.7) * 43758.5453;
          const random = seed - Math.floor(seed);
          const drift = (1 - settle) * step * 1.35;
          const offsetX = Math.cos(random * Math.PI * 2) * drift;
          const offsetY = Math.sin(random * Math.PI * 2) * drift;
          const edge = Math.max(0, 1 - distance / radius);
          const opacity = (0.12 + edge * 0.5) * (alpha / 255);
          const size = 1.25 + edge * 2.15;
          context.fillStyle = `rgba(${red},${green},${blue},${opacity.toFixed(3)})`;
          context.fillRect(x + offsetX, y + offsetY, size, size);
        }
      }

      const pulse = reducedMotion.matches ? 0 : (1 - settle) * 3;
      context.globalCompositeOperation = 'source-over';
      context.lineWidth = 0.8;
      context.strokeStyle = 'rgba(255,255,255,0.58)';
      context.beginPath();
      context.arc(pointer.x, pointer.y, radius * (0.88 + pulse * 0.045), 0, Math.PI * 2);
      context.stroke();
      context.strokeStyle = 'rgba(255,255,255,0.28)';
      context.beginPath();
      context.arc(pointer.x, pointer.y, radius * 0.72, 0, Math.PI * 2);
      context.stroke();
      context.globalCompositeOperation = 'source-over';
      if (!reducedMotion.matches && elapsed < 1) frame = window.requestAnimationFrame(render);
    };
    const queueRender = (animate = true) => {
      if (!active || !visible || document.hidden || !preparePixels()) return;
      if (animate && !reducedMotion.matches) motionStartedAt = performance.now();
      stop();
      if (reducedMotion.matches) render(performance.now());
      else frame = window.requestAnimationFrame(render);
    };
    const updatePointer = (event) => {
      const bounds = host.getBoundingClientRect();
      pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
      if (!active) active = true;
      host.classList.add('is-active');
      queueRender(true);
    };
    const leave = () => {
      active = false;
      host.classList.remove('is-active');
      stop();
      clear();
    };
    const enter = (event) => updatePointer(event);
    host.addEventListener('pointerenter', enter, { passive: true });
    host.addEventListener('pointermove', updatePointer, { passive: true });
    host.addEventListener('pointerleave', leave, { passive: true });
    const focusTarget = host.closest('a, button') || host;
    focusTarget.addEventListener('focusin', () => {
      const bounds = host.getBoundingClientRect();
      pointer = { x: bounds.width / 2, y: bounds.height / 2 };
      active = true;
      host.classList.add('is-active');
      queueRender(true);
    });
    focusTarget.addEventListener('focusout', (event) => {
      if (event.relatedTarget && focusTarget.contains(event.relatedTarget)) return;
      leave();
    });
    image.addEventListener('load', () => { pixels = null; if (active) queueRender(false); }, { passive: true });
    image.addEventListener('error', leave, { once: true });
    const resize = () => { pixels = null; if (active) queueRender(false); };
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(host);
    else window.addEventListener('resize', resize, { passive: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible && active) queueRender(false);
        else if (!visible) { stop(); clear(); }
      }, { rootMargin: '120px' }).observe(host);
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { stop(); clear(); }
      else if (active) queueRender(false);
    });
    reducedMotion.addEventListener?.('change', () => { if (active) queueRender(false); });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      closeSearch();
      document.querySelectorAll('.al-ref-dropdown[open], .al-ref-site-menu[open]').forEach((dropdown) => { dropdown.open = false; });
      document.querySelectorAll('[data-home-related][open]').forEach((disclosure) => { disclosure.open = false; });
      return;
    }
    if (event.target.matches('input, textarea, select, [contenteditable="true"]')) return;
    const commandSearch = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
    if (!commandSearch && event.key !== '/') return;
    event.preventDefault();
    if (searchDialog) openSearch();
    else document.querySelector('[data-lab-search]')?.focus();
  });
  globalSearch?.addEventListener('keydown', (event) => {
    const results = [...(searchResults?.querySelectorAll('a') || [])];
    const focusedIndex = results.indexOf(document.activeElement);
    if (event.key === 'ArrowDown' && results.length) {
      event.preventDefault();
      results[Math.min(focusedIndex + 1, results.length - 1)].focus();
    } else if (event.key === 'Enter' && results.length) {
      event.preventDefault();
      results[0].click();
    }
  });

  document.querySelectorAll('[data-featured-carousel]').forEach((carousel) => {
    const slides = [...carousel.querySelectorAll('[data-featured-slide]')];
    const previous = carousel.querySelector('[data-featured-prev]');
    const next = carousel.querySelector('[data-featured-next]');
    const count = carousel.querySelector('[data-featured-count]');
    if (!slides.length) return;
    let activeIndex = 0;
    const show = (index) => {
      activeIndex = Math.max(0, Math.min(index, slides.length - 1));
      slides.forEach((slide, position) => {
        const active = position === activeIndex;
        slide.hidden = !active;
        slide.setAttribute('aria-hidden', String(!active));
      });
      if (count) count.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
      if (previous) previous.disabled = activeIndex === 0;
      if (next) next.disabled = activeIndex === slides.length - 1;
    };
    previous?.addEventListener('click', () => show(activeIndex - 1));
    next?.addEventListener('click', () => show(activeIndex + 1));
    carousel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); show(activeIndex - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); show(activeIndex + 1); }
    });
    let pointerStart = null;
    let suppressAnchorClick = false;
    let suppressAnchorClickTimer = 0;
    carousel.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 || event.target.closest('button')) return;
      suppressAnchorClick = false;
      window.clearTimeout(suppressAnchorClickTimer);
      pointerStart = {
        x: event.clientX,
        y: event.clientY,
        pointerId: event.pointerId,
        anchor: event.target.closest('a'),
      };
    });
    carousel.addEventListener('pointerup', (event) => {
      if (!pointerStart || event.pointerId !== pointerStart.pointerId) return;
      const start = pointerStart;
      const deltaX = event.clientX - start.x;
      const deltaY = event.clientY - start.y;
      pointerStart = null;
      if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return;
      event.preventDefault();
      show(activeIndex + (deltaX < 0 ? 1 : -1));
      if (start.anchor) {
        suppressAnchorClick = true;
        suppressAnchorClickTimer = window.setTimeout(() => {
          suppressAnchorClick = false;
        }, 500);
      }
    });
    carousel.addEventListener('pointercancel', () => { pointerStart = null; });
    carousel.addEventListener('click', (event) => {
      if (!suppressAnchorClick || event.detail === 0) return;
      event.preventDefault();
      event.stopPropagation();
      suppressAnchorClick = false;
      window.clearTimeout(suppressAnchorClickTimer);
    }, true);
    show(0);
  });

  document.querySelectorAll('[data-learn-carousel]').forEach((carousel) => {
    const slides = [...carousel.querySelectorAll('[data-learn-slide]')];
    const controls = carousel.closest('.al-home-learn-more')?.querySelector('[data-learn-controls]');
    const previous = controls?.querySelector('[data-learn-prev]');
    const next = controls?.querySelector('[data-learn-next]');
    const count = controls?.querySelector('[data-learn-count]');
    if (!slides.length) return;
    let activeIndex = 0;
    let syncing = false;
    const show = (index, behavior = 'smooth') => {
      activeIndex = Math.max(0, Math.min(index, slides.length - 1));
      const active = slides[activeIndex];
      const horizontal = carousel.scrollWidth > carousel.clientWidth + 1;
      if (horizontal && active) {
        syncing = true;
        carousel.scrollTo({ left: active.offsetLeft, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : behavior });
        window.setTimeout(() => { syncing = false; }, behavior === 'auto' ? 0 : 450);
      }
      slides.forEach((slide, position) => slide.setAttribute('aria-current', position === activeIndex ? 'true' : 'false'));
      if (count) count.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
      if (previous) previous.disabled = activeIndex === 0;
      if (next) next.disabled = activeIndex === slides.length - 1;
    };
    previous?.addEventListener('click', () => show(activeIndex - 1));
    next?.addEventListener('click', () => show(activeIndex + 1));
    carousel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); show(activeIndex - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); show(activeIndex + 1); }
    });
    carousel.addEventListener('scroll', () => {
      if (syncing || window.innerWidth > 900) return;
      const left = carousel.getBoundingClientRect().left;
      const nearest = slides.reduce((best, slide, index) => {
        const distance = Math.abs(slide.getBoundingClientRect().left - left);
        return distance < best.distance ? { index, distance } : best;
      }, { index: 0, distance: Infinity });
      if (nearest.index !== activeIndex) show(nearest.index, 'auto');
    }, { passive: true });
    show(0, 'auto');
  });

  document.querySelectorAll('[data-copy-code]').forEach((button) => {
    button.addEventListener('click', async () => {
      const block = button.closest('[data-code-block]');
      const code = block?.querySelector('.lntable .lntd:last-child pre, .highlight > pre, pre')?.innerText || '';
      if (!code) return;
      try {
        const text = code.replace(/\n$/, '');
        try {
          await navigator.clipboard.writeText(text);
        } catch (_) {
          const textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.setAttribute('readonly', '');
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.append(textarea);
          textarea.select();
          const copied = document.execCommand('copy');
          textarea.remove();
          if (!copied) throw new Error('Clipboard is unavailable');
        }
        const previousText = button.textContent;
        button.textContent = root.lang.startsWith('zh') ? '已复制' : 'Copied';
        window.setTimeout(() => { button.textContent = previousText; }, 1300);
      } catch (_) {
        button.textContent = root.lang.startsWith('zh') ? '复制失败' : 'Copy failed';
      }
    });
  });

  const progress = document.querySelector('[data-reading-progress]');
  if (progress) {
    let frame = 0;
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = `${scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0}%`;
      frame = 0;
    };
    window.addEventListener('scroll', () => {
      if (!frame) frame = window.requestAnimationFrame(updateProgress);
    }, { passive: true });
    updateProgress();
  }

  document.querySelectorAll('[data-lab-math]').forEach((node) => {
    if (!window.katex) return;
    window.katex.render(node.textContent, node, {
      displayMode: node.dataset.display === 'true',
      throwOnError: false,
      strict: 'ignore',
    });
  });

  if (window.mermaid) {
    window.mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: root.dataset.theme === 'dark' ? 'dark' : 'neutral',
      flowchart: { htmlLabels: false, curve: 'linear' },
    });
    window.mermaid.run({ querySelector: '[data-lab-diagram]' }).catch(() => {});
  }

  const playground = document.querySelector('[data-lab-playground]');
  if (playground) {
    const input = playground.querySelector('[data-playground-input]');
    const textCount = playground.querySelector('[data-text-count]');
    const lineCount = playground.querySelector('[data-line-count]');
    const jsonOutput = playground.querySelector('[data-json-output]');
    const jsonStatus = playground.querySelector('[data-json-status]');
    const formatButton = playground.querySelector('[data-json-format]');
    const sample = '{\n  "query": "How does retrieval work?",\n  "top_k": 5,\n  "filters": { "published": true }\n}';
    if (input && !input.value) input.value = sample;
    const updateText = () => {
      if (textCount) textCount.textContent = String((input?.value || '').length);
      if (lineCount) lineCount.textContent = String((input?.value || '').split('\n').length);
    };
    input?.addEventListener('input', updateText);
    updateText();
    const validateJson = (format) => {
      if (!input || !jsonStatus || !jsonOutput) return;
      try {
        const value = JSON.parse(input.value);
        jsonStatus.textContent = root.lang.startsWith('zh') ? 'JSON 有效' : 'VALID JSON';
        jsonStatus.dataset.state = 'valid';
        jsonOutput.textContent = JSON.stringify(value, null, format ? 2 : 0);
      } catch (error) {
        jsonStatus.textContent = root.lang.startsWith('zh') ? 'JSON 格式错误' : 'INVALID JSON';
        jsonStatus.dataset.state = 'invalid';
        jsonOutput.textContent = error.message;
      }
    };
    formatButton?.addEventListener('click', () => validateJson(true));
    playground.querySelector('[data-json-check]')?.addEventListener('click', () => validateJson(false));
    playground.querySelector('[data-json-check]')?.click();

    const ragQuery = playground.querySelector('[data-rag-query]');
    const ragRun = playground.querySelector('[data-rag-run]');
    const ragResult = playground.querySelector('[data-rag-result]');
    let fixture = [];
    const tokenize = (value) => {
      const words = (value.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) || []).flatMap((word) => {
        if (/\p{Script=Han}/u.test(word) && word.length > 2) {
          return Array.from({ length: word.length - 1 }, (_, index) => word.slice(index, index + 2));
        }
        return [word];
      });
      return words;
    };
    const trigrams = (value) => {
      const joined = tokenize(value).join(' ');
      return new Set(Array.from({ length: Math.max(1, joined.length - 2) }, (_, index) => joined.slice(index, index + 3)));
    };
    const retrieve = (query) => {
      const language = root.lang.toLocaleLowerCase().startsWith('zh') ? 'zh' : 'en';
      const documents = fixture.filter((doc) => doc.language === language);
      if (!documents.length) return [];
      const terms = tokenize(query);
      const documentFrequency = new Map();
      documents.forEach((doc) => {
        for (const token of new Set(doc.tokens)) documentFrequency.set(token, (documentFrequency.get(token) || 0) + 1);
      });
      const averageLength = documents.reduce((sum, doc) => sum + doc.tokens.length, 0) / documents.length || 1;
      const queryGrams = trigrams(query);
      return documents.map((doc) => {
        const counts = new Map();
        for (const token of doc.tokens) counts.set(token, (counts.get(token) || 0) + 1);
        const bm25 = terms.reduce((score, term) => {
          const frequency = counts.get(term) || 0;
          if (!frequency) return score;
          const df = documentFrequency.get(term) || 0;
          const idf = Math.log(1 + (documents.length - df + 0.5) / (df + 0.5));
          const k1 = 1.2; const b = 0.75;
          return score + idf * ((frequency * (k1 + 1)) / (frequency + k1 * (1 - b + b * doc.tokens.length / averageLength)));
        }, 0);
        const docGrams = trigrams(doc.content);
        const intersection = [...queryGrams].filter((gram) => docGrams.has(gram)).length;
        const ngram = intersection / Math.max(1, new Set([...queryGrams, ...docGrams]).size);
        return { ...doc, score: bm25 * 0.7 + ngram * 2 };
      }).filter((doc) => doc.score > 0).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id)).slice(0, 3);
    };
    const runRag = () => {
      if (!ragQuery || !ragResult) return;
      const query = ragQuery.value.trim();
      if (!query) { ragResult.textContent = root.lang.startsWith('zh') ? '请输入检索问题。' : 'Enter a retrieval question.'; return; }
      const results = retrieve(query);
      ragResult.replaceChildren();
      if (!results.length) {
        ragResult.textContent = root.lang.startsWith('zh') ? '没有命中当前语言的本站文章；这是本地检索空结果，不代表模型回答。' : 'No local article matched in this language; this is an empty retrieval result, not a model answer.';
        return;
      }
      results.forEach((item) => {
        const row = document.createElement('div');
        row.className = 'al-rag-hit';
        const title = document.createElement('a'); title.href = item.url; title.textContent = item.title;
        const score = document.createElement('span'); score.textContent = `BM25 + n-gram ${item.score.toFixed(3)}`;
        const text = document.createElement('p'); text.textContent = item.content.slice(0, 360);
        row.append(title, score, text); ragResult.append(row);
      });
    };
    const loadFixture = async () => {
      if (!ragResult) return;
      try {
        const response = await fetch(playground.dataset.corpusUrl, { credentials: 'same-origin' });
        if (!response.ok) throw new Error(`Corpus request failed (${response.status})`);
        const corpus = await response.json();
        if (corpus.schema_version !== 1 || !Array.isArray(corpus.documents)) throw new Error('Unsupported corpus schema');
        fixture = corpus.documents.map((document) => ({ ...document, tokens: tokenize(`${document.title} ${document.content}`) }));
        ragResult.setAttribute('aria-busy', 'false');
        runRag();
      } catch (_) {
        ragResult.setAttribute('aria-busy', 'false');
        ragResult.textContent = root.lang.startsWith('zh') ? '本地语料载入失败，请检查构建资源后重试。' : 'Could not load the local corpus. Check the built assets and retry.';
      }
    };
    ragRun?.addEventListener('click', runRag);
    ragQuery?.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); runRag(); } });
    loadFixture();
  }
})();
