(() => {
  const app = document.querySelector("[data-at-app]");
  if (!app) return;

  const body = document.body;
  const root = document.documentElement;
  const cliView = document.querySelector('[data-at-view="cli"]');
  const guiView = document.querySelector('[data-at-view="gui"]');
  const output = app.querySelector("[data-at-output]");
  const input = app.querySelector("[data-at-input]");
  const themeSelect = app.querySelector("[data-at-theme-select]");
  const themeLabel = app.querySelector("[data-at-theme-label]");
  const modeLabel = app.querySelector("[data-at-mode-label]");
  const pathLabel = app.querySelector("[data-at-path]");
  const status = app.querySelector("[data-at-radio-status]");
  const modalLayer = document.querySelector("[data-at-modal-layer]");
  const modalContent = document.querySelector("[data-at-modal-content]");
  const modalTitle = document.querySelector("[data-at-modal-title]");
  const overlay = document.querySelector("[data-at-matrix]");
  const overlayCanvas = document.querySelector("[data-at-matrix-canvas]");
  const commandSources = new Map();
  document.querySelectorAll("[data-at-source]").forEach((source) => {
    commandSources.set(source.dataset.atSource, [...source.querySelectorAll("a")].map((link) => ({ title: link.textContent.trim(), href: link.href })));
  });

  const themes = ["green", "amber", "cyan", "dracula", "mono", "cappuccino"];
  const themeNames = { green: "PHOSPHOR", amber: "AMBER", cyan: "CYBER CYAN", dracula: "DRACULA", mono: "MONO", cappuccino: "CAPPUCCINO" };
  const commands = ["help", "about", "skills", "projects", "notes", "repos", "ls", "neofetch", "theme", "crt", "sfx", "matrix", "gui", "cli", "radio", "snake", "pong", "clear", "whoami", "date"];
  const state = { history: [], historyIndex: -1, sfx: localStorage.getItem("tui_sfx") === "true", crt: localStorage.getItem("tui_crt") !== "false", mode: "cli", matrix: false, audio: null, radioPlaying: false };

  const beep = (frequency = 620, duration = 0.045, type = "square") => {
    if (!state.sfx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const context = state.audio || (state.audio = new AudioContext());
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.035, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + duration);
    } catch (_) { /* Audio is an enhancement; commands remain usable without it. */ }
  };

  const print = (text, className = "at-cli-line") => {
    if (!output) return;
    const line = document.createElement("p");
    line.className = className;
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
    return line;
  };

  const printLinks = (source, label) => {
    print(`${label}/`, "at-cli-line at-cli-accent");
    (commandSources.get(source) || []).slice(0, 10).forEach((item, index) => {
      const line = document.createElement("p");
      line.className = "at-cli-line";
      const number = document.createElement("strong");
      number.textContent = `${String(index + 1).padStart(2, "0")} `;
      const link = document.createElement("a");
      link.href = item.href;
      link.textContent = item.title;
      line.append(number, link);
      output.appendChild(line);
    });
    if (!commandSources.get(source)?.length) print("(empty archive)", "at-cli-line at-cli-dim");
    output.scrollTop = output.scrollHeight;
  };

  const setTheme = (name) => {
    const theme = themes.includes(name) ? name : "green";
    body.dataset.atTheme = theme;
    root.dataset.atTheme = theme;
    if (themeSelect) themeSelect.value = theme;
    if (themeLabel) themeLabel.textContent = themeNames[theme];
    localStorage.setItem("tui_theme", theme);
    beep(640, 0.05);
  };

  const setCrt = (enabled) => {
    state.crt = enabled;
    body.classList.toggle("at-crt-off", !enabled);
    const button = app.querySelector('[data-at-action="crt"]');
    button?.setAttribute("aria-pressed", String(enabled));
    localStorage.setItem("tui_crt", String(enabled));
  };

  const setMode = (mode) => {
    state.mode = mode === "gui" ? "gui" : "cli";
    const cli = state.mode === "cli";
    if (cliView) cliView.hidden = !cli;
    if (guiView) guiView.hidden = cli;
    app.querySelectorAll("[data-at-mode]").forEach((tab) => {
      const active = tab.dataset.atMode === state.mode;
      tab.setAttribute("aria-selected", String(active));
    });
    if (modeLabel) modeLabel.textContent = state.mode.toUpperCase();
    if (pathLabel) pathLabel.textContent = cli ? "~/portfolio" : "~/dashboard";
    if (cli) window.setTimeout(() => input?.focus(), 80);
    beep(cli ? 500 : 700, 0.04);
  };

  const run = (raw) => {
    const command = raw.trim();
    if (!command) return;
    print(`❯ ${command}`, "at-cli-line at-cli-dim");
    const [verb, ...args] = command.toLowerCase().split(/\s+/);
    if (verb === "clear") { output.replaceChildren(); return; }
    if (verb === "help") {
      print("help       show this command index"); print("ls notes   list local engineering notes"); print("ls projects list local project records"); print("about      open the profile route"); print("skills     show the current engineering stack"); print("neofetch   inspect the site runtime"); print("theme NAME switch CRT palette (green/amber/cyan/dracula/mono/cappuccino)"); print("crt / sfx  toggle visual scanlines or key sounds"); print("gui / cli  switch dashboard mode"); print("radio      open local audio widget"); print("snake/pong open playable arcade widgets"); print("matrix     toggle the Matrix overlay");
      return;
    }
    if (verb === "ls" || verb === "list") { const target = args[0] === "projects" ? "projects" : "notes"; printLinks(target, target); return; }
    if (verb === "notes" || verb === "blog") { printLinks("notes", "notes"); return; }
    if (verb === "projects" || verb === "collabs" || verb === "repos") { printLinks("projects", verb); return; }
    if (verb === "about") { const profile = commandSources.get("about")?.[0]; if (profile) window.location.href = profile.href; return; }
    if (verb === "skills") { print("AI APP / RAG / AGENTS / JAVA / PYTHON / SPRING / FASTAPI", "at-cli-line at-cli-accent"); print("engineering archive: local-first, bilingual, reproducible", "at-cli-line at-cli-dim"); return; }
    if (verb === "neofetch") { print("YOYO@ENGINEERING-LAB", "at-cli-line at-cli-accent"); print("OS: Hugo static runtime"); print("KERNEL: Astro TUI source remix"); print(`THEME: ${themeNames[body.dataset.atTheme || "green"]}`); print(`MODE: ${state.mode.toUpperCase()} / CRT: ${state.crt ? "ON" : "OFF"}`); print("CONTENT: Chinese-first engineering archive"); return; }
    if (verb === "theme") { if (args[0] && themes.includes(args[0])) { setTheme(args[0]); print(`palette loaded: ${themeNames[args[0]]}`, "at-cli-line at-cli-accent"); } else print(`themes: ${themes.join(" / ")}`); return; }
    if (verb === "crt") { setCrt(!state.crt); print(`CRT scanlines: ${state.crt ? "ON" : "OFF"}`, "at-cli-line at-cli-accent"); return; }
    if (verb === "sfx") { state.sfx = !state.sfx; localStorage.setItem("tui_sfx", String(state.sfx)); app.querySelector('[data-at-action="sfx"]')?.setAttribute("aria-pressed", String(state.sfx)); beep(700); print(`audio feedback: ${state.sfx ? "ON" : "OFF"}`, "at-cli-line at-cli-accent"); return; }
    if (verb === "gui" || verb === "dashboard") { setMode("gui"); return; }
    if (verb === "cli") { setMode("cli"); return; }
    if (verb === "matrix") { toggleMatrix(); return; }
    if (verb === "radio" || verb === "music") { openWidget("radio"); return; }
    if (verb === "snake") { openWidget("snake"); return; }
    if (verb === "pong") { openWidget("pong"); return; }
    if (verb === "whoami") { print("guest@engineering-lab / curious builder"); return; }
    if (verb === "date") { print(new Date().toString()); return; }
    print(`command not found: ${command}. Type help.`, "at-cli-line at-cli-dim");
  };

  const openWidget = (name) => {
    const template = document.querySelector(`[data-at-template="${name}"]`);
    if (!template || !modalLayer || !modalContent) return;
    modalContent.replaceChildren(...[...template.children].map((child) => child.cloneNode(true)));
    if (modalTitle) modalTitle.textContent = name.toUpperCase();
    modalLayer.hidden = false;
    modalLayer.dataset.atWidget = name;
    if (name === "snake") initSnake();
    if (name === "pong") initPong();
    modalContent.querySelector("[data-at-radio-toggle]")?.addEventListener("click", toggleRadio);
    modalContent.querySelector("[data-at-snake-start]")?.addEventListener("click", startSnake);
    modalContent.querySelector("[data-at-pong-start]")?.addEventListener("click", startPong);
    beep(740, 0.05);
  };
  const closeWidget = () => { modalLayer.hidden = true; stopSnake(); stopPong(); if (state.radioPlaying) toggleRadio(); };

  let audioOscillator = null;
  const toggleRadio = () => {
    state.radioPlaying = !state.radioPlaying;
    if (state.radioPlaying) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) { state.audio = state.audio || new AudioContext(); audioOscillator = state.audio.createOscillator(); const gain = state.audio.createGain(); audioOscillator.type = "triangle"; audioOscillator.frequency.value = 196; gain.gain.value = 0.018; audioOscillator.connect(gain).connect(state.audio.destination); audioOscillator.start(); }
      } catch (_) { /* Browser audio may require a user gesture. */ }
      if (status) status.textContent = "RADIO: PLAYING";
      modalContent?.querySelector("[data-at-radio-toggle]")?.replaceChildren(document.createTextNode("■ STOP SIGNAL"));
      modalContent?.querySelector("[data-at-audio-meter]")?.classList.add("is-playing");
    } else {
      audioOscillator?.stop(); audioOscillator = null;
      if (status) status.textContent = "RADIO: OFF";
      modalContent?.querySelector("[data-at-radio-toggle]")?.replaceChildren(document.createTextNode("▶ PLAY SIGNAL"));
      modalContent?.querySelector("[data-at-audio-meter]")?.classList.remove("is-playing");
    }
    beep(760, 0.05);
  };

  let matrixTimer = null;
  const toggleMatrix = (force) => {
    state.matrix = typeof force === "boolean" ? force : !state.matrix;
    if (!overlay) return;
    overlay.hidden = !state.matrix;
    if (!state.matrix) { if (matrixTimer) cancelAnimationFrame(matrixTimer); matrixTimer = null; return; }
    const canvas = overlayCanvas; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize, { once: true });
    const chars = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*+~<>?/\\{}[]"; const fontSize = 15; let drops = [];
    const draw = () => { if (!state.matrix) return; if (!drops.length || drops.length !== Math.floor(canvas.width / fontSize)) drops = Array.from({ length: Math.floor(canvas.width / fontSize) }, () => Math.random() * -30); ctx.fillStyle = "rgba(0,0,0,.08)"; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = getComputedStyle(body).getPropertyValue("--tui-fg").trim() || "#00ff66"; ctx.font = `${fontSize}px monospace`; drops.forEach((drop, i) => { ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize, drop * fontSize); if (drop * fontSize > canvas.height && Math.random() > .975) drops[i] = 0; drops[i] += 1; }); matrixTimer = requestAnimationFrame(draw); };
    draw(); beep(700, 0.08);
  };

  let snakeTimer = null; let snakeState = null;
  const drawSnake = () => { if (!snakeState) return; const { canvas, ctx, snake, food, grid } = snakeState; ctx.fillStyle = "#050805"; ctx.fillRect(0, 0, canvas.width, canvas.height); const size = canvas.width / grid; ctx.strokeStyle = getComputedStyle(body).getPropertyValue("--tui-border"); for (let i = 0; i <= grid; i++) { ctx.beginPath(); ctx.moveTo(i * size, 0); ctx.lineTo(i * size, canvas.height); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, i * size); ctx.lineTo(canvas.width, i * size); ctx.stroke(); } ctx.fillStyle = getComputedStyle(body).getPropertyValue("--tui-fg"); snake.forEach((part) => ctx.fillRect(part.x * size + 1, part.y * size + 1, size - 2, size - 2)); ctx.fillStyle = getComputedStyle(body).getPropertyValue("--tui-accent"); ctx.fillRect(food.x * size + 2, food.y * size + 2, size - 4, size - 4); };
  const startSnake = () => { if (!snakeState) return; snakeState.running = true; snakeState.snake = [{ x: 8, y: 6 }, { x: 7, y: 6 }, { x: 6, y: 6 }]; snakeState.dir = { x: 1, y: 0 }; snakeState.score = 0; const score = modalContent.querySelector("[data-at-snake-score]"); if (score) score.textContent = "0"; if (snakeTimer) clearInterval(snakeTimer); snakeTimer = setInterval(() => { if (!snakeState?.running) return; const next = { x: snakeState.snake[0].x + snakeState.dir.x, y: snakeState.snake[0].y + snakeState.dir.y }; if (next.x < 0 || next.y < 0 || next.x >= snakeState.grid || next.y >= snakeState.grid || snakeState.snake.some((part) => part.x === next.x && part.y === next.y)) { snakeState.running = false; clearInterval(snakeTimer); return; } snakeState.snake.unshift(next); if (next.x === snakeState.food.x && next.y === snakeState.food.y) { snakeState.score += 1; snakeState.food = { x: Math.floor(Math.random() * snakeState.grid), y: Math.floor(Math.random() * snakeState.grid) }; if (score) score.textContent = String(snakeState.score); beep(900, 0.035); } else snakeState.snake.pop(); drawSnake(); }, 125); };
  const stopSnake = () => { if (snakeTimer) clearInterval(snakeTimer); snakeTimer = null; snakeState = null; };
  const initSnake = () => { const canvas = modalContent.querySelector("[data-at-snake-canvas]"); if (!canvas) return; snakeState = { canvas, ctx: canvas.getContext("2d"), grid: 18, snake: [{ x: 8, y: 6 }], food: { x: 13, y: 7 }, dir: { x: 1, y: 0 }, running: false, score: 0 }; drawSnake(); };

  let pongTimer = null; let pongState = null;
  const drawPong = () => { if (!pongState) return; const { canvas, ctx } = pongState; ctx.fillStyle = "#050805"; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.strokeStyle = getComputedStyle(body).getPropertyValue("--tui-border"); ctx.setLineDash([4, 6]); ctx.beginPath(); ctx.moveTo(canvas.width / 2, 0); ctx.lineTo(canvas.width / 2, canvas.height); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = getComputedStyle(body).getPropertyValue("--tui-fg"); ctx.fillRect(14, pongState.left, 7, 48); ctx.fillRect(canvas.width - 21, pongState.right, 7, 48); ctx.fillRect(pongState.ball.x, pongState.ball.y, 7, 7); };
  const startPong = () => { if (!pongState) return; pongState.running = true; if (pongTimer) clearInterval(pongTimer); pongTimer = setInterval(() => { const s = pongState; s.ball.x += s.ball.vx; s.ball.y += s.ball.vy; if (s.ball.y <= 0 || s.ball.y >= s.canvas.height - 7) s.ball.vy *= -1; s.right += (s.ball.y - s.right - 20) * .08; if (s.ball.x <= 21 && s.ball.y > s.left - 4 && s.ball.y < s.left + 55) s.ball.vx = Math.abs(s.ball.vx); if (s.ball.x >= s.canvas.width - 28 && s.ball.y > s.right - 4 && s.ball.y < s.right + 55) s.ball.vx = -Math.abs(s.ball.vx); if (s.ball.x < -10 || s.ball.x > s.canvas.width + 10) { if (s.ball.x < 0) s.cpu += 1; else s.you += 1; s.ball = { x: s.canvas.width / 2, y: s.canvas.height / 2, vx: s.ball.x < 0 ? 3 : -3, vy: 2 }; modalContent.querySelector("[data-at-pong-score]").textContent = String(s.you); modalContent.querySelector("[data-at-cpu-score]").textContent = String(s.cpu); } drawPong(); }, 24); };
  const stopPong = () => { if (pongTimer) clearInterval(pongTimer); pongTimer = null; pongState = null; };
  const initPong = () => { const canvas = modalContent.querySelector("[data-at-pong-canvas]"); if (!canvas) return; pongState = { canvas, ctx: canvas.getContext("2d"), left: 96, right: 96, ball: { x: 208, y: 116, vx: 3, vy: 2 }, you: 0, cpu: 0, running: false }; canvas.addEventListener("pointermove", (event) => { const rect = canvas.getBoundingClientRect(); pongState.left = (event.clientY - rect.top) * (canvas.height / rect.height) - 24; }); drawPong(); };

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { if (state.matrix) toggleMatrix(false); else if (!modalLayer.hidden) closeWidget(); }
    if (modalLayer.hidden || modalLayer.dataset.atWidget !== "snake" || !snakeState) return;
    if (event.code === "Space") { snakeState.running = !snakeState.running; event.preventDefault(); return; }
    const keys = { ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 } };
    const direction = keys[event.key]; if (direction && !(direction.x === -snakeState.dir.x && direction.y === -snakeState.dir.y)) { snakeState.dir = direction; event.preventDefault(); }
  });
  app.querySelector("[data-at-form]")?.addEventListener("submit", (event) => { event.preventDefault(); const raw = input.value; if (!raw.trim()) return; state.history.push(raw.trim()); state.historyIndex = -1; input.value = ""; run(raw); });
  input?.addEventListener("keydown", (event) => { if (event.key === "Tab") { event.preventDefault(); const value = input.value.toLowerCase(); const matches = commands.filter((command) => command.startsWith(value)); if (matches.length === 1) { input.value = `${matches[0]} `; beep(600); } else if (matches.length > 1) print(`possible: ${matches.join("  ")}`, "at-cli-line at-cli-dim"); } if (event.key === "ArrowUp") { event.preventDefault(); if (state.history.length) { state.historyIndex = Math.min(state.historyIndex + 1, state.history.length - 1); input.value = state.history[state.history.length - 1 - state.historyIndex]; } } if (event.key === "ArrowDown") { event.preventDefault(); if (state.historyIndex > 0) { state.historyIndex -= 1; input.value = state.history[state.history.length - 1 - state.historyIndex]; } else { state.historyIndex = -1; input.value = ""; } } });
  app.querySelectorAll("[data-at-command]").forEach((button) => button.addEventListener("click", () => run(button.dataset.atCommand || "")));
  app.querySelectorAll("[data-at-mode]").forEach((button) => button.addEventListener("click", () => setMode(button.dataset.atMode)));
  themeSelect?.addEventListener("change", () => setTheme(themeSelect.value));
  app.querySelectorAll("[data-at-action]").forEach((button) => button.addEventListener("click", () => { const action = button.dataset.atAction; if (action === "crt") setCrt(!state.crt); if (action === "sfx") { state.sfx = !state.sfx; localStorage.setItem("tui_sfx", String(state.sfx)); button.setAttribute("aria-pressed", String(state.sfx)); beep(700); } if (action === "matrix") toggleMatrix(); if (action === "radio") openWidget("radio"); if (action === "snake") openWidget("snake"); if (action === "pong") openWidget("pong"); }));
  document.querySelector("[data-at-close-modal]")?.addEventListener("click", closeWidget); modalLayer?.addEventListener("click", (event) => { if (event.target === modalLayer) closeWidget(); }); document.querySelector("[data-at-close-overlay]")?.addEventListener("click", () => toggleMatrix(false));
  document.querySelectorAll("[data-at-window]").forEach((button) => button.addEventListener("click", () => { const action = button.dataset.atWindow; if (action === "compact") app.classList.toggle("at-compact"); if (action === "wide") app.classList.toggle("at-wide"); if (action === "reset") { app.classList.remove("at-compact", "at-wide"); setMode("cli"); output.replaceChildren(); print("terminal reset: ready", "at-cli-line at-cli-accent"); } }));

  const updateClock = () => { const now = new Date(); const time = now.toLocaleTimeString([], { hour12: false }); document.querySelectorAll("[data-at-clock], [data-at-footer-clock]").forEach((element) => { element.textContent = element.matches("[data-at-footer-clock]") ? `${time} LOCAL` : time; }); };
  updateClock(); window.setInterval(updateClock, 1000);
  setTheme(localStorage.getItem("tui_theme") || "green"); setCrt(state.crt); app.querySelector('[data-at-action="sfx"]')?.setAttribute("aria-pressed", String(state.sfx)); setMode("cli");
})();
