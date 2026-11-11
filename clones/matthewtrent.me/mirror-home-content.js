(function () {
  'use strict';

  var articleCovers = [
    '/media/blog-library/article-covers/rag-basic-pipeline.jpg',
    '/media/blog-library/article-covers/building-ai-agents.jpg',
    '/media/blog-library/article-covers/java-high-concurrency.jpg'
  ];
  var seriesCovers = [
    '/media/blog-library/article-covers/agriculture-rag.jpg',
    '/media/blog-library/article-covers/fastapi-ai-streaming.jpg',
    '/media/blog-library/article-covers/java-high-concurrency.jpg'
  ];
  var technicalCover = '/media/blog-library/article-covers/fastapi-ai-streaming.jpg';
  var evolutionCover = '/media/misc_landing_page/project-blog-system.svg';
  var contactVisual = '/media/misc_landing_page/receipt-yang-jinsong.svg';
  var galleryFallbacks = [
    '/media/blog-library/photos/pexels/13054497-pexels.jpg',
    '/media/blog-library/photos/pexels/19569316-pexels.jpg',
    '/media/blog-library/photos/pexels/22719133-pexels.jpg',
    '/media/blog-library/photos/pexels/29724360-pexels.jpg'
  ];

  function guardImage(image, fallback) {
    if (!image || image.dataset.mirrorImageGuard) return;
    image.dataset.mirrorImageGuard = 'true';
    image.addEventListener('error', function () {
      if (image.dataset.mirrorImageFallback || !fallback) return;
      image.dataset.mirrorImageFallback = 'true';
      image.src = fallback;
    }, { once: true });
    if (image.complete && !image.naturalWidth && fallback) {
      image.dataset.mirrorImageFallback = 'true';
      image.src = fallback;
    }
  }

  function stabilizeGalleryImages() {
    var nodes = document.querySelectorAll('.polaroid-life .pdrift__image, .polaroid-life .polaroid-intro-card__image');
    nodes.forEach(function (image, index) {
      image.classList.add('mirror-gallery-image');
      image.loading = index < 12 ? 'eager' : 'lazy';
      image.decoding = 'async';
      if (index < 12) image.setAttribute('fetchpriority', 'high');
      guardImage(image, technicalCover);
    });
  }

  function normalizeLegacyGalleryAssets() {
    var life = document.querySelector('.polaroid-life');
    // Once the mirror gallery owns the cards, its renderer is the source of
    // truth. Replacing those URLs here would collapse every card to the same
    // fallback image when the captured Svelte bundle rehydrates.
    if (life && life.classList.contains('mirror-original-gallery')) return;
    var index = 0;
    document.querySelectorAll('.polaroid-life img, .polaroid-life video').forEach(function (media) {
      var src = media.getAttribute('src') || media.currentSrc || '';
      if (!/\/media\/gallery(?:-thumb)?\//i.test(src)) return;
      var replacement = galleryFallbacks[index++ % galleryFallbacks.length];
      if (media.tagName.toLowerCase() === 'video') {
        var image = document.createElement('img');
        image.className = media.className;
        image.alt = '';
        image.loading = 'lazy';
        image.decoding = 'async';
        image.src = replacement;
        media.replaceWith(image);
        guardImage(image, technicalCover);
      } else if (media.getAttribute('src') !== replacement) {
        media.src = replacement;
        media.removeAttribute('srcset');
        media.removeAttribute('data-src');
        guardImage(media, technicalCover);
      }
    });
    document.querySelectorAll('video[src*="beanie-boomerang"], source[src*="beanie-boomerang"]').forEach(function (node) {
      var parent = node.closest('video');
      if (parent) parent.remove(); else node.remove();
    });
  }

  function removeNonHeroPortraits() {
    document.querySelectorAll('img').forEach(function (image) {
      var src = image.getAttribute('src') || '';
      if (image.classList.contains('idx__mark')) {
        if (/portrait-yang-jinsong|favicon/i.test(src)) image.src = 'media/misc_landing_page/neutral-mark.svg';
        return;
      }
      if (image.closest('.ed3__hero-portrait')) return;
      if (/portrait-yang-jinsong-clean/i.test(src)) {
        image.src = evolutionCover;
        image.alt = '中文博客第一版：工程记录与技术笔记';
        return;
      }
      if (/portrait-yang-jinsong|developer-profile/i.test(src)) {
        image.src = technicalCover;
        image.alt = '技术工程实践封面';
      }
    });
  }

  function stabilizeSectionImages() {
    document.querySelectorAll('.wk__img, .ed3-evo-eras__img, .rcp__setup-img').forEach(function (image) {
      guardImage(image, technicalCover);
    });
    document.querySelectorAll('.tech-icons__icon').forEach(function (image) {
      guardImage(image, '/media/misc_landing_page/neutral-mark.svg');
    });
  }

  function applyRow(row, src, label) {
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
    if (image.getAttribute('src') !== src) image.src = src;
    image.removeAttribute('srcset');
    image.removeAttribute('data-src');
    image.loading = 'eager';
    image.decoding = 'async';
    image.setAttribute('fetchpriority', 'high');
    guardImage(image, technicalCover);
    image.alt = label + '文章封面';
  }

  function apply() {
    removeNonHeroPortraits();
    normalizeLegacyGalleryAssets();
    stabilizeSectionImages();
    stabilizeGalleryImages();
    var contactImage = document.querySelector('.rcp__setup-img');
    if (contactImage) {
      if (contactImage.getAttribute('src') !== contactVisual) contactImage.src = contactVisual;
      contactImage.removeAttribute('srcset');
      contactImage.alt = document.documentElement.dataset.mirrorLanguage === 'en' ? 'A local engineering contact receipt for Yang Jinsong' : '杨劲松的工程联系回执';
    }
    var articleList = document.querySelector('.ed3-acc[aria-label="文章列表"]');
    if (articleList) {
      articleList.querySelectorAll('li[data-entry-id]').forEach(function (row, index) {
        applyRow(row, articleCovers[index % articleCovers.length], '技术');
      });
    }
    var seriesList = document.querySelector('.ed3-acc[aria-label="Series"]');
    if (seriesList) {
      seriesList.querySelectorAll('li[data-entry-id]').forEach(function (row, index) {
        applyRow(row, seriesCovers[index % seriesCovers.length], '专题');
      });
    }
  }

  function boot() {
    apply();
    [180, 500, 1000, 2000, 3600, 5200, 7600].forEach(function (delay) { window.setTimeout(apply, delay); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
