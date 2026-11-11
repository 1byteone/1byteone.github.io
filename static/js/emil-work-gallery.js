(() => {
  const main = document.querySelector("[data-ep-work-main]");
  if (!main) return;

  const cards = [...main.querySelectorAll("[data-ep-work-item]")];
  const previous = main.querySelector("[data-ep-work-previous]");
  const next = main.querySelector("[data-ep-work-next]");
  const open = main.querySelector("[data-ep-work-open]");
  const preview = main.querySelector("[data-ep-work-preview]");
  const count = main.querySelector("[data-ep-work-count]");
  const title = main.querySelector("[data-ep-work-title]");
  const description = main.querySelector("[data-ep-work-description]");
  const capeViewer = main.querySelector("[data-ep-cape-viewer]");
  const dialog = document.querySelector("[data-ep-work-dialog]");
  const fullsize = dialog?.querySelector("[data-ep-work-fullsize]");
  const fullsizeTitle = dialog?.querySelector("[data-ep-work-fullsize-title]");
  const categoryLinks = [...main.querySelectorAll(".ep-work-category")];
  const zh = document.documentElement.lang.startsWith("zh");
  const categoryNames = zh ? { minecraft: "Minecraft / UI", capes: "披风", art: "像素艺术", other: "其他作品" } : { minecraft: "MINECRAFT", capes: "CAPES", art: "ART", other: "OTHER" };
  const groupNames = zh ? {
    INVENTORIES: "背包界面", "ESC MENUS": "暂停菜单", "OTHER UI": "其他界面", TEXTURES: "纹理与皮肤", HIGHLIGHTS: "精选披风", MULTIVERSE: "多元宇宙", JAPANESE: "日式主题", PREHISTORIC: "史前主题", ANIME: "动漫主题", SPACE: "太空主题", "NEW YEAR": "新年主题", SUMMER: "夏日主题", NEON: "霓虹主题", MISC: "其他披风", "PIXEL ART": "像素作品", TUTORIALS: "绘制教程", "WEB DESIGN": "网页设计", LOGOS: "标志设计", PRINT: "印刷设计"
  } : {};
  let selected = Math.max(0, cards.findIndex((card) => card.getAttribute("aria-pressed") === "true"));

  const groupLabel = (raw) => {
    const match = raw.match(/^(.*)\s+(\d+)$/);
    const key = match?.[1] || raw;
    return groupNames[key] || key;
  };

  const setSelected = (index, scroll = false) => {
    if (!cards.length) return;
    selected = (index + cards.length) % cards.length;
    const card = cards[selected];
    const { workTitle, workGroup, workGroupIndex, workGroupTotal, workCategoryTotal, workImage, workDescription, workAnimation } = card.dataset;
    cards.forEach((item, cardIndex) => {
      const active = cardIndex === selected;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    if (preview && workImage) {
      preview.src = workImage;
      preview.alt = workTitle;
    }
    if (title) title.textContent = workTitle;
    if (description) description.textContent = workDescription || `${zh ? "原站作品条目" : "Original work entry"} · ${groupLabel(workGroup)}`;
    if (count) count.textContent = `${groupLabel(workGroup).toLocaleUpperCase()} · ${workGroupIndex} / ${workGroupTotal}`;
    if (fullsize) {
      fullsize.src = workImage;
      fullsize.alt = workTitle;
    }
    if (fullsizeTitle) fullsizeTitle.textContent = `${workTitle} · ${selected + 1} / ${workCategoryTotal}`;
    if (capeViewer) {
      capeViewer.dataset.texture = workImage;
      capeViewer.dataset.animation = workAnimation || "{}";
      capeViewer.setAttribute("aria-label", zh ? `${workTitle}披风预览，可拖动旋转` : `${workTitle} cape preview. Drag to rotate.`);
      capeViewer.dispatchEvent(new CustomEvent("ep:cape-texture", { detail: { texture: workImage, animation: workAnimation ? JSON.parse(workAnimation) : {}, title: workTitle } }));
    }
    if (scroll) card.scrollIntoView({ block: "nearest", inline: "nearest", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  cards.forEach((card, index) => card.addEventListener("click", () => setSelected(index)));
  previous?.addEventListener("click", () => setSelected(selected - 1, true));
  next?.addEventListener("click", () => setSelected(selected + 1, true));
  open?.addEventListener("click", () => {
    if (!dialog?.showModal) return;
    const active = cards[selected];
    if (fullsize) fullsize.src = active.dataset.workImage;
    if (fullsizeTitle) fullsizeTitle.textContent = active.dataset.workTitle;
    dialog.showModal();
  });
  dialog?.querySelector("[data-ep-work-close]")?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });

  main.querySelectorAll("[data-ep-cape-pose]").forEach((button) => button.addEventListener("click", () => {
    const pose = button.dataset.epCapePose || "stand";
    main.dataset.capePose = pose;
    main.querySelectorAll("[data-ep-cape-pose]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    capeViewer?.dispatchEvent(new CustomEvent("ep:cape-pose", { detail: { pose } }));
  }));

  document.addEventListener("keydown", (event) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    if (dialog?.open) {
      if (event.key === "Escape") dialog.close();
      if (event.key === "ArrowLeft") { event.preventDefault(); setSelected(selected - 1); }
      if (event.key === "ArrowRight") { event.preventDefault(); setSelected(selected + 1); }
      return;
    }
    if (event.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)) return;
    if (event.key === "ArrowLeft") { event.preventDefault(); setSelected(selected - 1, true); }
    if (event.key === "ArrowRight") { event.preventDefault(); setSelected(selected + 1, true); }
    if (event.key === "Enter") { event.preventDefault(); open?.click(); }
    if (event.key.toLowerCase() === "q" || event.key.toLowerCase() === "e") {
      const direction = event.key.toLowerCase() === "e" ? 1 : -1;
      const current = categoryLinks.findIndex((link) => link.getAttribute("aria-current") === "page");
      const target = categoryLinks[(current + direction + categoryLinks.length) % categoryLinks.length];
      if (target) window.location.assign(target.href);
    }
  });

  setSelected(selected);
})();
