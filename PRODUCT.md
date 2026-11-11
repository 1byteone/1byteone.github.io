# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Technical hiring managers reviewing the author's AI application and backend engineering ability.
- Engineering peers looking for implementation notes, architecture decisions, and practical technical writing.

## Product Purpose

An independent developer blog and portfolio that helps readers understand Jinsong Yang's real AI application, RAG, agent, Java backend, and systems work. Success means readers can find relevant project evidence or technical writing quickly and contact the author when there is a fit.

## Positioning

The site connects project outcomes to implementation context, trade-offs, and verification evidence. Its content is grounded in the author's existing projects, articles, and source repositories rather than generic capability claims.

## Operating Context

Readers browse a bilingual static site, search or filter the engineering archive, open Markdown-backed articles and project case studies, and follow GitHub or email links. The site is built with Hugo and deployed through the repository's GitHub Pages workflow.

## Capabilities and Constraints

- Chinese and English content, responsive layouts, article and project archives, search, language switching, and external GitHub/email links.
- Hugo content and shared site data remain the source of truth; theme work must not replace or fabricate their facts.
- Use only claims present in existing content or repositories. Clearly label any illustrative interface data.
- Preserve accessibility, keyboard operation, reduced-motion behavior, and static hosting compatibility.

## Brand Commitments

- The requested identity is YOYO / Night City Engineering, positioned as an independent AI application engineer and full-stack developer.
- The official Cyberpunk 2077 website is the pixel-level visual and motion reference for this personal portfolio: closely reproduce its public-site composition, black/yellow/cyan palette, typography, navigation, buttons, media-led hierarchy, and transitions using HTML/CSS/JS. Preserve YOYO's original content and routes. The user-provided local `logo-cyberpunk-2077-user.png` (and its transparent crop) is permitted as the global header brand mark only. This is an unofficial personal portfolio, not an official Cyberpunk 2077 site or endorsement; do not use HUD/control sticker crops as runtime UI.
- Do not present the existing terminal avatar as a portrait of the author. No approved author portrait is available for this redesign.

## Evidence on Hand

- Existing engineering articles under `content/zh/blog/` and their English counterparts.
- Two project case studies under `content/zh/projects/`: the distributed microservice mall and agricultural QA agent.
- Source links and author profile in `data/site.yaml`.
- The official Cyberpunk 2077 website at `https://www.cyberpunk.net/us/en/`, inspected as the pixel-level public-site visual/motion reference. The user-provided local logo is listed in `assets/media/cyberpunk2077/official/ASSET_MANIFEST.md` and is authorized for header-brand use in this personal portfolio only.
- User-supplied symbol and HUD reference sheets copied to `assets/media/cyberpunk2077/ui/source/`, retained for offline reference only. Their crops and sticker-like UI images are not runtime control, panel, or background assets.
- Locally stored Cyberpunk-inspired photography is used only as editorial hero and article/project cover content, not as control chrome.
- Existing theme implementations and route integration under `layouts/partials/themes/cyberpunk2077/`.

## Product Principles

- Make real implementation evidence easy to find.
- Explain engineering decisions with context and trade-offs.
- Keep claims traceable to published project or article content.
- Let readers move naturally between projects, technical writing, and the author's profile.
