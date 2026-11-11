const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Users/FFY/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const baseUrl = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:1314';
const routes = [
  { id: 'home', path: '/' },
  { id: 'blog', path: '/blog/' },
  { id: 'projects', path: '/projects/' },
  { id: 'hobby', path: '/hobby/' },
  { id: 'tech-stack', path: '/tech-stack/' },
  { id: 'about', path: '/about/' },
];
const viewports = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 1024, height: 768 },
  mobile: { width: 390, height: 844 },
};
const evidenceDir = path.resolve('docs/audit/evidence');
fs.mkdirSync(evidenceDir, { recursive: true });

const initVitals = () => {
  window.__auditVitals = { lcp: null, cls: 0, inp: null };
  try {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      if (last) window.__auditVitals.lcp = last.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {}
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__auditVitals.cls += entry.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
  } catch {}
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__auditVitals.inp = Math.max(window.__auditVitals.inp || 0, entry.duration);
      }
    }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
  } catch {}
};

async function collectPage(page, route, viewport) {
  const consoleErrors = [];
  const requestFailures = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(`pageerror: ${error.message}`));
  page.on('requestfailed', (request) => requestFailures.push({ url: request.url(), error: request.failure()?.errorText || 'unknown' }));

  const response = await page.goto(`${baseUrl}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(300);
  const screenshotPath = path.join(evidenceDir, `${route.id}-${viewport}.png`);
  await page.screenshot({ path: screenshotPath });

  const state = await page.evaluate(async () => {
    const color = (value) => {
      const match = value.match(/rgba?\(([^)]+)\)/);
      if (match) {
        const parts = match[1].split(',').map((part) => Number.parseFloat(part.trim()));
        return [parts[0], parts[1], parts[2], parts[3] == null ? 1 : parts[3]];
      }
      const hex = value.replace('#', '');
      if (/^[0-9a-f]{6}$/i.test(hex)) return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16), 1];
      return null;
    };
    const luminance = (rgb) => {
      if (!rgb) return null;
      const channels = rgb.slice(0, 3).map((channel) => channel / 255).map((channel) => channel <= .03928 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4);
      return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
    };
    const contrast = (foreground, background) => {
      const f = luminance(color(foreground));
      const b = luminance(color(background));
      return f == null || b == null ? null : (Math.max(f, b) + .05) / (Math.min(f, b) + .05);
    };
    const first = (selector) => document.querySelector(selector);
    const visible = (element) => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0' || rect.width <= 0 || rect.height <= 0) return false;
      if (element.closest('[hidden], details:not([open])')) return false;
      return true;
    };
    const interactive = [...document.querySelectorAll('a[href],button,input,select,textarea,[role="button"]')].filter(visible);
    const touchCandidates = interactive.filter((element) => {
      if (element.matches('input,select,textarea,button,[role="button"]')) return true;
      return element.matches('a[href]') && element.closest('header,nav,[role="dialog"],form,.cp77-profile-contact-actions,.cp77-profile-map-details,.cp77-skill-proof');
    });
    const undersizedTargets = touchCandidates.map((element) => ({
      tag: element.tagName.toLowerCase(),
      text: element.textContent.trim().replace(/\s+/g, ' ').slice(0, 60),
      rect: (() => { const r = element.getBoundingClientRect(); return { width: Math.round(r.width), height: Math.round(r.height) }; })(),
    })).filter((item) => item.rect.width < 44 || item.rect.height < 44);
    const focusTarget = first('a[href],button,input');
    focusTarget?.focus();
    const focusStyle = focusTarget ? (() => { const style = getComputedStyle(focusTarget); return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth, outlineColor: style.outlineColor, boxShadow: style.boxShadow }; })() : null;
    const heroButton = first('.cp77-button-primary');
    const heroButtonStyle = heroButton ? getComputedStyle(heroButton) : null;
    const bodyStyle = getComputedStyle(document.body);
    const sampleText = first('.cp77-index-lead, .cp77-prose p, .cp77-hobby-copy p');
    const sampleTextStyle = sampleText ? getComputedStyle(sampleText) : null;
    let frames = 0;
    const started = performance.now();
    await new Promise((resolve) => {
      const tick = (now) => {
        frames += 1;
        if (now - started >= 1000) resolve();
        else requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    return {
      title: document.title,
      headings: [...document.querySelectorAll('h1,h2,h3')].map((heading) => heading.textContent.trim()).filter(Boolean).slice(0, 12),
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: innerWidth,
      bodyHeight: document.body.scrollHeight,
      navLinks: [...document.querySelectorAll('.cp77-nav a')].map((link) => ({ text: link.textContent.trim(), current: link.getAttribute('aria-current') })),
      images: [...document.images].map((image) => ({ src: image.currentSrc || image.src, alt: image.alt, loaded: image.complete && image.naturalWidth > 0 })),
      interactiveCount: interactive.length,
      undersizedTargets,
      focusStyle,
      contrast: {
        heroButton: heroButtonStyle ? contrast(heroButtonStyle.color, heroButtonStyle.backgroundColor) : null,
        bodyText: null,
        note: sampleTextStyle ? 'NOT MEASURED: sample may use layered/translucent or image-backed surfaces; run rendered contrast sampling before claiming conformance.' : 'NOT MEASURED: no representative body-copy sample on this route.',
      },
      fps: frames,
      vitals: window.__auditVitals,
      hasVideo: Boolean(first('video')),
      videoDisplay: first('video') ? getComputedStyle(first('video')).display : null,
      commandHidden: first('[data-cp77-command]')?.hidden ?? null,
      menuExpanded: first('[data-cp77-menu-toggle]')?.getAttribute('aria-expanded') ?? null,
    };
  });

  const result = {
    route: route.path,
    viewport,
    status: response?.status() ?? null,
    screenshot: path.relative(process.cwd(), screenshotPath).replaceAll('\\', '/'),
    consoleErrors,
    requestFailures,
    state,
  };

  if (viewport === 'desktop') {
    const open = page.locator('[data-cp77-open]');
    if (await open.count()) {
      await open.evaluate((element) => element.click());
      await page.waitForTimeout(80);
      result.search = await page.evaluate(() => ({
        open: !document.querySelector('[data-cp77-command]')?.hidden,
        resultCount: document.querySelectorAll('[data-cp77-results] [role="option"]').length,
        focus: document.activeElement?.getAttribute('data-cp77-search') === '' || document.activeElement?.matches('[data-cp77-search]'),
      }));
      await page.keyboard.press('Escape');
      result.search.closed = await page.evaluate(() => Boolean(document.querySelector('[data-cp77-command]')?.hidden));
    }
  }
  if (viewport === 'mobile') {
    const toggle = page.locator('[data-cp77-menu-toggle]');
    if (await toggle.count()) {
      await toggle.evaluate((element) => element.click());
      await page.waitForTimeout(80);
      result.mobileMenu = await page.evaluate(() => ({
        expanded: document.querySelector('[data-cp77-menu-toggle]')?.getAttribute('aria-expanded'),
        openClass: document.body.classList.contains('cp77-menu-open'),
        navFocusable: !document.querySelector('.cp77-nav')?.inert,
      }));
      await page.keyboard.press('Escape');
      result.mobileMenu.closed = await page.evaluate(() => ({ expanded: document.querySelector('[data-cp77-menu-toggle]')?.getAttribute('aria-expanded'), openClass: document.body.classList.contains('cp77-menu-open') }));
    }
  }
  if (route.id === 'about') {
    const skipBoot = page.locator('[data-cp77-skip-boot]');
    if (await skipBoot.count() && await skipBoot.isVisible()) await skipBoot.evaluate((element) => element.click());
    const target = page.locator('[data-cp77-target]');
    if (await target.count()) {
      await target.evaluate((element) => element.click());
      result.aboutTarget = await page.locator('[data-cp77-target-status]').textContent();
    }
    const mapNode = page.locator('[data-cp77-map-node]').nth(1);
    if (await mapNode.count()) {
      await mapNode.evaluate((element) => element.click());
      result.aboutMap = await page.evaluate(() => ({ active: document.querySelector('[data-cp77-map-node].is-active')?.dataset.cp77MapNode, panel: document.querySelector('[data-cp77-map-detail].is-active')?.dataset.cp77MapDetail }));
    }
    const terminal = page.locator('[data-cp77-terminal-form]');
    if (await terminal.count()) {
      await page.locator('[data-cp77-terminal-input]').fill('help');
      await terminal.locator('button[type="submit"]').evaluate((element) => element.click());
      result.aboutTerminal = await page.locator('[data-cp77-terminal-output]').textContent();
    }
  }
  return result;
}

async function main() {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--no-sandbox'] });
  const results = [];
  for (const [viewportName, viewport] of Object.entries(viewports)) {
    for (const route of routes) {
      const page = await browser.newPage({ viewport });
      await page.addInitScript(initVitals);
      try {
        results.push(await collectPage(page, route, viewportName));
      } catch (error) {
        results.push({ route: route.path, viewport: viewportName, error: error.message });
      }
      await page.close();
    }
  }
  const reducedPage = await browser.newPage({ viewport: viewports.mobile });
  await reducedPage.emulateMedia({ reducedMotion: 'reduce' });
  await reducedPage.addInitScript(initVitals);
  await reducedPage.goto(`${baseUrl}/about/?audit=reduced-motion`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await reducedPage.waitForTimeout(500);
  results.push({
    route: '/about/',
    viewport: 'mobile-reduced-motion',
    reducedMotion: await reducedPage.evaluate(() => ({
      mediaMatches: matchMedia('(prefers-reduced-motion: reduce)').matches,
      bootVisible: Boolean(document.querySelector('[data-cp77-boot].is-booting')),
      videoDisplay: document.querySelector('video') ? getComputedStyle(document.querySelector('video')).display : null,
      motionReady: document.body.classList.contains('cp77-motion-ready'),
    })),
  });
  await reducedPage.close();
  await browser.close();
  process.stdout.write(JSON.stringify({ generatedAt: new Date().toISOString(), baseUrl, results }, null, 2));
}

main().catch((error) => { console.error(error); process.exit(1); });
