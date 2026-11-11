(() => {
  "use strict";

  const root = document.body;
  const command = document.querySelector("[data-cp77-command]");
  const openButton = document.querySelector("[data-cp77-open]");
  const menu = document.querySelector("[data-cp77-menu-toggle]");
  const nav = document.querySelector(".cp77-nav");
  const closeButtons = document.querySelectorAll("[data-cp77-close]");
  const search = document.querySelector("[data-cp77-search]");
  const results = document.querySelector("[data-cp77-results]");
  const clock = document.querySelector("[data-cp77-clock]");
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = motionQuery.matches;
  const backgroundNodes = Array.from(document.body.children).filter((node) => node !== command);
  const backgroundInertState = new Map(backgroundNodes.map((node) => [node, node.inert]));
  const menuQuery = window.matchMedia("(max-width: 1000px)");
  let previousDocumentOverflow = "";
  let previousBodyOverflow = "";

  const hero = document.querySelector("[data-cp77-hero]");
  const revealNodes = document.querySelectorAll("[data-cp77-reveal]");
  const onMediaChange = (query, handler) => {
    if (query.addEventListener) query.addEventListener("change", handler);
    else query.addListener(handler);
  };
  let revealObserver = null;
  const syncRevealMotion = () => {
    if (revealObserver) {
      revealObserver.disconnect();
      revealObserver = null;
    }
    if (reducedMotion || !("IntersectionObserver" in window)) {
      root.classList.remove("cp77-motion-ready");
      revealNodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }
    root.classList.add("cp77-motion-ready");
    revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealNodes.forEach((node) => {
      if (!node.classList.contains("is-visible")) revealObserver.observe(node);
    });
  };
  syncRevealMotion();
  let scrollFrame = 0;
  const syncScroll = () => {
    scrollFrame = 0;
    const scrollY = window.scrollY || 0;
    root.classList.toggle("cp77-scrolled", scrollY > 18);
    if (hero && !reducedMotion) {
      hero.style.setProperty("--cp77-hero-shift", `${Math.min(scrollY * 0.12, 42)}px`);
    }
  };
  const queueScrollSync = () => {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(syncScroll);
  };
  window.addEventListener("scroll", queueScrollSync, { passive: true });
  syncScroll();

  const heroVideo = document.querySelector("[data-cp77-hero-video]");
  if (heroVideo) {
    let heroIsVisible = true;
    const syncHeroPlayback = () => {
      if (reducedMotion || document.hidden || !heroIsVisible) {
        heroVideo.pause();
        return;
      }
      const playback = heroVideo.play();
      playback?.catch?.(() => {});
    };
    onMediaChange(motionQuery, (event) => {
      reducedMotion = event.matches;
      syncRevealMotion();
      if (reducedMotion && hero) hero.style.removeProperty("--cp77-hero-shift");
      else queueScrollSync();
      syncHeroPlayback();
    });
    document.addEventListener("visibilitychange", syncHeroPlayback);
    if ("IntersectionObserver" in window && hero) {
      const heroObserver = new IntersectionObserver(([entry]) => {
        heroIsVisible = entry.isIntersecting;
        syncHeroPlayback();
      }, { threshold: 0.01 });
      heroObserver.observe(hero);
    }
    syncHeroPlayback();
  } else {
    onMediaChange(motionQuery, (event) => {
      reducedMotion = event.matches;
      syncRevealMotion();
      if (reducedMotion && hero) hero.style.removeProperty("--cp77-hero-shift");
      else queueScrollSync();
    });
  }

  const setMenuOpen = (open, { restoreFocus = false } = {}) => {
    root.classList.toggle("cp77-menu-open", open);
    menu?.setAttribute("aria-expanded", String(open));
    if (nav) nav.inert = menuQuery.matches && !open;
    if (menu) {
      const isChinese = document.documentElement.lang.toLowerCase().startsWith("zh");
      menu.setAttribute("aria-label", open
        ? (isChinese ? "关闭导航菜单" : "Close navigation menu")
        : (isChinese ? "打开导航菜单" : "Open navigation menu"));
    }
    if (open && menuQuery.matches) {
      previousDocumentOverflow = document.documentElement.style.overflow;
      previousBodyOverflow = root.style.overflow;
      document.documentElement.style.overflow = "hidden";
      root.style.overflow = "hidden";
      nav?.querySelector("a[href]")?.focus({ preventScroll: true });
    } else if (!open) {
      document.documentElement.style.overflow = previousDocumentOverflow;
      root.style.overflow = previousBodyOverflow;
      if (restoreFocus) menu?.focus({ preventScroll: true });
    }
  };
  if (nav) nav.inert = menuQuery.matches;
  menu?.addEventListener("click", () => {
    const open = !root.classList.contains("cp77-menu-open");
    setMenuOpen(open, { restoreFocus: !open });
  });
  nav?.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuOpen(false);
  });
  document.addEventListener("click", (event) => {
    if (root.classList.contains("cp77-menu-open") && !event.target.closest(".cp77-header")) setMenuOpen(false);
  });
  onMediaChange(menuQuery, (event) => {
    if (event.matches) {
      if (nav) nav.inert = true;
      if (nav?.contains(document.activeElement)) menu?.focus({ preventScroll: true });
      if (root.classList.contains("cp77-menu-open")) setMenuOpen(false);
    } else {
      if (nav) nav.inert = false;
      if (root.classList.contains("cp77-menu-open")) setMenuOpen(false);
    }
  });

  const dossier = document.querySelector("[data-cp77-profile-dossier]");
  if (dossier) {
    const scene = dossier.querySelector("[data-cp77-scene]");
    const visual = dossier.querySelector(".cp77-profile-hero-visual");
    const rainCanvas = dossier.querySelector("[data-cp77-rain]");
    const target = dossier.querySelector("[data-cp77-target]");
    const targetLabel = dossier.querySelector("[data-cp77-target-label]");
    const targetStatus = dossier.querySelector("[data-cp77-target-status]");
    const boot = dossier.querySelector("[data-cp77-boot]");
    const skipBoot = dossier.querySelector("[data-cp77-skip-boot]");
    const bootMessage = dossier.querySelector("[data-cp77-boot-message]");
    const bootState = dossier.querySelector("[data-cp77-boot-state]");
    const identityStatus = dossier.querySelector("[data-cp77-identity-status]");
    const mapNodes = dossier.querySelectorAll("[data-cp77-map-node]");
    const mapDetails = dossier.querySelectorAll("[data-cp77-map-detail]");
    const channelStatus = dossier.querySelector("[data-cp77-channel-status]");
    const chapters = dossier.querySelectorAll("[data-cp77-chapter]");
    const chapterIndex = dossier.querySelector("[data-cp77-chapter-index]");
    const chapterLabel = dossier.querySelector("[data-cp77-chapter-label]");
    const chapterStatus = dossier.querySelector("[data-cp77-chapter-status]");
    const timelineTrack = dossier.querySelector("[data-cp77-timeline-track]");
    const terminalForm = dossier.querySelector("[data-cp77-terminal-form]");
    const terminalInput = dossier.querySelector("[data-cp77-terminal-input]");
    const terminalOutput = dossier.querySelector("[data-cp77-terminal-output]");
    const terminalState = dossier.querySelector("[data-cp77-terminal-state]");
    let bootTimer = 0;
    let bootStageTimer = 0;
    let rainFrame = 0;
    let rainObserver = null;
    let rainVisible = true;
    let rainDrops = [];
    let rainSize = { width: 0, height: 0, dpr: 1 };
    const bootKey = "cp77-profile-booted";
    const bootStages = ["INITIALIZING SYSTEM", "CONNECTING NIGHT CITY NETWORK", "ACCESSING PERSONAL DATABASE", "IDENTITY SCANNING", "DECRYPTING PROFILE", "ACCESS GRANTED"];

    const finishBoot = () => {
      window.clearTimeout(bootTimer);
      window.clearTimeout(bootStageTimer);
      dossier.classList.remove("is-booting");
      if (identityStatus) identityStatus.textContent = "IDENTITY VERIFIED";
      if (bootState) bootState.textContent = "VERIFIED";
      if (bootMessage) bootMessage.textContent = "ACCESS GRANTED";
      try { window.sessionStorage.setItem(bootKey, "1"); } catch (error) { /* storage can be unavailable in private contexts */ }
    };
    let booted = false;
    try { booted = window.sessionStorage.getItem(bootKey) === "1"; } catch (error) { booted = false; }
    const replayBoot = new URLSearchParams(window.location.search).get("boot") === "1";
    if ((!booted || replayBoot) && !reducedMotion && boot) {
      dossier.classList.add("is-booting");
      let stage = 0;
      const advanceBoot = () => {
        if (stage >= bootStages.length) { bootTimer = window.setTimeout(finishBoot, 360); return; }
        if (bootMessage) bootMessage.textContent = bootStages[stage];
        if (bootState) bootState.textContent = stage === bootStages.length - 1 ? "GRANTED" : "VERIFYING";
        stage += 1;
        bootStageTimer = window.setTimeout(advanceBoot, 360);
      };
      advanceBoot();
      bootTimer = window.setTimeout(finishBoot, 2700);
    } else if (identityStatus) {
      identityStatus.textContent = booted ? "IDENTITY VERIFIED" : identityStatus.textContent;
      if (booted && bootState) bootState.textContent = "VERIFIED";
    }
    skipBoot?.addEventListener("click", finishBoot);
    onMediaChange(motionQuery, (event) => { if (event.matches && dossier.classList.contains("is-booting")) finishBoot(); });

    target?.addEventListener("click", () => {
      const locked = target.classList.toggle("is-locked");
      target.setAttribute("aria-pressed", String(locked));
      targetLabel.textContent = locked ? "TARGET LOCKED" : "TARGET LOCK";
      targetStatus.textContent = locked ? "SIGNAL: STABLE" : "CLICK TO LOCK";
    });

    const selectMapNode = (id) => {
      mapNodes.forEach((node) => {
        const active = node.dataset.cp77MapNode === id;
        node.classList.toggle("is-active", active);
        node.setAttribute("aria-selected", String(active));
        node.tabIndex = active ? 0 : -1;
      });
      mapDetails.forEach((detail) => {
        const active = detail.dataset.cp77MapDetail === id;
        detail.classList.toggle("is-active", active);
        detail.hidden = !active;
      });
    };
    mapNodes.forEach((node) => {
      node.addEventListener("click", () => selectMapNode(node.dataset.cp77MapNode));
      node.addEventListener("keydown", (event) => {
        if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const nodes = Array.from(mapNodes);
        const current = nodes.indexOf(node);
        const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1;
        const next = event.key === 'Home' ? nodes[0] : event.key === 'End' ? nodes[nodes.length - 1] : nodes[(current + direction + nodes.length) % nodes.length];
        selectMapNode(next.dataset.cp77MapNode);
        next.focus();
      });
    });

    dossier.querySelectorAll("[data-cp77-channel]").forEach((channel) => {
      channel.addEventListener("click", () => {
        if (!channelStatus) return;
        channelStatus.textContent = "CHANNEL OPENING";
        window.setTimeout(() => { channelStatus.textContent = "CHANNEL READY"; }, 900);
      });
    });

    const syncChapter = () => {
      if (!chapters.length) return;
      const pivot = window.innerHeight * .34;
      let active = chapters[0];
      chapters.forEach((chapter) => {
        if (chapter.getBoundingClientRect().top <= pivot) active = chapter;
      });
      chapterIndex && (chapterIndex.textContent = active.dataset.cp77Chapter || "01");
      chapterLabel && (chapterLabel.textContent = active.dataset.cp77ChapterLabel || "DOSSIER");
      chapterStatus && (chapterStatus.textContent = active === chapters[0] ? "SCROLL TO READ" : "SIGNAL ACTIVE");
      chapters.forEach((chapter) => chapter.classList.toggle("is-current", chapter === active));
      if (timelineTrack) {
        const bounds = timelineTrack.getBoundingClientRect();
        const progress = Math.max(0, Math.min(100, ((pivot - bounds.top) / Math.max(1, bounds.height)) * 100));
        timelineTrack.style.setProperty("--cp77-timeline-progress", `${progress}%`);
      }
    };
    let chapterFrame = 0;
    const queueChapterSync = () => {
      if (!chapterFrame) chapterFrame = window.requestAnimationFrame(() => { chapterFrame = 0; syncChapter(); });
    };
    window.addEventListener("scroll", queueChapterSync, { passive: true });
    window.addEventListener("resize", queueChapterSync, { passive: true });
    syncChapter();

    const terminalCommands = {
      help: { output: "HELP / about · projects · skills · experience · contact · clear", anchor: null },
      about: { output: "OPENING / identity signal", anchor: "profile-interests" },
      projects: { output: "OPENING / mission archive", anchor: "profile-projects" },
      skills: { output: "OPENING / capability matrix", anchor: "profile-capabilities" },
      experience: { output: "OPENING / personal history", anchor: "profile-timeline" },
      contact: { output: "OPENING / open channel", anchor: "profile-contact" },
      clear: { output: "", anchor: null },
    };
    terminalForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const commandValue = terminalInput?.value.trim().toLowerCase().replace(/\s+/g, " ") || "help";
      const commandData = terminalCommands[commandValue];
      if (!terminalOutput) return;
      if (!commandData) {
        terminalOutput.textContent = `ERROR / UNKNOWN COMMAND: ${commandValue}. TYPE HELP.`;
        terminalState && (terminalState.textContent = "COMMAND ERROR");
        return;
      }
      terminalOutput.textContent = commandData.output;
      terminalState && (terminalState.textContent = commandValue === "clear" ? "CLEARED" : "COMMAND OK");
      if (commandData.anchor) document.getElementById(commandData.anchor)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      if (terminalInput) terminalInput.value = "";
    });

    if (!reducedMotion && !menuQuery.matches) {
      dossier.querySelectorAll("[data-cp77-magnetic]").forEach((control) => {
        const resetMagnet = () => control.style.removeProperty("transform");
        control.addEventListener("pointermove", (event) => {
          const bounds = control.getBoundingClientRect();
          const x = ((event.clientX - bounds.left) / bounds.width - .5) * 5;
          const y = ((event.clientY - bounds.top) / bounds.height - .5) * 5;
          control.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }, { passive: true });
        control.addEventListener("pointerleave", resetMagnet, { passive: true });
      });
    }

    const syncParallax = (event) => {
      if (!scene || reducedMotion || menuQuery.matches) return;
      const bounds = visual.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
      const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
      scene.style.transform = `translate3d(${x * -10}px, ${y * -7}px, 0) scale(1.05)`;
      target.style.setProperty("--target-x", `${x * 8}px`);
      target.style.setProperty("--target-y", `${y * 6}px`);
    };
    const resetParallax = () => {
      if (!scene || reducedMotion) return;
      scene.style.removeProperty("transform");
      target?.style.removeProperty("--target-x");
      target?.style.removeProperty("--target-y");
    };
    visual?.addEventListener("pointermove", syncParallax, { passive: true });
    visual?.addEventListener("pointerleave", resetParallax, { passive: true });

    if (rainCanvas && !reducedMotion) {
      const context = rainCanvas.getContext("2d");
      const resizeRain = () => {
        const bounds = visual.getBoundingClientRect();
        rainSize = { width: Math.max(1, bounds.width), height: Math.max(1, bounds.height), dpr: Math.min(window.devicePixelRatio || 1, 1.5) };
        rainCanvas.width = Math.floor(rainSize.width * rainSize.dpr);
        rainCanvas.height = Math.floor(rainSize.height * rainSize.dpr);
        rainDrops = Array.from({ length: Math.max(24, Math.round(rainSize.width / 22)) }, () => ({
          x: Math.random() * rainSize.width,
          y: Math.random() * rainSize.height,
          length: 7 + Math.random() * 14,
          speed: 1.5 + Math.random() * 2.4,
          opacity: .12 + Math.random() * .32,
        }));
      };
      const drawRain = () => {
        rainFrame = 0;
        if (!rainVisible || document.hidden) return;
        const { width, height, dpr } = rainSize;
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        context.clearRect(0, 0, width, height);
        context.strokeStyle = "rgba(86,216,207,.55)";
        context.lineWidth = .7;
        rainDrops.forEach((drop) => {
          context.globalAlpha = drop.opacity;
          context.beginPath();
          context.moveTo(drop.x, drop.y);
          context.lineTo(drop.x - 2, drop.y + drop.length);
          context.stroke();
          drop.y += drop.speed;
          drop.x -= .35;
          if (drop.y > height + drop.length) { drop.y = -drop.length; drop.x = Math.random() * width; }
          if (drop.x < -8) drop.x = width + 8;
        });
        context.globalAlpha = 1;
        rainFrame = window.requestAnimationFrame(drawRain);
      };
      const queueRain = () => { if (!rainFrame && rainVisible) rainFrame = window.requestAnimationFrame(drawRain); };
      resizeRain();
      window.addEventListener("resize", resizeRain, { passive: true });
      document.addEventListener("visibilitychange", queueRain);
      if ("IntersectionObserver" in window) {
        rainObserver = new IntersectionObserver(([entry]) => {
          rainVisible = entry.isIntersecting;
          if (rainVisible) queueRain();
          else if (rainFrame) { window.cancelAnimationFrame(rainFrame); rainFrame = 0; }
        }, { threshold: .01 });
        rainObserver.observe(visual);
      }
      queueRain();
    }
  }

  const updateClock = () => {
    if (!clock) return;
    clock.textContent = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date());
  };
  updateClock();
  window.setInterval(updateClock, 1000);

  if (!command || !search || !results) return;
  const entries = Array.from(document.querySelectorAll("[data-cp77-source] a")).map((link) => ({
    href: link.getAttribute("href"),
    title: link.dataset.title || link.textContent.trim(),
    section: link.dataset.section || "archive",
    summary: link.dataset.summary || "",
  }));
  let matches = entries;
  let selected = 0;
  let restoreFocus = null;

  const render = () => {
    results.replaceChildren();
    if (!matches.length) {
      const empty = document.createElement("p");
      empty.className = "cp77-command-empty";
      empty.textContent = "NO MATCHING RECORDS / TRY ANOTHER QUERY";
      results.append(empty);
      return;
    }
    matches.slice(0, 12).forEach((entry, index) => {
      const link = document.createElement("a");
      link.className = "cp77-command-result";
      link.href = entry.href;
      link.setAttribute("role", "option");
      link.setAttribute("aria-selected", String(index === selected));
      if (index === selected) link.classList.add("is-selected");
      const section = document.createElement("small");
      section.textContent = `${String(index + 1).padStart(2, "0")} / ${entry.section.toUpperCase()}`;
      const copy = document.createElement("span");
      const title = document.createElement("strong");
      title.textContent = entry.title;
      copy.append(title);
      if (entry.summary) {
        const summary = document.createElement("p");
        summary.textContent = entry.summary;
        copy.append(summary);
      }
      link.append(section, copy);
      results.append(link);
    });
  };

  const open = () => {
    setMenuOpen(false, { restoreFocus: true });
    restoreFocus = document.activeElement;
    command.hidden = false;
    backgroundNodes.forEach((node) => { node.inert = true; });
    root.classList.add("cp77-command-open");
    search.value = "";
    matches = entries;
    selected = 0;
    render();
    search.focus({ preventScroll: true });
  };
  const close = () => {
    command.hidden = true;
    backgroundNodes.forEach((node) => { node.inert = backgroundInertState.get(node) || false; });
    root.classList.remove("cp77-command-open");
    restoreFocus?.focus?.({ preventScroll: true });
  };
  const filter = () => {
    const query = search.value.trim().toLocaleLowerCase();
    matches = query ? entries.filter((entry) => `${entry.title} ${entry.summary} ${entry.section}`.toLocaleLowerCase().includes(query)) : entries;
    selected = 0;
    render();
  };

  openButton?.addEventListener("click", open);
  closeButtons.forEach((button) => button.addEventListener("click", close));
  search.addEventListener("input", filter);
  search.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") { event.preventDefault(); selected = Math.min(Math.max(0, matches.length - 1), selected + 1); render(); }
    if (event.key === "ArrowUp") { event.preventDefault(); selected = Math.max(0, selected - 1); render(); }
    if (event.key === "Enter" && matches[selected]) { event.preventDefault(); window.location.assign(matches[selected].href); }
    if (event.key === "Escape") { event.preventDefault(); close(); }
  });
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); command.hidden ? open() : close(); }
    if (event.key === "Escape" && !command.hidden) close();
    if (event.key === "Escape" && root.classList.contains("cp77-menu-open")) setMenuOpen(false, { restoreFocus: true });
    if (event.key === "Tab" && !command.hidden) {
      const focusable = Array.from(command.querySelectorAll('button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) { event.preventDefault(); search.focus(); }
      else if (!command.contains(document.activeElement)) { event.preventDefault(); first.focus(); }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  render();
})();
