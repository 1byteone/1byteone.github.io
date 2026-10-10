(function () {
  'use strict';

  var root = document.body;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;

  function qs(selector, scope) { return (scope || document).querySelector(selector); }
  function qsa(selector, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(selector)); }
  function langText(zh, en) { return root && root.dataset.lang === 'zh' ? zh : en; }

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

  var heatmap = qs('[data-heatmap]');
  if (heatmap && !heatmap.children.length) {
    var cells = document.createDocumentFragment();
    for (var i = 0; i < 371; i += 1) {
      var cell = document.createElement('i');
      cell.title = (Math.floor(i / 7) + 1) + ' contributions';
      cells.appendChild(cell);
    }
    heatmap.appendChild(cells);
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
    if (galleryButton) galleryButton.textContent = '‹  ' + (galleryIndex + 1) + ' / ' + images.length + '  ›';
  }
  showGallery(0);
  if (galleryButton) galleryButton.addEventListener('click', function () { showGallery(galleryIndex + 1); });
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

  /* Music card supports a real source when one is provided and a deterministic
     visual demo when the static theme has no audio asset. */
  var musicButton = qs('[data-music]');
  if (musicButton) {
    var track = musicButton.closest ? musicButton.closest('.alxian-track') : null;
    var progress = track && qs('.alxian-progress i', track);
    var timeWrap = track && qs('.alxian-track div > span', track);
    var currentNode = timeWrap && timeWrap.firstChild;
    var totalNode = timeWrap && qs('b', timeWrap);
    var audio = musicButton.dataset.audioSrc ? new Audio(musicButton.dataset.audioSrc) : null;
    var musicTimer = null; var elapsed = 0; var duration = 224;
    function formatTime(seconds) { var value = Math.max(0, Math.floor(seconds)); return String(Math.floor(value / 60)).padStart(2, '0') + ':' + String(value % 60).padStart(2, '0'); }
    function updateMusic(current, total) {
      elapsed = current; duration = total || duration;
      if (progress) progress.style.width = Math.min(100, (elapsed / duration) * 100) + '%';
      if (currentNode) currentNode.nodeValue = formatTime(elapsed) + ' ';
      if (totalNode) totalNode.textContent = formatTime(duration);
    }
    function setMusicState(playing) {
      musicButton.setAttribute('aria-pressed', String(playing));
      musicButton.dataset.playing = String(playing);
      musicButton.textContent = playing ? 'Ⅱ' : '▶';
      musicButton.setAttribute('aria-label', playing ? langText('暂停音乐', 'Pause music') : langText('播放音乐', 'Play music'));
      if (track) track.classList.toggle('is-playing', playing);
    }
    function stopMusic() {
      if (musicTimer) { window.clearInterval(musicTimer); musicTimer = null; }
      if (audio) audio.pause();
      setMusicState(false);
    }
    if (audio) {
      audio.addEventListener('loadedmetadata', function () { duration = audio.duration || duration; updateMusic(0, duration); });
      audio.addEventListener('timeupdate', function () { updateMusic(audio.currentTime, audio.duration || duration); });
      audio.addEventListener('ended', function () { updateMusic(0, duration); stopMusic(); });
    }
    updateMusic(0, duration);
    musicButton.addEventListener('click', function () {
      var playing = musicButton.getAttribute('aria-pressed') === 'true';
      if (playing) { stopMusic(); return; }
      setMusicState(true);
      if (audio) {
        audio.play().catch(function () { stopMusic(); });
      } else {
        musicTimer = window.setInterval(function () {
          elapsed += 1;
          if (elapsed >= duration) { updateMusic(0, duration); stopMusic(); } else updateMusic(elapsed, duration);
        }, 1000);
      }
    });
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
