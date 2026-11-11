# Emil Pixel Terminal Reference Build

## Source And Scope

- Reference: https://www.emil.art/
- Work routes inspected: `/work/ui/`, `/work/capes/`, `/work/art/`, and `/work/other/`.
- The four collections contain 45 Minecraft UI works, 74 cape works (plus 5 highlights repeated from those collections), 31 pixel-art/tutorial works, and 14 other works.
- Public artwork remains the property of Emil Tracht and any other rightsholders. Local copies in this repository are for this explicitly requested, attributed, non-commercial study; do not remove marks, claim authorship, or sell/redistribute the artwork.

## Observed Page Pattern

Each work page shares a compact fixed pixel-font header and footer, a category navigation row with item counts, an introductory sentence, grouped thumbnail shelves, and a large selected-work panel. Selecting a thumbnail updates the preview title, category position, description, and artwork without leaving the page. Previous/next controls navigate the active collection. The selected image can be opened full size. Capes add Stand/Walk animation controls and drag-to-rotate preview behavior. The page remains one continuous collection rather than a set of unrelated mock cards.

| Collection | Groups |
| --- | --- |
| Minecraft / UI | Inventories 10, Esc Menus 6, Other UI 20, Textures 9 |
| Capes | Highlights 5, Multiverse 8, Japanese 6, Prehistoric 7, Anime 4, Space 10, New Year 12, Summer 6, Neon 4, Misc 17 |
| Art | Pixel Art 18, Tutorials 13 |
| Other | Web Design 8, Logos 4, Print 2 |

The five Highlights are curated repeats, so the Capes navigation count remains 74 unique works although the page presents 79 gallery tiles including highlights.

## Visual And Motion Rules

- Palette: near-black green-tinted field, phosphor green, dim green rules, and sparse amber/white particle accents.
- Pixel-font navigation and labels, large pixel-font active title, square controls, thin green active outlines, and compact gallery thumbnails.
- Three full-viewport canvas layers were observed: a 1/3-resolution pixel field, a 1/12-resolution glow/color layer, and a native-resolution effect layer. Combine them with the scanline treatment; keep the content above the canvases.
- The homepage has a separate boot screen and active portfolio screen. The background must retain moving particle clusters, tiny geometric sparkles, and low-opacity ASCII/CRT texture in both states.
- Respect reduced-motion preferences, pause expensive rendering when the tab is hidden, retain keyboard access, and keep touch layouts within the viewport.

## Implementation Contract

- Use local files for collected source thumbnails and selected-work images so previews do not depend on the reference host.
- Preserve source title, group, order, and available descriptions. Fall back to the local thumbnail only when no full-size image is published or the image URL is unavailable.
- The hobby index and its four route variants use one shared gallery renderer. A route selects a collection; thumbnails and Previous/Next update the selected work in place.
- Keep full-size artwork in a local, accessible viewer and keep all hobby navigation on this site. The source notice identifies the original author and the non-commercial study scope.
