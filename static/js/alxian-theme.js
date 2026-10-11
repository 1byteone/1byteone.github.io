(function () {
  'use strict';

  var root = document.body;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;

  function qs(selector, scope) { return (scope || document).querySelector(selector); }
  function qsa(selector, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(selector)); }
  function langText(zh, en) { return root && root.dataset.lang === 'zh' ? zh : en; }

  /* Keep the age current even when a static build has not been redeployed yet. */
  var ageNode = qs('[data-age]');
  if (ageNode) {
    var birthYear = Number(ageNode.getAttribute('data-birth-year'));
    if (Number.isFinite(birthYear) && birthYear > 1900 && birthYear <= new Date().getFullYear()) {
      var age = Math.max(0, new Date().getFullYear() - birthYear);
      ageNode.textContent = root.dataset.lang === 'zh'
        ? age + ' 岁 · 南昌 / 中国'
        : age + ' years old · Software engineer · Nanchang, China';
    }
  }

  /* The original loader leaves the viewport with a vertical wipe. Keep the
     curtain until the primary illustration is ready, with a hard fallback. */
  var loader = qs('[data-loader]');
  if (loader) {
    var loaderDone = false;
    var loaderStartedAt = window.performance && window.performance.now ? window.performance.now() : Date.now();
    var loaderImage = qs('.alxian-loader-content img', loader);
    var leaveTimer = 0;
    function leaveLoader() {
      if (loaderDone) return;
      loaderDone = true;
      if (leaveTimer) window.clearTimeout(leaveTimer);
      var elapsed = (window.performance && window.performance.now ? window.performance.now() : Date.now()) - loaderStartedAt;
      var wait = Math.max(0, 950 - elapsed);
      leaveTimer = window.setTimeout(function () {
        loader.classList.add('is-hidden');
        window.setTimeout(function () { loader.classList.add('is-gone'); }, reduceMotion ? 0 : 1050);
      }, reduceMotion ? 0 : wait);
    }
    if (loaderImage) {
      var preload = new Image();
      preload.onload = leaveLoader;
      preload.onerror = leaveLoader;
      preload.src = loaderImage.currentSrc || loaderImage.src;
      if (preload.complete) leaveLoader();
    } else {
      leaveLoader();
    }
    window.setTimeout(leaveLoader, 2500);
  }

  /* The face is a transparent 448 x 1098 canvas. Keep the eyes in the image's
     coordinate system so the overlays stay inside the glasses at every size. */
  var character = qs('[data-character]');
  if (character) {
    var eyes = qsa('.alxian-character-eye', character);
    var targetEyeX = 0; var targetEyeY = 0; var eyeX = 0; var eyeY = 0; var eyeFrame = 0;
    function renderEyes() {
      eyeFrame = 0;
      eyeX += (targetEyeX - eyeX) * 0.1;
      eyeY += (targetEyeY - eyeY) * 0.1;
      eyes.forEach(function (eye) { eye.style.setProperty('--eye-x', (3 * eyeX) + 'px'); eye.style.setProperty('--eye-y', (3 * eyeY * 0.55) + 'px'); });
      if (Math.abs(targetEyeX - eyeX) > 0.002 || Math.abs(targetEyeY - eyeY) > 0.002) eyeFrame = window.requestAnimationFrame(renderEyes);
    }
    if (finePointer) {
      document.addEventListener('pointermove', function (event) {
        targetEyeX = event.clientX / Math.max(1, window.innerWidth) * 2 - 1;
        targetEyeY = event.clientY / Math.max(1, window.innerHeight) * 2 - 1;
        if (!eyeFrame) eyeFrame = window.requestAnimationFrame(renderEyes);
      }, { passive: true });
    }
    function blink() {
      if (!reduceMotion) {
        character.classList.add('is-blinking');
        window.setTimeout(function () { character.classList.remove('is-blinking'); }, 130);
      }
      window.setTimeout(blink, 2800 + 3500 * Math.random());
    }
    window.setTimeout(blink, 2800 + 3500 * Math.random());
  }

  /* Reference-style arrow cursor. It is disabled for touch and reduced motion. */
  if (!reduceMotion && finePointer) {
    var cursor = document.createElement('div');
    cursor.className = 'alxian-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = '<div class="alxian-cursor-text" aria-hidden="true"></div><div class="alxian-cursor-circle" aria-hidden="true"></div><svg viewBox="0 0 14 14" focusable="false" aria-hidden="true"><path class="alxian-cursor-fill" d="M13.246 4.973c0-1.126-10.832-5.333-12.222-3.945C-.362 2.413 3.902 13.25 5.02 13.25c1.303 0 2.068-4.965 2.377-5.854c.886-.313 5.849-1.115 5.849-2.423"></path><path class="alxian-cursor-stroke" d="M13.246 4.973c0-1.126-10.832-5.333-12.222-3.945C-.362 2.413 3.902 13.25 5.02 13.25c1.303 0 2.068-4.965 2.377-5.854c.886-.313 5.849-1.115 5.849-2.423"></path></svg>';
    root.appendChild(cursor);
    root.classList.add('alxian-cursor-active');
    var cursorX = -80; var cursorY = -80; var pointerX = -80; var pointerY = -80; var cursorFrame = 0; var cursorMode = 'default'; var cursorAngle = 0; var targetAngle = 0; var lastPointerX = -80; var lastPointerY = -80; var lastPointerAt = 0;
    function setCursorMode(mode) {
      if (cursorMode === mode) return;
      cursorMode = mode;
      cursor.classList.remove('is-hover', 'is-interactive', 'is-text', 'is-drag', 'is-disabled');
      if (mode === 'interactive') cursor.classList.add('is-interactive');
      if (mode === 'text' || mode === 'drag' || mode === 'disabled') cursor.classList.add('is-' + mode);
    }
    function cursorModeFor(target) {
      if (!target || !target.closest) return 'default';
      var element = target.closest('button:disabled, input:disabled, textarea:disabled, select:disabled, [aria-disabled="true"], .cursor-not-allowed');
      if (element) return 'disabled';
      element = target.closest('.cursor-grab, .cursor-grabbing, [draggable="true"], [data-guitar]');
      if (element) return 'drag';
      element = target.closest('input:not([type="button"]):not([type="submit"]):not([type="range"]), textarea, [contenteditable="true"]');
      if (element) return 'text';
      element = target.closest('a,button,[role="button"],input[type="button"],input[type="submit"],input[type="range"],summary,select,.cursor-pointer');
      return element ? 'interactive' : 'default';
    }
    function renderCursor() {
      cursorFrame = 0;
      cursorX += (pointerX - cursorX) * 0.27;
      cursorY += (pointerY - cursorY) * 0.27;
      cursorAngle += (targetAngle - cursorAngle) * 0.24;
      cursor.style.transform = 'translate3d(' + cursorX + 'px,' + cursorY + 'px,0) rotate(' + cursorAngle + 'deg)';
      if (Math.abs(pointerX - cursorX) > 0.2 || Math.abs(pointerY - cursorY) > 0.2) cursorFrame = window.requestAnimationFrame(renderCursor);
    }
    document.addEventListener('pointermove', function (event) {
      var now = Date.now(); var elapsed = Math.max(1, now - lastPointerAt); var dx = event.clientX - lastPointerX; var dy = event.clientY - lastPointerY;
      if (lastPointerAt && Math.hypot(dx, dy) > 2 && elapsed > 8) {
        var angle = (Math.atan2(dy, dx) * 180 / Math.PI) + 90;
        while (angle > 180) angle -= 360; while (angle < -180) angle += 360;
        targetAngle = Math.sign(angle) * Math.min(Math.abs(angle), 15);
      }
      lastPointerX = event.clientX; lastPointerY = event.clientY; lastPointerAt = now;
      pointerX = event.clientX - 13;
      pointerY = event.clientY - 13;
      setCursorMode(cursorModeFor(event.target));
      if (!cursorFrame) cursorFrame = window.requestAnimationFrame(renderCursor);
    }, { passive: true });
    document.addEventListener('pointerover', function (event) {
      setCursorMode(cursorModeFor(event.target));
    });
    document.addEventListener('pointerout', function (event) {
      setCursorMode(cursorModeFor(event.relatedTarget));
    });
    document.addEventListener('pointerdown', function () { cursor.classList.add('is-pressed'); });
    document.addEventListener('pointerup', function () { cursor.classList.remove('is-pressed'); });
    document.addEventListener('pointercancel', function () { cursor.classList.remove('is-pressed'); });
    window.addEventListener('blur', function () { setCursorMode('default'); cursor.classList.remove('is-pressed'); });
  }

  var gridBackground = qs('.alxian-grid-bg');
  if (gridBackground && !reduceMotion && finePointer) {
    var spotFrame = 0;
    document.addEventListener('pointermove', function (event) {
      if (spotFrame) return;
      spotFrame = window.requestAnimationFrame(function () {
        spotFrame = 0;
        gridBackground.style.setProperty('--spot-x', event.clientX + 'px');
        gridBackground.style.setProperty('--spot-y', event.clientY + 'px');
      });
    }, { passive: true });
  }

  /* GitHub's contribution graph is not available from the unauthenticated
     GitHub API. The public contributions service mirrors GitHub's calendar
     and exposes the actual public profile data with CORS enabled, so the
     static GitHub Pages build can still render the owner's live activity. */
  var heatmap = qs('[data-heatmap]');
  if (heatmap) {
    var githubTotal = qs('[data-github-total]');
    var githubSummary = qs('[data-github-summary]');
    var githubYearNode = qs('[data-github-year]');
    var githubPrev = qs('[data-github-year-prev]');
    var githubNext = qs('[data-github-year-next]');
    var githubUrl = heatmap.getAttribute('data-github-url') || '';
    var githubMatch = githubUrl.match(/github\.com\/([^/?#]+)/i);
    var githubUser = githubMatch ? githubMatch[1] : '';
    var currentYear = new Date().getFullYear();
    var githubYear = currentYear;
    var githubRequestId = 0;
    var githubMinYear = 2008;
    var githubCacheTtl = 30 * 60 * 1000;
    var heatmapCells = [];

    function githubText(zh, en) { return root && root.dataset.lang === 'zh' ? zh : en; }
    function setGithubSummary(total, year, state) {
      if (githubTotal) githubTotal.textContent = state === 'loading' ? '…' : (state === 'error' ? '--' : String(total));
      if (!githubSummary) return;
      if (state === 'loading') githubSummary.textContent = githubText('正在同步 GitHub 数据', 'Syncing GitHub data');
      else if (state === 'error') githubSummary.textContent = githubText('GitHub 数据暂时不可用', 'GitHub data is temporarily unavailable');
      else githubSummary.textContent = githubText(year + ' 年已提交', 'contributions in ' + year);
    }
    function updateGithubYearButtons() {
      if (githubYearNode) githubYearNode.textContent = String(githubYear);
      if (githubPrev) githubPrev.disabled = githubYear <= githubMinYear;
      if (githubNext) githubNext.disabled = githubYear >= currentYear;
    }
    function buildGithubCells() {
      if (heatmapCells.length) return;
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < 371; i += 1) {
        var cell = document.createElement('i');
        cell.className = 'is-empty is-loading';
        cell.setAttribute('aria-hidden', 'true');
        fragment.appendChild(cell);
        heatmapCells.push(cell);
      }
      heatmap.appendChild(fragment);
    }
    function cacheKey(year) { return 'alxian-github-contributions:' + githubUser + ':' + year; }
    function readGithubCache(year) {
      try {
        var cached = JSON.parse(localStorage.getItem(cacheKey(year)) || 'null');
        if (cached && Array.isArray(cached.contributions) && cached.savedAt && Date.now() - cached.savedAt < githubCacheTtl) return cached;
      } catch (_) {}
      return null;
    }
    function writeGithubCache(year, payload) {
      try { localStorage.setItem(cacheKey(year), JSON.stringify({ savedAt: Date.now(), contributions: payload.contributions })); } catch (_) {}
    }
    function formatGithubDate(dateValue) {
      var date = new Date(dateValue + 'T00:00:00Z');
      if (isNaN(date.getTime())) return dateValue;
      return date.toISOString().slice(0, 10);
    }
    function renderGithubContributions(payload, year) {
      var records = payload && Array.isArray(payload.contributions) ? payload.contributions : [];
      var byDate = {};
      var total = 0;
      records.forEach(function (record) {
        if (!record || !record.date) return;
        var count = Number(record.count) || 0;
        byDate[record.date] = { count: count, level: Math.max(0, Math.min(4, Number(record.level) || 0)) };
        total += count;
      });
      var firstDay = new Date(Date.UTC(year, 0, 1));
      var offset = firstDay.getUTCDay();
      heatmapCells.forEach(function (cell, index) {
        var dayOffset = index - offset;
        var date = new Date(Date.UTC(year, 0, 1));
        date.setUTCDate(date.getUTCDate() + dayOffset);
        var dateKey = date.toISOString().slice(0, 10);
        var inYear = date.getUTCFullYear() === year;
        var item = inYear ? byDate[dateKey] : null;
        cell.className = item ? 'level-' + item.level : 'is-empty';
        cell.setAttribute('data-level', item ? String(item.level) : '0');
        cell.setAttribute('data-date', dateKey);
        cell.setAttribute('aria-hidden', item ? 'false' : 'true');
        if (inYear) {
          cell.title = formatGithubDate(dateKey) + ' · ' + (item ? item.count : 0) + ' ' + githubText('次提交', 'contributions');
          cell.setAttribute('aria-label', cell.title);
        } else {
          cell.removeAttribute('title');
          cell.removeAttribute('aria-label');
        }
      });
      setGithubSummary(total, year, 'ready');
    }
    function loadGithubContributions(year) {
      if (!githubUser) { setGithubSummary(0, year, 'error'); return; }
      githubYear = year;
      updateGithubYearButtons();
      setGithubSummary(0, year, 'loading');
      var requestId = ++githubRequestId;
      var cached = readGithubCache(year);
      if (cached) renderGithubContributions(cached, year);
      var endpoint = 'https://github-contributions-api.jogruber.de/v4/' + encodeURIComponent(githubUser) + '?y=' + encodeURIComponent(String(year));
      fetch(endpoint, { headers: { Accept: 'application/json' }, credentials: 'omit' }).then(function (response) {
        if (!response.ok) throw new Error('GitHub contribution request failed');
        return response.json();
      }).then(function (payload) {
        if (requestId !== githubRequestId || !payload || !Array.isArray(payload.contributions)) return;
        writeGithubCache(year, payload);
        renderGithubContributions(payload, year);
      }).catch(function () {
        if (requestId !== githubRequestId || cached) return;
        setGithubSummary(0, year, 'error');
        heatmap.setAttribute('data-github-error', 'true');
      });
    }
    buildGithubCells();
    updateGithubYearButtons();
    if (githubPrev) githubPrev.addEventListener('click', function () { if (githubYear > githubMinYear) loadGithubContributions(githubYear - 1); });
    if (githubNext) githubNext.addEventListener('click', function () { if (githubYear < currentYear) loadGithubContributions(githubYear + 1); });
    loadGithubContributions(githubYear);
  }

  var themeButton = qs('[data-theme-toggle]');
  var savedTheme = null;
  try { savedTheme = localStorage.getItem('alxian-theme-mode'); } catch (_) {}
  if (savedTheme === 'dark') root.classList.add('is-dark');
  function updateThemeButton() {
    if (!themeButton) return;
    var dark = root.classList.contains('is-dark');
    themeButton.textContent = dark ? '☀' : '☾';
    themeButton.setAttribute('aria-pressed', String(dark));
    themeButton.setAttribute('aria-label', langText('切换浅色模式', 'Switch to light mode'));
  }
  updateThemeButton();
  var themeTransition = null;
  function toggleThemeWithTransition() {
    var nextDark = !root.classList.contains('is-dark');
    if (reduceMotion || !themeButton) {
      root.classList.toggle('is-dark', nextDark);
      try { localStorage.setItem('alxian-theme-mode', nextDark ? 'dark' : 'light'); } catch (_) {}
      updateThemeButton();
      return;
    }
    var rect = themeButton.getBoundingClientRect(); var x = rect.left + rect.width / 2; var y = rect.top + rect.height / 2;
    var radius = 1.12 * Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    if (!themeTransition) { themeTransition = document.createElement('div'); themeTransition.className = 'alxian-theme-transition'; root.appendChild(themeTransition); }
    themeTransition.style.background = nextDark ? 'radial-gradient(circle,#06080cc2 0%,#0a0c12a3 48%,#020204ad 100%)' : 'radial-gradient(circle,#ffffffb8 0%,#f8fafca3 48%,#e2e8f0ad 100%)';
    themeTransition.style.display = 'block'; themeTransition.style.opacity = '1'; themeTransition.style.clipPath = 'circle(0px at ' + x + 'px ' + y + 'px)';
    window.requestAnimationFrame(function () { themeTransition.style.clipPath = 'circle(' + radius + 'px at ' + x + 'px ' + y + 'px)'; });
    window.setTimeout(function () {
      root.classList.toggle('is-dark', nextDark);
      try { localStorage.setItem('alxian-theme-mode', nextDark ? 'dark' : 'light'); } catch (_) {}
      updateThemeButton();
      themeTransition.style.opacity = '0';
      window.setTimeout(function () { if (themeTransition) { themeTransition.style.display = 'none'; themeTransition.style.clipPath = 'none'; } }, 360);
    }, 460);
  }
  if (themeButton) themeButton.addEventListener('click', toggleThemeWithTransition);

  var gallery = qs('[data-gallery]');
  var galleryButton = qs('[data-gallery-next]');
  var galleryPrevButton = qs('[data-gallery-prev]');
  var galleryCount = qs('[data-gallery-count]');
  var galleryIndex = 0;
  var gallerySuppressClick = false;
  function showGallery(index) {
    if (!gallery) return;
    var images = qsa('img', gallery);
    if (!images.length) return;
    galleryIndex = (index + images.length) % images.length;
    images.forEach(function (image, itemIndex) {
      var distance = (itemIndex - galleryIndex + images.length) % images.length;
      var offsets = [{ x: 0, y: 0, r: 0, opacity: 1 }, { x: 14, y: 8, r: 4, opacity: .48 }, { x: 28, y: 16, r: 8, opacity: .36 }, { x: 42, y: 24, r: 12, opacity: .24 }];
      var offset = offsets[Math.min(distance, offsets.length - 1)];
      image.classList.toggle('is-current', distance === 0);
      image.style.zIndex = String(images.length - distance);
      image.style.opacity = String(offset.opacity);
      image.style.transform = 'translate(' + offset.x + 'px,' + offset.y + 'px) rotate(' + offset.r + 'deg)';
      image.style.pointerEvents = distance === 0 ? 'auto' : 'none';
      image.setAttribute('aria-hidden', itemIndex === galleryIndex ? 'false' : 'true');
    });
    if (galleryButton) galleryButton.setAttribute('aria-label', langText('下一张图片', 'Next gallery image'));
    if (galleryPrevButton) galleryPrevButton.setAttribute('aria-label', langText('上一张图片', 'Previous gallery image'));
    if (galleryCount) galleryCount.textContent = (galleryIndex + 1) + ' / ' + images.length;
  }
  showGallery(0);
  if (galleryButton) galleryButton.addEventListener('click', function () { showGallery(galleryIndex + 1); });
  if (galleryPrevButton) galleryPrevButton.addEventListener('click', function () { showGallery(galleryIndex - 1); });
  if (gallery) {
    var galleryModal = null;
    function closeGalleryModal() { if (!galleryModal) return; galleryModal.classList.remove('is-open'); window.setTimeout(function () { if (galleryModal) { galleryModal.remove(); galleryModal = null; } }, 300); }
    function openGalleryModal(image) {
      closeGalleryModal(); galleryModal = document.createElement('div'); galleryModal.className = 'alxian-gallery-modal'; galleryModal.setAttribute('role', 'dialog'); galleryModal.setAttribute('aria-modal', 'true');
      var close = document.createElement('button'); close.type = 'button'; close.textContent = '×'; close.setAttribute('aria-label', langText('关闭图库', 'Close gallery'));
      var preview = document.createElement('img'); preview.src = image.currentSrc || image.src; preview.alt = image.alt;
      galleryModal.appendChild(preview); galleryModal.appendChild(close); root.appendChild(galleryModal); window.requestAnimationFrame(function () { galleryModal.classList.add('is-open'); });
      close.addEventListener('click', closeGalleryModal); galleryModal.addEventListener('click', function (event) { if (event.target === galleryModal) closeGalleryModal(); });
    }
    gallery.addEventListener('click', function (event) {
      if (gallerySuppressClick) { gallerySuppressClick = false; return; }
      var image = event.target.closest ? event.target.closest('img') : null;
      if (image && image.classList.contains('is-current')) openGalleryModal(image); else showGallery(galleryIndex + 1);
    });
    var galleryStartX = 0; var galleryStartY = 0;
    gallery.addEventListener('pointerdown', function (event) {
      galleryStartX = event.clientX; galleryStartY = event.clientY;
    }, { passive: true });
    gallery.addEventListener('pointerup', function (event) {
      var deltaX = event.clientX - galleryStartX;
      var deltaY = event.clientY - galleryStartY;
      if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
        gallerySuppressClick = true;
        showGallery(galleryIndex + (deltaX < 0 ? 1 : -1));
      }
    }, { passive: true });
    gallery.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); showGallery(galleryIndex + 1); }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); showGallery(galleryIndex - 1); }
    });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape') closeGalleryModal(); });
    gallery.setAttribute('tabindex', '0');
  }

  /* The reference ticker pauses on hover/focus and turns a selected skill
     into a short-lived focus state: every item dims, the selected item grows,
     and the repeated track slides it to the centre before returning to its
     marquee position. Use the Web Animations API when available so the CSS
     marquee remains smooth and does not jump when a button is clicked. */
  var skillStrip = qs('.alxian-skill-strip');
  var skillTrack = skillStrip && qs('.alxian-skill-track', skillStrip);
  if (skillStrip && skillTrack) {
    var skillItems = qsa('.alxian-skill', skillTrack);
    var skillResetTimer = 0;
    var skillTrackAnimation = null;
    var skillFocusDuration = reduceMotion ? 0 : 650;
    function clearSkillFocus() {
      if (skillResetTimer) window.clearTimeout(skillResetTimer);
      skillResetTimer = 0;
      if (skillTrackAnimation) { skillTrackAnimation.cancel(); skillTrackAnimation = null; }
      skillTrack.style.animation = '';
      skillTrack.style.transform = '';
      skillTrack.classList.remove('is-focus');
      skillItems.forEach(function (item) {
        item.classList.remove('is-selected');
        item.setAttribute('aria-pressed', 'false');
        item.style.opacity = '';
        item.style.transform = '';
        item.style.transition = '';
      });
    }
    function focusSkill(item) {
      if (!item) return;
      if (skillResetTimer) window.clearTimeout(skillResetTimer);
      if (skillTrackAnimation) { skillTrackAnimation.cancel(); skillTrackAnimation = null; }
      skillTrack.classList.add('is-focus');
      var stripRect = skillStrip.getBoundingClientRect();
      var itemRect = item.getBoundingClientRect();
      var currentTranslate = 0;
      var computedTransform = window.getComputedStyle(skillTrack).transform;
      if (computedTransform && computedTransform !== 'none') {
        var matrixMatch = computedTransform.match(/^matrix(?:3d)?\\((.+)\\)$/);
        if (matrixMatch) {
          var values = matrixMatch[1].split(',').map(function (value) { return parseFloat(value); });
          currentTranslate = values.length === 16 ? values[12] : values[4];
        }
      }
      skillTrack.style.animation = 'none';
      var targetTranslate = currentTranslate + (stripRect.left + stripRect.width / 2) - (itemRect.left + itemRect.width / 2);
      skillItems.forEach(function (entry) {
        var selected = entry === item;
        entry.classList.toggle('is-selected', selected);
        entry.setAttribute('aria-pressed', selected ? 'true' : 'false');
        entry.style.opacity = selected ? '1' : '.62';
        entry.style.transform = selected ? 'scale(1.45)' : 'scale(.88)';
        entry.style.transition = reduceMotion ? 'none' : 'transform .65s cubic-bezier(.22,1,.36,1), opacity .28s ease';
      });
      var from = 'translate3d(' + currentTranslate + 'px,0,0)';
      var to = 'translate3d(' + targetTranslate + 'px,0,0)';
      if (skillTrack.animate && !reduceMotion) {
        skillTrackAnimation = skillTrack.animate([{ transform: from }, { transform: to }], { duration: skillFocusDuration, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' });
        skillTrackAnimation.onfinish = function () { skillTrack.style.transform = to; skillTrackAnimation = null; };
      } else {
        skillTrack.style.transform = to;
      }
      skillResetTimer = window.setTimeout(clearSkillFocus, reduceMotion ? 0 : 1800 + skillFocusDuration);
    }
    skillItems.forEach(function (item) {
      item.addEventListener('click', function () { focusSkill(item); });
      item.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); focusSkill(item); }
      });
    });
    skillStrip.addEventListener('mouseleave', function () {
      if (!skillTrack.querySelector('.is-selected')) return;
      if (skillResetTimer) window.clearTimeout(skillResetTimer);
      skillResetTimer = window.setTimeout(clearSkillFocus, 1800);
    });
  }

  /* A static GitHub Pages build has no visitor API of its own. Only fetch an
     explicitly configured endpoint; the empty/default state stays neutral
     instead of showing numbers copied from the reference site. */
  var visitorStats = qs('[data-visitors-endpoint]');
  if (visitorStats) {
    var visitorsToday = qs('[data-visitors-today]', visitorStats);
    var visitorsTotal = qs('[data-visitors-total]', visitorStats);
    var visitorEndpoint = visitorStats.getAttribute('data-visitors-endpoint') || '';
    function renderVisitors(payload) {
      if (!payload || typeof payload !== 'object') return false;
      var today = payload.todayVisitors != null ? payload.todayVisitors : payload.today;
      var total = payload.totalVisitors != null ? payload.totalVisitors : payload.total;
      if (visitorsToday && Number.isFinite(Number(today))) visitorsToday.textContent = String(Math.max(0, Number(today)));
      if (visitorsTotal && Number.isFinite(Number(total))) visitorsTotal.textContent = String(Math.max(0, Number(total)));
      return Number.isFinite(Number(today)) || Number.isFinite(Number(total));
    }
    if (visitorEndpoint) {
      fetch(visitorEndpoint, { headers: { Accept: 'application/json' }, credentials: 'omit' }).then(function (response) {
        if (!response.ok) throw new Error('visitor stats unavailable');
        return response.json();
      }).then(renderVisitors).catch(function () {});
    }
  }

  /* The source site keeps one shared Audio element and a seekable playlist. */
  var musicButton = qs('[data-music]');
  if (musicButton) {
    var track = musicButton.closest ? musicButton.closest('[data-music-track]') : null;
    var progressTrack = track && qs('[data-music-progress]', track);
    var progress = progressTrack && qs('i', progressTrack);
    var progressDot = progressTrack && qs('b', progressTrack);
    var currentNode = track && qs('[data-music-current]', track);
    var totalNode = track && qs('[data-music-total]', track);
    var titleNode = track && qs('[data-music-title]', track);
    var authorNode = track && qs('[data-music-author]', track);
    var coverNode = track && qs('[data-music-cover]', track);
    var indexNode = track && qs('[data-music-index]', track);
    var playlist = track && track.parentNode && qs('[data-music-list]', track.parentNode);
    var prevTrack = track && qs('[data-music-prev]', track);
    var nextTrack = track && qs('[data-music-next]', track);
    var assetRoot = root.getAttribute('data-asset-root') || '/assets/alxian/';
    function assetCover(name) { return assetRoot + 'images/' + name; }
    var elapsed = 0; var duration = 0; var selectedTrack = 0;
    var musicItems = [
      { title: '五哈', author: '邓超 & 陈赫 & 鹿晗 & 范志毅 & 宝石Gem & 王勉', duration: 224, url: 'https://image.goodjob.cn/image/live/wx/wuha.mp3', cover: assetCover('wuha.jpg') },
      { title: langText('天空中的歌', 'Song in the sky'), author: '崔一乔', duration: 198, url: 'https://image.goodjob.cn/image/live/wx/tkzdg.mp3', cover: assetCover('tkzdg.jpg') },
      { title: langText('鲜花', 'Flowers'), author: '回春丹乐队', duration: 231, url: 'https://image.goodjob.cn/image/live/wx/xh.mp3', cover: assetCover('xh.jpg') },
      { title: langText('专注时刻 01', 'Focus session 01'), author: 'SoundHelix · T. Schürger', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', cover: assetCover('wuha.jpg') },
      { title: langText('专注时刻 02', 'Focus session 02'), author: 'SoundHelix · T. Schürger', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', cover: assetCover('tkzdg.jpg') },
      { title: langText('专注时刻 03', 'Focus session 03'), author: 'SoundHelix · T. Schürger', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', cover: assetCover('xh.jpg') },
      { title: langText('专注时刻 04', 'Focus session 04'), author: 'SoundHelix · T. Schürger', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', cover: assetCover('wuha.jpg') },
      { title: langText('专注时刻 05', 'Focus session 05'), author: 'SoundHelix · T. Schürger', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', cover: assetCover('tkzdg.jpg') },
      { title: langText('专注时刻 06', 'Focus session 06'), author: 'SoundHelix · T. Schürger', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', cover: assetCover('xh.jpg') },
      { title: langText('专注时刻 07', 'Focus session 07'), author: 'SoundHelix · T. Schürger', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', cover: assetCover('wuha.jpg') },
    ];
    var audio = new Audio();
    audio.preload = 'metadata';
    function formatTime(seconds) { var value = Math.max(0, Math.floor(seconds)); return String(Math.floor(value / 60)).padStart(2, '0') + ':' + String(value % 60).padStart(2, '0'); }
    function renderMusic(current, total) {
      elapsed = Math.max(0, current || 0); duration = total || duration;
      var ratio = duration ? Math.min(1, elapsed / duration) : 0;
      if (progress) progress.style.width = (ratio * 100) + '%';
      if (progressDot) progressDot.style.left = (ratio * 100) + '%';
      if (progressTrack) progressTrack.setAttribute('aria-valuenow', String(Math.round(ratio * 100)));
      if (currentNode) currentNode.textContent = formatTime(elapsed);
      if (totalNode) totalNode.textContent = formatTime(duration);
    }
    function setMusicState(playing) {
      musicButton.setAttribute('aria-pressed', String(playing));
      musicButton.dataset.playing = String(playing);
      musicButton.textContent = playing ? 'Ⅱ' : '▶';
      musicButton.setAttribute('aria-label', playing ? langText('暂停音乐', 'Pause music') : langText('播放音乐', 'Play music'));
      if (track) track.classList.toggle('is-playing', playing);
      if (playlist) qsa('[data-track-state]', playlist).forEach(function (state, itemIndex) { state.textContent = itemIndex === selectedTrack ? (playing ? langText('播放中', 'Playing') : langText('已选', 'Selected')) : ''; });
    }
    function renderPlaylist() {
      if (!playlist) return;
      playlist.innerHTML = '';
      musicItems.forEach(function (item, itemIndex) {
        var button = document.createElement('button');
        button.type = 'button'; button.dataset.trackIndex = String(itemIndex);
        button.className = itemIndex === selectedTrack ? 'is-current' : '';
        var title = document.createElement('span');
        title.textContent = (itemIndex + 1) + '. ' + item.title;
        var state = document.createElement('em');
        state.setAttribute('data-track-state', '');
        state.textContent = itemIndex === selectedTrack ? langText('已选', 'Selected') : '';
        button.appendChild(title); button.appendChild(state);
        button.addEventListener('click', function (event) { event.stopPropagation(); selectMusic(itemIndex, true); });
        playlist.appendChild(button);
      });
    }
    function stopMusic(reset) {
      audio.pause();
      if (reset) renderMusic(0, duration);
      setMusicState(false);
    }
    function selectMusic(index, autoplay) {
      selectedTrack = (index + musicItems.length) % musicItems.length;
      var item = musicItems[selectedTrack];
      stopMusic(true); duration = item.duration || 224; elapsed = 0;
      audio.src = item.url;
      audio.load();
      if (track) track.removeAttribute('data-audio-error');
      if (titleNode) titleNode.textContent = item.title;
      if (authorNode) authorNode.textContent = item.author;
      if (coverNode) { coverNode.src = item.cover; coverNode.alt = item.title; }
      if (indexNode) indexNode.textContent = (selectedTrack + 1) + '/' + musicItems.length;
      if (playlist) qsa('button[data-track-index]', playlist).forEach(function (button) { button.classList.toggle('is-current', Number(button.dataset.trackIndex) === selectedTrack); });
      renderMusic(0, duration);
      if (autoplay) startMusic();
    }
    function startMusic() {
      setMusicState(true);
      audio.play().catch(function () { setMusicState(false); if (track) track.setAttribute('data-audio-error', 'true'); });
    }
    audio.addEventListener('loadedmetadata', function () { duration = audio.duration || duration; renderMusic(audio.currentTime, duration); if (track) track.removeAttribute('data-audio-error'); });
    audio.addEventListener('timeupdate', function () { renderMusic(audio.currentTime, audio.duration || duration); });
    audio.addEventListener('ended', function () { selectMusic(selectedTrack + 1, true); });
    audio.addEventListener('error', function () { setMusicState(false); if (track) track.setAttribute('data-audio-error', 'true'); });
    if (progressTrack) {
      function seekFromEvent(event) { var rect = progressTrack.getBoundingClientRect(); var ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / Math.max(1, rect.width))); var next = ratio * duration; if (Number.isFinite(audio.duration)) audio.currentTime = next; renderMusic(next, duration); }
      progressTrack.addEventListener('pointerdown', function (event) { seekFromEvent(event); });
      progressTrack.addEventListener('keydown', function (event) { var next = null; if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = Math.min(duration, elapsed + 5); if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = Math.max(0, elapsed - 5); if (next == null) return; event.preventDefault(); if (Number.isFinite(audio.duration)) audio.currentTime = next; renderMusic(next, duration); });
    }
    renderPlaylist();
    selectMusic(0, false);
    musicButton.addEventListener('click', function (event) { event.stopPropagation(); musicButton.getAttribute('aria-pressed') === 'true' ? stopMusic(false) : startMusic(); });
    if (prevTrack) prevTrack.addEventListener('click', function (event) { event.stopPropagation(); selectMusic(selectedTrack - 1, true); });
    if (nextTrack) nextTrack.addEventListener('click', function (event) { event.stopPropagation(); selectMusic(selectedTrack + 1, true); });
    if (track) track.addEventListener('click', function (event) { if (event.target.closest('button,[data-music-progress]')) return; });

    /* Keep the ten bundled tracks intact. Apple's Search API only exposes
       thirty-second previews, so it must not replace the full audio sources. */

  }

  var commentsButton = qs('[data-comments]');
  var commentPopover = qs('[data-comment-popover]');
  var commentText = commentPopover && qs('textarea', commentPopover);
  var sendComment = qs('[data-comment-send]');
  var commentStatus = commentPopover && qs('[data-comment-status]', commentPopover);
  var commentCount = qs('[data-comment-count]');
  if (commentCount) {
    fetch('/api/comments', { headers: { Accept: 'application/json' } }).then(function (response) { if (!response.ok) throw new Error('comment count unavailable'); return response.json(); }).then(function (payload) {
      var count = Array.isArray(payload) ? payload.length : payload && Number(payload.count);
      if (Number.isFinite(count)) commentCount.textContent = count > 99 ? '99+' : String(Math.max(0, count));
    }).catch(function () { commentCount.textContent = '0'; });
  }
  if (commentPopover && !commentStatus) {
    commentStatus = document.createElement('small');
    commentStatus.className = 'alxian-comment-status';
    commentStatus.setAttribute('data-comment-status', 'true');
    commentStatus.setAttribute('role', 'status');
    commentPopover.appendChild(commentStatus);
  }
  function setCommentStatus(message, isError) {
    if (!commentStatus) return;
    commentStatus.textContent = message;
    commentStatus.classList.toggle('is-error', Boolean(isError));
  }
  if (commentText) {
    var savedDraft = null;
    try { savedDraft = localStorage.getItem('alxian-comment-draft') || ''; } catch (_) {}
    commentText.value = savedDraft;
    setCommentStatus(savedDraft ? langText('草稿已从本地恢复', 'Draft restored from this browser') : langText('输入内容会自动保存在本地', 'Your draft is saved locally while you type'));
    commentText.addEventListener('input', function () {
      if (commentText.value.trim()) {
        try { localStorage.setItem('alxian-comment-draft', commentText.value); setCommentStatus(langText('本地保存 · 草稿已更新', 'Saved locally · draft updated')); } catch (_) { setCommentStatus(langText('浏览器未允许本地保存', 'Local saving is unavailable'), true); }
      } else {
        try { localStorage.removeItem('alxian-comment-draft'); } catch (_) {}
        setCommentStatus(langText('输入内容会自动保存在本地', 'Your draft is saved locally while you type'));
      }
    });
  }
  function closeComments() {
    if (commentPopover) commentPopover.hidden = true;
    if (commentsButton) commentsButton.setAttribute('aria-expanded', 'false');
  }
  if (commentsButton && commentPopover) commentsButton.addEventListener('click', function (event) {
    event.stopPropagation();
    commentPopover.hidden = !commentPopover.hidden;
    commentsButton.setAttribute('aria-expanded', String(!commentPopover.hidden));
    if (!commentPopover.hidden && commentText) commentText.focus();
  });
  document.addEventListener('pointerdown', function (event) {
    if (commentPopover && !commentPopover.hidden && event.target !== commentsButton && !commentPopover.contains(event.target)) closeComments();
  });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape') closeComments(); });
  if (sendComment) sendComment.addEventListener('click', function () {
    if (!commentText || !commentText.value.trim()) { setCommentStatus(langText('先写点内容，再发送', 'Write a note before sending'), true); if (commentText) commentText.focus(); return; }
    commentText.value = '';
    try { localStorage.removeItem('alxian-comment-draft'); } catch (_) {}
    sendComment.textContent = langText('已保存到本地', 'Saved locally');
    setCommentStatus(langText('已保存到本地', 'Saved to this browser'));
    window.setTimeout(function () { sendComment.textContent = langText('发送', 'Send'); closeComments(); }, 1500);
  });

  /* Five reactions use the reference's reversed visual order, clip-path reveal,
     local persistence, disabled repeat state and transient thanks label. */
  var reaction = qs('[data-reaction]');
  if (reaction && reaction.parentNode) {
    var reactionZone = document.createElement('div');
    reactionZone.className = 'alxian-reaction-zone';
    reaction.parentNode.insertBefore(reactionZone, reaction);
    reactionZone.appendChild(reaction);
    reaction.classList.add('alxian-reaction-trigger');
    reaction.setAttribute('aria-haspopup', 'true');
    reaction.setAttribute('aria-expanded', 'false');
    var reactionPanel = document.createElement('div');
    reactionPanel.className = 'alxian-reaction-panel';
    reactionPanel.setAttribute('role', 'group');
    reactionPanel.setAttribute('aria-label', langText('选择反应', 'Choose a reaction'));
    var reactionItems = [{ key: 'like', emoji: '👍', label: 'Like' }, { key: 'cheer', emoji: '👏🏻', label: 'Cheer' }, { key: 'celebrate', emoji: '🎉', label: 'Celebrate' }, { key: 'appreciate', emoji: '✨', label: 'Appreciate' }, { key: 'smile', emoji: '🙂', label: 'Smile' }];
    var reactionCounts = {}; var reacted = {};
    try { reactionCounts = JSON.parse(localStorage.getItem('alxian-reaction-counts') || '{}'); } catch (_) { reactionCounts = {}; }
    reactionItems.forEach(function (item) { reacted[item.key] = localStorage.getItem('alxian-reacted-' + item.key) === 'true'; reactionCounts[item.key] = Number(reactionCounts[item.key] || 0); });
    function reactionLabel(item) { var count = reactionCounts[item.key]; return langText(item.label + (count ? ' (' + count + ')' : ''), item.label + (count ? ' (' + count + ')' : '')); }
    function markReaction(button, item) { button.dataset.reactionKey = item.key; button.title = reactionLabel(item); button.setAttribute('aria-label', langText('反应：' + item.emoji, item.label)); if (reacted[item.key]) { button.dataset.reacted = 'true'; button.disabled = true; } }
    function showReactionThanks(item) { var thanks = document.createElement('span'); thanks.className = 'alxian-reaction-thanks'; thanks.textContent = langText('谢谢你', 'Thank you'); reactionZone.appendChild(thanks); window.setTimeout(function () { thanks.remove(); }, 1150); }
    function chooseReaction(item, button) {
      if (reacted[item.key]) return;
      reacted[item.key] = true; reactionCounts[item.key] += 1;
      try { localStorage.setItem('alxian-reacted-' + item.key, 'true'); localStorage.setItem('alxian-reaction-counts', JSON.stringify(reactionCounts)); } catch (_) {}
      button.dataset.reacted = 'true'; button.disabled = true; button.title = reactionLabel(item); button.classList.add('is-selected');
      reaction.classList.add('is-reacted'); reactionZone.classList.add('is-open'); reaction.setAttribute('aria-expanded', 'true'); showReactionThanks(item);
      window.setTimeout(function () { reaction.classList.remove('is-reacted'); }, 420);
    }
    markReaction(reaction, reactionItems[0]);
    reaction.addEventListener('click', function () { var open = reactionZone.classList.contains('is-open'); if (!open) reactionZone.classList.add('is-open'); reaction.setAttribute('aria-expanded', 'true'); chooseReaction(reactionItems[0], reaction); });
    reactionItems.slice().reverse().slice(0, 4).forEach(function (item) {
      var button = document.createElement('button'); button.type = 'button'; button.className = 'alxian-reaction-option'; button.textContent = item.emoji; markReaction(button, item);
      button.addEventListener('click', function (event) { event.stopPropagation(); chooseReaction(item, button); }); reactionPanel.appendChild(button);
    });
    /* The reference reads shared counts from its API. Static deployments may
       not expose that endpoint, so local counts remain the deterministic
       fallback while a successful response updates the accessible labels. */
    fetch('/api/reactions', { headers: { Accept: 'application/json' } }).then(function (response) { if (!response.ok) throw new Error('reaction counts unavailable'); return response.json(); }).then(function (remoteCounts) {
      reactionItems.forEach(function (item) { if (remoteCounts && Number.isFinite(Number(remoteCounts[item.key]))) reactionCounts[item.key] = Number(remoteCounts[item.key]); });
      qsa('.alxian-reaction-option, .alxian-reaction-trigger', reactionZone).forEach(function (button) { var item = reactionItems.find(function (entry) { return entry.key === button.dataset.reactionKey; }); if (item) button.title = reactionLabel(item); });
    }).catch(function () {});
    reactionZone.appendChild(reactionPanel);
    document.addEventListener('pointerdown', function (event) { if (!reactionZone.contains(event.target)) { reactionZone.classList.remove('is-open'); reaction.setAttribute('aria-expanded', 'false'); } });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape') { reactionZone.classList.remove('is-open'); reaction.setAttribute('aria-expanded', 'false'); } });
  }

  /* Draggable guitar with a click-only strum state and a tiny note feedback. */
  var guitar = qs('[data-guitar]');
  if (guitar && window.PointerEvent) {
    var dragging = false; var moved = false; var offsetX = 0; var offsetY = 0; var downX = 0; var downY = 0;
    var audioContext = null;
    function playNote() {
      try {
        audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
        var oscillator = audioContext.createOscillator(); var gain = audioContext.createGain();
        oscillator.type = 'triangle'; oscillator.frequency.value = 330 + Math.random() * 120;
        gain.gain.setValueAtTime(0.0001, audioContext.currentTime); gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.012); gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.18);
        oscillator.connect(gain); gain.connect(audioContext.destination); oscillator.start(); oscillator.stop(audioContext.currentTime + 0.2);
      } catch (_) {}
    }
    function spawnNote() {
      if (reduceMotion) return;
      var note = document.createElement('span');
      var flight = ['one', 'two', 'three'][Math.floor(Math.random() * 3)];
      note.className = 'alxian-guitar-note' + (flight === 'two' ? ' note-two' : flight === 'three' ? ' note-three' : '');
      var selectedSvg = flight === 'two' ? guitar.dataset.noteTwo : guitar.dataset.noteOne;
      var image = document.createElement('img');
      image.src = selectedSvg || guitar.dataset.noteOne || '';
      image.alt = '';
      image.draggable = false;
      note.appendChild(image);
      var box = guitar.getBoundingClientRect();
      note.style.left = Math.max(10, box.right - 42) + 'px';
      note.style.top = Math.max(10, box.top + 80) + 'px';
      root.appendChild(note); window.setTimeout(function () { note.remove(); }, 1300);
    }
    function placeGuitar() {
      if (guitar.dataset.moved === 'true') return;
      var narrow = window.innerWidth < 720;
      var left = narrow ? 14 : 24;
      var bottom = narrow ? 104 : 132;
      guitar.style.left = left + 'px';
      guitar.style.top = Math.max(10, window.innerHeight - guitar.offsetHeight - bottom) + 'px';
      guitar.style.bottom = 'auto';
    }
    window.setTimeout(placeGuitar, 0);
    window.addEventListener('resize', placeGuitar);
    guitar.setAttribute('aria-label', langText('拖动吉他角色或播放音符', 'Drag the guitar or play a note'));
    guitar.setAttribute('data-ready', 'true');
    guitar.addEventListener('pointerdown', function (event) {
      event.preventDefault(); dragging = true; moved = false; downX = event.clientX; downY = event.clientY;
      var box = guitar.getBoundingClientRect(); offsetX = event.clientX - box.left; offsetY = event.clientY - box.top;
      guitar.setPointerCapture(event.pointerId); guitar.setAttribute('data-dragging', 'false'); guitar.style.transition = 'none';
    });
    guitar.addEventListener('pointermove', function (event) {
      if (!dragging) return;
      if (!moved && Math.hypot(event.clientX - downX, event.clientY - downY) > 5) { moved = true; guitar.setAttribute('data-dragging', 'true'); }
      if (!moved) return;
      guitar.setAttribute('data-moved', 'true');
      guitar.style.left = Math.max(4, Math.min(window.innerWidth - guitar.offsetWidth - 4, event.clientX - offsetX)) + 'px';
      guitar.style.top = Math.max(55, Math.min(window.innerHeight - guitar.offsetHeight - 4, event.clientY - offsetY)) + 'px';
      guitar.style.bottom = 'auto';
    });
    function stopDrag() {
      if (!dragging) return;
      dragging = false; guitar.style.transition = ''; guitar.setAttribute('data-dragging', 'false');
      if (!moved) { guitar.classList.add('is-strummed'); playNote(); spawnNote(); window.setTimeout(function () { guitar.classList.remove('is-strummed'); }, 420); }
    }
    guitar.addEventListener('pointerup', stopDrag); guitar.addEventListener('pointercancel', stopDrag); guitar.addEventListener('lostpointercapture', stopDrag);
    guitar.addEventListener('keydown', function (event) {
      var step = event.shiftKey ? 54 : 18;
      var delta = { ArrowDown: { x: 0, y: step }, ArrowLeft: { x: -step, y: 0 }, ArrowRight: { x: step, y: 0 }, ArrowUp: { x: 0, y: -step } }[event.key];
      if (!delta) return;
      event.preventDefault();
      guitar.setAttribute('data-moved', 'true');
      var box = guitar.getBoundingClientRect();
      guitar.style.left = Math.max(10, Math.min(window.innerWidth - box.width - 10, box.left + delta.x)) + 'px';
      guitar.style.top = Math.max(10, Math.min(window.innerHeight - box.height - 10, box.top + delta.y)) + 'px';
      guitar.style.bottom = 'auto';
    });
  }

  qsa('.alxian-nav-grid a').forEach(function (link) {
    link.addEventListener('keydown', function (event) { if (event.key === 'Enter') link.classList.add('is-visited'); });
  });
}());
