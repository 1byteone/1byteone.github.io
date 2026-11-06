const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Users/FFY/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const showcaseRoot = 'C:/Users/FFY/AppData/Local/Temp/theme-showcase-8956a7cf7cf44802b67511f3c839e9cc';
const repoRoot = 'D:/1byteone.github.io';
const outputDir = 'C:/Users/FFY/AppData/Local/Temp/theme-center-real-captures';
const serverOrigin = 'http://127.0.0.1:1330';

const themes = [
  ['lzw-archive', '/themes/lzw-archive/'],
  ['cyberpunk2077', '/themes/cyberpunk2077/'],
  ['ai-terminal', '/themes/engineer-terminal/'],
  ['astro-tui-portfolio', '/themes/engineer-terminal/astro-tui-portfolio/'],
  ['emil-pixel-terminal', '/themes/engineer-terminal/emil-pixel-terminal/'],
  ['minimal', '/themes/minimal/'],
  ['astro-blog', '/themes/minimal/astro-blog/'],
  ['astropaper', '/themes/minimal/astropaper/'],
  ['astro-erudite', '/themes/minimal/astro-erudite/'],
  ['pudding', '/themes/minimal/pudding/'],
  ['miniblog', '/themes/minimal/miniblog/'],
  ['oil', '/themes/oil/'],
  ['alxian', '/themes/alxian/'],
  ['bloggpt', '/themes/bloggpt/'],
  ['termfolio', '/themes/engineer-terminal/termfolio/'],
];

const contentType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  return ({
    '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
    '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.html': 'text/html', '.woff': 'font/woff',
    '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.ico': 'image/x-icon',
  })[ext] || 'application/octet-stream';
};

const localCandidate = (requestUrl) => {
  const url = new URL(requestUrl);
  const pathname = decodeURIComponent(url.pathname);

  const termfolioPrefix = '/themes/engineer-terminal/termfolio/';
  if (pathname.startsWith(termfolioPrefix)) {
    const termfolioPath = path.join(repoRoot, 'termfolio/out', pathname.slice(termfolioPrefix.length));
    if (fs.existsSync(termfolioPath) && fs.statSync(termfolioPath).isFile()) return termfolioPath;
    if (!path.extname(termfolioPath)) {
      const htmlPath = path.join(termfolioPath, 'index.html');
      if (fs.existsSync(htmlPath)) return htmlPath;
    }
  }

  if (!pathname.startsWith('/themes/')) {
    const staticPath = path.join(repoRoot, 'static', pathname.replace(/^\/+/, ''));
    if (fs.existsSync(staticPath) && fs.statSync(staticPath).isFile()) return staticPath;
  }

  // Theme builds reference assets relative to their preview prefix. Reuse the
  // checked-in local asset library so the captured page has the same imagery.
  if (pathname.startsWith('/themes/')) {
    const assetsIndex = pathname.indexOf('/assets/');
    if (assetsIndex >= 0) {
      const assetPath = path.join(repoRoot, 'static', 'assets', pathname.slice(assetsIndex + '/assets/'.length));
      if (fs.existsSync(assetPath) && fs.statSync(assetPath).isFile()) return assetPath;
    }
    const imageIndex = pathname.indexOf('/images/');
    if (imageIndex >= 0) {
      const imagePath = path.join(repoRoot, 'static', 'images', pathname.slice(imageIndex + '/images/'.length));
      if (fs.existsSync(imagePath) && fs.statSync(imagePath).isFile()) return imagePath;
    }
  }

  const marker = '/themes/';
  const relative = pathname.startsWith(marker) ? pathname.slice(marker.length) : '';
  if (!relative) return null;

  // The Hugo preview output can omit shared static files when several configs are
  // rendered in one destination. Resolve those assets from the current checkout.
  const staticName = relative.split('/').pop();
  if (pathname.includes('/css/') || pathname.includes('/js/')) {
    const staticPath = path.join(repoRoot, 'static', pathname.includes('/css/') ? 'css' : 'js', staticName);
    if (fs.existsSync(staticPath)) return staticPath;
  }

  // Termfolio is a Next static export kept in the repository. It is intentionally
  // served through the same preview origin without duplicating the export.
  return null;
};

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 760 }, deviceScaleFactor: 1 });
  const failed = [];

  await page.route('**/*', async (route) => {
    const request = route.request();
    const url = request.url();
    if (url.startsWith(serverOrigin)) {
      const localPath = localCandidate(url);
      if (localPath) {
        return route.fulfill({
          status: 200,
          contentType: contentType(localPath),
          body: fs.readFileSync(localPath),
        });
      }
    }
    return route.continue();
  });
  page.on('requestfailed', (request) => {
    const url = request.url();
    const error = request.failure()?.errorText || 'failed';
    if (url.startsWith(serverOrigin) && error !== 'net::ERR_ABORTED') failed.push({ url, error });
  });
  page.on('response', (response) => {
    if (response.url().startsWith(serverOrigin) && response.status() >= 400) {
      failed.push({ url: response.url(), error: `HTTP ${response.status()}` });
    }
  });

  const report = [];
  for (const [id, routePath] of themes) {
    const url = `${serverOrigin}${routePath}`;
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      // A few themes intentionally keep a canvas/particle loop active, so a
      // network-idle wait would never be a stable capture boundary. The first
      // painted frame after a short settle window is the showcase state.
      await page.waitForTimeout(1300);
      const title = await page.title();
      const bodyText = (await page.locator('body').innerText().catch(() => '')).slice(0, 120).replace(/\s+/g, ' ');
      const images = await page.locator('img').evaluateAll((items) => items.map((image) => ({ src: image.currentSrc || image.src, loaded: image.complete && image.naturalWidth > 0, width: image.naturalWidth })));
      const screenshotPath = path.join(outputDir, `${id}.png`);
      await page.screenshot({ path: screenshotPath, type: 'png', fullPage: false });
      report.push({ id, url, title, bodyText, imageCount: images.length, failedImages: images.filter((image) => !image.loaded), screenshotPath });
    } catch (error) {
      report.push({ id, url, error: String(error) });
    }
  }

  await browser.close();
  fs.writeFileSync(path.join(outputDir, 'capture-report.json'), JSON.stringify({ generatedAt: new Date().toISOString(), report, failed }, null, 2));
  console.log(JSON.stringify({ report, failedCount: failed.length }, null, 2));
}

main().catch((error) => { console.error(error); process.exit(1); });
