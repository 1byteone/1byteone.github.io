(() => {
  "use strict";

  const root = document.body;
  const toggle = document.querySelector("[data-cp77-toggle]");
  const command = document.querySelector("[data-cp77-command]");
  const openButton = document.querySelector("[data-cp77-open]");
  const closeButtons = document.querySelectorAll("[data-cp77-close]");
  const search = document.querySelector("[data-cp77-search]");
  const results = document.querySelector("[data-cp77-results]");
  const clock = document.querySelector("[data-cp77-clock]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const updateClock = () => {
    if (!clock) return;
    clock.textContent = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date());
  };
  updateClock();
  window.setInterval(updateClock, 1000);

  if (toggle) {
    const saved = window.localStorage.getItem("cp77-scanlines") === "true";
    if (saved && !reducedMotion) {
      root.classList.add("cp77-scanlines");
      toggle.setAttribute("aria-pressed", "true");
    }
    toggle.addEventListener("click", () => {
      const active = root.classList.toggle("cp77-scanlines");
      toggle.setAttribute("aria-pressed", String(active));
      window.localStorage.setItem("cp77-scanlines", String(active));
    });
  }

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
    restoreFocus = document.activeElement;
    command.hidden = false;
    root.classList.add("cp77-command-open");
    search.value = "";
    matches = entries;
    selected = 0;
    render();
    search.focus({ preventScroll: true });
  };
  const close = () => {
    command.hidden = true;
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
  });
  render();
})();
