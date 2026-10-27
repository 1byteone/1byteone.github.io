(function () {
  'use strict';

  function copyCodeBlocks() {
    document.querySelectorAll('.paper-article-body pre').forEach(function (pre) {
      if (pre.parentElement.classList.contains('paper-code-wrap')) return;
      var wrapper = document.createElement('div');
      wrapper.className = 'paper-code-wrap';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      var button = document.createElement('button');
      button.className = 'code-copy';
      button.type = 'button';
      button.textContent = document.documentElement.lang.indexOf('zh') === 0 ? '复制' : 'Copy';
      button.addEventListener('click', function () {
        var code = pre.querySelector('code');
        var value = code ? code.innerText : pre.innerText;
        var done = document.documentElement.lang.indexOf('zh') === 0 ? '已复制' : 'Copied';
        var failed = document.documentElement.lang.indexOf('zh') === 0 ? '复制失败' : 'Copy failed';
        var restore = document.documentElement.lang.indexOf('zh') === 0 ? '复制' : 'Copy';
        var finish = function (label) {
          button.textContent = label;
          window.setTimeout(function () { button.textContent = restore; }, 1600);
        };
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(value).then(function () { finish(done); }).catch(function () { finish(failed); });
          return;
        }
        var textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try { document.execCommand('copy'); finish(done); } catch (error) { finish(failed); }
        document.body.removeChild(textarea);
      });
      wrapper.appendChild(button);
    });
  }

  function setupSearch() {
    var input = document.querySelector('[data-note-search]');
    if (!input) return;
    var items = Array.prototype.slice.call(document.querySelectorAll('[data-note-item]'));
    var count = document.querySelector('[data-search-count]');
    var empty = document.querySelector('[data-search-empty]');
    var languageIsChinese = document.documentElement.lang.indexOf('zh') === 0;
    var update = function () {
      var query = input.value.trim().toLowerCase();
      var visible = 0;
      items.forEach(function (item) {
        var matches = !query || (item.getAttribute('data-search') || '').indexOf(query) !== -1;
        item.hidden = !matches;
        if (matches) visible += 1;
      });
      if (count) count.textContent = visible + (languageIsChinese ? ' 篇' : (visible === 1 ? ' note' : ' notes'));
      if (empty) empty.hidden = visible !== 0;
    };
    input.addEventListener('input', update);
  }

  function setupThemeToggle() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-theme-toggle]'));
    if (!buttons.length) return;
    var root = document.documentElement;
    var key = 'yoyo-color-mode';
    var stored = null;
    try { stored = window.localStorage.getItem(key); } catch (error) { stored = null; }
    var initial = stored || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var chinese = root.lang.indexOf('zh') === 0;
    var update = function (mode) {
      root.setAttribute('data-color-mode', mode);
      buttons.forEach(function (button) {
        var isDark = mode === 'dark';
        button.setAttribute('aria-pressed', String(isDark));
        var label = button.querySelector('[data-theme-label]');
        if (label) label.textContent = isDark ? (chinese ? '浅色' : 'Light') : (chinese ? '深色' : 'Dark');
      });
    };
    update(initial);
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var next = root.getAttribute('data-color-mode') === 'dark' ? 'light' : 'dark';
        update(next);
        try { window.localStorage.setItem(key, next); } catch (error) { /* storage may be disabled */ }
      });
    });
  }

  function setupReadingProgress() {
    var progress = document.querySelector('[data-reading-progress]');
    var article = document.querySelector('[data-reading-article]');
    if (!progress || !article) return;
    var update = function () {
      var top = article.getBoundingClientRect().top + window.scrollY;
      var distance = Math.max(article.offsetHeight - window.innerHeight, 1);
      var value = Math.min(Math.max((window.scrollY - top) / distance, 0), 1);
      progress.style.transform = 'scaleX(' + value + ')';
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  function setupBackToTop() {
    document.querySelectorAll('[data-scroll-top]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    copyCodeBlocks();
    setupSearch();
    setupThemeToggle();
    setupReadingProgress();
    setupBackToTop();
  });
}());
