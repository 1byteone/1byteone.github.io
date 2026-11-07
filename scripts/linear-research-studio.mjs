#!/usr/bin/env node

/**
 * Linear Research Studio
 *
 * Collects public, observable rendering evidence for a reference website. It
 * deliberately stores DOM/CSS/resource metadata rather than third-party JS
 * bundles, so the resulting dataset can inform an original implementation.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";
import process from "node:process";

const DEFAULT_VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 768, height: 1024 },
  { width: 664, height: 524 },
  { width: 390, height: 844 },
];
const DEFAULT_WAIT_MS = 1200;
const INTERACTIVE_SELECTOR =
  "a,button,[role=button],[role=tab],[aria-expanded],input,select,textarea";

function printHelp() {
  console.log(`
Linear Research Studio (中文研究采集器)

用法:
  node scripts/linear-research-studio.mjs --url https://linear.app/homepage

参数:
  --url <url>                 公开页面入口（必填）
  --out <dir>                 输出目录，默认 research/linear
  --routes <url,url,...>      额外页面；也可传 .txt 文件，每行一个 URL
  --viewports <w×h,...>      视口矩阵，默认 1440x900,768x1024,664x524,390x844
  --mode <auto|browser|static> auto 默认优先 Playwright，缺失时降级静态模式
  --wait-ms <number>          页面加载后等待时间，默认 ${DEFAULT_WAIT_MS}
  --max-pages <number>        最多采集页面数，默认 12
  --help                      显示帮助

浏览器模式需要项目外部安装 Playwright：pnpm add -D playwright && pnpm exec playwright install chromium
静态模式不执行脚本、不截图，只保存脱敏 HTML、链接/资源清单和研究报告。
`);
}

function parseArgs(argv) {
  const args = { mode: "auto", out: "research/linear", waitMs: DEFAULT_WAIT_MS, maxPages: 12 };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--help" || token === "-h") {
      args.help = true;
      continue;
    }
    if (!token.startsWith("--")) throw new Error(`无法识别参数: ${token}`);
    const key = token.slice(2);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`参数 ${token} 缺少值`);
    index += 1;
    if (key === "wait-ms" || key === "max-pages") args[key === "wait-ms" ? "waitMs" : "maxPages"] = Number(value);
    else if (key === "url" || key === "out" || key === "routes" || key === "viewports" || key === "mode") args[key === "viewports" ? "viewports" : key] = value;
    else throw new Error(`无法识别参数: ${token}`);
  }
  if (args.help) return args;
  if (!args.url) throw new Error("必须提供 --url");
  if (!Number.isFinite(args.waitMs) || args.waitMs < 0) throw new Error("--wait-ms 必须是非负数字");
  if (!Number.isInteger(args.maxPages) || args.maxPages < 1) throw new Error("--max-pages 必须是正整数");
  return args;
}

function parseViewports(value) {
  if (!value) return DEFAULT_VIEWPORTS;
  const viewports = value.split(",").map((item) => {
    const match = item.trim().match(/^(\d+)\s*[x×]\s*(\d+)$/i);
    if (!match) throw new Error(`无效视口: ${item}，示例: 1440x900`);
    return { width: Number(match[1]), height: Number(match[2]) };
  });
  if (viewports.some(({ width, height }) => width < 240 || height < 240)) throw new Error("视口尺寸过小");
  return viewports;
}

function safeName(input) {
  const value = String(input).replace(/^https?:\/\//, "").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return value || "page";
}

function pageName(url, index) {
  const parsed = new URL(url);
  const path = parsed.pathname.replace(/^\/+|\/+$/g, "").replaceAll("/", "--");
  return `${String(index + 1).padStart(2, "0")}-${safeName(path || "home")}`;
}

async function readRoutes(value, seedUrl) {
  if (!value) return [seedUrl];
  const entries = value.endsWith(".txt") ? (await readFile(resolve(value), "utf8")).split(/\r?\n/) : value.split(",");
  const urls = entries.map((item) => item.trim()).filter(Boolean).map((item) => new URL(item, seedUrl).href);
  return [...new Set([seedUrl, ...urls])];
}

function sanitizeHtml(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '<script data-research-omitted="true"></script>')
    .replace(/\s(on[a-z]+)\s*=\s*("[^"]*"|'[^']*')/gi, "")
    .replace(/<link\b([^>]*rel=["']?preload["']?[^>]*)>/gi, "<link$1 data-research-reference-only=\"true\">");
}

function resourceKind(url, tagName = "") {
  const lower = `${url} ${tagName}`.toLowerCase();
  if (lower.includes(".woff") || lower.includes("font")) return "font";
  if (lower.includes(".css") || tagName === "link") return "stylesheet";
  if (lower.includes(".mp4") || lower.includes("video")) return "video";
  if (/\.(png|jpe?g|gif|webp|avif|svg)(\?|$)/i.test(url) || tagName === "img") return "image";
  if (lower.includes("script") || /\.m?js(\?|$)/i.test(url)) return "script-reference";
  return "other";
}

function dedupeResources(resources) {
  const map = new Map();
  for (const resource of resources) {
    if (!resource.url || resource.url.startsWith("data:")) continue;
    const key = resource.url;
    const previous = map.get(key) || {};
    map.set(key, { ...previous, ...resource, kind: previous.kind || resource.kind || "other" });
  }
  return [...map.values()].sort((a, b) => a.url.localeCompare(b.url));
}

async function writeJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function writeText(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, value, "utf8");
}

function collectStaticResources(html, baseUrl) {
  const resources = [];
  const pattern = /<(img|source|video|audio|script|link|iframe)\b[^>]*?(?:src|href|srcset)\s*=\s*["']([^"']+)["'][^>]*>/gi;
  for (const match of html.matchAll(pattern)) {
    const [, tagName, rawUrl] = match;
    const first = rawUrl.split(",")[0].trim().split(/\s+/)[0];
    try {
      resources.push({ url: new URL(first, baseUrl).href, kind: resourceKind(first, tagName), source: "html" });
    } catch {
      // Ignore malformed authoring URLs while keeping the rest of the manifest.
    }
  }
  for (const match of html.matchAll(/--([a-z0-9-]+)\s*:/gi)) resources.push({ url: `css-variable:--${match[1]}`, kind: "design-token", source: "inline-css" });
  return dedupeResources(resources);
}

function extractStaticLinks(html, baseUrl) {
  const links = [];
  for (const match of html.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["']/gi)) {
    try {
      const url = new URL(match[1], baseUrl);
      if (url.origin === new URL(baseUrl).origin && ["http:", "https:"].includes(url.protocol)) links.push(url.href);
    } catch {
      // Ignore malformed links.
    }
  }
  return [...new Set(links)];
}

function staticStyleSummary(html) {
  const vars = [...new Set([...html.matchAll(/--([a-z0-9-]+)\s*:/gi)].map((match) => `--${match[1]}`))];
  const tags = {};
  for (const tag of ["header", "main", "nav", "footer", "h1", "button", "a", "img"]) tags[tag] = (html.match(new RegExp(`<${tag}\\b`, "gi")) || []).length;
  return { source: "static-html", customProperties: vars, semanticTagCounts: tags };
}

async function collectStaticPage(url, outputPath) {
  const response = await fetch(url, { redirect: "follow", headers: { "user-agent": "LinearResearchStudio/1.0 (research evidence)" } });
  const html = await response.text();
  const finalUrl = response.url || url;
  const sanitized = sanitizeHtml(html);
  await writeText(outputPath, sanitized);
  return {
    requestedUrl: url,
    finalUrl,
    status: response.status,
    title: html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "",
    lang: html.match(/<html[^>]*\blang=["']([^"']+)/i)?.[1] || "",
    resources: collectStaticResources(html, finalUrl),
    links: extractStaticLinks(html, finalUrl),
    styles: staticStyleSummary(html),
    evidence: { dom: "captured", screenshot: "not-run", computedStyles: "not-run", interactions: "not-run" },
  };
}

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    return null;
  }
}

async function collectBrowserPage(browser, url, viewport, outputRoot, waitMs) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(waitMs);
  const actualUrl = page.url();
  const evidence = await page.evaluate((interactiveSelector) => {
    const selectors = ["body", "header", "nav", "main", "footer", "h1", "h2", "button", "a", "img"];
    const styleProperties = ["display", "position", "fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "color", "backgroundColor", "margin", "padding", "gap", "borderRadius", "boxShadow", "transform", "opacity"];
    const box = (element) => {
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      const computed = getComputedStyle(element);
      return { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height), styles: Object.fromEntries(styleProperties.map((key) => [key, computed[key]])) };
    };
    const regions = Object.fromEntries(selectors.map((selector) => [selector, box(document.querySelector(selector))]));
    const interactive = [...document.querySelectorAll(interactiveSelector)].slice(0, 80).map((element, index) => ({ index, tag: element.tagName.toLowerCase(), role: element.getAttribute("role") || "", text: (element.innerText || element.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 120), href: element.getAttribute("href") || "", expanded: element.getAttribute("aria-expanded"), disabled: element.hasAttribute("disabled") }));
    const links = [...document.querySelectorAll("a[href]")].map((element) => element.href).filter(Boolean);
    const resources = performance.getEntriesByType("resource").map((entry) => ({ url: entry.name, initiatorType: entry.initiatorType, duration: Math.round(entry.duration), transferSize: entry.transferSize || 0 }));
    const customProperties = [];
    for (const sheet of [...document.styleSheets]) {
      try { for (const rule of [...sheet.cssRules]) { const text = rule.cssText || ""; for (const match of text.matchAll(/--[a-z0-9-]+/gi)) customProperties.push(match[0]); } } catch { /* cross-origin stylesheet */ }
    }
    return { title: document.title, lang: document.documentElement.lang, dimensions: { scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight }, regions, interactive, links: [...new Set(links)], resources, customProperties: [...new Set(customProperties)] };
  }, INTERACTIVE_SELECTOR);
  const pageDir = join(outputRoot, "pages", safeName(new URL(actualUrl).pathname || "home"), `${viewport.width}x${viewport.height}`);
  await mkdir(pageDir, { recursive: true });
  await writeText(join(pageDir, "dom.html"), sanitizeHtml(await page.content()));
  await page.screenshot({ path: join(pageDir, "screenshot.png"), fullPage: true });

  const interactions = [];
  const candidates = await page.locator(INTERACTIVE_SELECTOR).all();
  for (let index = 0; index < Math.min(candidates.length, 12); index += 1) {
    const item = candidates[index];
    const label = ((await item.innerText().catch(() => "")) || (await item.getAttribute("aria-label").catch(() => "")) || "").trim().replace(/\s+/g, " ").slice(0, 120);
    if (!(await item.isVisible().catch(() => false))) continue;
    await item.hover({ timeout: 2000 }).catch(() => {});
    const hovered = await item.evaluate((element) => ({ ariaExpanded: element.getAttribute("aria-expanded"), className: element.className, active: document.activeElement === element })).catch(() => ({}));
    await item.focus().catch(() => {});
    interactions.push({ index, label, state: "hover+focus", observed: hovered });
  }
  await writeJson(join(pageDir, "interactions.json"), { selector: INTERACTIVE_SELECTOR, checked: interactions, keyboard: "focus() applied; click actions are not executed automatically", reducedMotion: "not forced in this pass" });
  await page.close();
  return {
    requestedUrl: url,
    finalUrl: actualUrl,
    viewport,
    evidence: { dom: relative(outputRoot, join(pageDir, "dom.html")), screenshot: relative(outputRoot, join(pageDir, "screenshot.png")), computedStyles: "embedded in page.json regions", interactions: relative(outputRoot, join(pageDir, "interactions.json")) },
    ...evidence,
    resources: dedupeResources(evidence.resources.map((resource) => ({ ...resource, kind: resourceKind(resource.url, resource.initiatorType), source: "performance" }))),
    consoleErrors,
    pageErrors,
  };
}

