(function () {
  'use strict';
  var root = document.body;
  document.querySelectorAll('[data-filter]').forEach(function (button) {
    button.addEventListener('click', function () {
      document.querySelectorAll('[data-filter]').forEach(function (item) { item.classList.remove('is-active'); });
      button.classList.add('is-active');
      var filter = button.getAttribute('data-filter');
      document.querySelectorAll('[data-entry-card]').forEach(function (card) {
        card.hidden = filter !== 'all' && card.dataset.featured !== 'true';
      });
    });
  });
  document.querySelectorAll('.alxian-reveal').forEach(function (item, index) {
    item.style.setProperty('--alx-delay', (Math.min(index, 8) * 45) + 'ms');
  });
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
    var needle = resourceSearch ? resourceSearch.value.toLowerCase().trim() : '';
    resourceCards.forEach(function (card) {
      var matchesType = resourceFilter === 'all' || card.dataset.resourceCategory === resourceFilter;
      var matchesText = !needle || card.textContent.toLowerCase().indexOf(needle) !== -1;
      card.hidden = !(matchesType && matchesText);
    });
  }
  document.querySelectorAll('[data-resource-filter]').forEach(function (button) {
    button.addEventListener('click', function () {
      document.querySelectorAll('[data-resource-filter]').forEach(function (item) { item.classList.remove('is-active'); });
      button.classList.add('is-active'); resourceFilter = button.dataset.resourceFilter; updateResources();
    });
  });
  if (resourceSearch) resourceSearch.addEventListener('input', updateResources);
  var chatForm = document.querySelector('[data-chat-form]');
  var chatMessages = document.querySelector('[data-chat-messages]');
  var chatName = document.querySelector('[data-chat-name]');
  var chatRoom = 'lobby';
  try { if (chatName) chatName.value = localStorage.getItem('alxian-chat-name') || ''; } catch (_) {}
  if (chatName) chatName.addEventListener('change', function () { try { localStorage.setItem('alxian-chat-name', chatName.value.trim()); } catch (_) {} });
  document.querySelectorAll('[data-chat-room]').forEach(function (button) {
    button.addEventListener('click', function () {
      document.querySelectorAll('[data-chat-room]').forEach(function (item) { item.classList.remove('is-active'); });
      button.classList.add('is-active'); chatRoom = button.dataset.chatRoom;
      if (chatMessages) chatMessages.dataset.room = chatRoom;
    });
  });
  if (chatForm && chatMessages) chatForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var input = chatForm.querySelector('input[name="message"]');
    if (!input || !input.value.trim()) return;
    var message = document.createElement('div'); message.className = 'alxian-chat-message';
    var name = chatName && chatName.value.trim() ? chatName.value.trim() : (root.dataset.lang === 'zh' ? '访客' : 'Guest');
    var now = new Date(); var time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    message.innerHTML = '<b></b><small></small><p></p>'; message.querySelector('b').textContent = name; message.querySelector('small').textContent = time; message.querySelector('p').textContent = input.value.trim();
    chatMessages.appendChild(message); input.value = ''; chatMessages.scrollTop = chatMessages.scrollHeight;
  });
  if (root.classList.contains('alxian-page')) {
    root.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        var target = document.querySelector(link.getAttribute('href'));
        if (target) { event.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      });
    });
  }
}());
