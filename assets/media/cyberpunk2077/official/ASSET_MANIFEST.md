# Cyberpunk 2077 local asset manifest

These files are kept locally so the theme preview does not depend on third-party runtime URLs.

## Provenance

The scene images were downloaded from the official CD PROJEKT RED press page:

`https://press.cdprojektred.com/en/224/445`

The logo file was supplied by the site owner for use in this personal portfolio:

`logo-cyberpunk-2077-user.png`

## Catalog

| Local file | Source URL | Intended use |
| --- | --- | --- |
| `logo-cyberpunk-2077-user.png` | User-provided upload | Site brand mark in the global header |
| `hero-ultimate-edition-16x9-clean.png` | `https://press.cdn.cdpr.app/media/assets/766/CP2077_UE_KV_16x9_RGB_clean_v1.png` | Desktop home hero |
| `hero-ultimate-edition-9x16-clean.png` | `https://press.cdn.cdpr.app/media/assets/766/CP2077_UE_KV_9x16_RGB_clean_v1.png` | Mobile home hero |
| `hero-ultimate-edition-animation.webm` | `https://cdn-l-cyberpunk.cdprojektred.com/video/CP2077_UE_KV_Animation_1920x1080.webm` | Local 1920x1080, 10-second home hero animation; static poster remains reduced-motion fallback |
| `night-city-vista-zh.png` | `https://press.cdn.cdpr.app/media/assets/800/CP77_UE_NS2_Night_City_Vista_ZHS_16x9.png` | Project card fallback |
| `black-sapphire-clean.png` | `https://press.cdn.cdpr.app/media/assets/800/Cyberpunk2077_NS2_Black_Sapphire_1920x1080_CLEAN.png` | Project card fallback |
| `japantown-parade-clean.png` | `https://press.cdn.cdpr.app/media/assets/800/Cyberpunk2077_NS2_Japantown_Parade_1920x1080_CLEAN_EN.png` | Project card fallback |
| `johnny-clean.png` | `https://press.cdn.cdpr.app/media/assets/808/Cyberpunk2077_Mac_Johnny_CLEAN_EN.png` | Future archive/profile visual |
| `night-city-day-clean.png` | `https://press.cdn.cdpr.app/media/assets/808/Cyberpunk2077_Mac_Night_City_at_Day_CLEAN_EN.png` | Future archive/gallery visual |
| `street-view-clean.png` | `https://press.cdn.cdpr.app/media/assets/808/Cyberpunk2077_Mac_Street_View_CLEAN_EN.png` | Project card fallback |

## Editorial derivatives

The following derivatives are deterministic crops/resizes of the official media above. They are optimized for editorial image slots; the originals remain untouched.

| Local file | Derivation | Intended use |
| --- | --- | --- |
| `../ui/logo-tight.png` | Center crop of the user-provided logo to its visible lockup, then resized to 1320x360 PNG | Header logo |
| `../ui/derived/logo-tight-transparent.png` | Crop of the user-provided logo, resized to 1320x360, then keyed against the source `#272322` background to RGBA | Header logo with no rectangular matte |
| `../ui/hero-desktop.webp` | 3840x2160 hero resized to 1920x1080 WebP | Desktop hero |
| `../ui/hero-mobile.webp` | 2160x3840 hero resized to 1080x1920 WebP | Mobile hero |
| `../ui/card-night-city.webp` | 1920x1080 resized to 1200x675 WebP | Project card |
| `../ui/card-black-sapphire.webp` | 1920x1080 resized to 1200x675 WebP | Project card |
| `../ui/card-japantown.webp` | 1920x1080 resized to 1200x675 WebP | Project card |
| `../ui/card-street-view.webp` | Center crop from 8:5 to 16:9, resized to 1200x675 WebP | Project card |
| `../ui/card-johnny.webp` | Center crop from 8:5 to 16:9, resized to 1200x675 WebP | Future archive card |
| `../ui/card-night-city-day.webp` | Center crop from 8:5 to 16:9, resized to 1200x675 WebP | Future archive card |

## Archived user-supplied UI references

The original files are preserved in `../ui/source/`. They were supplied with the design brief and are treated as offline references, not as official CD PROJEKT RED press-kit material. Neither the atlas files nor their crops are used by the active theme.

| Local file | Dimensions | Former use (archived, not rendered) |
| --- | ---: | --- |
| `../ui/source/icons-symbol-sheet.png` | 2048x1365 | Transparent processed atlas used as the signal-strip symbol texture |
| `../ui/source/hud-wide-sheet.png` | 2800x1387 | Compressed HUD atlas used as the telemetry section background |
| `../ui/source/hud-vertical-sheet.png` | 1024x1480 | Compressed vertical atlas used as the telemetry side rail |
| `../ui/source/hud-telemetry-sheet.png` | 1200x675 | Compressed telemetry panel displayed in the homepage interface section |

