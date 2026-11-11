(function () {
  'use strict';

  function setRoleText(text) {
    var role = document.querySelector('.ed3__byline-role');
    var visual = role && role.querySelector('[data-personal-role]');
    if (!visual) return;
    if (visual.dataset.mirrorRoleText === text) return;

    var fragment = document.createDocumentFragment();
    Array.from(text).forEach(function (character) {
      var letter = document.createElement('span');
      letter.className = 'ed3__byline-letter svelte-1uha8ag';

      var strut = document.createElement('span');
      strut.className = 'ed3__byline-letter-strut svelte-1uha8ag';
      strut.textContent = character;
      strut.setAttribute('aria-hidden', 'true');

      var face = document.createElement('span');
      face.className = 'ed3__byline-letter-face svelte-1uha8ag';
      face.textContent = character;
      face.setAttribute('aria-hidden', 'true');
      face.style.visibility = 'visible';

      var alt = document.createElement('span');
      alt.className = 'ed3__byline-letter-face ed3__byline-face--alt svelte-1uha8ag';
      alt.textContent = character;
      alt.setAttribute('aria-hidden', 'true');
      alt.style.visibility = 'hidden';

      letter.append(strut, face, alt);
      fragment.appendChild(letter);
    });
    visual.replaceChildren(fragment);
    visual.dataset.mirrorRoleText = text;
  }

  function apply() {
    var english = document.documentElement.lang === 'en';
    setRoleText(english ? 'AI Application Engineer' : 'AI 应用工程师');
  }

  function boot() {
    apply();
    window.setTimeout(apply, 180);
    window.setTimeout(apply, 700);
    window.setInterval(apply, 300);
    var button = document.querySelector('.mirror-language-toggle');
    if (button) button.addEventListener('click', function () { window.setTimeout(apply, 0); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
