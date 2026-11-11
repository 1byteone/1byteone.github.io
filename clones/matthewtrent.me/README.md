# 1byteone personal blog preview

Captured from <https://matthewtrent.me/> on 2026-11-09. The mirror contains the public HTML routes and first-party CSS, JavaScript, fonts, images, SVGs, and resume PDF that were reachable from the route map at capture time.

Run it locally from the repository root:

```powershell
python -m http.server 8766 --directory clones/matthewtrent.me
```

Open <http://127.0.0.1:8766/>. The landing page (`index.html`) is adapted for Yang Jinsong / 1byteone with Chinese copy, verified published blog links, the supplied portrait with its visible lower-right watermark cleaned into a separate derivative, and project/article visuals reused from this repository's own article artwork. The page also includes a local article visual index backed by `media/blog-library/article-covers/`. `asset-catalog.json` records 25 Pexels photos plus 107 Flowbite illustrations and 584 Flowbite icons; `download-manifest.json` keeps the source URLs and license notes. `index.original.html` preserves the captured landing page for design comparison. Other captured routes remain source-reference pages and have not been adapted to the personal blog; the Chinese personal-brand content currently covers the landing page only.

`MIRROR_MANIFEST.json` records the capture time and the three first-party URLs that were unavailable during the crawl. `VENDORED_ASSETS.json` lists the 115 downloaded image references, while `RUNTIME_MANIFEST.json` records the SvelteKit entry/chunk runtime. Five article videos still point to their public GitHub URLs. The original supplied portrait remains unchanged as `portrait-yang-jinsong-reference.png`; the page uses `portrait-yang-jinsong-clean.png`, a derivative with only the lower-right watermark area repaired. Original personal copy, portraits, logos, and third-party media remain the property of their respective owners. Keep this directory for local preview and technical comparison unless you have permission to redistribute the reference materials.
