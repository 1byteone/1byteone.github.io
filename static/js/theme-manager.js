(() => {
  const preferenceKey = "ai-engineering-theme-default-v1";
  const favoritesKey = "ai-engineering-theme-favorites-v1";
  const recentKey = "ai-engineering-theme-recent-v1";
  const script = document.currentScript;

  if (script?.src) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = new URL("../css/theme-manager.css", script.src).href;
    document.head.append(stylesheet);
  }

  const managers = Array.from(document.querySelectorAll("[data-theme-manager]"));
  if (!managers.length) return;

  const readPreference = () => {
    try { return window.localStorage.getItem(preferenceKey) || ""; } catch { return ""; }
  };

  const readList = (key) => {
    try {
      const value = JSON.parse(window.localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
    } catch { return []; }
  };

  const writeValue = (key, value) => {
    try { window.localStorage.setItem(key, value); return true; } catch { return false; }
  };

  const writeList = (key, list) => writeValue(key, JSON.stringify(list));

  const themeOptions = (manager) => Array.from(manager.querySelectorAll("[data-theme-option]"));
  const getTheme = (manager, id) => themeOptions(manager).find((option) => option.dataset.themeId === id);

  const recordRecent = (id) => {
    if (!id) return;
    const recent = [id, ...readList(recentKey).filter((item) => item !== id)].slice(0, 5);
    writeList(recentKey, recent);
  };

  const updateFavoriteButtons = () => {
    const favorites = new Set(readList(favoritesKey));
    const isChinese = document.documentElement.lang.startsWith("zh");
    document.querySelectorAll("[data-theme-favorite]").forEach((button) => {
      const saved = favorites.has(button.dataset.themeId);
      button.setAttribute("aria-pressed", String(saved));
      button.textContent = saved ? "★" : "☆";
      const label = button.dataset.themeLabel || button.getAttribute("aria-label") || "theme";
      button.setAttribute("aria-label", isChinese ? (saved ? `取消收藏${label}` : `收藏${label}`) : (saved ? `Remove ${label} from favorites` : `Add ${label} to favorites`));
    });
  };

  const getButtonLabel = (id) => Array.from(document.querySelectorAll("[data-theme-set-default]"))
    .find((button) => button.dataset.themeId === id)?.dataset.themeLabel;

  const updateDefaultButtons = (id) => {
    document.querySelectorAll("[data-theme-set-default]").forEach((button) => {
      const selected = button.dataset.themeId === id;
      button.setAttribute("aria-pressed", String(selected));
      button.textContent = selected ? button.dataset.labelDefault : button.dataset.labelSet;
    });

    managers.forEach((manager) => {
      const option = getTheme(manager, id);
      const label = option?.dataset.themeLabel || getButtonLabel(id);
      const status = manager.querySelector("[data-theme-default-status]");
      if (status && label) {
        status.textContent = manager.dataset.themeUiLang === "zh"
          ? `浏览器默认：${label}`
          : `Browser default: ${label}`;
      }
    });

    document.querySelectorAll("[data-theme-catalog] [data-theme-default-status]").forEach((status) => {
      const manager = managers[0];
      const option = manager && getTheme(manager, id);
      const button = Array.from(document.querySelectorAll("[data-theme-set-default]")).find((item) => item.dataset.themeId === id);
      const label = option?.dataset.themeLabel || button?.dataset.themeLabel;
      if (label) status.textContent = document.documentElement.lang.startsWith("zh") ? `当前浏览器默认主题：${label}` : `Browser default: ${label}`;
    });
  };

  const renderList = (manager, listName, ids, emptyText) => {
    const target = manager.querySelector(`[data-theme-${listName}-list]`);
    if (!target) return;
    const query = (manager.querySelector("[data-theme-quick-search]")?.value || "").trim().toLocaleLowerCase();
    const options = themeOptions(manager);
    const matching = ids.map((id) => options.find((option) => option.dataset.themeId === id)).filter(Boolean).filter((option) => {
      const text = `${option.dataset.themeLabel} ${option.dataset.themeDescription}`.toLocaleLowerCase();
      return !query || text.includes(query);
    });

    target.replaceChildren();
    if (!matching.length) {
      const empty = document.createElement("p");
      empty.className = "theme-manager-empty";
      empty.textContent = query ? (manager.dataset.themeUiLang === "zh" ? "没有匹配的主题。" : "No matching themes.") : emptyText;
      target.append(empty);
      return;
    }

    matching.forEach((option) => {
      const item = document.createElement("div");
      item.className = "theme-manager-quick-item";
      const link = document.createElement("a");
      link.className = "theme-manager-quick-link";
      link.href = option.dataset.themePath;
      link.dataset.themeVisit = "";
      link.dataset.themeId = option.dataset.themeId;
      const title = document.createElement("strong");
      title.textContent = option.dataset.themeLabel;
      const description = document.createElement("small");
      description.textContent = option.dataset.themeDescription;
      link.append(title, description);

      const star = document.createElement("button");
      star.className = "theme-manager-star";
      star.type = "button";
      star.dataset.themeFavorite = "";
      star.dataset.themeId = option.dataset.themeId;
      star.dataset.themeLabel = option.dataset.themeLabel;
      star.setAttribute("aria-label", manager.dataset.themeUiLang === "zh" ? `收藏${option.dataset.themeLabel}` : `Favorite ${option.dataset.themeLabel}`);
      star.setAttribute("aria-pressed", String(readList(favoritesKey).includes(option.dataset.themeId)));
      star.textContent = star.getAttribute("aria-pressed") === "true" ? "★" : "☆";
      item.append(link, star);
      target.append(item);
    });
  };

  const renderManagers = () => {
    const recent = readList(recentKey);
    const favorites = readList(favoritesKey);
    managers.forEach((manager) => {
      const isChinese = manager.dataset.themeUiLang === "zh";
      renderList(manager, "recent", recent, isChinese ? "浏览主题后会显示在这里。" : "Themes you visit will appear here.");
      renderList(manager, "favorites", favorites, isChinese ? "收藏的主题会显示在这里。" : "Your saved themes will appear here.");
    });
    updateFavoriteButtons();
  };

  managers.forEach((manager) => {
    manager.querySelector("[data-theme-quick-search]")?.addEventListener("input", renderManagers);
  });

  document.addEventListener("click", (event) => {
    const visit = event.target?.closest?.("[data-theme-visit]");
    if (visit) recordRecent(visit.dataset.themeId);

    const favorite = event.target?.closest?.("[data-theme-favorite]");
    if (favorite) {
      const favorites = readList(favoritesKey);
      const id = favorite.dataset.themeId;
      const next = favorites.includes(id) ? favorites.filter((item) => item !== id) : [id, ...favorites];
      writeList(favoritesKey, next);
      renderManagers();
    }

    const button = event.target?.closest?.("[data-theme-set-default]");
    if (button) {
      const id = button.dataset.themeId;
      const persisted = writeValue(preferenceKey, id);
      updateDefaultButtons(id);
      if (!persisted) {
        const status = button.closest("[data-theme-manager]")?.querySelector("[data-theme-default-status]");
        if (status) status.textContent = managerLabel(button, status);
      }
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") managers.forEach((manager) => { manager.open = false; });
  });

  document.addEventListener("click", (event) => {
    managers.forEach((manager) => {
      if (!manager.contains(event.target)) manager.open = false;
    });
  });

  const managerLabel = (button, status) => status.closest("[data-theme-manager]")?.dataset.themeUiLang === "zh"
    ? `浏览器无法保存设置；${button.dataset.themeLabel}仅为当前页面的默认主题。`
    : `Browser storage is unavailable; ${button.dataset.themeLabel} is only the page default.`;

  const preferredId = readPreference();
  const rootHome = managers.find((manager) => manager.hasAttribute("data-theme-root-home"));

  if (rootHome && preferredId) {
    const selected = getTheme(rootHome, preferredId);
    if (selected) {
      const target = selected.dataset.themePath;
      if (window.location.pathname.replace(/\/$/, "") !== target.replace(/\/$/, "")) {
        window.location.replace(target);
        return;
      }
    }
  }

  updateDefaultButtons(preferredId || rootHome?.dataset.themeFallback || managers[0]?.dataset.themeFallback);
  managers.forEach((manager) => recordRecent(manager.dataset.themeCurrent));
  renderManagers();
})();
