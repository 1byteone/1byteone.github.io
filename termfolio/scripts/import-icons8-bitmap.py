"""Import the visible Icons8 Bitmap references into the local catalog.

The source page exposes preview JPGs with a light watermark. The project keeps
those previews under assets/sources and publishes only a high contrast local
PNG derivative with a transparent background.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from urllib.request import Request, urlopen

import numpy as np
from PIL import Image, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "assets" / "sources" / "icons8-bitmap" / "catalog"
PUBLIC_DIR = ROOT / "public" / "images" / "blog" / "bitmap" / "catalog"
LIB_DIR = ROOT / "lib"
SOURCE_PAGE = "https://icons8.com/illustrations/style--bitmap"


ASSETS = [
    ("bitmap-film-reel", "Film reel", "https://ouch-prod-var-cdn.icons8.com/td/illustrations/previews/ZuOk7Jg-VgLzN_wc.jpg"),
    ("bitmap-hourglass-with-sand-flowing-in-classic-wooden-frame", "Hourglass", "https://ouch-prod-var-cdn.icons8.com/dc/illustrations/previews/xKMC7pSS_isZxjf4.jpg"),
    ("bitmap-dice-game", "Dice game", "https://ouch-prod-var-cdn.icons8.com/wg/illustrations/previews/8TKA53pMWeOgeWuV.jpg"),
    ("bitmap-halloween-pumpkin-with-hat", "Halloween pumpkin", "https://ouch-prod-var-cdn.icons8.com/gz/illustrations/previews/4ODrH6OrZdZ5xrP5.jpg"),
    ("bitmap-audio-boombox", "Audio boombox", "https://ouch-prod-var-cdn.icons8.com/px/illustrations/previews/ibZC0ByNN6l7uqrX.jpg"),
    ("bitmap-scales", "Scales", "https://ouch-prod-var-cdn.icons8.com/ui/illustrations/previews/K9i7J6hArl-824EJ.jpg"),
    ("bitmap-eyes", "Eyes", "https://ouch-prod-var-cdn.icons8.com/fx/illustrations/previews/e9lvSfie1T3CVLPp.jpg"),
    ("bitmap-cherry", "Cherry", "https://ouch-prod-var-cdn.icons8.com/it/illustrations/previews/0NBd355nZJqCue_z.jpg"),
    ("bitmap-shell", "Shell", "https://ouch-prod-var-cdn.icons8.com/in/illustrations/previews/K1afIirUpkzDwPfO.jpg"),
    ("bitmap-pocket-watch", "Pocket watch", "https://ouch-prod-var-cdn.icons8.com/nu/illustrations/previews/cz-rzo57XQfYiyFZ.jpg"),
    ("bitmap-young-man-riding-a-skateboard", "Skateboard", "https://ouch-prod-var-cdn.icons8.com/uf/illustrations/previews/2x9VN6rFebKRTwp4.jpg"),
    ("bitmap-mirror", "Mirror", "https://ouch-prod-var-cdn.icons8.com/rx/illustrations/previews/XSIBasM8fZEyowU9.jpg"),
    ("bitmap-cassette", "Cassette", "https://ouch-prod-var-cdn.icons8.com/pa/illustrations/previews/_Bm-ftmznyByKaid.jpg"),
    ("bitmap-microphone", "Microphone", "https://ouch-prod-var-cdn.icons8.com/oj/illustrations/previews/JH-x40_4yNnZIjuh.jpg"),
    ("bitmap-winners-cup", "Winner's cup", "https://ouch-prod-var-cdn.icons8.com/oi/illustrations/previews/Jj52NkLXZWUxPs1Z.jpg"),
    ("bitmap-photographic-film", "Photographic film", "https://ouch-prod-var-cdn.icons8.com/vm/illustrations/previews/lhH4PflidJRIihcS.jpg"),
    ("bitmap-street-light", "Street light", "https://ouch-prod-var-cdn.icons8.com/xo/illustrations/previews/OFk19_nzRhtkch8B.jpg"),
    ("bitmap-old-mobile-phone", "Old mobile phone", "https://ouch-prod-var-cdn.icons8.com/et/illustrations/previews/rSOHc_PpFijbjzt9.jpg"),
    ("bitmap-game-boy", "Game Boy", "https://ouch-prod-var-cdn.icons8.com/zx/illustrations/previews/0tu_93tKznLNO6m1.jpg"),
    ("bitmap-knight-chess", "Knight chess", "https://ouch-prod-var-cdn.icons8.com/sm/illustrations/previews/LlHw1O9DL_EIBy73.jpg"),
    ("bitmap-handcuffs", "Handcuffs", "https://ouch-prod-var-cdn.icons8.com/bz/illustrations/previews/TpemyeBYTaL-2WZE.jpg"),
    ("bitmap-sewing-machine", "Sewing machine", "https://ouch-prod-var-cdn.icons8.com/rx/illustrations/previews/569lDuk7x2yQiKN7.jpg"),
    ("bitmap-pigeon", "Pigeon", "https://ouch-prod-var-cdn.icons8.com/lx/illustrations/previews/cJ6tUH5m8HA97DVw.jpg"),
    ("bitmap-silhouette-of-people-against-the-background-of-a-window", "Window silhouettes", "https://ouch-prod-var-cdn.icons8.com/uc/illustrations/previews/BGxPRJg1ZJ8MvhOD.jpg"),
    ("bitmap-deer-head", "Deer head", "https://ouch-prod-var-cdn.icons8.com/tl/illustrations/previews/Md-u9JVBrZziZFkA.jpg"),
    ("bitmap-chess", "Chess", "https://ouch-prod-var-cdn.icons8.com/vj/illustrations/previews/-ZB6-sTh8WFfWkG0.jpg"),
    ("bitmap-ballerina", "Ballerina", "https://ouch-prod-var-cdn.icons8.com/if/illustrations/previews/RXaNw9PgNC0GMB8S.jpg"),
    ("bitmap-hot-air-balloon-with-striped-pattern-and-basket", "Hot air balloon", "https://ouch-prod-var-cdn.icons8.com/do/illustrations/previews/yOG7-yP-VFIfxn2t.jpg"),
    ("bitmap-alarm", "Alarm", "https://ouch-prod-var-cdn.icons8.com/ak/illustrations/previews/Kaf9TobUNikqf6ff.jpg"),
    ("bitmap-classic-compact-automobile-with-black-and-white-shading", "Compact automobile", "https://ouch-prod-var-cdn.icons8.com/bi/illustrations/previews/nqwdwLtkNNiYZsZu.jpg"),
    ("bitmap-disco-ball", "Disco ball", "https://ouch-prod-var-cdn.icons8.com/li/illustrations/previews/7rE41l-OKzdzsAMA.jpg"),
    ("bitmap-colosseum", "Colosseum", "https://ouch-prod-var-cdn.icons8.com/qe/illustrations/previews/O1MRN0vYaC8ZMJWi.jpg"),
    ("bitmap-human-brain-silhouette-with-detailed-black-and-white-shading", "Human brain", "https://ouch-prod-var-cdn.icons8.com/qw/illustrations/previews/mte1UBkAYE9QeWDB.jpg"),
    ("bitmap-crown", "Crown", "https://ouch-prod-var-cdn.icons8.com/wl/illustrations/previews/Ws3n1Obw7JFbBB-f.jpg"),
    ("bitmap-butterfly", "Butterfly", "https://ouch-prod-var-cdn.icons8.com/zh/illustrations/previews/rz_yc4erVXMv8FMf.jpg"),
    ("bitmap-planet-earth", "Planet earth", "https://ouch-prod-var-cdn.icons8.com/hk/illustrations/previews/dpPJsRaq7Z7pJWIF.jpg"),
    ("bitmap-cupid", "Cupid", "https://ouch-prod-var-cdn.icons8.com/og/illustrations/previews/4c9HVQ0hz7G134JF.jpg"),
    ("bitmap-gypsum-statue-of-apollos-head", "Apollo statue", "https://ouch-prod-var-cdn.icons8.com/on/illustrations/previews/sffnii8-_8FOOkwK.jpg"),
    ("bitmap-lighthouse", "Lighthouse", "https://ouch-prod-var-cdn.icons8.com/wp/illustrations/previews/Djgs8UuI7RToabC5.jpg"),
    ("bitmap-angel-sculpture", "Angel sculpture", "https://ouch-prod-var-cdn.icons8.com/pr/illustrations/previews/teTwoznmrypHZ4u4.jpg"),
    ("bitmap-light-bulb-with-halftone-dots-and-detailed-metal-socket", "Light bulb", "https://ouch-prod-var-cdn.icons8.com/qz/illustrations/previews/JZbBCBdWtjI99gsx.jpg"),
    ("bitmap-frame", "Frame", "https://ouch-prod-var-cdn.icons8.com/xl/illustrations/previews/GJYwbPzrKl0f2nm5.jpg"),
    ("bitmap-old-key", "Old key", "https://ouch-prod-var-cdn.icons8.com/tc/illustrations/previews/qOqxpgjuP3qodgOy.jpg"),
    ("bitmap-vintage-skeleton-key-with-oval-bow", "Skeleton key", "https://ouch-prod-var-cdn.icons8.com/kz/illustrations/previews/uI67790K15F61YGM.jpg"),
    ("bitmap-eiffel-tower", "Eiffel tower", "https://ouch-prod-var-cdn.icons8.com/gc/illustrations/previews/2lmq_fP-4YQ6FRO8.jpg"),
    ("bitmap-city-silhouette", "City silhouette", "https://ouch-prod-var-cdn.icons8.com/yp/illustrations/previews/Fl1StiWP5eZGWJ0g.jpg"),
    ("bitmap-wooden-house", "Wooden house", "https://ouch-prod-var-cdn.icons8.com/tw/illustrations/previews/vzoNNb3d7dKdmXu4.jpg"),
    ("bitmap-open-mouth-with-tongue", "Open mouth", "https://ouch-prod-var-cdn.icons8.com/mz/illustrations/previews/b9cVCOCDLanpTdqk.jpg"),
    ("bitmap-ear", "Ear", "https://ouch-prod-var-cdn.icons8.com/kj/illustrations/previews/rNV3-RQ-DYRwi4GZ.jpg"),
    ("bitmap-retro-monochrome-heart-with-textured-pattern-fill", "Retro heart", "https://ouch-prod-var-cdn.icons8.com/sk/illustrations/previews/5Lb29-Zkdd67q_p1.jpg"),
    ("bitmap-arrow-with-halftone-shadow-and-bold-volumetric-shape", "Arrow", "https://ouch-prod-var-cdn.icons8.com/bp/illustrations/previews/Z7O20dnnyctBgD3S.jpg"),
    ("bitmap-hashtag-symbol", "Hashtag", "https://ouch-prod-var-cdn.icons8.com/ox/illustrations/previews/G73jsI3iuP39l7Gx.jpg"),
    ("bitmap-floral-bead", "Floral bead", "https://ouch-prod-var-cdn.icons8.com/hl/illustrations/previews/YXyC9GqIHiY4bwT1.jpg"),
    ("bitmap-twisted-cuboid", "Twisted cuboid", "https://ouch-prod-var-cdn.icons8.com/xb/illustrations/previews/885ul6QoZZnfTrZn.jpg"),
    ("bitmap-lego-cube", "Lego cube", "https://ouch-prod-var-cdn.icons8.com/wb/illustrations/previews/PtPyf6roNd_wq3C7.jpg"),
    ("bitmap-mechanical-gear-wheel-with-pixelated-halftone-texture", "Mechanical gear", "https://ouch-prod-var-cdn.icons8.com/bo/illustrations/previews/rtsuU4i2XOF6Kn4a.jpg"),
    ("bitmap-flower-shaped-tube", "Flower tube", "https://ouch-prod-var-cdn.icons8.com/ln/illustrations/previews/NtxIyBnp0BD0--Rf.jpg"),
    ("bitmap-sparkles-with-halftone-pixel-effect", "Sparkles", "https://ouch-prod-var-cdn.icons8.com/af/illustrations/previews/r5MrXXBNLHhiHxEx.jpg"),
    ("bitmap-black-curve", "Black curve", "https://ouch-prod-var-cdn.icons8.com/bw/illustrations/previews/lwbVb8iG-7YwXi1W.jpg"),
    ("bitmap-vintage-eyewear-with-circular-black-lenses", "Vintage eyewear", "https://ouch-prod-var-cdn.icons8.com/oj/illustrations/previews/MPe-gw9jLPW13iL3.jpg"),
    ("bitmap-couple-in-front-of-the-eiffel-tower", "Eiffel couple", "https://ouch-prod-var-cdn.icons8.com/wm/illustrations/previews/dCcD7lAz7Vwaytws.jpg"),
    ("bitmap-candle-in-a-candlestick", "Candle", "https://ouch-prod-var-cdn.icons8.com/ka/illustrations/previews/cyYfEzOc9nqIn_Yy.jpg"),
    ("bitmap-poppy-flower", "Poppy flower", "https://ouch-prod-var-cdn.icons8.com/jx/illustrations/previews/HhME-maWEUxk_E0o.jpg"),
    ("bitmap-mount-rushmore-national-memorial", "Mount Rushmore", "https://ouch-prod-var-cdn.icons8.com/vd/illustrations/previews/Ro836RzfR2brEmMB.jpg"),
    ("bitmap-angel-of-sorrow", "Angel of sorrow", "https://ouch-prod-var-cdn.icons8.com/zx/illustrations/previews/lt8-mABuPTXZFl22.jpg"),
    ("bitmap-airship", "Airship", "https://ouch-prod-var-cdn.icons8.com/iv/illustrations/previews/Yd4wUdwXJioryBeh.jpg"),
    ("bitmap-typewriter", "Typewriter", "https://ouch-prod-var-cdn.icons8.com/td/illustrations/previews/jygCB3qXZNQzSPv5.jpg"),
    ("bitmap-statue-of-liberty", "Statue of liberty", "https://ouch-prod-var-cdn.icons8.com/ir/illustrations/previews/h08PC_kGzLxa-zBs.jpg"),
    ("bitmap-mosque", "Mosque", "https://ouch-prod-var-cdn.icons8.com/tz/illustrations/previews/TK1N8XBly0wLn8Gv.jpg"),
    ("bitmap-fossil-shell", "Fossil shell", "https://ouch-prod-var-cdn.icons8.com/zc/illustrations/previews/sxNXvD_qhOFWywbR.jpg"),
    ("bitmap-avocado", "Avocado", "https://ouch-prod-var-cdn.icons8.com/nb/illustrations/previews/VCCID22RypvF_3BM.jpg"),
    ("bitmap-violin", "Violin", "https://ouch-prod-var-cdn.icons8.com/wm/illustrations/previews/54HW2SIoT-vd3j0M.jpg"),
    ("bitmap-old-camera", "Old camera", "https://ouch-prod-var-cdn.icons8.com/jn/illustrations/previews/R0UOvx67KedlHFrQ.jpg"),
    ("bitmap-betta-fish-with-flowing-tail-and-curved-body", "Betta fish", "https://ouch-prod-var-cdn.icons8.com/cu/illustrations/previews/wulXmYPQS3B2haNT.jpg"),
    ("bitmap-pineapple", "Pineapple", "https://ouch-prod-var-cdn.icons8.com/eg/illustrations/previews/mRcNwyXrwdxAnZnk.jpg"),
    ("bitmap-lantern", "Lantern", "https://ouch-prod-var-cdn.icons8.com/xt/illustrations/previews/T3_Ca5QxOtMsNr-T.jpg"),
    ("bitmap-guy-with-glasses-and-cap", "Guy with glasses", "https://ouch-prod-var-cdn.icons8.com/wj/illustrations/previews/BaWaJeahWEO2qhwc.jpg"),
    ("bitmap-big-ben", "Big Ben", "https://ouch-prod-var-cdn.icons8.com/mf/illustrations/previews/E3WVpqBCF_duZXr3.jpg"),
    ("bitmap-red-telephone-box", "Telephone box", "https://ouch-prod-var-cdn.icons8.com/od/illustrations/previews/PXOMzFm9lL_CirFS.jpg"),
    ("bitmap-srow", "Crow", "https://ouch-prod-var-cdn.icons8.com/nk/illustrations/previews/mxWQ8iariaHn76q9.jpg"),
    ("bitmap-airplane-top-view-with-twin-engines", "Airplane", "https://ouch-prod-var-cdn.icons8.com/kk/illustrations/previews/x1K0XsGZL9RaCtPy.jpg"),
    ("bitmap-motorcycle", "Motorcycle", "https://ouch-prod-var-cdn.icons8.com/du/illustrations/previews/aqCFVRmNr2C9e4W0.jpg"),
    ("bitmap-scissors", "Scissors", "https://ouch-prod-var-cdn.icons8.com/id/illustrations/previews/Zd5jXy8VN_lDA-s3.jpg"),
    ("bitmap-leaning-tower-of-pisa", "Leaning tower", "https://ouch-prod-var-cdn.icons8.com/xi/illustrations/previews/_bmLBpU5NG1E5GjI.jpg"),
    ("bitmap-dog-balloon", "Dog balloon", "https://ouch-prod-var-cdn.icons8.com/dp/illustrations/previews/-O9nc2wpkkY2L3vf.jpg"),
    ("bitmap-sompass", "Compass", "https://ouch-prod-var-cdn.icons8.com/bi/illustrations/previews/KJ0NfJovLiDZzVWw.jpg"),
    ("bitmap-old-phone", "Old phone", "https://ouch-prod-var-cdn.icons8.com/uf/illustrations/previews/SESgJAnPryWhgUXO.jpg"),
    ("bitmap-horn", "Horn", "https://ouch-prod-var-cdn.icons8.com/jt/illustrations/previews/tbS8DxzdgCOefkrD.jpg"),
    ("bitmap-clover", "Clover", "https://ouch-prod-var-cdn.icons8.com/rm/illustrations/previews/suw_UD9QxNi8b5dl.jpg"),
    ("bitmap-cat-portrait-with-front-paws-on-ledge-black-and-white", "Cat portrait", "https://ouch-prod-var-cdn.icons8.com/uw/illustrations/previews/ufDRcploG4wkqy6N.jpg"),
    ("bitmap-compact-cassette", "Compact cassette", "https://ouch-prod-var-cdn.icons8.com/il/illustrations/previews/InO-rRQ59Gjcrssh.jpg"),
    ("bitmap-tulip", "Tulip", "https://ouch-prod-var-cdn.icons8.com/uy/illustrations/previews/Ovc5HMpY_OO8hUig.jpg"),
    ("bitmap-single-rose-silhouette-for-romantic-occasions", "Rose silhouette", "https://ouch-prod-var-cdn.icons8.com/ws/illustrations/previews/mz5lFAiEc28XrSGe.jpg"),
    ("bitmap-caravan", "Caravan", "https://ouch-prod-var-cdn.icons8.com/dp/illustrations/previews/Qp8c6hBaaoIjCrFy.jpg"),
    ("bitmap-paper-ship", "Paper ship", "https://ouch-prod-var-cdn.icons8.com/cs/illustrations/previews/K1LZskDiMbu8D_oa.jpg"),
    ("bitmap-hourglass-timekeeper-with-falling-sand-and-glass-bulbs", "Hourglass timekeeper", "https://ouch-prod-var-cdn.icons8.com/ma/illustrations/previews/17rRxnh4T_oTtDIs.jpg"),
    ("bitmap-hungarian-parliament-building", "Hungarian parliament", "https://ouch-prod-var-cdn.icons8.com/jc/illustrations/previews/2nvy9e9267FWV8bP.jpg"),
    ("bitmap-sat", "Cat", "https://ouch-prod-var-cdn.icons8.com/yu/illustrations/previews/tGv2S-QxilVvPogY.jpg"),
    ("bitmap-spatial-computer", "Spatial computer", "https://ouch-prod-var-cdn.icons8.com/gd/illustrations/previews/ChngAb6qJodFQuDE.jpg"),
    ("bitmap-old-car", "Old car", "https://ouch-prod-var-cdn.icons8.com/mj/illustrations/previews/bzJzOXeHfyiqNHvS.jpg"),
]


def fetch(url: str, target: Path) -> None:
    if target.exists() and target.stat().st_size > 1024:
        return
    request = Request(url, headers={"User-Agent": "Mozilla/5.0 (termfolio asset importer)"})
    with urlopen(request, timeout=30) as response:
        target.write_bytes(response.read())


def clean_preview(source: Path, target: Path) -> None:
    image = Image.open(source).convert("RGB")
    image.thumbnail((720, 720), Image.Resampling.LANCZOS)
    gray = np.asarray(ImageOps.grayscale(image), dtype=np.float32)
    # Dark artwork is opaque white in the terminal; the near-white page and
    # pale preview watermark become transparent. A small alpha floor removes
    # the remaining low-contrast watermark pixels without erasing the dots.
    alpha = np.clip((190.0 - gray) * 3.4, 0, 255)
    alpha[alpha < 52] = 0
    rgba = np.full((*gray.shape, 4), 255, dtype=np.uint8)
    rgba[:, :, 3] = alpha.astype(np.uint8)
    Image.fromarray(rgba, "RGBA").save(target, optimize=True)


def main() -> int:
    SOURCE_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    catalog: list[dict[str, str]] = []
    for index, (slug, title, url) in enumerate(ASSETS, start=1):
        source = SOURCE_DIR / f"{slug}.jpg"
        output = PUBLIC_DIR / f"{slug}.png"
        try:
            fetch(url, source)
            clean_preview(source, output)
            catalog.append({
                "slug": slug,
                "title": title,
                "src": f"/images/blog/bitmap/catalog/{slug}.png",
                "source": f"https://icons8.com/illustrations/illustration/{slug}",
            })
            print(f"[{index:02d}/{len(ASSETS)}] {title}")
        except Exception as error:  # keep the batch moving if one CDN item expires
            print(f"[{index:02d}/{len(ASSETS)}] skipped {slug}: {error}", file=sys.stderr)

    (PUBLIC_DIR / "index.json").write_text(json.dumps(catalog, ensure_ascii=False, indent=2), encoding="utf-8")
    (LIB_DIR / "bitmap-catalog.json").write_text(json.dumps(catalog, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Imported {len(catalog)} Bitmap assets from {SOURCE_PAGE}")
    return 0 if catalog else 1


if __name__ == "__main__":
    raise SystemExit(main())
