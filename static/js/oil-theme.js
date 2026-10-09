(() => {
  const tabs = [...document.querySelectorAll('.work-tab')];
  const panels = [...document.querySelectorAll('.work-panel')];
  const validPanels = new Set(tabs.map((tab) => tab.dataset.panel));
  const setPanel = (name, moveFocus = false, updateHash = true) => {
    if (!validPanels.has(name)) name = 'projects';
    tabs.forEach((tab) => {
      const active = tab.dataset.panel === name;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && moveFocus) tab.focus();
    });
    panels.forEach((panel) => {
      const active = panel.id === `panel-${name}`;
      panel.hidden = !active;
      panel.classList.toggle('is-visible', active);
    });
    if (updateHash) {
      const nextHash = `#${name}`;
      if (window.location.hash !== nextHash) history.replaceState(null, '', nextHash);
    }
    observeReveals();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => setPanel(tab.dataset.panel, false, true));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      setPanel(tabs[next].dataset.panel, true, true);
    });
  });

  let revealObserver;
  const panelFromHash = () => {
    const hash = window.location.hash.slice(1).toLowerCase();
    setPanel(validPanels.has(hash) ? hash : 'projects', false, false);
  };
  panelFromHash();
  window.addEventListener('hashchange', panelFromHash);

  const progressBar = document.getElementById('progress-bar');
  const progressValue = document.getElementById('progress-value');
  let scrollPending = false;
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percent = max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0;
    progressBar.style.height = `${percent}%`;
    progressValue.textContent = String(percent).padStart(2, '0');
    updateRollBands();
    scrollPending = false;
  };
  const smoothStep = (value) => {
    const t = Math.max(0, Math.min(1, value));
    return t * t * (3 - 2 * t);
  };
  const updateRollBands = () => {
    const viewport = window.innerHeight;
    document.querySelectorAll('.card-hitbox.is-scroll-active').forEach((item) => {
      const rect = item.getBoundingClientRect();
      const local = Math.max(0, Math.min(1, (viewport - rect.top) / Math.max(1, viewport + rect.height)));
      const enter = smoothStep((.3 - local) / .3);
      const leave = smoothStep((local - .7) / .3);
      item.style.setProperty('--roll-origin-y', enter > 0 ? '4%' : leave > 0 ? '96%' : '50%');
      item.style.setProperty('--roll-angle', `${(-14 * enter + 28 * leave).toFixed(2)}deg`);
      item.style.setProperty('--roll-y', `${(6 * enter - 10 * leave).toFixed(1)}px`);
      item.style.setProperty('--roll-opacity', `${(1 - .1 * enter - .14 * leave).toFixed(3)}`);
    });
  };
  window.addEventListener('scroll', () => {
    if (!scrollPending) {
      scrollPending = true;
      requestAnimationFrame(updateProgress);
    }
  }, { passive: true });
  updateProgress();

  function observeReveals() {
    revealObserver?.disconnect();
    const active = document.querySelectorAll('.work-panel.is-visible .reveal');
    if (!('IntersectionObserver' in window)) {
      active.forEach((node) => {
        node.classList.add('is-in');
        if (node.classList.contains('card-hitbox')) node.classList.add('is-scroll-active');
        if (node.classList.contains('card-hitbox')) node.querySelector('.project-card')?.setAttribute('data-demo-active', 'true');
      });
      return;
    }
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const node = entry.target;
        if (entry.isIntersecting) {
          node.classList.add('is-in');
          if (node.classList.contains('card-hitbox')) node.classList.add('is-scroll-active');
          if (node.classList.contains('card-hitbox')) node.querySelector('.project-card')?.setAttribute('data-demo-active', 'true');
        } else if (node.classList.contains('card-hitbox')) {
          node.classList.remove('is-scroll-active');
          node.querySelector('.project-card')?.setAttribute('data-demo-active', 'false');
        }
      });
    }, { threshold: 0.12 });
    active.forEach((node) => {
      if (node.classList.contains('card-hitbox') && !node.classList.contains('is-in')) node.querySelector('.project-card')?.setAttribute('data-demo-active', 'false');
      revealObserver.observe(node);
    });
  }
  observeReveals();

  const copyButton = document.querySelector('.copy-email');
  const toast = document.getElementById('toast');
  let toastTimer;
  copyButton?.addEventListener('click', async () => {
    const email = copyButton.dataset.copy;
    try {
      await navigator.clipboard.writeText(email);
      toast.textContent = document.documentElement.lang.startsWith('zh') ? '邮箱已复制' : 'Email copied';
      toast.classList.add('is-on');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('is-on'), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  });

  const springButton = document.querySelector('.demo-spring-button');
  const blurButton = document.querySelector('.demo-blur-button');
  const blurScene = document.querySelector('.blur-demo-scene');
  if (blurButton?.getAttribute('aria-pressed') === 'true') blurScene?.classList.add('is-blurred');
  blurButton?.addEventListener('click', () => {
    const isBlurred = blurButton.getAttribute('aria-pressed') !== 'true';
    blurButton.setAttribute('aria-pressed', String(isBlurred));
    blurButton.textContent = isBlurred ? 'blur: on' : 'blur: off';
    blurScene?.classList.toggle('is-blurred', isBlurred);
  });

  const interactionSlides = [...document.querySelectorAll('.interaction-slide')];
  const interactionDots = [...document.querySelectorAll('.interaction-dot')];
  const interactionCounter = document.querySelector('.interaction-counter b');
  const interactionPrev = document.querySelector('.interaction-prev');
  const interactionNext = document.querySelector('.interaction-next');
  const interactionLab = document.querySelector('.interaction-lab');
  let interactionIndex = 0;
  let interactionTimer;
  let interactionVisible = false;
  let autoResumeAt = 0;
  const setInteraction = (nextIndex, manual = false) => {
    if (!interactionSlides.length) return;
    interactionIndex = (nextIndex % interactionSlides.length + interactionSlides.length) % interactionSlides.length;
    const track = document.querySelector('.interaction-track');
    if (track) track.style.transform = `translateX(-${interactionIndex * 100}%)`;
    interactionSlides.forEach((slide, index) => slide.classList.toggle('is-active', index === interactionIndex));
    interactionDots.forEach((dot, index) => dot.classList.toggle('is-active', index === interactionIndex));
    if (interactionCounter) interactionCounter.textContent = String(interactionIndex + 1).padStart(2, '0');
    if (manual) autoResumeAt = Date.now() + 8000;
  };
  interactionPrev?.addEventListener('click', () => setInteraction(interactionIndex - 1, true));
  interactionNext?.addEventListener('click', () => setInteraction(interactionIndex + 1, true));
  interactionDots.forEach((dot) => dot.addEventListener('click', () => setInteraction(Number(dot.dataset.demoIndex), true)));
  setInteraction(0);
  if (interactionLab && 'IntersectionObserver' in window) {
    const interactionObserver = new IntersectionObserver(([entry]) => { interactionVisible = entry.isIntersecting; }, { threshold: 0.15 });
    interactionObserver.observe(interactionLab);
  } else {
    interactionVisible = Boolean(interactionLab);
  }
  interactionTimer = setInterval(() => {
    if (interactionVisible && !document.hidden && Date.now() >= autoResumeAt) setInteraction(interactionIndex + 1);
  }, 3200);

  const springTrack = document.querySelector('.spring-track');
  const springBall = document.querySelector('.spring-ball');
  const replaySpring = () => {
    if (springBall) {
      springBall.style.animation = 'none';
      void springBall.offsetWidth;
      springBall.style.animation = '';
    }
  };
  springTrack?.addEventListener('click', replaySpring);
  springTrack?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); replaySpring(); }
  });
  springButton?.addEventListener('click', replaySpring);

  const cursor = document.querySelector('.cursor-fx');
  const finePointer = matchMedia('(pointer:fine)').matches && matchMedia('(min-width: 761px)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (cursor && finePointer) {
    document.documentElement.classList.add('has-cursor-fx');
    let pointerReady = false;
    let isText = false;
    let isLink = false;
    const moveCursor = (event) => {
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      if (!pointerReady) { pointerReady = true; cursor.classList.add('on'); }
    };
    const setCursorMode = (target) => {
      if (!(target instanceof Element)) return;
      const nextText = Boolean(target.closest('input, textarea, [contenteditable="true"]'));
      const nextLink = !nextText && Boolean(target.closest('a, button, [role="button"], select, label, summary'));
      if (nextText !== isText || nextLink !== isLink) {
        isText = nextText;
        isLink = nextLink;
        cursor.classList.toggle('is-text', isText);
        cursor.classList.toggle('is-link', isLink);
      }
    };
    const hideCursor = () => { pointerReady = false; isText = false; isLink = false; cursor.classList.remove('on', 'is-text', 'is-link'); };
    window.addEventListener('pointermove', moveCursor, { passive: true });
    window.addEventListener('pointerover', (event) => setCursorMode(event.target), { passive: true });
    document.documentElement.addEventListener('mouseleave', hideCursor);
  }

  // Oil's source motion: pupils ease toward the pointer and the dog atlas
  // follows the pointer angle through a critically damped spring.
  const hero = document.querySelector('.hero');
  const illo = document.querySelector('.hero-illo');
  const dogSprite = document.querySelector('.hero-dog-sprite');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heroFinePointer = matchMedia('(pointer: fine)').matches;
  if (hero && illo && dogSprite && heroFinePointer && !reducedMotion) {
    const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const wrap240 = (value) => ((value % 240) + 240) % 240;
    const shortest = (from, to) => {
      let delta = wrap240(to) - wrap240(from);
      if (delta > 120) delta -= 240;
      if (delta < -120) delta += 240;
      return delta;
    };
    const springStep = (value, target, velocity, response, maxSpeed, dt) => {
      const omega = 2 / Math.max(0.0001, response);
      const step = omega * dt;
      const factor = 1 / (1 + step + .48 * step * step + .235 * step * step * step);
      const delta = clamp(value - target, -maxSpeed * response, maxSpeed * response);
      const acceleration = (velocity + omega * delta) * dt;
      const next = value - delta + (delta + acceleration) * factor;
      return ((target - value > 0) === (next > target)) ? [target, 0] : [next, (velocity - omega * acceleration) * factor];
    };
    let pointerX = 0;
    let pointerY = 0;
    let eyeTargetX = 0;
    let eyeTargetY = 0;
    let eyeX = 0;
    let eyeY = 0;
    let dogTarget = 157;
    let dogFrame = 157;
    let dogVelocity = 0;
    let previousTime = performance.now();
    let motionRaf = 0;
    const renderMotion = (now) => {
      motionRaf = 0;
      const dt = Math.min((now - previousTime) / 1000, 1 / 30);
      previousTime = now;
      eyeX += (eyeTargetX - eyeX) * .14;
      eyeY += (eyeTargetY - eyeY) * .14;
      [dogFrame, dogVelocity] = springStep(dogFrame, dogTarget, dogVelocity, .11, 460, dt);
      illo.style.setProperty('--eye-x', `${eyeX.toFixed(2)}px`);
      illo.style.setProperty('--eye-y', `${eyeY.toFixed(2)}px`);
      const frame = Math.round(wrap240(dogFrame));
      dogSprite.style.backgroundPosition = `${(frame % 16) / 15 * 100}% ${Math.floor(frame / 16) / 14 * 100}%`;
      const still = Math.abs(eyeTargetX - eyeX) < .02 && Math.abs(eyeTargetY - eyeY) < .02 && Math.abs(shortest(dogFrame, dogTarget)) < .03;
      if (!still && !document.hidden) motionRaf = requestAnimationFrame(renderMotion);
    };
    const scheduleMotion = () => { if (!motionRaf && !document.hidden) motionRaf = requestAnimationFrame(renderMotion); };
    const onPointerMove = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      const bounds = illo.getBoundingClientRect();
      eyeTargetX = 3.2 * clamp(2 * ((pointerX - bounds.left) / bounds.width) - 1, -1, 1);
      eyeTargetY = 2.4 * clamp(2 * ((pointerY - bounds.top) / bounds.height) - 1, -1, 1);
      const angle = (Math.atan2(pointerY - (bounds.top + bounds.height * .71), pointerX - (bounds.left + bounds.width * .62)) + 3 * Math.PI / 4 + Math.PI * 2) % (Math.PI * 2);
      dogTarget = 157 + shortest(157, angle / (Math.PI * 2) * 240);
      scheduleMotion();
    };
    const onPointerLeave = () => { eyeTargetX = 0; eyeTargetY = 0; dogTarget = 157; scheduleMotion(); };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onPointerLeave, { passive: true });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) { previousTime = performance.now(); scheduleMotion(); } });
    scheduleMotion();
  }

  // The reference page gives long-form cards a small perspective roll as they
  // enter and leave the viewport. It is driven from viewport position rather
  // than a one-shot reveal class, so scrolling back reverses the motion.
  const rollNodes = [...document.querySelectorAll('.hero, .tabs-wrap, .card-hitbox, .about-intro, .contact-panel, .site-footer')];
  if (rollNodes.length && !reducedMotion) {
    const clampRoll = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const smoothstep = (value) => value * value * (3 - 2 * value);
    const active = new Set();
    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting ? active.add(entry.target) : active.delete(entry.target)), { rootMargin: '100% 0px 100% 0px' })
      : null;
    rollNodes.forEach((node) => { node.classList.add('roll-band'); observer?.observe(node); active.add(node); });
    let rollRaf = 0;
    const updateRoll = () => {
      rollRaf = 0;
      active.forEach((node) => {
        const rect = node.getBoundingClientRect();
        const local = clampRoll((window.innerHeight - rect.top) / Math.max(1, window.innerHeight + rect.height));
        const entering = smoothstep(clampRoll((.3 - local) / .3));
        const leaving = smoothstep(clampRoll((local - .7) / .3));
        node.style.setProperty('--roll-origin-y', entering ? '4%' : leaving ? '96%' : '50%');
        node.style.setProperty('--roll-angle', `${(-14 * entering + 28 * leaving).toFixed(2)}deg`);
        node.style.setProperty('--roll-angle-mobile', `${(-9 * entering + 18 * leaving).toFixed(2)}deg`);
        node.style.setProperty('--roll-y', `${(6 * entering - 10 * leaving).toFixed(1)}px`);
        node.style.setProperty('--roll-opacity', (1 - .1 * entering - .14 * leaving).toFixed(3));
      });
    };
    const scheduleRoll = () => { if (!rollRaf) rollRaf = requestAnimationFrame(updateRoll); };
    window.addEventListener('scroll', scheduleRoll, { passive: true });
    window.addEventListener('resize', scheduleRoll, { passive: true });
    scheduleRoll();
  }
})();
