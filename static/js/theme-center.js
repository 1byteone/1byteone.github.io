(() => {
  const catalog = document.querySelector("[data-theme-catalog]");
  if (!catalog) return;

  const cards = Array.from(catalog.querySelectorAll("[data-theme-card]"));
  const search = catalog.querySelector("[data-theme-search]");
  const categoryButtons = Array.from(catalog.querySelectorAll("[data-theme-filter]"));
  const statusButtons = Array.from(catalog.querySelectorAll("[data-status-filter]"));
  const resultLabel = catalog.querySelector("[data-theme-result-label]");
  const emptyState = catalog.querySelector("[data-theme-empty]");
  const isChinese = document.documentElement.lang.startsWith("zh");
  let category = "all";
  let status = "all";

  const update = () => {
    const query = (search?.value || "").trim().toLocaleLowerCase();
    let count = 0;

    cards.forEach((card) => {
      const matchesCategory = category === "all" || card.dataset.themeCategory === category;
      const matchesStatus = status === "all" || (status === "available" ? card.dataset.themeAvailable === "true" : card.dataset.themeAvailable === "false");
      const matchesSearch = !query || card.dataset.themeSearchText.includes(query);
      const visible = matchesCategory && matchesStatus && matchesSearch;
      card.hidden = !visible;
      if (visible) count += 1;
    });

    if (resultLabel) resultLabel.textContent = isChinese ? `显示 ${count} 个主题` : `Showing ${count} themes`;
    if (emptyState) emptyState.hidden = count > 0;
  };

  categoryButtons.forEach((button) => button.addEventListener("click", () => {
    category = button.dataset.themeFilter;
    categoryButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    update();
  }));

  statusButtons.forEach((button) => button.addEventListener("click", () => {
    status = button.dataset.statusFilter;
    statusButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    update();
  }));

  search?.addEventListener("input", update);
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      search?.focus();
    }
  });
})();
