---
title: "AI Lab Homepage Review: Research Visuals, Real Evidence, And Open Work On One Page"
date: 2026-11-05
summary: "At the November 5, 2026 audit checkpoint, review homepage motion, shared-article adaptation, image rights, and the evidence required for evaluations."
lab_category: field-notes
cover: media/ai-lab/open-doodles-covers/rag-grounded-knowledge.png
cover_alt: "An evidence-driven AI research illustration using domain knowledge, paper notes, and crop imagery."
cover_credit: "Pablo Stanley / Open Doodles (CC0 1.0)"
translationKey: theme-ai-lab-postmortem
source_page: "ai-lab/"
authors: [me]
---

> **Audit checkpoint: 2026-11-05.** AI Lab is a usable independent section and preview, not a final production release. This date records the local completion audit and responsive fix; it does not mean production deployment or every research capability is complete.

## A Research-Looking Homepage Is Not Yet A Verifiable Lab

Early work prioritized the hero stage, particles/Canvas, and palette to approach Anthropic's homepage and Research section. Repeated feedback about video, heading motion, hover feedback, content density, and unrelated themes on other pages showed that atmosphere is not a substitute for state-by-state comparison. A concrete reading issue also remained: the article sidebar overlapped the table of contents, which disappeared during scrolling. The page loaded, but the reading task failed.

## Root Cause And Fixes

Visual review had not separated **structure, timing, interaction, and content semantics**. The hero, sticky TOC, metadata, and article container were positioned independently without shared responsive constraints. The repair put metadata and the TOC in one sticky sidebar with internal scrolling; narrow screens use a fixed collapsible TOC and move metadata below the article. Homepage cards use local data, and local cover assets have explicit fallbacks. Motion work also considers offscreen/hidden-page pausing and reduced-motion preferences.

At the audit date, AI Lab had six tracks and 27 Chinese plus 27 English article/record pages, including shared articles. Twelve CC0 SVGs produced six derivative covers. Fifteen representative routes covered the homepage, tracks, bilingual articles, profile, projects, contact, and legal pages. The TOC and horizontal overflow were checked at desktop `1440×900`, tablet `667×547`, and mobile `390×844`. These figures come from that day's audit; they are not full accessibility certification or production verification.

## Evidence, Assets, And Limits Of Comparison

Homepage research images were localized with source URLs and hashes, but downloading or citing an image does not automatically grant redistribution rights. Each asset's terms still need checking. CC0 Open Doodles covers and official Anthropic reference images must remain separate so reference material is not mislabeled as original or CC0. Research experiments need a fixed dataset and measured metrics before moving beyond `planned`; a runnable RAG demo does not prove quality improvement.

The homepage still needs viewport-by-viewport, state-by-state comparison. Current implementation notes document a Canvas stage and carousel; they do not show that the reference video's player has been integrated. Desktop navigation, hover motion, actual video playback, complete keyboard/screen-reader review, and performance regression remain acceptance work. The current Playground is a browser-local text/JSON utility, not an Agnes chat or production RAG service.

## An Engineering Exercise For AI Interns

Use the Feynman method to explain this chain: **source data -> content model -> research record -> evaluation method -> verifiable conclusion**. For one RAG metric, record corpus version, chunking strategy, retriever, top-k, reranker, prompt, model version, latency, and failure cases. Without them, call the conclusion a hypothesis rather than an experiment result. Apply the same discipline to visual reviews: record viewport, state, measurement method, and evidence instead of relying on memory to claim a “complete replication.”

## Release Gate

Remaining work includes adding `dev_theme_ai_lab` to the deployment workflow, aligning Hugo versions, reviewing framework API versions in shared articles, executing evaluation protocols, checking asset rights, and adding browser automation/accessibility regression. Local rendering cannot establish GitHub Pages deployment status; no push or production deployment was performed for this audit. Upgrade the preview status only when these items are closed with evidence.
