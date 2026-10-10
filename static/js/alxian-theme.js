(function () {
  'use strict';

  var root = document.body;
  var loader = document.querySelector('[data-loader]');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.addEventListener('load', function () {
    window.setTimeout(function () { if (loader) loader.classList.add('is-hidden'); }, reduceMotion ? 0 : 480);
  });

  var heatmap = document.querySelector('[data-heatmap]');
  if (heatmap) {
    var cells = document.createDocumentFragment();
    for (var i = 0; i < 371; i += 1) {
      var cell = document.createElement('i');
      cell.title = (Math.floor(i / 7) + 1) + ' contributions';
      cells.appendChild(cell);
    }
    heatmap.appendChild(cells);
  }

  var themeButton = document.querySelector('[data-theme-toggle]');
  var savedTheme = null;
  try { savedTheme = localStorage.getItem('alxian-theme-mode'); } catch (_) {}
  if (savedTheme === 'dark') root.classList.add('is-dark');
  function updateThemeButton() {
    if (!themeButton) return;
    var dark = root.classList.contains('is-dark');
    themeButton.textContent = dark ? '☀' : '☾';
    themeButton.setAttribute('aria-pressed', String(dark));
  }
  updateThemeButton();
  if (themeButton) themeButton.addEventListener('click', function () {
    root.classList.toggle('is-dark');
    try { localStorage.setItem('alxian-theme-mode', root.classList.contains('is-dark') ? 'dark' : 'light'); } catch (_) {}
    updateThemeButton();
  });

  var gallery = document.querySelector('[data-gallery]');
  var galleryButton = document.querySelector('[data-gallery-next]');
  var galleryIndex = 0;
  function showGallery(index) {
    if (!gallery) return;
    var images = gallery.querySelectorAll('img');
    galleryIndex = (index + images.length) % images.length;
    images.forEach(function (image, itemIndex) { image.classList.toggle('is-current', itemIndex === galleryIndex); });
    if (galleryButton) galleryButton.innerHTML = '‹ &nbsp; ' + (galleryIndex + 1) + ' / ' + images.length + ' &nbsp; ›';
  }
  showGallery(0);
  if (galleryButton) galleryButton.addEventListener('click', function () { showGallery(galleryIndex + 1); });
  if (gallery) gallery.addEventListener('click', function () { showGallery(galleryIndex + 1); });

  var musicButton = document.querySelector('[data-music]');
  if (musicButton) musicButton.addEventListener('click', function () {
    var playing = musicButton.getAttribute('aria-pressed') === 'true';
    musicButton.setAttribute('aria-pressed', String(!playing));
    musicButton.textContent = playing ? '▶' : 'Ⅱ';
  });

  var commentsButton = document.querySelector('[data-comments]');
  var commentPopover = document.querySelector('[data-comment-popover]');
  if (commentsButton && commentPopover) commentsButton.addEventListener('click', function () {
    commentPopover.hidden = !commentPopover.hidden;
    if (!commentPopover.hidden) commentPopover.querySelector('textarea').focus();
  });
  var sendComment = document.querySelector('[data-comment-send]');
  if (sendComment) sendComment.addEventListener('click', function () {
    var textarea = document.querySelector('.alxian-comment-popover textarea');
    if (textarea && textarea.value.trim()) {
      textarea.value = '';
      sendComment.textContent = root.dataset.lang === 'zh' ? '已发送' : 'Sent';
      window.setTimeout(function () { sendComment.textContent = root.dataset.lang === 'zh' ? '发送' : 'Send'; }, 1500);
    }
  });
  var reaction = document.querySelector('[data-reaction]');
  if (reaction) reaction.addEventListener('click', function () {
    reaction.classList.add('is-reacted');
    reaction.textContent = '💛';
    window.setTimeout(function () { reaction.classList.remove('is-reacted'); }, 500);
  });

  var guitar = document.querySelector('[data-guitar]');
  if (guitar && window.PointerEvent) {
    var dragging = false; var offsetX = 0; var offsetY = 0;
    guitar.addEventListener('pointerdown', function (event) {
      dragging = true;
      var box = guitar.getBoundingClientRect();
      offsetX = event.clientX - box.left; offsetY = event.clientY - box.top;
      guitar.setPointerCapture(event.pointerId);
      guitar.style.transition = 'none';
    });
    guitar.addEventListener('pointermove', function (event) {
      if (!dragging) return;
      guitar.style.left = Math.max(4, Math.min(window.innerWidth - guitar.offsetWidth - 4, event.clientX - offsetX)) + 'px';
      guitar.style.top = Math.max(55, Math.min(window.innerHeight - guitar.offsetHeight - 4, event.clientY - offsetY)) + 'px';
      guitar.style.bottom = 'auto';
    });
    function stopDrag() { dragging = false; guitar.style.transition = ''; }
    guitar.addEventListener('pointerup', stopDrag); guitar.addEventListener('pointercancel', stopDrag);
  }

  document.querySelectorAll('.alxian-nav-grid a').forEach(function (link) {
    link.addEventListener('keydown', function (event) { if (event.key === 'Enter') link.classList.add('is-visited'); });
  });
}());
