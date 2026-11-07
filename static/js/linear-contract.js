(() => {
  'use strict';
  const body = document.body;
  if (!body?.classList.contains('aps-home')) return;
  const root = document.documentElement;
  const zh = (root.lang || '').toLowerCase().startsWith('zh');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const announce = (message) => {
    const node = document.querySelector('[data-linear-announcer]');
    if (node) node.textContent = message;
  };

  // Product/Resources follow the same hover-intent and keyboard contract as a
  // desktop mega menu: one open panel, delayed close, Escape restoration.
  const menuRoots = Array.from(document.querySelectorAll('[data-linear-menu-root]'));
  let closeTimer = 0;
  const hideTimers = new WeakMap();
  const closeMenus = (restore = false) => {
    window.clearTimeout(closeTimer);
    let lastOpenTrigger = null;
    menuRoots.forEach((rootNode) => {
      const trigger = rootNode.querySelector('[data-linear-menu-trigger]');
      const panel = rootNode.querySelector('[data-linear-menu-panel]');
      if (!trigger || !panel) return;
      if (trigger.getAttribute('aria-expanded') === 'true') lastOpenTrigger = trigger;
      trigger.setAttribute('aria-expanded', 'false');
      panel.classList.remove('is-open');
      window.clearTimeout(hideTimers.get(panel));
      hideTimers.set(panel, window.setTimeout(() => { panel.hidden = true; }, 150));
    });
    if (restore) lastOpenTrigger?.focus();
  };
  const openMenu = (rootNode) => {
    window.clearTimeout(closeTimer);
    menuRoots.forEach((other) => {
      if (other !== rootNode) {
        const otherTrigger = other.querySelector('[data-linear-menu-trigger]');
        const otherPanel = other.querySelector('[data-linear-menu-panel]');
        otherTrigger?.setAttribute('aria-expanded', 'false');
        if (otherPanel) { otherPanel.classList.remove('is-open'); otherPanel.hidden = true; }
      }
    });
    const trigger = rootNode.querySelector('[data-linear-menu-trigger]');
    const panel = rootNode.querySelector('[data-linear-menu-panel]');
    if (!trigger || !panel) return;
    window.clearTimeout(hideTimers.get(panel));
    trigger.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add('is-open'));
  };
  menuRoots.forEach((rootNode) => {
    const trigger = rootNode.querySelector('[data-linear-menu-trigger]');
    rootNode.addEventListener('pointerenter', () => { closeTimer = window.setTimeout(() => openMenu(rootNode), 90); });
    rootNode.addEventListener('pointerleave', () => { closeTimer = window.setTimeout(() => closeMenus(), 220); });
    trigger?.addEventListener('click', () => {
      if (trigger.getAttribute('aria-expanded') === 'true') closeMenus();
      else openMenu(rootNode);
    });
    trigger?.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openMenu(rootNode);
        rootNode.querySelector('[data-linear-menu-panel] a')?.focus();
      }
    });
  });
  document.addEventListener('pointerdown', (event) => {
    if (!event.target.closest('[data-linear-menu-root]')) closeMenus();
  });

  const stage = document.querySelector('[data-linear-stage-wrap]');
  let frame = 0;
  let stageVisible = true;
  const updateStage = () => {
    frame = 0;
    if (!stage || reduced.matches) { stage?.style.setProperty('--linear-stage-progress', '1'); return; }
    if (!stageVisible) return;
    const rect = stage.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height * .68)));
    stage.style.setProperty('--linear-stage-progress', progress.toFixed(3));
  };
  const scheduleStage = () => { if (stageVisible && !frame) frame = requestAnimationFrame(updateStage); };
  window.addEventListener('scroll', scheduleStage, { passive: true });
  window.addEventListener('resize', scheduleStage, { passive: true });
  reduced.addEventListener?.('change', scheduleStage);
  if (stage && 'IntersectionObserver' in window) {
    const stageObserver = new IntersectionObserver((entries) => {
      stageVisible = entries.some((entry) => entry.isIntersecting);
      if (stageVisible) scheduleStage();
    }, { rootMargin: '220px 0px' });
    stageObserver.observe(stage);
  }
  updateStage();

  const reveals = Array.from(document.querySelectorAll('[data-linear-reveal]'));
  const reveal = () => reveals.forEach((item, index) => window.setTimeout(() => item.classList.add('is-visible'), reduced.matches ? 0 : index * 85));
  if (reduced.matches || !('IntersectionObserver' in window)) reveal();
  else {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); instance.unobserve(entry.target); } });
    }, { threshold: .1 });
    reveals.forEach((item) => observer.observe(item));
  }

  const issues = [
    { id: 'APS-211', label: zh ? '让 Agent 失败时仍可解释' : 'Make agent failures explainable', title: zh ? '让 Agent 失败时仍可解释' : 'Make agent failures explainable', copy: zh ? '记录状态、工具调用和恢复动作，让每次失败都能回到具体证据。' : 'Expose state, tools, and recovery actions so every failure can return to evidence.' },
    { id: 'APS-207', label: zh ? '压缩首屏模型等待时间' : 'Reduce first-response latency', title: zh ? '压缩首屏模型等待时间' : 'Reduce first-response latency', copy: zh ? '把首 token、流式渲染和回退路径放进同一条可测量的体验链路。' : 'Make first token, streaming render, and fallback paths measurable in one experience.' },
    { id: 'APS-204', label: zh ? '建立可追踪的检索评测集' : 'Define a traceable retrieval eval set', title: zh ? '建立可追踪的检索评测集' : 'Define a traceable retrieval eval set', copy: zh ? '固定任务、失败标签与证据边界，再讨论模型分数。' : 'Fix tasks, failure labels, and evidence boundaries before discussing model scores.' }
  ];
  let issueIndex = 0;
  const setIssue = (next) => {
    issueIndex = (next + issues.length) % issues.length;
    const item = issues[issueIndex];
    document.querySelector('[data-linear-issue-id]')?.replaceChildren(document.createTextNode(item.id));
    document.querySelector('[data-linear-issue-label]')?.replaceChildren(document.createTextNode(item.label));
    document.querySelector('[data-linear-detail-title]')?.replaceChildren(document.createTextNode(item.title));
    document.querySelector('[data-linear-detail-copy]')?.replaceChildren(document.createTextNode(item.copy));
    const count = document.querySelector('[data-linear-issue-count]');
    if (count) count.textContent = `${issueIndex + 1} / 06`;
    announce(zh ? `已切换到 ${item.id}` : `Switched to ${item.id}`);
  };
  document.querySelector('[data-linear-issue-prev]')?.addEventListener('click', () => setIssue(issueIndex - 1));
  document.querySelector('[data-linear-issue-next]')?.addEventListener('click', () => setIssue(issueIndex + 1));
  document.querySelector('[data-linear-loop-next]')?.addEventListener('click', () => {
    const labels = zh ? ['新建工作面', '评测工作面', '交付工作面'] : ['New workspace', 'Evaluation workspace', 'Delivery workspace'];
    const label = document.querySelector('[data-linear-loop-label]');
    const current = labels.indexOf(label?.textContent || labels[0]);
    if (label) label.textContent = labels[(current + 1) % labels.length];
    announce(zh ? '主视觉工作面已切换' : 'Hero workspace switched');
  });
  document.querySelectorAll('[data-linear-frame-tab]').forEach((tab) => tab.addEventListener('click', () => {
    document.querySelectorAll('[data-linear-frame-tab]').forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
    announce(zh ? `已切换到${tab.textContent.trim()}视图` : `Switched to ${tab.textContent.trim()} view`);
  }));
  document.querySelector('[data-linear-comment-submit]')?.addEventListener('click', (event) => {
    const button = event.currentTarget;
    button.textContent = '✓';
    button.setAttribute('aria-label', zh ? '备注已提交' : 'Note added');
    announce(zh ? '工程备注已提交' : 'Engineering note added');
  });
  document.querySelector('[data-linear-workspace-trigger]')?.addEventListener('click', (event) => {
    const trigger = event.currentTarget;
    const open = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', String(!open));
    announce(!open ? (zh ? '工作区菜单已打开' : 'Workspace menu opened') : (zh ? '工作区菜单已关闭' : 'Workspace menu closed'));
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenus(true);
    if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && event.target.closest('[data-linear-stage-wrap]')) {
      event.preventDefault();
      setIssue(issueIndex + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
})();