async function writeResearchScaffold(outputRoot, metadata) {
  await writeJson(join(outputRoot, "manifest.json"), metadata);
  await writeJson(join(outputRoot, "licenses", "provenance.json"), {
    reference: metadata.seedUrl,
    collectedAt: metadata.collectedAt,
    policy: "仅记录公开页面研究证据；不将第三方 JS bundle、私有源码或未核验素材复制到生产主题。",
    entries: metadata.pages.map((page) => ({ url: page.finalUrl || page.requestedUrl, source: "public reference website", licenseStatus: "manual-review-required", intendedUse: "layout / interaction / accessibility research" })),
  });
  await writeText(join(outputRoot, "archives", "README.md"), `# 离线归档提示\n\n本目录不自动执行全站抓取。若你对目标站点拥有明确授权，可在合规范围内使用 Browsertrix 生成 WARC/WACZ，再把归档路径登记到 \`licenses/provenance.json\`。\n\n示例（请先核对授权与 robots 规则）：\n\n\`\`\`powershell\nnpx @webrecorder/browsertrix-crawler crawl --url ${metadata.seedUrl} --collection linear-research --seeds ${metadata.seedUrl}\n\`\`\`\n\n研究输出不包含目标站点的生产脚本副本。`);
  await writeJson(join(outputRoot, "reproduction-skeleton", "contract.json"), {
    principle: "observable-contract-first",
    brand: "1BYTEONE / YOYO",
    reference: metadata.seedUrl,
    regions: ["header", "hero", "primary-surface", "content-cards", "footer"],
    states: ["initial", "hover", "focus-visible", "pressed", "expanded", "loading", "error", "reduced-motion", "offscreen"],
    implementation: "原创组件 + 本地内容；仅使用本研究输出的结构、几何与状态契约",
  });
  await writeText(join(outputRoot, "reproduction-skeleton", "README.md"), `# 原创复刻骨架\n\n这是一个 framework-agnostic 研究契约，不是参考站源码副本。根据 \`contract.json\` 建立组件、数据模型和状态机，再接入 1BYTEONE 的中文 AI 工程内容。\n\n推荐验收：四视口截图、键盘焦点、触摸、reduced-motion、图片失败回退和控制台错误。`);
  const report = [
    "# Linear Research Studio 采集报告",
    "",
    `- 入口：${metadata.seedUrl}`,
    `- 采集时间：${metadata.collectedAt}`,
    `- 模式：${metadata.mode}`,
    `- 页面数：${metadata.pages.length}`,
    `- 视口：${metadata.viewports.map((item) => `${item.width}×${item.height}`).join("、")}`,
    "",
    "## 输出",
    "",
    "- `pages/**/dom.html`：脱敏后的渲染 DOM，仅保留结构证据。",
    "- `pages/**/screenshot.png`：浏览器模式的全页截图；静态模式不会伪造截图。",
    "- `pages/**/page.json`：几何、字体、颜色、资源性能和错误摘要。",
    "- `pages/**/interactions.json`：可见交互元素的 hover/focus 证据。",
    "- `licenses/provenance.json`：来源与许可证人工核验清单。",
    "- `reproduction-skeleton/`：原创实现契约，不包含第三方私有 bundle。",
    "",
    "## 限制",
    "",
    "浏览器模式只观察公开渲染结果，不下载或执行后复制参考站生产脚本；静态模式不执行脚本，因此不会声称已经完成动态交互或截图验收。许可证状态必须逐项人工核验。",
    "",
    "## 页面状态摘要",
    "",
    ...metadata.pages.map((page) => `- ${page.finalUrl || page.requestedUrl}：DOM ${page.evidence?.dom ? "已记录" : "未记录"}；截图 ${page.evidence?.screenshot === "not-run" ? "未执行" : "已记录"}；控制台错误 ${[...(page.consoleErrors || []), ...(page.pageErrors || [])].length}`),
    "",
  ].join("\n");
  await writeText(join(outputRoot, "REPORT.md"), report);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) return printHelp();
  const viewports = parseViewports(args.viewports);
  const outputRoot = resolve(args.out);
  const routes = await readRoutes(args.routes, args.url);
  let mode = args.mode;
  let playwright = null;
  if (mode !== "static") {
    playwright = await loadPlaywright();
    if (!playwright && mode === "browser") throw new Error("未安装 Playwright。执行 pnpm add -D playwright && pnpm exec playwright install chromium，或改用 --mode static");
    if (!playwright) mode = "static";
  }
  await mkdir(outputRoot, { recursive: true });
  const pages = [];
  const queue = [...routes];
  const seen = new Set();
  const collectedAt = new Date().toISOString();
  if (mode === "browser") {
    const browser = await playwright.chromium.launch({ headless: true });
    try {
      while (queue.length && pages.length < args.maxPages) {
        const url = queue.shift();
        if (seen.has(url)) continue;
        seen.add(url);
        const pageVariants = [];
        for (const viewport of viewports) {
          const result = await collectBrowserPage(browser, url, viewport, outputRoot, args.waitMs);
          pageVariants.push(result);
          await writeJson(join(outputRoot, "pages", safeName(new URL(result.finalUrl).pathname || "home"), `${viewport.width}x${viewport.height}`, "page.json"), result);
        }
        pages.push({ ...pageVariants[0], viewports: pageVariants });
        const discovered = (pageVariants[0].links || []).map((item) => new URL(item, pageVariants[0].finalUrl).href).filter((item) => new URL(item).origin === new URL(args.url).origin);
        for (const discoveredUrl of discovered) if (!seen.has(discoveredUrl) && queue.length + pages.length < args.maxPages) queue.push(discoveredUrl);
      }
    } finally {
      await browser.close();
    }
  } else {
    for (const url of routes.slice(0, args.maxPages)) {
      const name = pageName(url, pages.length);
      const result = await collectStaticPage(url, join(outputRoot, "pages", name, "dom.html"));
      await writeJson(join(outputRoot, "pages", name, "page.json"), result);
      pages.push(result);
    }
  }
  await writeResearchScaffold(outputRoot, { tool: "linear-research-studio", version: "1.0.0", seedUrl: args.url, collectedAt, mode, viewports, pages });
  console.log(`研究采集完成：${outputRoot}`);
  console.log(`模式：${mode}；页面：${pages.length}；视口：${viewports.length}`);
  if (mode === "static") console.log("提示：未检测到 Playwright，截图和动态交互标记为未执行；可安装 Playwright 后使用 --mode browser 重跑。\n");
}

main().catch((error) => {
  console.error(`Linear Research Studio 失败：${error.message}`);
  process.exitCode = 1;
});