Processed reference copies (not runtime assets):

- `../ui/icons-symbol-sheet-transparent.png`
- `../ui/hud-wide-sheet.webp`
- `../ui/hud-vertical-sheet.webp`
- `../ui/hud-telemetry.webp`

## Deprecated YOYO UI crops

These deterministic crops are retained for project history only. The active theme no longer references them as controls, button skins, navigation arrows, modal frames, badges, backgrounds, or panel decoration.

| Local file | Source crop | Intended use |
| --- | --- | --- |
| `../ui/derived/hud-frame-panel.png` | `../ui/source/hud-wide-sheet.png` panel region | Project signal frame |
| `../ui/derived/hud-wave-chart.png` | `../ui/source/hud-wide-sheet.png` chart region | Journal signal trace |
| `../ui/derived/hud-loading-bar.png` | `../ui/source/hud-wide-sheet.png` loading region | Legacy telemetry reference only |
| `../ui/derived/hud-scanline.png` | `../ui/source/hud-wide-sheet.png` top rule | Signal index header rule |
| `../ui/derived/hud-vertical-rail.png` | `../ui/source/hud-vertical-sheet.png` rail region | Field ledger rail |
| `../ui/derived/hud-telemetry-panel.png` | `../ui/source/hud-telemetry-sheet.png` full panel | Homepage system signal |
| `../ui/derived/signal-icons.png` | `../ui/source/icons-symbol-sheet.png` icon region | Legacy atlas reference only |
| `../ui/derived/signal-controls.png` | `../ui/source/icons-symbol-sheet.png` control region | Journal signal controls |
| `../ui/derived/ui-button-frame.png` | `../ui/source/hud-vertical-sheet.png` button sprite crop | Primary and utility button decoration |
| `../ui/derived/ui-nav-arrow.png` | `../ui/source/hud-vertical-sheet.png` navigation arrow crop | Navigation and command affordance texture |
| `../ui/derived/ui-status-badge.png` | `../ui/source/hud-vertical-sheet.png` warning/status crop | Tag, status, and metadata markers |
| `../ui/derived/ui-modal-corner.png` | `../ui/source/hud-vertical-sheet.png` telemetry frame crop | Search dialog and overlay corner texture |
| `../ui/derived/ui-button-frame-single.png` | `../ui/source/hud-vertical-sheet.png` crop `x=850,y=620,w=160,h=92` | Single reusable button frame; avoids mixed sprite labels |
| `../ui/derived/ui-nav-arrow-single.png` | `../ui/source/hud-vertical-sheet.png` crop `x=615,y=626,w=92,h=80` | Single reusable navigation arrow |
| `../ui/derived/ui-meta-signal.png` | `../ui/source/hud-vertical-sheet.png` crop `x=34,y=1065,w=170,h=48` | Text-free metadata signal strip |
| `../ui/derived/ui-button-frame-clean.png` | `../ui/source/hud-vertical-sheet.png` crop `x=870,y=1000,w=130,h=70`, interior placeholder erased with a background-color drawbox | Clean single button border for actions and utility controls |
| `../ui/derived/ui-nav-arrow-clean.png` | `../ui/source/hud-vertical-sheet.png` crop `x=550,y=640,w=65,h=70` | Clean single cyan navigation arrow |
| `../ui/derived/ui-status-badge-clean.png` | `../ui/source/hud-vertical-sheet.png` crop `x=870,y=720,w=130,h=70`, interior placeholder erased with a background-color drawbox | Clean empty status frame for tags and metadata |
| `../ui/derived/ui-modal-corner-clean.png` | `../ui/source/hud-wide-sheet.png` crop `x=1370,y=65,w=90,h=90` | Single yellow HUD corner for command dialogs |
| `../ui/derived/hud-loading-bar-clean.png` | `../ui/source/hud-wide-sheet.png` crop `x=1990,y=670,w=310,h=35` | Single striped loading/status bar without label text |
| `../ui/derived/logo-tight-transparent.png` | `../official/logo-cyberpunk-2077-user.png` crop `x=0,y=365,w=2048,h=560`, resize to 1320x360, chroma-key `#272322` | Header theme mark without a matte |

The archival crops can be regenerated with `tools/cyberpunk-ui-crops.ps1`; the script requires `ffmpeg` and keeps the source atlas unchanged.

## Usage note

The press-kit images and the Cyberpunk 2077 marks remain the property of CD PROJEKT RED. They are used here for a personal, non-commercial portfolio preview. Confirm current CD PROJEKT RED press-kit and commercial-use terms before publishing a commercial or redistributed build.
