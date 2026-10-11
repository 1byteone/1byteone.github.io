(function () {
  'use strict';

  var root = document.body;
  if (!root) return;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('alxian-js');

  function t(zh, en) {
    return root.dataset.lang === 'zh' ? zh : en;
  }
  var apiBase = (root.dataset.apiBase || '').replace(/\/+$/, '');
  function apiUrl(path) { return apiBase + path; }

  function readStorage(key) {
    try { return window.localStorage.getItem(key); } catch (_) { return null; }
  }

  function writeStorage(key, value) {
    try { window.localStorage.setItem(key, value); return true; } catch (_) { return false; }
  }

  function removeStorage(key) {
    try { window.localStorage.removeItem(key); } catch (_) {}
  }

  function setActive(button, selector) {
    document.querySelectorAll(selector).forEach(function (item) {
      item.classList.toggle('is-active', item === button);
    });
  }

  document.querySelectorAll('[data-filter]').forEach(function (button) {
    button.addEventListener('click', function () {
      setActive(button, '[data-filter]');
      var filter = button.getAttribute('data-filter');
      document.querySelectorAll('[data-entry-card]').forEach(function (card) {
        card.hidden = filter !== 'all' && card.dataset.featured !== 'true';
      });
    });
  });
  var entryCarousel = document.querySelector('.alxian-entry-grid.is-works');
  if (entryCarousel) {
    var carouselStep = function () { var card = entryCarousel.querySelector('[data-entry-card]'); return card ? card.getBoundingClientRect().width + 16 : Math.max(280, entryCarousel.clientWidth * .82); };
    var prevEntry = document.querySelector('[data-entry-carousel-prev]');
    var nextEntry = document.querySelector('[data-entry-carousel-next]');
    if (prevEntry) prevEntry.addEventListener('click', function () { entryCarousel.scrollBy({ left: -carouselStep(), behavior: reduceMotion ? 'auto' : 'smooth' }); });
    if (nextEntry) nextEntry.addEventListener('click', function () { entryCarousel.scrollBy({ left: carouselStep(), behavior: reduceMotion ? 'auto' : 'smooth' }); });
    entryCarousel.addEventListener('keydown', function (event) { if (event.key === 'ArrowLeft') entryCarousel.scrollBy({ left: -carouselStep(), behavior: 'smooth' }); if (event.key === 'ArrowRight') entryCarousel.scrollBy({ left: carouselStep(), behavior: 'smooth' }); });
    entryCarousel.setAttribute('tabindex', '0'); entryCarousel.setAttribute('aria-label', t('作品轮播，可使用左右方向键切换', 'Works carousel, use arrow keys to navigate'));
  }

  function setupReveals() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.alxian-reveal'));
    items.forEach(function (item, index) {
      item.style.setProperty('--alx-delay', (Math.min(index, 8) * 45) + 'ms');
    });
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (item) { item.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -9% 0px', threshold: 0.08 });
    items.forEach(function (item) { observer.observe(item); });
  }
  setupReveals();

  var query = new URLSearchParams(window.location.search).get('q');
  if (query) {
    var needle = query.toLowerCase();
    document.querySelectorAll('[data-entry-card], .alxian-resource-card').forEach(function (card) {
      card.hidden = card.textContent.toLowerCase().indexOf(needle) === -1;
    });
  }

  var resourceSearch = document.querySelector('[data-resource-search]');
  var resourceCards = document.querySelectorAll('[data-resource-card]');
  var resourceFilter = 'all';
  function updateResources() {
    var resourceNeedle = resourceSearch ? resourceSearch.value.toLowerCase().trim() : '';
    resourceCards.forEach(function (card) {
      var matchesType = resourceFilter === 'all' || card.dataset.resourceCategory === resourceFilter;
      var matchesText = !resourceNeedle || card.textContent.toLowerCase().indexOf(resourceNeedle) !== -1;
      card.hidden = !(matchesType && matchesText);
    });
  }
  document.querySelectorAll('[data-resource-filter]').forEach(function (button) {
    button.addEventListener('click', function () {
      setActive(button, '[data-resource-filter]');
      resourceFilter = button.dataset.resourceFilter;
      updateResources();
    });
  });
  if (resourceSearch) resourceSearch.addEventListener('input', updateResources);

  /* Resource parity: the reference presents its resource cards as a gentle
     orbit that can be paused for reading. The grid remains the resilient
     fallback; this enhancement is opt-in through the toolbar button. */
  var resourceGrid = document.querySelector('[data-resource-grid]');
  var resourceOrbitToggle = document.querySelector('[data-resource-orbit-toggle]');
  var resourceOrbitFrame = 0;
  var resourceOrbitStarted = 0;
  function renderResourceOrbit(now) {
    if (!resourceGrid || !resourceGrid.classList.contains('is-orbit')) { resourceOrbitFrame = 0; return; }
    var cards = Array.prototype.slice.call(resourceGrid.querySelectorAll('[data-resource-card]:not([hidden])'));
    var elapsed = (now - resourceOrbitStarted) / 1000;
    var radiusX = Math.min(310, Math.max(150, resourceGrid.clientWidth * .34));
    var radiusY = Math.min(100, Math.max(52, radiusX * .28));
    cards.forEach(function (card, index) {
      var angle = elapsed * .28 + index * (Math.PI * 2 / Math.max(cards.length, 1));
      var x = Math.cos(angle) * radiusX;
      var y = Math.sin(angle) * radiusY;
      var depth = (Math.sin(angle) + 1) / 2;
      card.style.transform = 'translate(calc(-50% + ' + x.toFixed(1) + 'px),calc(-50% + ' + y.toFixed(1) + 'px)) rotate(' + (Math.sin(angle) * 2.5).toFixed(2) + 'deg) scale(' + (.86 + depth * .14).toFixed(3) + ')';
      card.style.zIndex = String(Math.round(depth * 20));
      card.style.opacity = String(.56 + depth * .44);
    });
    resourceOrbitFrame = window.requestAnimationFrame(renderResourceOrbit);
  }
  if (resourceGrid && resourceOrbitToggle) {
    resourceOrbitToggle.addEventListener('click', function () {
      var orbiting = !resourceGrid.classList.contains('is-orbit');
      resourceGrid.classList.toggle('is-orbit', orbiting);
      resourceOrbitToggle.setAttribute('aria-pressed', String(orbiting));
      resourceOrbitToggle.textContent = orbiting ? t('暂停环绕', 'Pause orbit') : t('环绕', 'Orbit');
      if (orbiting) { resourceOrbitStarted = performance.now(); if (!resourceOrbitFrame) resourceOrbitFrame = requestAnimationFrame(renderResourceOrbit); }
      else { if (resourceOrbitFrame) cancelAnimationFrame(resourceOrbitFrame); resourceOrbitFrame = 0; resourceGrid.querySelectorAll('[data-resource-card]').forEach(function (card) { card.style.transform = ''; card.style.zIndex = ''; card.style.opacity = ''; }); }
    });
  }

  function setupFriends() {
    var list = document.querySelector('[data-friends-list]');
    var stats = document.querySelector('[data-friend-stats]');
    if (!list && !stats) return;
    fetch(apiUrl('/api/friends/stats'), { headers: { Accept: 'application/json' }, credentials: 'omit' }).then(function (response) { if (!response.ok) throw new Error('friend stats unavailable'); return response.json(); }).then(function (payload) {
      if (!stats || !payload) return;
      stats.querySelectorAll('[data-friend-stat]').forEach(function (node) { var key = node.dataset.friendStat; if (payload[key] != null) node.textContent = String(payload[key]); });
    }).catch(function () {});
    fetch(apiUrl('/api/friends'), { headers: { Accept: 'application/json' }, credentials: 'omit' }).then(function (response) { if (!response.ok) throw new Error('friends unavailable'); return response.json(); }).then(function (payload) {
      if (!list || !Array.isArray(payload) || !payload.length) return;
      list.innerHTML = '';
      payload.filter(function (item) { return !item.status || item.status === 'approved'; }).forEach(function (item, index) {
        var link = document.createElement('a'); link.className = 'alxian-friend-row alxian-reveal is-visible'; link.href = item.url || '#'; link.target = '_blank'; link.rel = 'noopener noreferrer';
        var icon = item.favicon || '/assets/alxian/icons/link.svg';
        link.innerHTML = '<span class="alxian-friend-index">' + String(index + 1).padStart(2, '0') + '</span><span class="alxian-friend-icon"><img alt=""></span><span class="alxian-friend-copy"><strong></strong><small></small></span><span class="alxian-friend-arrow">↗</span>';
        link.querySelector('img').src = icon; link.querySelector('strong').textContent = item.name || item.url; link.querySelector('small').textContent = item.description || item.url;
        link.addEventListener('click', function () { if (item.id) fetch(apiUrl('/api/friends/' + encodeURIComponent(item.id) + '/visit'), { method: 'POST', credentials: 'omit' }).catch(function () {}); });
        list.appendChild(link);
      });
    }).catch(function () {});
  }
  setupFriends();

  function setupGalleries() {
    document.querySelectorAll('[data-gallery]').forEach(function (gallery) {
      if (gallery.dataset.pagesGalleryBound === 'true') return;
      gallery.dataset.pagesGalleryBound = 'true';
      var images = Array.prototype.slice.call(gallery.querySelectorAll('img'));
      if (images.length < 2) return;

      var panel = gallery.parentNode;
      var button = panel && panel.querySelector('[data-gallery-next]');
      var index = parseInt(gallery.dataset.galleryIndex || '0', 10);
      if (isNaN(index)) index = 0;
      index = (index + images.length) % images.length;
      var touchStartX = 0;
      var touchStartY = 0;
      var touchActive = false;

      gallery.setAttribute('role', 'region');
      gallery.setAttribute('aria-roledescription', t('图库', 'gallery'));
      gallery.setAttribute('aria-label', t('个人图库，可使用左右方向键切换', 'Personal gallery, use arrow keys to switch'));
      if (gallery.tabIndex < 0) gallery.tabIndex = 0;

      function render(next) {
        index = (next + images.length) % images.length;
        gallery.dataset.galleryIndex = String(index);
        images.forEach(function (image, imageIndex) {
          var current = imageIndex === index;
          image.classList.toggle('is-current', current);
          image.setAttribute('aria-hidden', String(!current));
        });
        if (button) {
          button.innerHTML = '&#8249; &nbsp; ' + (index + 1) + ' / ' + images.length + ' &nbsp; &#8250;';
          button.setAttribute('aria-label', t('下一张图片', 'Next gallery image'));
        }
      }
      function move(delta) { render(index + delta); }

      render(index);
      if (button) {
        button.addEventListener('click', function (event) {
          event.preventDefault();
          move(1);
        });
      }
      gallery.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowRight' || event.key === 'PageDown') {
          event.preventDefault(); move(1);
        } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
          event.preventDefault(); move(-1);
        } else if (event.key === 'Home') {
          event.preventDefault(); render(0);
        } else if (event.key === 'End') {
          event.preventDefault(); render(images.length - 1);
        }
      });
      gallery.addEventListener('touchstart', function (event) {
        if (!event.touches || !event.touches.length) return;
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
        touchActive = true;
      }, { passive: true });
      gallery.addEventListener('touchend', function (event) {
        if (!touchActive || !event.changedTouches || !event.changedTouches.length) return;
        touchActive = false;
        var touch = event.changedTouches[0];
        var deltaX = touch.clientX - touchStartX;
        var deltaY = touch.clientY - touchStartY;
        if (Math.abs(deltaX) < 34 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
        event.preventDefault();
        move(deltaX < 0 ? 1 : -1);
      }, { passive: false });
    });
  }
  setupGalleries();

  var chatForm = document.querySelector('[data-chat-form]');
  var chatMessages = document.querySelector('[data-chat-messages]');
  var chatName = document.querySelector('[data-chat-name]');
  var chatRoom = 'lobby';
  function renderChatMessages(items) {
    if (!chatMessages || !Array.isArray(items)) return;
    chatMessages.innerHTML = '';
    items.slice(-100).forEach(function (item) {
      var message = document.createElement('div'); message.className = 'alxian-chat-message'; message.innerHTML = '<b></b><small></small><p></p>';
      message.querySelector('b').textContent = item.nickname || item.name || 'Guest'; message.querySelector('small').textContent = item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''; message.querySelector('p').textContent = item.content || item.message || '';
      chatMessages.appendChild(message);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  function loadChatRoom(roomId) {
    if (!chatMessages) return;
    fetch(apiUrl('/api/chat/messages?roomId=' + encodeURIComponent(roomId)), { headers: { Accept: 'application/json' }, credentials: 'omit' }).then(function (response) { if (!response.ok) throw new Error('chat API unavailable'); return response.json(); }).then(function (payload) { renderChatMessages(Array.isArray(payload) ? payload : payload.messages); }).catch(function () { chatMessages.dataset.room = roomId; });
  }
  fetch(apiUrl('/api/chat/rooms'), { headers: { Accept: 'application/json' }, credentials: 'omit' }).then(function (response) { if (!response.ok) throw new Error('rooms unavailable'); return response.json(); }).then(function (payload) {
    var rooms = Array.isArray(payload) ? payload : payload && payload.rooms;
    if (!Array.isArray(rooms)) return;
    var roomButtons = document.querySelector('.alxian-chat-rooms'); if (!roomButtons) return;
    roomButtons.innerHTML = '';
    rooms.slice(0, 6).forEach(function (room, index) { var button = document.createElement('button'); button.type = 'button'; button.dataset.chatRoom = room.id || room.slug || 'room-' + index; button.textContent = room.name || room.title || button.dataset.chatRoom; if (index === 0) button.classList.add('is-active'); roomButtons.appendChild(button); });
    roomButtons.querySelectorAll('[data-chat-room]').forEach(function (button) { button.addEventListener('click', function () { setActive(button, '[data-chat-room]'); chatRoom = button.dataset.chatRoom; loadChatRoom(chatRoom); }); });
    setActive(roomButtons.querySelector('button'), '[data-chat-room]');
    chatRoom = roomButtons.querySelector('button').dataset.chatRoom; loadChatRoom(chatRoom);
  }).catch(function () {});
  if (chatName) chatName.value = readStorage('alxian-chat-name') || '';
  if (chatName) chatName.addEventListener('change', function () {
    writeStorage('alxian-chat-name', chatName.value.trim());
  });
  document.querySelectorAll('[data-chat-room]').forEach(function (button) {
    button.addEventListener('click', function () {
      setActive(button, '[data-chat-room]');
      chatRoom = button.dataset.chatRoom;
      if (chatMessages) chatMessages.dataset.room = chatRoom;
      loadChatRoom(chatRoom);
    });
  });
  if (chatForm && chatMessages) chatForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var input = chatForm.querySelector('input[name="message"]');
    if (!input || !input.value.trim()) return;
    var messageValue = input.value.trim();
    var name = chatName && chatName.value.trim() ? chatName.value.trim() : t('访客', 'Guest');
    fetch(apiUrl('/api/chat/messages'), { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ roomId: chatRoom, nickname: name, content: messageValue }), credentials: 'omit' }).then(function (response) { if (!response.ok) throw new Error('chat send unavailable'); return response.json(); }).then(function (payload) { if (payload && payload.message) { var messages = Array.prototype.slice.call(chatMessages.querySelectorAll('.alxian-chat-message')).map(function (node) { return { nickname: node.querySelector('b').textContent, content: node.querySelector('p').textContent }; }); messages.push(payload.message); renderChatMessages(messages); } }).catch(function () {});
    var message = document.createElement('div');
    message.className = 'alxian-chat-message';
    var now = new Date();
    var time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    message.innerHTML = '<b></b><small></small><p></p>';
    message.querySelector('b').textContent = name;
    message.querySelector('small').textContent = time;
    message.querySelector('p').textContent = input.value.trim();
    chatMessages.appendChild(message);
    input.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });

  function setupComments() {
    var commentsButton = document.querySelector('[data-comments]');
    var commentPopover = document.querySelector('[data-comment-popover]');
    if (!commentsButton || !commentPopover || commentPopover.dataset.pagesCommentsBound === 'true') return;
    commentPopover.dataset.pagesCommentsBound = 'true';
    var textarea = commentPopover.querySelector('textarea');
    var sendComment = commentPopover.querySelector('[data-comment-send]');
    if (!textarea) return;
    var popoverId = commentPopover.id || 'alxian-comment-popover';
    commentPopover.id = popoverId;
    commentsButton.setAttribute('aria-controls', popoverId);
    commentsButton.setAttribute('aria-expanded', String(!commentPopover.hidden));

    var status = commentPopover.querySelector('[data-comment-status]');
    if (!status) {
      status = document.createElement('small');
      status.className = 'alxian-comment-status';
      status.setAttribute('data-comment-status', 'true');
      status.setAttribute('role', 'status');
      commentPopover.appendChild(status);
    }

    function setStatus(message, isError) {
      status.textContent = message;
      status.classList.toggle('is-error', Boolean(isError));
    }
    function setOpen(open, focus) {
      commentPopover.hidden = !open;
      commentPopover.dataset.open = String(open);
      commentsButton.setAttribute('aria-expanded', String(open));
      root.classList.toggle('alxian-comments-open', open);
      if (open && focus) window.setTimeout(function () { textarea.focus(); }, 0);
    }

    setStatus(t('输入内容会自动保存在本地', 'Your draft is saved locally while you type'));
    var draft = readStorage('alxian-comment-draft');
    if (draft) {
      textarea.value = draft;
      setStatus(t('草稿已从本地恢复', 'Draft restored from this browser'));
    }
    textarea.addEventListener('input', function () {
      var value = textarea.value;
      if (value.trim()) {
        if (writeStorage('alxian-comment-draft', value)) {
          setStatus(t('本地保存 · 草稿已更新', 'Saved locally · draft updated'));
        } else {
          setStatus(t('浏览器未允许本地保存', 'Local saving is unavailable'), true);
        }
      } else {
        removeStorage('alxian-comment-draft');
        setStatus(t('输入内容会自动保存在本地', 'Your draft is saved locally while you type'));
      }
    });
    commentsButton.addEventListener('click', function (event) {
      event.preventDefault();
      setOpen(commentPopover.hidden, true);
    });
    commentPopover.addEventListener('click', function (event) { event.stopPropagation(); });
    document.addEventListener('click', function (event) {
      if (!commentPopover.hidden && event.target !== commentsButton && !commentPopover.contains(event.target)) setOpen(false, false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !commentPopover.hidden) {
        event.preventDefault(); setOpen(false, false); commentsButton.focus();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && !commentPopover.hidden && sendComment) sendComment.click();
    });
    if (sendComment) sendComment.addEventListener('click', function () {
      var value = textarea.value.trim();
      if (!value) {
        setStatus(t('先写点内容，再发送', 'Write a note before sending'), true);
        textarea.focus();
        return;
      }
      var comments = [];
      try { comments = JSON.parse(readStorage('alxian-comments') || '[]'); } catch (_) { comments = []; }
      if (!Array.isArray(comments)) comments = [];
      comments.push({ text: value, createdAt: new Date().toISOString(), path: window.location.pathname });
      if (writeStorage('alxian-comments', JSON.stringify(comments.slice(-20)))) {
        removeStorage('alxian-comment-draft');
        textarea.value = '';
        setStatus(t('已保存到本地', 'Saved to this browser'));
      } else {
        setStatus(t('保存失败，请检查浏览器权限', 'Could not save in this browser'), true);
      }
    });
  }
  setupComments();

  function setupAnchors() {
    if (!root.classList.contains('alxian-page')) return;
    root.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        var selector = link.getAttribute('href');
        if (!selector || selector === '#') return;
        var target;
        try { target = document.querySelector(selector); } catch (_) { return; }
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        if (window.history && window.history.replaceState) window.history.replaceState(null, '', link.getAttribute('href'));
      });
    });
  }
  setupAnchors();

  function setupPageExit() {
    var leaving = false;
    root.querySelectorAll('a[href]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        if (leaving || event.defaultPrevented || event.button && event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (link.target && link.target !== '_self' || link.hasAttribute('download')) return;
        var href = link.getAttribute('href');
        if (!href || href.charAt(0) === '#' || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return;
        var destination;
        try { destination = new URL(link.href, window.location.href); } catch (_) { return; }
        if (destination.origin !== window.location.origin || destination.href === window.location.href) return;
        leaving = true;
        event.preventDefault();
        root.classList.add('is-leaving');
        root.setAttribute('data-page-transition', 'leaving');
        window.setTimeout(function () { window.location.assign(destination.href); }, reduceMotion ? 0 : 300);
      });
    });
    window.addEventListener('pageshow', function () {
      leaving = false;
      root.classList.remove('is-leaving');
      root.removeAttribute('data-page-transition');
    });
  }
  setupPageExit();
}());
