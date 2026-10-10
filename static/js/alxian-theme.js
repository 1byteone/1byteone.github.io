(function () {
  'use strict';

  var root = document.body;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;

  function qs(selector, scope) { return (scope || document).querySelector(selector); }
  function qsa(selector, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(selector)); }
  function langText(zh, en) { return root && root.dataset.lang === 'zh' ? zh : en; }

  /* The original loader leaves the viewport with a vertical wipe. The SVG is
     injected so every page keeps the same loader contract without duplicating
     markup in every Hugo template. */
  var loader = qs('[data-loader]');
  if (loader) {
    var loaderContent = qs('.alxian-loader-content', loader);
    if (loaderContent && !qs('.wuxian-loader', loaderContent)) {
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'wuxian-loader');
      svg.setAttribute('viewBox', '0 0 300 80');
      svg.setAttribute('aria-hidden', 'true');
      svg.innerHTML = '<defs><linearGradient id="alx-ink-gradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#1e293b"></stop><stop offset="30%" stop-color="#334155"></stop><stop offset="70%" stop-color="#475569"></stop><stop offset="100%" stop-color="#64748b"></stop></linearGradient><filter id="alx-ink-blur"><feGaussianBlur stdDeviation=".5" result="blur"></feGaussianBlur><feOffset in="blur" dx="1" dy="1" result="offset"></feOffset><feMerge><feMergeNode in="offset"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter></defs><g fill="none" stroke="url(#alx-ink-gradient)" stroke-linecap="round" stroke-linejoin="round" filter="url(#alx-ink-blur)"><g transform="translate(40,40)"><path class="wuxian-w" d="M-18-20Q-16-18-12 8Q-10 18-8 16Q-6 12-2-5Q0-8 2-5Q6 12 8 16Q10 18 12 8Q16-18 18-20" stroke-width="2.8" stroke-dasharray="140"></path></g><g transform="translate(85,40)"><path class="wuxian-u" d="M-15-15Q-16-12-15 0Q-15 12-11 16Q-7 18-3 16Q1 14 5 16Q9 18 13 16Q15 12 15 0Q16-12 15-20" stroke-width="2.6" stroke-dasharray="75"></path></g><g transform="translate(130,40)"><path class="wuxian-x1" d="M-15-18Q-10-12-5-6Q0 0 5 6Q10 12 15 18" stroke-width="3" stroke-dasharray="50 50"></path><path class="wuxian-x2" d="M15-18Q10-12 5-6Q0 0-5 6Q-10 12-15 18" stroke-width="3" stroke-dasharray="50 50"></path></g><g transform="translate(170,40)"><circle class="wuxian-i-dot" r="3" cy="-25" stroke-width="2" stroke-dasharray="18.8 18.8" fill="url(#alx-ink-gradient)"></circle><path class="wuxian-i" d="M0-15Q-1-10 0 0Q1 10 0 18" stroke-width="2.8" stroke-dasharray="35 35"></path></g><g transform="translate(210,40)"><path class="wuxian-a" d="M8 18Q9 15 8 5Q8-5 4-12Q0-16-4-14Q-8-12-12-8Q-16-4-14 2Q-12 8-8 12Q-4 16 0 14Q4 12 8 8Q9 5 8 0M8 18L8-15" stroke-width="2.7" stroke-dasharray="85 85"></path></g><g transform="translate(250,40)"><path class="wuxian-n" d="M-15 18Q-16 15-15 5Q-15-5-13-10Q-11-14-7-12Q-3-10 1-8Q5-6 7-2Q9 2 9 8Q10 15 9 18M-15 18L-15-15" stroke-width="2.6" stroke-dasharray="70 70"></path></g></g>';
      loaderContent.appendChild(svg);
    }
    var loaderDismissed = false;
    function hideLoader() {
      if (loaderDismissed) return;
      loaderDismissed = true;
      loader.classList.add('is-hidden');
      window.setTimeout(function () { loader.classList.add('is-gone'); }, reduceMotion ? 0 : 1050);
    }
    function scheduleLoader() { window.setTimeout(hideLoader, reduceMotion ? 0 : 950); }
    window.addEventListener('load', scheduleLoader, { once: true });
    if (document.readyState === 'complete') {
      scheduleLoader();
    }
  }

  /* Reference-style arrow cursor. It is disabled for touch and reduced motion. */
  if (!reduceMotion && finePointer) {
    var cursor = document.createElement('div');
    cursor.className = 'alxian-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = '<svg viewBox="0 0 14 14" focusable="false" aria-hidden="true"><path class="alxian-cursor-fill" d="M13.246 4.973c0-1.126-10.832-5.333-12.222-3.945C-.362 2.413 3.902 13.25 5.02 13.25c1.303 0 2.068-4.965 2.377-5.854c.886-.313 5.849-1.115 5.849-2.423"></path><path class="alxian-cursor-stroke" d="M13.246 4.973c0-1.126-10.832-5.333-12.222-3.945C-.362 2.413 3.902 13.25 5.02 13.25c1.303 0 2.068-4.965 2.377-5.854c.886-.313 5.849-1.115 5.849-2.423"></path></svg>';
    root.appendChild(cursor);
    root.classList.add('alxian-cursor-active');
    var cursorX = -80; var cursorY = -80; var pointerX = -80; var pointerY = -80; var cursorFrame = 0; var cursorMode = 'default';
    function setCursorMode(mode) {
      if (cursorMode === mode) return;
      cursorMode = mode;
      cursor.classList.remove('is-hover', 'is-text', 'is-drag', 'is-disabled');
      if (mode === 'interactive') cursor.classList.add('is-hover');
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
      element = target.closest('a,button,[role="button"],input[type="button"],input[type="submit"],input[type="range"],summary,select');
      return element ? 'interactive' : 'default';
    }
    function renderCursor() {
      cursorFrame = 0;
      cursorX += (pointerX - cursorX) * 0.27;
      cursorY += (pointerY - cursorY) * 0.27;
      cursor.style.transform = 'translate3d(' + cursorX + 'px,' + cursorY + 'px,0)';
      if (Math.abs(pointerX - cursorX) > 0.2 || Math.abs(pointerY - cursorY) > 0.2) cursorFrame = window.requestAnimationFrame(renderCursor);
    }
    document.addEventListener('pointermove', function (event) {
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
  if (themeButton) themeButton.addEventListener('click', function () {
    root.classList.toggle('is-dark');
    try { localStorage.setItem('alxian-theme-mode', root.classList.contains('is-dark') ? 'dark' : 'light'); } catch (_) {}
    updateThemeButton();
  });

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
      image.classList.toggle('is-current', itemIndex === galleryIndex);
      image.setAttribute('aria-hidden', itemIndex === galleryIndex ? 'false' : 'true');
    });
    if (galleryButton) galleryButton.textContent = '‹  ' + (galleryIndex + 1) + ' / ' + images.length + '  ›';
  }
  showGallery(0);
  if (galleryButton) galleryButton.addEventListener('click', function () { showGallery(galleryIndex + 1); });
  if (gallery) {
    gallery.addEventListener('click', function () {
      if (gallerySuppressClick) { gallerySuppressClick = false; return; }
      showGallery(galleryIndex + 1);
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

  /* Expandable five-choice reaction bar, matching the reference's clip-path reveal. */
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
    [['🙂', 'Smile'], ['✨', 'Sparkle'], ['🎉', 'Celebrate'], ['👏🏻', 'Applause']].forEach(function (item) {
      var button = document.createElement('button');
      button.type = 'button'; button.className = 'alxian-reaction-option'; button.textContent = item[0]; button.title = langText(item[0], item[1]); button.setAttribute('aria-label', langText('反应：' + item[0], item[1]));
      button.addEventListener('click', function () {
        qsa('.alxian-reaction-option', reactionPanel).forEach(function (option) { option.classList.remove('is-selected'); });
        button.classList.add('is-selected'); reaction.textContent = item[0]; reaction.classList.add('is-reacted');
        reactionZone.classList.add('is-open'); reaction.setAttribute('aria-expanded', 'true');
        window.setTimeout(function () { reaction.classList.remove('is-reacted'); }, 420);
      });
      reactionPanel.appendChild(button);
    });
    reactionZone.appendChild(reactionPanel);
    reaction.addEventListener('click', function () {
      var open = reactionZone.classList.toggle('is-open');
      reaction.setAttribute('aria-expanded', String(open));
    });
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
      note.textContent = ['♪', '♫', '♬'][Math.floor(Math.random() * 3)];
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
