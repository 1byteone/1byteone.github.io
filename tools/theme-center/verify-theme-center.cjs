const path = require('path');
const { chromium } = require('C:/Users/FFY/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const baseUrl = 'http://127.0.0.1:1420/theme-center/';
const outputDir = 'C:/Users/FFY/AppData/Local/Temp';

async function inspect(page, viewport, screenshotName) {
  await page.setViewportSize(viewport);
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    document.querySelectorAll('.tc-preview-real img').forEach((image) => { image.loading = 'eager'; });
  });
  await page.waitForFunction(() => Array.from(document.querySelectorAll('.tc-preview-real img')).every((image) => image.complete), null, { timeout: 15000 });
  await page.waitForTimeout(250);

  const result = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('.tc-preview-real img'));
    return {
      viewport: { width: innerWidth, height: innerHeight },
      documentWidth: document.documentElement.scrollWidth,
      realPreviewCount: images.length,
      loadedPreviewCount: images.filter((image) => image.naturalWidth > 0).length,
      brokenPreviews: images.filter((image) => image.naturalWidth === 0).map((image) => image.currentSrc),
      plannedCount: document.querySelectorAll('.tc-preview-unavailable').length,
      fakePreviewMarkup: Boolean(document.querySelector('.tc-preview-window, .tc-preview-lines, .tc-preview-blocks')),
      cards: document.querySelectorAll('[data-theme-card]').length,
    };
  });
  await page.screenshot({ path: path.join(outputDir, screenshotName), fullPage: true });
  return result;
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const consoleErrors = [];
  page.on('pageerror', (error) => consoleErrors.push(error.message));

  const desktop = await inspect(page, { width: 1440, height: 900 }, 'theme-center-real-desktop.png');
  await page.locator('[data-theme-filter="terminal"]').click();
  const terminalVisible = await page.locator('[data-theme-card]:visible').count();
  await page.locator('[data-theme-search]').fill('Astro TUI');
  const searchVisible = await page.locator('[data-theme-card]:visible').count();
  await page.locator('[data-theme-search]').fill('');
  await page.locator('[data-theme-filter="all"]').click();

  const mobile = await inspect(page, { width: 390, height: 844 }, 'theme-center-real-mobile.png');
  await browser.close();
  const report = { desktop, mobile, terminalVisible, searchVisible, consoleErrors };
  console.log(JSON.stringify(report, null, 2));
  if (desktop.brokenPreviews.length || mobile.brokenPreviews.length || desktop.documentWidth > 1440 || mobile.documentWidth > 390 || desktop.loadedPreviewCount !== desktop.realPreviewCount || terminalVisible < 1 || searchVisible !== 1 || consoleErrors.length) process.exit(1);
}

main().catch((error) => { console.error(error); process.exit(1); });
