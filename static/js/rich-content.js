(function () {
  'use strict';

  function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(value);
    var area = document.createElement('textarea');
    area.value = value;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    try { document.execCommand('copy'); return Promise.resolve(); }
    catch (error) { return Promise.reject(error); }
    finally { document.body.removeChild(area); }
  }

  function setupCodeCopy() {
    var chinese = document.documentElement.lang.indexOf('zh') === 0;
    document.querySelectorAll('[data-rich-code]').forEach(function (frame) {
      var button = frame.querySelector('[data-rich-code-copy]');
      var code = frame.querySelector('.rich-code-body code');
      var source = frame.querySelector('[data-rich-code-source]');
      if (!button || !code || button.dataset.bound === 'true') return;
      button.dataset.bound = 'true';
      button.addEventListener('click', function () {
        var original = button.textContent;
        copyText(source ? source.value : (code.innerText || code.textContent || '')).then(function () {
          button.textContent = chinese ? '已复制' : 'Copied';
          window.setTimeout(function () { button.textContent = original; }, 1400);
        }).catch(function () {
          button.textContent = chinese ? '复制失败' : 'Copy failed';
          window.setTimeout(function () { button.textContent = original; }, 1400);
        });
      });
    });
  }

  function setupTables() {
    document.querySelectorAll('main article table').forEach(function (table) {
      if (table.parentElement && table.parentElement.classList.contains('rich-table-wrapper')) return;
      var wrapper = document.createElement('div');
      wrapper.className = 'rich-table-wrapper';
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  }

  function setupImageLightbox() {
    if (!document.querySelector('[data-rich-image-link]')) return;
    var chinese = document.documentElement.lang.indexOf('zh') === 0;
    var dialog = document.createElement('dialog');
    dialog.className = 'rich-lightbox';
    dialog.setAttribute('aria-label', chinese ? '图片查看器' : 'Image viewer');
    dialog.innerHTML = '<span class="rich-lightbox-count" aria-live="polite"></span><button class="rich-lightbox-close" type="button" aria-label="' + (chinese ? '关闭图片' : 'Close image') + '">×</button><button class="rich-lightbox-prev" type="button" aria-label="' + (chinese ? '上一张' : 'Previous image') + '">‹</button><figure><img alt=""><figcaption></figcaption></figure><button class="rich-lightbox-next" type="button" aria-label="' + (chinese ? '下一张' : 'Next image') + '">›</button>';
    document.body.appendChild(dialog);
    var image = dialog.querySelector('img');
    var caption = dialog.querySelector('figcaption');
    var count = dialog.querySelector('.rich-lightbox-count');
    var closeButton = dialog.querySelector('.rich-lightbox-close');
    var previousButton = dialog.querySelector('.rich-lightbox-prev');
    var nextButton = dialog.querySelector('.rich-lightbox-next');
    var items = [];
    var index = 0;

    function render() {
      var item = items[index];
      if (!item) return;
      image.src = item.href;
      image.alt = item.alt;
      caption.textContent = item.caption;
      count.textContent = items.length > 1 ? (index + 1) + ' / ' + items.length : '';
      previousButton.hidden = items.length < 2;
      nextButton.hidden = items.length < 2;
    }

    function move(step) {
      if (items.length < 2) return;
      index = (index + step + items.length) % items.length;
      render();
    }

    document.addEventListener('click', function (event) {
      var link = event.target.closest && event.target.closest('[data-rich-image-link]');
      if (!link || !link.closest('article, main')) return;
      event.preventDefault();
      var gallery = link.dataset.richGallery;
      items = Array.from(document.querySelectorAll('[data-rich-image-link]'))
        .filter(function (candidate) { return candidate.dataset.richGallery === gallery; })
        .map(function (candidate) {
          var thumb = candidate.querySelector('img');
          return {
            href: candidate.href,
            alt: thumb ? thumb.alt : '',
            caption: candidate.dataset.richCaption || ''
          };
        });
      index = Math.max(0, Array.from(document.querySelectorAll('[data-rich-image-link]'))
        .filter(function (candidate) { return candidate.dataset.richGallery === gallery; }).indexOf(link));
      render();
      if (!dialog.open) dialog.showModal();
      closeButton.focus();
    });
    closeButton.addEventListener('click', function () { dialog.close(); });
    previousButton.addEventListener('click', function () { move(-1); });
    nextButton.addEventListener('click', function () { move(1); });
    dialog.addEventListener('click', function (event) { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
    });
    dialog.addEventListener('close', function () { image.removeAttribute('src'); });
  }

  function init() {
    setupCodeCopy();
    setupTables();
    setupImageLightbox();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
