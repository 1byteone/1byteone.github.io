(() => {
  'use strict';
  const body = document.body;
  if (!body?.classList.contains('aps-home')) return;
  const root = document.documentElement;
  const zh = (root.lang || '').toLowerCase().startsWith('zh');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const labels = zh
    ? { copied: '链接已复制', context: '上下文已展开', delegated: '任务已委派给 YOYO', complete: '问题已标记为已完成', restored: '问题已恢复为进行中', created: '问题已创建', comment: '工程备注已添加', favorite: '已收藏评测集', unfavorite: '已取消收藏评测集' }
    : { copied: 'Link copied', context: 'Context expanded', delegated: 'Task delegated to YOYO', complete: 'Issue marked complete', restored: 'Issue restored to in progress', created: 'Issue created', comment: 'Engineering note added', favorite: 'Evaluation set saved', unfavorite: 'Evaluation set removed' };
  const announce = (message) => {
    const node = document.querySelector('[data-linear-announcer]');
    const status = document.querySelector('[data-linear-action-status]');
    if (node) node.textContent = message;
    if (status) status.textContent = message;
  };
  const readStorage = (key, fallback) => {
    try { const value = window.localStorage.getItem(key); return value === null ? fallback : JSON.parse(value); } catch { return fallback; }
  };
  const writeStorage = (key, value) => { try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage can be unavailable. */ } };
  const copyText = async (value) => {
    if (navigator.clipboard?.writeText && window.isSecureContext) { await navigator.clipboard.writeText(value); return true; }
    const area = document.createElement('textarea');
    area.value = value; area.setAttribute('readonly', ''); area.style.position = 'fixed'; area.style.opacity = '0';
    document.body.appendChild(area); area.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch { copied = false; }
    area.remove();
    return copied;
  };

  // Product/Resources use one shared hover-intent and focus contract.
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
      if (other === rootNode) return;
      const otherTrigger = other.querySelector('[data-linear-menu-trigger]');
      const otherPanel = other.querySelector('[data-linear-menu-panel]');
      otherTrigger?.setAttribute('aria-expanded', 'false');
      if (otherPanel) { otherPanel.classList.remove('is-open'); otherPanel.hidden = true; }
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
    trigger?.addEventListener('click', () => trigger.getAttribute('aria-expanded') === 'true' ? closeMenus() : openMenu(rootNode));
    trigger?.addEventListener('keydown', (event) => {
      if (!['ArrowDown', 'Enter', ' '].includes(event.key)) return;
      event.preventDefault(); openMenu(rootNode); rootNode.querySelector('[data-linear-menu-panel] a')?.focus();
    });
  });

  // Scroll progress is observable but throttled and disabled while off-screen.
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
    const stageObserver = new IntersectionObserver((entries) => { stageVisible = entries.some((entry) => entry.isIntersecting); if (stageVisible) scheduleStage(); }, { rootMargin: '220px 0px' });
    stageObserver.observe(stage);
  }
  updateStage();

  const reveals = Array.from(document.querySelectorAll('[data-linear-reveal]'));
  if (reduced.matches || !('IntersectionObserver' in window)) reveals.forEach((item) => item.classList.add('is-visible'));
  else {
    const observer = new IntersectionObserver((entries, instance) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); instance.unobserve(entry.target); } }), { threshold: .1 });
    reveals.forEach((item) => observer.observe(item));
  }

  const issues = [
    { id: 'APS-211', label: zh ? '让 Agent 失败时仍可解释' : 'Make agent failures explainable', title: zh ? '让 Agent 失败时仍可解释' : 'Make agent failures explainable', copy: zh ? '记录状态、工具调用和恢复动作，让每次失败都能回到具体证据。' : 'Expose state, tools, and recovery actions so every failure can return to evidence.', kicker: zh ? '进行中 · 可解释性' : 'IN PROGRESS · EXPLAINABILITY' },
    { id: 'APS-207', label: zh ? '压缩首屏模型等待时间' : 'Reduce first-response latency', title: zh ? '压缩首屏模型等待时间' : 'Reduce first-response latency', copy: zh ? '把首 token、流式渲染和回退路径放进同一条可测量的体验链路。' : 'Make first token, streaming render, and fallback paths measurable in one experience.', kicker: zh ? '进行中 · 性能' : 'IN PROGRESS · PERFORMANCE' },
    { id: 'APS-204', label: zh ? '建立可追踪的检索评测集' : 'Define a traceable retrieval eval set', title: zh ? '建立可追踪的检索评测集' : 'Define a traceable retrieval eval set', copy: zh ? '固定任务、失败标签与证据边界，再讨论模型分数。' : 'Fix tasks, failure labels, and evidence boundaries before discussing model scores.', kicker: zh ? '待处理 · RAG 评测' : 'BACKLOG · RAG EVALUATION' },
    { id: 'APS-198', label: zh ? '整理工具调用的错误路径' : 'Map tool-call failure paths', title: zh ? '整理工具调用的错误路径' : 'Map tool-call failure paths', copy: zh ? '把超时、拒绝和重试分成可观察的恢复分支。' : 'Turn timeout, rejection, and retry into observable recovery branches.', kicker: zh ? '待处理 · 工具调用' : 'BACKLOG · TOOL USE' },
    { id: 'APS-193', label: zh ? '发布主题工作台' : 'Ship the studio workbench', title: zh ? '发布主题工作台' : 'Ship the studio workbench', copy: zh ? '把视觉契约、内容路由和交互验收整理成可复用主题能力。' : 'Package the visual contract, content routes, and interaction checks as a reusable theme capability.', kicker: zh ? '已完成 · 交付' : 'DONE · DELIVERY' },
    { id: 'APS-187', label: zh ? '补齐中英文深链接' : 'Complete bilingual deep links', title: zh ? '补齐中英文深链接' : 'Complete bilingual deep links', copy: zh ? '让每个主题入口、文章和项目都能在两种语言之间保持上下文。' : 'Keep context across theme, article, and project routes in both languages.', kicker: zh ? '已完成 · 国际化' : 'DONE · INTERNATIONALIZATION' }
  ];
  const storedIssues = readStorage('yoyo-linear-issues', []);
  if (Array.isArray(storedIssues)) storedIssues.filter((item) => item && item.id && item.title).forEach((item) => issues.push(item));
  const issueId = document.querySelector('[data-linear-issue-id]');
  const issueLabel = document.querySelector('[data-linear-issue-label]');
  const issueTitle = document.querySelector('[data-linear-detail-title]');
  const issueCopy = document.querySelector('[data-linear-detail-copy]');
  const issueKicker = document.querySelector('[data-linear-detail-kicker]');
  const issueCount = document.querySelector('[data-linear-issue-count]');
  let issueIndex = 0;
  const setIssue = (next) => {
    issueIndex = (next + issues.length) % issues.length;
    const item = issues[issueIndex];
    if (issueId) issueId.textContent = item.id;
    if (issueLabel) issueLabel.textContent = item.label;
    if (issueTitle) issueTitle.textContent = item.title;
    if (issueCopy) issueCopy.textContent = item.copy;
    if (issueKicker) issueKicker.textContent = item.kicker;
    if (issueCount) issueCount.textContent = `${issueIndex + 1} / ${String(issues.length).padStart(2, '0')}`;
    document.querySelector('[data-linear-frame-main]')?.setAttribute('data-linear-current-issue', item.id);
    announce(zh ? `已切换到 ${item.id}` : `Switched to ${item.id}`);
  };
  setIssue(0);
  document.querySelector('[data-linear-issue-prev]')?.addEventListener('click', () => setIssue(issueIndex - 1));
  document.querySelector('[data-linear-issue-next]')?.addEventListener('click', () => setIssue(issueIndex + 1));

  // Main visual modes update both the label and the issue content.
  const modes = zh ? ['新建工作面', '评测工作面', '交付工作面'] : ['New workspace', 'Evaluation workspace', 'Delivery workspace'];
  let modeIndex = 0;
  document.querySelector('[data-linear-loop-next]')?.addEventListener('click', () => {
    modeIndex = (modeIndex + 1) % modes.length;
    const label = document.querySelector('[data-linear-loop-label]');
    if (label) label.textContent = modes[modeIndex];
    document.querySelector('[data-linear-frame]')?.setAttribute('data-linear-mode', ['new', 'evaluation', 'delivery'][modeIndex]);
    setIssue(modeIndex === 0 ? 0 : modeIndex === 1 ? 2 : 4);
  });

  const workspaceMenu = document.querySelector('[data-linear-workspace-menu]');
  const workspaceTrigger = document.querySelector('[data-linear-workspace-trigger]');
  const closeWorkspace = (restore = false) => { if (!workspaceMenu) return; workspaceMenu.hidden = true; workspaceTrigger?.setAttribute('aria-expanded', 'false'); if (restore) workspaceTrigger?.focus(); };
  workspaceTrigger?.addEventListener('click', () => { const open = workspaceTrigger.getAttribute('aria-expanded') === 'true'; workspaceTrigger.setAttribute('aria-expanded', String(!open)); if (workspaceMenu) workspaceMenu.hidden = open; });
  document.querySelectorAll('[data-linear-workspace-choice]').forEach((choice) => choice.addEventListener('click', () => { document.querySelectorAll('[data-linear-workspace-choice]').forEach((item) => item.setAttribute('aria-pressed', String(item === choice))); closeWorkspace(); announce(zh ? '已切换到 YOYO 工作区' : 'YOYO workspace selected'); }));

  const globalSearch = () => {
    const trigger = document.querySelector('[data-aps-search-open]');
    if (trigger) { trigger.click(); return; }
    const dialog = document.querySelector('[data-aps-search-dialog]');
    if (dialog?.showModal) dialog.showModal();
  };
  document.querySelector('[data-linear-frame-search]')?.addEventListener('click', globalSearch);

  const newDialog = document.querySelector('[data-linear-new-dialog]');
  const newForm = document.querySelector('[data-linear-new-form]');
  const closeNewDialog = () => { if (newDialog?.open) newDialog.close(); };
  document.querySelector('[data-linear-frame-new]')?.addEventListener('click', () => { newDialog?.showModal(); window.setTimeout(() => document.querySelector('[data-linear-new-title]')?.focus(), 0); });
  document.querySelectorAll('[data-linear-dialog-close]').forEach((button) => button.addEventListener('click', closeNewDialog));
  newDialog?.addEventListener('click', (event) => { if (event.target === newDialog) closeNewDialog(); });
  newForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.querySelector('[data-linear-new-title]')?.value.trim();
    const summary = document.querySelector('[data-linear-new-summary]')?.value.trim() || (zh ? '新建的工程问题，等待补充验证证据。' : 'New engineering issue awaiting evidence.');
    if (!title) return;
    const id = `APS-${String(Date.now()).slice(-3)}`;
    issues.push({ id, label: title, title, copy: summary, kicker: zh ? '新建 · 待处理' : 'NEW · BACKLOG' });
    writeStorage('yoyo-linear-issues', issues.slice(6));
    setIssue(issues.length - 1);
    newForm.reset(); closeNewDialog(); announce(`${labels.created}: ${id}`);
  });

  const issueMenu = document.querySelector('[data-linear-issue-menu]');
  const issueMenuTrigger = document.querySelector('[data-linear-issue-menu-trigger]');
  const closeIssueMenu = (restore = false) => { if (!issueMenu) return; issueMenu.hidden = true; issueMenuTrigger?.setAttribute('aria-expanded', 'false'); if (restore) issueMenuTrigger?.focus(); };
  issueMenuTrigger?.addEventListener('click', () => { const open = issueMenuTrigger.getAttribute('aria-expanded') === 'true'; issueMenuTrigger.setAttribute('aria-expanded', String(!open)); issueMenu.hidden = open; });
  document.querySelectorAll('[data-linear-issue-action]').forEach((button) => button.addEventListener('click', async () => {
    const action = button.dataset.linearIssueAction;
    if (action === 'copy') { await copyText(`${window.location.href}#${issues[issueIndex].id}`); announce(labels.copied); }
    if (action === 'complete') { if (issueKicker) issueKicker.textContent = zh ? '已完成 · 已归档' : 'DONE · ARCHIVED'; announce(labels.complete); }
    if (action === 'reset') { if (issueKicker) issueKicker.textContent = issues[issueIndex].kicker; announce(labels.restored); }
    closeIssueMenu();
  }));

  // Workspace tabs either change the current issue or navigate to the real archive.
  const frameTabs = Array.from(document.querySelectorAll('[data-linear-frame-tab]'));
  const tabIssue = { pulse: 0, inbox: 0, issues: 1, reviews: 2 };
  const setFrameTab = (tab) => {
    frameTabs.forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
    const value = tab.dataset.linearFrameTab;
    if (value === 'projects') { window.location.href = tab.dataset.linearHref || 'projects/'; return; }
    if (value === 'initiatives') { window.location.href = tab.dataset.linearHref || 'experiments/'; return; }
    if (value === 'more') { announce(zh ? '更多工作区入口：文章、资料与技术栈' : 'More workspace routes: journal, archive, and stack'); return; }
    if (value === 'favorite') {
      const saved = !readStorage('yoyo-linear-favorite', false); writeStorage('yoyo-linear-favorite', saved); tab.setAttribute('aria-pressed', String(saved)); announce(saved ? labels.favorite : labels.unfavorite); return;
    }
    if (Object.prototype.hasOwnProperty.call(tabIssue, value)) setIssue(tabIssue[value]);
    announce(zh ? `已切换到${tab.textContent.trim()}视图` : `Switched to ${tab.textContent.trim()} view`);
  };
  frameTabs.forEach((tab, index) => {
    if (tab.dataset.linearFrameTab === 'projects') tab.dataset.linearHref = new URL('projects/', window.location.href).href;
    if (tab.dataset.linearFrameTab === 'initiatives') tab.dataset.linearHref = new URL('experiments/', window.location.href).href;
    tab.addEventListener('click', () => setFrameTab(tab));
    tab.addEventListener('keydown', (event) => { if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return; event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? frameTabs.length - 1 : (index + (event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1) + frameTabs.length) % frameTabs.length; frameTabs[next].focus(); setFrameTab(frameTabs[next]); });
  });
  const favorite = document.querySelector('[data-linear-frame-tab="favorite"]');
  if (favorite) favorite.setAttribute('aria-pressed', String(readStorage('yoyo-linear-favorite', false)));

  document.querySelectorAll('[data-linear-view-action]').forEach((button) => button.addEventListener('click', async () => {
    const action = button.dataset.linearViewAction;
    if (action === 'link') { await copyText(`${window.location.href}#${issues[issueIndex].id}`); announce(labels.copied); }
    if (action === 'context') { document.querySelector('.linear-issue-detail')?.classList.toggle('is-context-open'); announce(labels.context); }
    if (action === 'delegate') { document.querySelector('[data-linear-frame-main]')?.setAttribute('data-linear-delegated', 'true'); announce(labels.delegated); }
  }));

  document.querySelector('[data-linear-comment-form]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.querySelector('[data-linear-comment-input]');
    const value = input?.value.trim();
    if (!value) return;
    const list = document.querySelector('[data-linear-activity-list]');
    if (list) { const item = document.createElement('li'); item.innerHTML = `<span class="linear-activity-avatar">Y</span><p><strong>YOYO</strong> ${value.replace(/[<&>]/g, '')}<small>${zh ? '刚刚' : 'just now'}</small></p>`; list.prepend(item); }
    if (input) input.value = '';
    announce(labels.comment);
  });

  document.addEventListener('pointerdown', (event) => {
    if (!event.target.closest('[data-linear-menu-root]')) closeMenus();
    if (!event.target.closest('[data-linear-workspace-menu]') && !event.target.closest('[data-linear-workspace-trigger]')) closeWorkspace();
    if (!event.target.closest('[data-linear-issue-menu]') && !event.target.closest('[data-linear-issue-menu-trigger]')) closeIssueMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    closeMenus(true); closeWorkspace(true); closeIssueMenu(true); if (newDialog?.open) closeNewDialog();
  });
})();
