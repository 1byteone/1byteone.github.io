(function () {
  'use strict';

  const root = document.querySelector('[data-ui-lab]');
  if (!root) return;

  const isZh = document.body && document.body.dataset.lang === 'zh';
  const text = isZh ? {
    you: '你', assistant: 'BlogGPT', copy: '复制', copied: '已复制', regenerate: '重新生成',
    generating: '生成中', stopped: '已停止', processing: '处理中', interactive: '可交互',
    approved: '已批准', approve: '批准执行', modelChanged: '模型已切换',
    empty: '请先输入一个问题。', scenario: '学习场景',
  } : {
    you: 'You', assistant: 'BlogGPT', copy: 'Copy', copied: 'Copied', regenerate: 'Regenerate',
    generating: 'Generating', stopped: 'Stopped', processing: 'Working', interactive: 'Interactive',
    approved: 'Approved', approve: 'Approve run', modelChanged: 'Model changed',
    empty: 'Enter a question first.', scenario: 'LEARNING SCENARIO',
  };

  const scenarios = {
    support: {
      title: isZh ? '客服知识库' : 'Support copilot',
      kicker: isZh ? '学习场景 01' : 'LEARNING SCENARIO 01',
      pattern: isZh ? '检索 + 引用' : 'Retrieval + citations',
      patternCopy: isZh ? '先展示检索状态，再给出带来源的回答，让用户知道答案来自哪里。' : 'Show retrieval first, then answer with sources so the user can see where the answer came from.',
      prompts: isZh ? ['退款政策是什么？', '找出 Pro 套餐的 SLA', '这条答案的来源？'] : ['What is the refund policy?', 'Find the Pro SLA', 'Where did this answer come from?'],
      messages: [
        { role: 'user', text: isZh ? 'Pro 套餐支持多久的退款窗口？' : 'How long is the refund window for the Pro plan?' },
        { role: 'assistant', text: isZh ? 'Pro 套餐支持购买后 30 天内申请退款。符合条件时，原支付渠道会在 5–10 个工作日内完成处理。' : 'The Pro plan has a 30-day refund window. When eligible, the original payment method is credited within 5–10 business days.', html: isZh ? '<p>Pro 套餐支持购买后 <strong>30 天内</strong>申请退款。符合条件时，原支付渠道会在 5–10 个工作日内完成处理。</p>' : '<p>The Pro plan has a <strong>30-day</strong> refund window. When eligible, the original payment method is credited within 5–10 business days.</p>', tool: { label: isZh ? '已检索 3 个知识库片段' : 'Retrieved 3 knowledge snippets', detail: isZh ? 'policy/refunds · help/pro-plan · billing/processing' : 'policy/refunds · help/pro-plan · billing/processing' }, citation: { label: isZh ? '来源 01 · 退款政策' : 'Source 01 · Refund policy', body: isZh ? '帮助中心 / 退款与取消 · 更新于 2026-08-12' : 'Help center / Refunds & cancellation · Updated 2026-08-12' }, trace: isZh ? ['检索：refund window + Pro', '重排：3 → 1 个高相关片段', '引用：退款政策 / 第 2 段'] : ['Search: refund window + Pro', 'Rerank: 3 → 1 relevant snippet', 'Cite: Refund policy / paragraph 2'] },
      ],
      response: {
        text: isZh ? '可以。知识库检索到 30 天退款政策，我会把来源一起展示，方便客服复核。' : 'Yes. The knowledge base found the 30-day refund policy, so I will show the source alongside the answer for review.',
        html: isZh ? '<p>可以。知识库检索到 <strong>30 天退款政策</strong>，我会把来源一起展示，方便客服复核。</p>' : '<p>Yes. The knowledge base found the <strong>30-day refund policy</strong>, so I will show the source alongside the answer for review.</p>',
        tool: { label: isZh ? '检索完成 · 相关度 0.94' : 'Retrieval complete · relevance 0.94', detail: isZh ? '命中 policy/refunds，返回 1 个可引用片段。' : 'Matched policy/refunds and returned one citable snippet.' },
        citation: { label: isZh ? '来源 01 · policy/refunds' : 'Source 01 · policy/refunds', body: isZh ? '引用卡片应该允许用户展开查看原文。' : 'A citation card should let users expand the original context.' },
        trace: isZh ? ['检索：退款政策', '置信度：0.94', '引用：policy/refunds'] : ['Search: refund policy', 'Confidence: 0.94', 'Cite: policy/refunds'],
      },
    },
    agent: {
      title: isZh ? 'Agent 工具调用' : 'Agent tools',
      kicker: isZh ? '学习场景 02' : 'LEARNING SCENARIO 02',
      pattern: isZh ? '决策 + 审批' : 'Decision + approval',
      patternCopy: isZh ? '把工具参数、风险边界和人工审批放进同一条可观察的执行轨迹。' : 'Keep tool arguments, risk boundaries, and human approval in one observable execution trace.',
      prompts: isZh ? ['查询订单 1048', '创建一张退款工单', '为什么需要审批？'] : ['Inspect order 1048', 'Create a refund ticket', 'Why is approval needed?'],
      messages: [
        { role: 'user', text: isZh ? '查询订单 1048，并准备退款。' : 'Inspect order 1048 and prepare a refund.' },
        { role: 'assistant', text: isZh ? '订单已找到。退款金额为 ¥249，执行前需要人工确认。' : 'The order is ready. The refund amount is $249, and a human confirmation is required before execution.', html: isZh ? '<p>订单已找到。退款金额为 <strong>¥249</strong>，执行前需要人工确认。</p>' : '<p>The order is ready. The refund amount is <strong>$249</strong>, and a human confirmation is required before execution.</p>', tool: { label: isZh ? '工具：订单查询 · 已完成' : 'Tool: order.lookup · complete', detail: isZh ? 'order_id=1048 · status=paid · refundable=true' : 'order_id=1048 · status=paid · refundable=true', approval: true }, trace: isZh ? ['规划：先查询订单，再创建退款', '工具：order.lookup', '策略：退款动作需要人工审批'] : ['Plan: inspect order, then create refund', 'Tool: order.lookup', 'Policy: refund action needs approval'] },
      ],
      response: {
        text: isZh ? '已准备好退款动作。审批按钮应该清楚说明金额和影响，再允许 Agent 执行。' : 'The refund action is ready. The approval step should show amount and impact before the agent can run it.',
        html: isZh ? '<p>已准备好退款动作。审批按钮应该清楚说明金额和影响，再允许 Agent 执行。</p>' : '<p>The refund action is ready. The approval step should show amount and impact before the agent can run it.</p>',
        tool: { label: isZh ? '工具参数已准备 · 等待审批' : 'Tool arguments ready · awaiting approval', detail: isZh ? 'refund.create(order_id=1048, amount=249)' : 'refund.create(order_id=1048, amount=249)', approval: true },
        trace: isZh ? ['计划：退款动作', '风险：资金变更', '状态：等待人工审批'] : ['Plan: refund action', 'Risk: money movement', 'State: waiting for approval'],
      },
    },
    code: {
      title: isZh ? '代码助手' : 'Code assistant',
      kicker: isZh ? '学习场景 03' : 'LEARNING SCENARIO 03',
      pattern: isZh ? '流式 + 代码块' : 'Streaming + code',
      patternCopy: isZh ? '让代码块、复制动作和重新生成都成为消息的一部分，减少来回跳转。' : 'Make code blocks, copy actions, and regeneration part of the message so users stay in flow.',
      prompts: isZh ? ['解释这个 API 路由', '生成一个重试函数', '如何测试这段代码？'] : ['Explain this API route', 'Generate a retry helper', 'How should I test this?'],
      messages: [
        { role: 'user', text: isZh ? '给一个带退避的 fetch 重试函数。' : 'Show a fetch retry helper with backoff.' },
        { role: 'assistant', text: isZh ? '可以把重试策略封装成一个小函数，并让代码块支持复制。' : 'Encapsulate the retry policy in a small helper and make the code block easy to copy.', html: isZh ? `<p>可以把重试策略封装成一个小函数，并让代码块支持复制。</p><pre>async function withRetry(task, attempts = 3) {
  for (let i = 0; i &lt; attempts; i += 1) {
    try { return await task(); }
    catch (error) {
      if (i === attempts - 1) throw error;
      await new Promise(r =&gt; setTimeout(r, 2 ** i * 250));
    }
  }
}</pre>` : `<p>Encapsulate the retry policy in a small helper and make the code block easy to copy.</p><pre>async function withRetry(task, attempts = 3) {
  for (let i = 0; i &lt; attempts; i += 1) {
    try { return await task(); }
    catch (error) {
      if (i === attempts - 1) throw error;
      await new Promise(r =&gt; setTimeout(r, 2 ** i * 250));
    }
  }
}</pre>`, trace: isZh ? ['解析：任务函数 + 次数参数', '生成：指数退避', '检查：最终错误继续抛出'] : ['Parse: task function + attempts', 'Generate: exponential backoff', 'Check: rethrow final error'] },
      ],
      response: {
        text: isZh ? '我会先输出解释，再逐步流式输出代码，最后给出测试建议。' : 'I will explain the approach, stream the code, and finish with a focused test suggestion.',
        html: isZh ? '<p>我会先输出解释，再逐步流式输出代码，最后给出测试建议。</p><pre>const result = await withRetry(() =&gt; fetch(url));</pre>' : '<p>I will explain the approach, stream the code, and finish with a focused test suggestion.</p><pre>const result = await withRetry(() =&gt; fetch(url));</pre>',
        trace: isZh ? ['输出：说明重试边界', '输出：代码块', '建议：覆盖最后一次失败'] : ['Output: explain retry boundary', 'Output: code block', 'Suggest: cover final failure'],
      },
    },
  };

  const thread = root.querySelector('[data-demo-thread]');
  const quickPrompts = root.querySelector('[data-quick-prompts]');
  const input = root.querySelector('[data-demo-input]');
  const form = root.querySelector('[data-demo-form]');
  const sendButton = root.querySelector('[data-send-demo]');
  const modelSelect = root.querySelector('[data-model-select]');
  const titleNode = root.querySelector('[data-demo-title]');
  const kickerNode = root.querySelector('[data-demo-kicker]');
  const patternNode = root.querySelector('[data-demo-pattern]');
  const patternCopyNode = root.querySelector('[data-demo-pattern-copy]');
  const liveNode = root.querySelector('.bloggpt-lab-live');
  let currentKey = 'support';
  let currentMessages = [];
  let streamState = null;

  const escapeHTML = (value) => String(value == null ? '' : value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  const setLive = (label) => { if (liveNode) liveNode.innerHTML = '<i></i>' + escapeHTML(label); };
  const renderTool = (tool) => {
    if (!tool) return '';
    return '<details class="bloggpt-lab-tool"><summary>' + escapeHTML(tool.label) + '</summary><div class="bloggpt-lab-tool-content"><strong>' + escapeHTML(tool.detail) + '</strong>' + (tool.approval ? '<br><button type="button" class="bloggpt-lab-tool-approve" data-approve-tool>' + escapeHTML(text.approve) + '</button>' : '') + '</div></details>';
  };
  const renderCitation = (citation) => citation ? '<details class="bloggpt-lab-citation"><summary>' + escapeHTML(citation.label) + '</summary><div class="bloggpt-lab-citation-content">' + escapeHTML(citation.body) + '</div></details>' : '';
  const renderTrace = (trace) => trace && trace.length ? '<div class="bloggpt-lab-trace" aria-label="Trace">' + trace.map((item, index) => '<div class="bloggpt-lab-trace-row"><b>0' + (index + 1) + '</b><span>' + escapeHTML(item) + '</span></div>').join('') + '</div>' : '';
  const renderBody = (message) => (message.html || '<p>' + escapeHTML(message.text) + '</p>') + renderTool(message.tool) + renderCitation(message.citation) + renderTrace(message.trace);
  const renderMessage = (message, index) => {
    const role = message.role === 'user' ? 'user' : 'assistant';
    const actions = role === 'assistant' ? '<div class="bloggpt-lab-message-actions"><button type="button" data-copy-message="' + escapeHTML(message.text) + '">' + escapeHTML(text.copy) + '</button><button type="button" data-regenerate="' + index + '">' + escapeHTML(text.regenerate) + '</button></div>' : '';
    return '<article class="bloggpt-lab-message ' + role + '" data-message-index="' + index + '"><div class="bloggpt-lab-message-meta"><span>' + escapeHTML(role === 'user' ? text.you : text.assistant) + '</span></div><div class="bloggpt-lab-message-body">' + renderBody(message) + '</div>' + actions + '</article>';
  };
  const scrollThread = () => { if (thread) thread.scrollTop = thread.scrollHeight; };
  const renderPrompts = (scenario) => { if (quickPrompts) quickPrompts.innerHTML = scenario.prompts.map((prompt) => '<button type="button" data-quick-prompt="' + escapeHTML(prompt) + '">' + escapeHTML(prompt) + '</button>').join(''); };
  const renderScenario = (key) => {
    const scenario = scenarios[key] || scenarios.support;
    currentKey = key;
    currentMessages = scenario.messages.map((message) => Object.assign({}, message));
    if (titleNode) titleNode.textContent = scenario.title;
    if (kickerNode) kickerNode.textContent = scenario.kicker;
    if (patternNode) patternNode.textContent = scenario.pattern;
    if (patternCopyNode) patternCopyNode.textContent = scenario.patternCopy;
    if (thread) thread.innerHTML = currentMessages.map(renderMessage).join('');
    renderPrompts(scenario);
    scrollThread();
  };
  const resetSendButton = () => {
    if (!sendButton) return;
    sendButton.dataset.stop = 'false';
    sendButton.textContent = '↑';
    sendButton.setAttribute('aria-label', isZh ? '发送' : 'Send');
  };
  const streamReply = (message, target) => {
    const fullText = message.text;
    let position = 0;
    streamState = { target: target, message: message, partial: '' };
    if (sendButton) { sendButton.dataset.stop = 'true'; sendButton.textContent = '■'; sendButton.setAttribute('aria-label', isZh ? '停止生成' : 'Stop generation'); }
    setLive(text.generating);
    const tick = () => {
      if (!streamState) return;
      position += Math.max(1, Math.ceil(fullText.length / 32));
      streamState.partial = fullText.slice(0, position);
      const streamNode = target.querySelector('[data-stream-text]');
      if (streamNode) streamNode.textContent = streamState.partial;
      scrollThread();
      if (position >= fullText.length) {
        window.clearInterval(streamState.timer);
        const index = currentMessages.push(message) - 1;
        target.outerHTML = renderMessage(message, index);
        streamState = null;
        resetSendButton();
        setLive(text.interactive);
        scrollThread();
      }
    };
    streamState.timer = window.setInterval(tick, 34);
    tick();
  };
  const stopStream = () => {
    if (!streamState) return;
    window.clearInterval(streamState.timer);
    const partial = streamState.partial || streamState.message.text.slice(0, 1);
    const stoppedMessage = { role: 'assistant', text: partial + (isZh ? '（已停止）' : ' (stopped)') };
    const index = currentMessages.push(stoppedMessage) - 1;
    streamState.target.outerHTML = renderMessage(stoppedMessage, index);
    streamState = null;
    resetSendButton();
    setLive(text.interactive);
  };
  const sendMessage = (value) => {
    const query = (value || '').trim();
    if (!query || streamState) return;
    const scenario = scenarios[currentKey];
    const userMessage = { role: 'user', text: query };
    currentMessages.push(userMessage);
    if (thread) thread.insertAdjacentHTML('beforeend', renderMessage(userMessage, currentMessages.length - 1));
    const placeholder = document.createElement('article');
    placeholder.className = 'bloggpt-lab-message assistant';
    placeholder.innerHTML = '<div class="bloggpt-lab-message-meta"><span>' + escapeHTML(text.assistant) + '</span></div><div class="bloggpt-lab-message-body"><p><span data-stream-text></span><span class="bloggpt-lab-stream-cursor" aria-hidden="true"></span></p></div>';
    if (thread) thread.appendChild(placeholder);
    if (input) { input.value = ''; input.style.height = ''; }
    scrollThread();
    streamReply(scenario.response, placeholder);
  };

  root.querySelectorAll('[data-demo-session]').forEach((button) => button.addEventListener('click', () => {
    if (streamState) stopStream();
    root.querySelectorAll('[data-demo-session]').forEach((item) => item.classList.toggle('is-active', item === button));
    renderScenario(button.dataset.demoSession);
  }));
  root.querySelectorAll('[data-demo-mode]').forEach((button) => button.addEventListener('click', () => {
    root.querySelectorAll('[data-demo-mode]').forEach((item) => { item.classList.toggle('is-active', item === button); item.setAttribute('aria-selected', item === button ? 'true' : 'false'); });
    root.dataset.mode = button.dataset.demoMode;
  }));
  root.querySelector('[data-new-session]')?.addEventListener('click', () => {
    if (streamState) stopStream();
    root.querySelectorAll('[data-demo-session]').forEach((item) => item.classList.toggle('is-active', item.dataset.demoSession === 'support'));
    if (modelSelect) modelSelect.selectedIndex = 0;
    root.dataset.mode = 'chat';
    root.querySelectorAll('[data-demo-mode]').forEach((item) => { item.classList.toggle('is-active', item.dataset.demoMode === 'chat'); item.setAttribute('aria-selected', item.dataset.demoMode === 'chat' ? 'true' : 'false'); });
    renderScenario('support');
  });
  modelSelect?.addEventListener('change', () => {
    setLive(text.modelChanged + ': ' + modelSelect.value);
    window.clearTimeout(modelSelect._statusTimer);
    modelSelect._statusTimer = window.setTimeout(() => setLive(text.interactive), 1800);
  });
  quickPrompts?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-quick-prompt]');
    if (!button || !input) return;
    input.value = button.dataset.quickPrompt || '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus();
  });
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (streamState) { stopStream(); return; }
    if (!input || !input.value.trim()) { setLive(text.empty); input?.focus(); return; }
    sendMessage(input.value);
  });
  input?.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });
  input?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); form?.requestSubmit(); }
  });
  root.addEventListener('click', async (event) => {
    const copyButton = event.target.closest('[data-copy-message]');
    if (copyButton) {
      const value = copyButton.dataset.copyMessage || '';
      try { await navigator.clipboard.writeText(value); copyButton.textContent = text.copied; } catch (_) { copyButton.textContent = isZh ? '复制失败' : 'Copy failed'; }
      window.setTimeout(() => { copyButton.textContent = text.copy; }, 1600);
      return;
    }
    const regenerateButton = event.target.closest('[data-regenerate]');
    if (regenerateButton && !streamState) {
      const target = regenerateButton.closest('.bloggpt-lab-message');
      if (!target) return;
      const response = scenarios[currentKey].response;
      target.querySelector('.bloggpt-lab-message-body').innerHTML = '<p><span data-stream-text></span><span class="bloggpt-lab-stream-cursor" aria-hidden="true"></span></p>';
      streamReply(response, target);
      return;
    }
    const approveButton = event.target.closest('[data-approve-tool]');
    if (approveButton) { approveButton.textContent = text.approved; approveButton.disabled = true; approveButton.closest('details')?.setAttribute('data-approved', 'true'); }
  });

  root.dataset.mode = 'chat';
  renderScenario('support');
})();
