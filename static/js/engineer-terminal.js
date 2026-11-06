(() => {
  const shell = document.querySelector("[data-terminal-shell]");
  const palette = document.querySelector("[data-command-palette]");
  const form = document.querySelector("[data-terminal-form]");
  const output = document.querySelector("[data-terminal-output]");
  const input = document.querySelector("[data-terminal-input]");
  const prompt = document.querySelector("[data-terminal-prompt]");
  const locationLabel = document.querySelector("[data-terminal-location]");
  const status = document.querySelector("[data-terminal-status]");
  const skipBootButton = document.querySelector("[data-terminal-skip]");
  const isChinese = document.documentElement.lang.startsWith("zh");

  const initStarfield = () => {
    if (!document.querySelector(".et-hero") || document.querySelector(".et-starfield-canvas")) return;
    const canvas = document.createElement("canvas");
    canvas.className = "et-starfield-canvas";
    canvas.setAttribute("aria-hidden", "true");
    document.body.prepend(canvas);
    const context = canvas.getContext("2d");
    if (!context) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let ratio = 1;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let stars = [];
    const setSize = () => {
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(150, Math.max(70, Math.floor((width * height) / 11000)));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.25 + .25,
        alpha: Math.random() * .48 + .16,
        drift: Math.random() * .18 + .04,
      }));
    };
    const draw = () => {
      context.clearRect(0, 0, width, height);
      const offsetX = pointerX * 12;
      const offsetY = pointerY * 9;
      stars.forEach((star) => {
        if (!reducedMotion.matches) star.y -= star.drift;
        if (star.y < -3) star.y = height + 3;
        const x = star.x + offsetX * (star.radius / 2.2);
        const y = star.y + offsetY * (star.radius / 2.2);
        context.fillStyle = `rgba(139, 219, 186, ${star.alpha})`;
        context.beginPath();
        context.arc(x, y, star.radius, 0, Math.PI * 2);
        context.fill();
      });
      if (document.body.dataset.terminalMode === "cyber") {
        context.strokeStyle = "rgba(83, 216, 162, .08)";
        context.lineWidth = 1;
        for (let index = 0; index < stars.length; index += 1) {
          const first = stars[index];
          for (let next = index + 1; next < stars.length; next += 1) {
            const second = stars[next];
            const distance = Math.hypot(first.x - second.x, first.y - second.y);
            if (distance > 105) continue;
            context.beginPath();
            context.moveTo(first.x + offsetX * .2, first.y + offsetY * .2);
            context.lineTo(second.x + offsetX * .2, second.y + offsetY * .2);
            context.stroke();
          }
        }
      }
      if (!reducedMotion.matches) frame = window.requestAnimationFrame(draw);
    };
    window.addEventListener("resize", () => {
      setSize();
      if (reducedMotion.matches) draw();
    }, { passive: true });
    window.addEventListener("pointermove", (event) => {
      pointerX = event.clientX / Math.max(1, width) - .5;
      pointerY = event.clientY / Math.max(1, height) - .5;
      if (reducedMotion.matches) draw();
    }, { passive: true });
    reducedMotion.addEventListener?.("change", () => {
      if (reducedMotion.matches && frame) window.cancelAnimationFrame(frame);
      if (!reducedMotion.matches) frame = window.requestAnimationFrame(draw);
      draw();
    });
    setSize();
    draw();
  };

  const initCyberMode = () => {
    const toggle = document.querySelector("[data-cyber-toggle]");
    if (!toggle) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let matrixFrame = 0;
    let matrixCanvas = null;
    let matrixContext = null;
    let matrixColumns = [];
    let matrixWidth = 0;
    let matrixHeight = 0;
    const matrixChars = "01{}[]<>/\\#$%AI";
    const storageKey = "yoyo-terminal-cyber";
    const readPreference = () => {
      try { return window.localStorage.getItem(storageKey) === "true"; } catch (_error) { return false; }
    };
    const writePreference = (enabled) => {
      try { window.localStorage.setItem(storageKey, String(enabled)); } catch (_error) { /* storage may be blocked */ }
    };
    const resizeMatrix = () => {
      if (!matrixCanvas || !matrixContext) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      matrixWidth = window.innerWidth;
      matrixHeight = window.innerHeight;
      matrixCanvas.width = Math.floor(matrixWidth * ratio);
      matrixCanvas.height = Math.floor(matrixHeight * ratio);
      matrixCanvas.style.width = `${matrixWidth}px`;
      matrixCanvas.style.height = `${matrixHeight}px`;
      matrixContext.setTransform(ratio, 0, 0, ratio, 0, 0);
      matrixColumns = Array.from({ length: Math.ceil(matrixWidth / 18) }, () => Math.random() * (matrixHeight / 16));
    };
    const drawMatrix = () => {
      if (!matrixContext || !matrixCanvas || document.body.dataset.terminalMode !== "cyber") return;
      matrixContext.fillStyle = "rgba(12, 15, 18, 0.12)";
      matrixContext.fillRect(0, 0, matrixWidth, matrixHeight);
      matrixContext.fillStyle = "#53d8a2";
      matrixContext.font = "11px ui-monospace, monospace";
      matrixColumns.forEach((y, index) => {
        const x = index * 18;
        const character = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        matrixContext.globalAlpha = 0.28 + Math.random() * 0.5;
        matrixContext.fillText(character, x, y * 16);
        matrixColumns[index] = y * 16 > matrixHeight && Math.random() > 0.975 ? 0 : y + 0.35;
      });
      matrixContext.globalAlpha = 1;
      matrixFrame = window.requestAnimationFrame(drawMatrix);
    };
    const stopMatrix = () => {
      if (matrixFrame) window.cancelAnimationFrame(matrixFrame);
      matrixFrame = 0;
      matrixCanvas?.remove();
      matrixCanvas = null;
      matrixContext = null;
    };
    const startMatrix = () => {
      if (reducedMotion.matches || matrixCanvas) return;
      matrixCanvas = document.createElement("canvas");
      matrixCanvas.className = "et-matrix-canvas";
      matrixCanvas.setAttribute("aria-hidden", "true");
      document.body.append(matrixCanvas);
      matrixContext = matrixCanvas.getContext("2d");
      resizeMatrix();
      drawMatrix();
    };
    const setMode = (enabled, persist = true) => {
      document.body.dataset.terminalMode = enabled ? "cyber" : "terminal";
      toggle.setAttribute("aria-pressed", String(enabled));
      toggle.title = enabled ? (isChinese ? "关闭赛博特效" : "Disable cyber effects") : (isChinese ? "开启赛博特效" : "Enable cyber effects");
      if (persist) writePreference(enabled);
      if (enabled) startMatrix(); else stopMatrix();
    };
    toggle.addEventListener("click", () => setMode(toggle.getAttribute("aria-pressed") !== "true"));
    window.addEventListener("resize", resizeMatrix, { passive: true });
    reducedMotion.addEventListener?.("change", () => {
      if (reducedMotion.matches) stopMatrix();
      else if (document.body.dataset.terminalMode === "cyber") startMatrix();
    });
    setMode(readPreference(), false);
  };

  const initTraceStages = () => {
    const detail = document.querySelector("[data-trace-detail]");
    const stages = Array.from(document.querySelectorAll("[data-trace-stage]"));
    if (!detail || !stages.length) return;
    const evidence = {
      gateway: isChinese ? "18ms · /retrieve · 网关已接收请求。" : "18ms · /retrieve · gateway accepted the request.",
      retrieval: isChinese ? "42ms · top_k=5 · 命中率 0.94 · 返回 3 个可引用片段。" : "42ms · top_k=5 · hit 0.94 · returned 3 citable chunks.",
      model: isChinese ? "88ms · retry=1 · 超时分支已触发，保留可观测上下文。" : "88ms · retry=1 · timeout branch recorded with trace context.",
      response: isChinese ? "36ms · citation envelope · 响应已返回并附带来源。" : "36ms · citation envelope · response returned with sources.",
    };
    stages.forEach((stage) => stage.addEventListener("click", () => {
      stages.forEach((item) => item.setAttribute("aria-expanded", String(item === stage)));
      detail.textContent = evidence[stage.dataset.traceStage] || "";
    }));
  };

  initStarfield();
  initCyberMode();
  initTraceStages();

  const initCommandPalette = () => {
    if (!palette) return;
    const paletteInput = palette.querySelector("[data-palette-input]");
    const paletteResults = palette.querySelector("[data-palette-results]");
    const paletteOpenButton = document.querySelector("[data-palette-open]");
    const paletteDialog = palette.querySelector(".et-command-palette-dialog");
    const paletteEntries = Array.from(palette.querySelectorAll("[data-palette-entry]")).map((link) => ({
      title: link.dataset.paletteTitle || link.textContent.trim(),
      section: link.dataset.paletteSection || "archive",
      summary: link.dataset.paletteSummary || "",
      href: link.getAttribute("href"),
    }));
    let selectedIndex = 0;
    let paletteMatches = paletteEntries;
    let previousFocus = null;
    const sectionLabel = (section) => ({
      blog: isChinese ? "文章" : "ARTICLE",
      projects: isChinese ? "项目" : "PROJECT",
      "ui-lab": isChinese ? "实验室" : "LAB",
      "tech-stack": isChinese ? "技术栈" : "STACK",
    }[section] || section.toUpperCase());
    const render = () => {
      paletteResults.replaceChildren();
      paletteMatches.slice(0, 10).forEach((entry, index) => {
        const button = document.createElement("a");
        button.href = entry.href;
        button.className = `et-palette-result${index === selectedIndex ? " is-selected" : ""}`;
        button.setAttribute("role", "option");
        button.setAttribute("aria-selected", index === selectedIndex ? "true" : "false");
        const section = document.createElement("span");
        section.className = "et-palette-result-section";
        section.textContent = sectionLabel(entry.section);
        const copy = document.createElement("span");
        copy.className = "et-palette-result-copy";
        const title = document.createElement("strong");
        title.textContent = entry.title;
        copy.append(title);
        if (entry.summary) {
          const summary = document.createElement("small");
          summary.textContent = entry.summary;
          copy.append(summary);
        }
        button.append(section, copy);
        paletteResults.append(button);
      });
      if (!paletteMatches.length) {
        const empty = document.createElement("p");
        empty.className = "et-palette-empty";
        empty.textContent = isChinese ? "没有匹配的公开记录。" : "No public records matched.";
        paletteResults.append(empty);
      }
    };
    const close = () => {
      palette.hidden = true;
      document.body.classList.remove("et-palette-open");
      previousFocus?.focus({ preventScroll: true });
    };
    const open = () => {
      previousFocus = document.activeElement;
      palette.hidden = false;
      document.body.classList.add("et-palette-open");
      paletteInput.value = "";
      paletteMatches = paletteEntries;
      selectedIndex = 0;
      render();
      paletteInput.focus({ preventScroll: true });
    };
    const filter = () => {
      const query = paletteInput.value.trim().toLocaleLowerCase();
      paletteMatches = query ? paletteEntries.filter((entry) => `${entry.title} ${entry.summary} ${entry.section}`.toLocaleLowerCase().includes(query)) : paletteEntries;
      selectedIndex = 0;
      render();
    };
    paletteInput.addEventListener("input", filter);
    paletteInput.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") { event.preventDefault(); selectedIndex = Math.min(Math.max(0, paletteMatches.length - 1), selectedIndex + 1); render(); }
      if (event.key === "ArrowUp") { event.preventDefault(); selectedIndex = Math.max(0, selectedIndex - 1); render(); }
      if (event.key === "Enter" && paletteMatches[selectedIndex]) { event.preventDefault(); window.location.assign(paletteMatches[selectedIndex].href); }
      if (event.key === "Escape") { event.preventDefault(); close(); }
    });
    palette.querySelectorAll("[data-palette-close]").forEach((element) => element.addEventListener("click", close));
    paletteOpenButton?.addEventListener("click", open);
    document.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); palette.hidden ? open() : close(); }
      if (event.key === "Escape" && !palette.hidden) close();
      if (event.key === "Tab" && !palette.hidden && paletteDialog) {
        const focusable = Array.from(paletteDialog.querySelectorAll("button, input, a[href]"));
        if (!focusable.length) return;
        const current = focusable.indexOf(document.activeElement);
        const next = event.shiftKey ? (current <= 0 ? focusable.length - 1 : current - 1) : (current === focusable.length - 1 ? 0 : current + 1);
        event.preventDefault();
        focusable[next].focus();
      }
    });
    render();
  };

  initCommandPalette();

  const initCodeBlocks = () => {
    document.querySelectorAll(".et-prose pre").forEach((pre) => {
      const code = pre.querySelector("code");
      if (!code || pre.dataset.enhanced === "true") return;
      pre.dataset.enhanced = "true";
      const source = code.textContent.replace(/\n$/, "");
      if (!code.children.length) {
        const fragment = document.createDocumentFragment();
        source.split("\n").forEach((line) => {
          const row = document.createElement("span");
          row.className = "et-code-line";
          row.textContent = line || " ";
          fragment.append(row);
        });
        code.replaceChildren(fragment);
      }
      const copy = document.createElement("button");
      copy.type = "button";
      copy.className = "code-copy";
      copy.textContent = isChinese ? "复制" : "Copy";
      copy.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(source);
          copy.textContent = isChinese ? "已复制" : "Copied";
          window.setTimeout(() => { copy.textContent = isChinese ? "复制" : "Copy"; }, 1400);
        } catch (_error) {
          copy.textContent = isChinese ? "复制失败" : "Copy failed";
        }
      });
      pre.append(copy);
    });
  };
  initCodeBlocks();
  if (!shell || !form || !output || !input) return;
  const labels = isChinese
    ? { projects: "项目", blog: "文章", about: "关于", incidents: "故障复盘", decisions: "架构决策", docs: "技术文档", stack: "技术栈", contact: "联系" }
    : { projects: "Projects", blog: "Articles", about: "About", incidents: "Incidents", decisions: "Decisions", docs: "Docs", stack: "Stack", contact: "Contact" };
  const sources = Object.fromEntries(
    ["projects", "logs", "about", "incidents", "decisions", "docs", "stack", "contact"].map((name) => {
      const source = document.querySelector(`[data-terminal-source="${name}"]`);
      const links = source ? Array.from(source.querySelectorAll("a")).filter((link) => link.dataset.archiveOnly !== "true") : [];
      return [name, links.map((link) => ({
        title: link.textContent.trim(),
        summary: link.dataset.summary || "",
        tags: (link.dataset.tags || "").split(",").map((tag) => tag.trim().toLocaleLowerCase()).filter(Boolean),
        href: link.getAttribute("href"),
        section: name,
      }))];
    }),
  );
  const posts = sources.logs || [];
  const projects = sources.projects || [];
  const allEntries = [...projects, ...posts];
  const commandHistory = [];
  const commandNames = ["help", "ls", "pwd", "whoami", "date", "projects", "posts", "blog", "logs", "about", "stack", "contact", "find", "search", "open", "cd", "history", "clear", "cls", "exit"];
  let historyIndex = 0;
  let currentDirectory = "~";
  let lastResults = [];
  let skipBoot = false;

  const writeLine = (text, className = "et-console-result") => {
    const line = document.createElement("p");
    line.className = className;
    line.textContent = text;
    output.append(line);
    return line;
  };

  const writeResults = (entries) => {
    lastResults = entries;
    if (!entries.length) {
      writeLine(isChinese ? "没有匹配的已发布条目。" : "No published entries matched.");
      return;
    }

    const list = document.createElement("div");
    list.className = "et-console-links";
    entries.slice(0, 12).forEach((entry, index) => {
      const link = document.createElement("a");
      link.className = "et-console-result-link";
      link.href = entry.href;
      link.dataset.resultIndex = String(index + 1);

      const number = document.createElement("span");
      number.className = "et-console-result-number";
      number.textContent = String(index + 1).padStart(2, "0");

      const copy = document.createElement("span");
      copy.className = "et-console-result-copy";
      const title = document.createElement("strong");
      title.textContent = entry.title;
      copy.append(title);
      if (entry.summary) {
        const summary = document.createElement("small");
        summary.textContent = entry.summary;
        copy.append(summary);
      }

      link.append(number, copy);
      list.append(link);
    });
    output.append(list);
    if (entries.length > 12) {
      writeLine(isChinese ? `显示前 12 条，共 ${entries.length} 条。可用 find <关键词> 缩小范围。` : `Showing 12 of ${entries.length}. Use find <query> to narrow the list.`);
    }
  };

  const scrollOutput = () => {
    output.scrollTop = output.scrollHeight;
  };

  const setStatus = (value, state = "ready") => {
    if (!status) return;
    status.textContent = value;
    status.dataset.state = state;
  };

  const updatePrompt = () => {
    const path = currentDirectory === "~" ? "~" : `~/${currentDirectory}`;
    if (prompt) prompt.textContent = `yoyo@engineering-lab:${path}$`;
    if (locationLabel) locationLabel.textContent = path;
  };

  const tokenize = (command) => {
    const tokens = [];
    command.replace(/"([^"]*)"|'([^']*)'|(\S+)/g, (_match, doubleQuoted, singleQuoted, bare) => {
      tokens.push(doubleQuoted ?? singleQuoted ?? bare);
      return "";
    });
    return tokens;
  };

  const resolveDirectory = (name) => {
    const normalized = name.toLowerCase().replace(/^\.\//, "").replace(/\/$/, "");
    const aliases = { articles: "blog", logs: "blog", notes: "blog", doc: "docs", decisions: "decisions", incident: "incidents" };
    const candidate = aliases[normalized] || normalized;
    return Object.hasOwn(labels, candidate) ? candidate : null;
  };

  const listDirectory = (directory) => {
    if (directory === "~") {
      writeLine(isChinese ? "目录：about/  blog/  projects/  incidents/  decisions/  docs/" : "Directories: about/  blog/  projects/  incidents/  decisions/  docs/");
      writeLine(isChinese ? "使用 ls <目录> 查看已发布内容。" : "Use ls <directory> to inspect published entries.");
      return;
    }
    const key = directory === "blog" ? "logs" : directory;
    const entries = sources[key] || [];
    if (["incidents", "decisions"].includes(directory) && entries.length === 0) {
      writeLine(isChinese ? `${labels[directory]}目录目前没有已发布条目。` : `${labels[directory]} has no published entries yet.`);
      const archive = entries[0];
      if (archive) writeResults([archive]);
      return;
    }
    writeLine(isChinese ? `${labels[directory]} · ${entries.length} 条已发布记录` : `${labels[directory]} · ${entries.length} published records`);
    writeResults(entries);
  };

  const navigateTo = (entry) => {
    if (!entry?.href) return false;
    setStatus(isChinese ? "打开记录" : "OPENING", "active");
    window.location.assign(entry.href);
    return true;
  };

  const searchEntries = (query) => {
    const normalized = query.toLocaleLowerCase();
    return allEntries.filter((entry) => `${entry.title} ${entry.summary} ${entry.section}`.toLocaleLowerCase().includes(normalized));
  };

  const runCommand = (rawCommand) => {
    const commandText = rawCommand.trim();
    if (!commandText) return;
    const tokens = tokenize(commandText);
    const command = tokens.shift()?.toLowerCase() || "";
    const args = tokens;
    const argumentText = args.join(" ");
    const promptLine = document.createElement("p");
    promptLine.className = "et-console-line";
    promptLine.textContent = `${prompt?.textContent || "yoyo@engineering-lab:~$"} ${commandText}`;
    output.append(promptLine);
    setStatus(isChinese ? "运行中" : "RUNNING", "active");

    switch (command) {
      case "help":
        writeLine(isChinese
          ? "help · ls [目录] · cd <目录> · pwd · projects · posts [--tag 标签] · logs [--level 级别] · stack · contact · find <关键词> · open <编号|关键词> · clear"
          : "help · ls [dir] · cd <dir> · pwd · projects · posts [--tag tag] · logs [--level level] · stack · contact · find <query> · open <number|query> · clear");
        writeLine(isChinese ? "open 的编号来自最近一次 ls 或 find 结果；仅访问本站已发布页面。" : "open uses the latest ls/find results and only visits published pages on this site.");
        break;
      case "pwd":
        writeLine(`/home/yoyo${currentDirectory === "~" ? "" : `/${currentDirectory}`}`);
        break;
      case "whoami":
      case "about":
        writeLine(isChinese ? "杨劲松 · AI 应用开发工程师 · 专注 AI 与后端系统。" : "Jinsong Yang · AI application engineer · AI and backend systems.");
        writeResults(sources.about || []);
        break;
      case "date":
        writeLine(new Intl.DateTimeFormat(undefined, { dateStyle: "full", timeStyle: "medium" }).format(new Date()));
        break;
      case "projects":
        listDirectory("projects");
        break;
      case "posts":
        if (args[0] === "--tag" && args[1]) {
          const tag = args[1].toLocaleLowerCase();
          const taggedPosts = posts.filter((entry) => entry.tags.includes(tag) || `${entry.title} ${entry.summary}`.toLocaleLowerCase().includes(tag));
          writeLine(isChinese ? `文章 · 标签 ${tag} · ${taggedPosts.length} 条结果` : `Posts · tag ${tag} · ${taggedPosts.length} result${taggedPosts.length === 1 ? "" : "s"}`);
          writeResults(taggedPosts);
        } else {
          listDirectory("blog");
        }
        break;
      case "blog":
      case "docs":
        listDirectory(command === "docs" ? "docs" : "blog");
        break;
      case "logs": {
        const requestedLevel = args[0] === "--level" ? (args[1] || "all").toUpperCase() : "ALL";
        const sampleLogs = [
          `[INFO] 2026-08-21T10:14:02Z gateway trace=7f2a route=/retrieve latency=18ms`,
          `[WARN] 2026-08-21T10:14:03Z retriever trace=7f2a top_k=5 hit=0.94 latency=42ms`,
          `[ERROR] 2026-08-21T10:14:04Z model trace=7f2a retry=1 timeout=88ms`,
        ].filter((line) => requestedLevel === "ALL" || line.includes(`[${requestedLevel}]`));
        writeLine(isChinese ? `SAMPLE DATA · 日志级别 ${requestedLevel}` : `SAMPLE DATA · log level ${requestedLevel}`);
        writeLine(sampleLogs.join("\n") || (isChinese ? "没有匹配的示例日志。" : "No sample logs matched."));
        writeLine(isChinese ? "Trace 7f2a：gateway → retrieval → model → response" : "Trace 7f2a: gateway → retrieval → model → response");
        break;
      }
      case "stack":
        writeLine(isChinese ? "技术栈档案：Java · Spring Boot · Python · FastAPI · RAG · Agent · Redis · Docker · CI/CD" : "Stack archive: Java · Spring Boot · Python · FastAPI · RAG · Agent · Redis · Docker · CI/CD");
        writeResults(sources.stack || []);
        break;
      case "contact":
        writeLine(isChinese ? "联系入口：" : "Contact endpoints:");
        writeResults(sources.contact || []);
        break;
      case "ls": {
        const directoryName = args[0] ? resolveDirectory(args[0]) : currentDirectory;
        if (args[0] && !directoryName) {
          writeLine(isChinese ? `目录不存在：${args[0]}` : `Directory not found: ${args[0]}`);
          setStatus(isChinese ? "未找到" : "NOT FOUND", "warning");
          break;
        }
        listDirectory(directoryName || "~");
        break;
      }
      case "cd": {
        const target = args[0] || "~";
        if (["~", "/home/yoyo", "/"].includes(target)) {
          currentDirectory = "~";
        } else if (target === "..") {
          currentDirectory = "~";
        } else {
          const directoryName = resolveDirectory(target);
          if (!directoryName) {
            writeLine(isChinese ? `目录不存在：${target}。使用 ls 查看可用目录。` : `Directory not found: ${target}. Use ls to see available directories.`);
            setStatus(isChinese ? "未找到" : "NOT FOUND", "warning");
            break;
          }
          currentDirectory = directoryName;
        }
        updatePrompt();
        writeLine(isChinese ? `当前目录：${currentDirectory}` : `Working directory: ${currentDirectory}`);
        break;
      }
      case "find":
      case "search": {
        if (!argumentText) {
          writeLine(isChinese ? "用法：find <关键词>" : "Usage: find <query>");
          break;
        }
        const matches = searchEntries(argumentText);
        writeLine(isChinese ? `检索 “${argumentText}” · ${matches.length} 条结果` : `Search "${argumentText}" · ${matches.length} result${matches.length === 1 ? "" : "s"}`);
        writeResults(matches);
        setStatus(isChinese ? `结果 ${matches.length}` : `${matches.length} MATCH`, "ready");
        break;
      }
      case "open": {
        if (!argumentText) {
          writeLine(isChinese ? "用法：open <编号|关键词>" : "Usage: open <number|query>");
          break;
        }
        const number = Number(argumentText);
        if (Number.isInteger(number) && number > 0 && lastResults[number - 1]) {
          navigateTo(lastResults[number - 1]);
          break;
        }
        const matches = searchEntries(argumentText);
        if (matches.length === 1) {
          navigateTo(matches[0]);
        } else if (matches.length > 1) {
          writeLine(isChinese ? `匹配到 ${matches.length} 条记录，请用 open <编号> 选择。` : `${matches.length} records matched. Select one with open <number>.`);
          writeResults(matches);
        } else {
          writeLine(isChinese ? "没有找到可打开的已发布记录。" : "No published record found to open.");
        }
        break;
      }
      case "history":
        writeLine(commandHistory.length
          ? commandHistory.map((item, index) => `${String(index + 1).padStart(2, "0")}  ${item}`).join("\n")
          : (isChinese ? "命令历史为空。" : "Command history is empty."));
        break;
      case "clear":
      case "cls":
        output.replaceChildren();
        lastResults = [];
        setStatus(isChinese ? "就绪" : "READY", "ready");
        scrollOutput();
        return;
      case "exit":
        writeLine(isChinese ? "站点档案会话仍保持打开。" : "The site archive session remains open.");
        break;
      default:
        writeLine(isChinese ? `未知命令：${command}。输入 help 查看命令。` : `Command not found: ${command}. Type help to list commands.`);
        setStatus(isChinese ? "未知命令" : "UNKNOWN CMD", "warning");
    }

    if (status?.dataset.state !== "warning") setStatus(isChinese ? "成功 · exit 0" : "SUCCESS · exit 0", "ready");
    scrollOutput();
  };

  const executeCommand = (command) => {
    commandHistory.push(command);
    historyIndex = commandHistory.length;
    runCommand(command);
    input.value = "";
    input.focus();
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    executeCommand(input.value);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      historyIndex = Math.max(0, historyIndex - 1);
      input.value = commandHistory[historyIndex] || "";
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      historyIndex = Math.min(commandHistory.length, historyIndex + 1);
      input.value = commandHistory[historyIndex] || "";
    } else if (event.key === "Tab") {
      event.preventDefault();
      const value = input.value.trim().toLowerCase();
      const candidates = commandNames.filter((name) => name.startsWith(value));
      if (candidates.length === 1) input.value = `${candidates[0]} `;
      else if (candidates.length > 1) writeLine(candidates.join("   "), "et-console-completion");
      scrollOutput();
    } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "l") {
      event.preventDefault();
      output.replaceChildren();
      lastResults = [];
      setStatus(isChinese ? "就绪" : "READY", "ready");
    } else if (event.key === "Escape") {
      input.value = "";
    }
  });

  shell.querySelectorAll("[data-terminal-command]").forEach((button) => {
    button.addEventListener("click", () => executeCommand(button.dataset.terminalCommand));
  });

  const bootLines = isChinese
    ? [
      "[init] 扫描已发布的站点内容…",
      `[index] ${posts.length} 篇文章 · ${projects.length} 个项目`,
      "[ready] 本地只读档案已就绪",
      '输入 "help" 查看可用命令。',
    ]
    : [
      "[init] Scanning published site content...",
      `[index] ${posts.length} articles · ${projects.length} projects`,
      "[ready] Local read-only archive is ready",
      'Type "help" to list available commands.',
    ];

  const boot = async () => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasBooted = window.sessionStorage.getItem("et-terminal-booted") === "true";
    skipBoot = reducedMotion || hasBooted;
    output.replaceChildren();
    if (skipBootButton) skipBootButton.hidden = skipBoot;
    for (let index = 0; index < bootLines.length; index += 1) {
      if (!skipBoot) await new Promise((resolve) => window.setTimeout(resolve, index === 0 ? 150 : 210));
      writeLine(bootLines[index], index === 2 ? "et-console-boot et-console-success" : "et-console-boot");
      scrollOutput();
    }
    shell.classList.add("is-ready");
    window.sessionStorage.setItem("et-terminal-booted", "true");
    if (skipBootButton) skipBootButton.hidden = true;
    setStatus(isChinese ? "就绪" : "READY", "ready");
    input.focus({ preventScroll: true });
  };

  skipBootButton?.addEventListener("click", () => { skipBoot = true; });
  updatePrompt();
  boot();
})();
