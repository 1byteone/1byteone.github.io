---
title: "The Cyberpunk 2077 Theme: Replace Neon Filters With Measurable UI States"
date: 2026-11-02
summary: "A review of real content, interaction coverage, performance evidence, and release conditions based on the November 2, 2026 UI/UX and motion audit."
lab_category: field-notes
cover: media/ai-lab/open-doodles-covers/hallucination-review.png
cover_alt: "A technical review illustration composed of evidence pages and marked comparisons."
cover_credit: "Pablo Stanley / Open Doodles (CC0 1.0)"
translationKey: theme-cyberpunk2077-postmortem
source_page: "theme-center/"
authors: [me]
---

> **Audit milestone: 2026-11-02.** The result that day was a CONDITIONAL PASS, not a claim that the theme or deployment was fully complete. Assets and layouts changed afterward; this review covers only the reproducible audit snapshot.

## Neon Colors Cannot Hide Empty Content

Early cyberpunk pages can easily become little more than color, scanlines, and motion. The user required articles, projects, stack, hobbies, and About to share one theme rather than opening pages with unrelated skins. The real work was a common shell, dedicated content templates, real data, and state feedback for search, menus, and terminal controls. The game HUD reference also had many assets; placing them directly into the page would push readable content into the background.

## Model Assets And Interaction States

Separate source media from derivatives and record each file's role in a manifest. Categorize wide, vertical, icon, and HUD components by dimensions and meaning. The theme shell owns shared navigation and style loading; home/list/single/profile/hobby templates own their content. Search dialogs, mobile navigation, map tabs, target lock, and terminal commands each need keyboard focus, ARIA state, and close/fallback paths. Keep images and copy on separate layers so headings do not cover high-detail HUD artwork.

## Before/After And Audit Evidence

The audit recorded a Hugo Extended 0.162.0 build of 262 Chinese pages, 253 English pages, and 739 static files. Six representative routes returned 200 across desktop, tablet, and phone samples. Eighteen route/viewport samples had no horizontal overflow, console errors, or failed requests. Search, Escape close with focus restoration, mobile-menu ARIA state, target lock, map selection, terminal `help`, and reduced-motion behavior were exercised. Headless samples reported roughly 61–62 FPS, **only for those local samples**, not physical mobile devices or a production performance SLA.

Compared with the initial mood board, acceptance moved toward real articles/projects, cross-route shell consistency, and specific interaction behavior. The audit scored UI/UX 4/5, motion 3/5, accessibility 3/5, and overall 3.25/5. AUD-004 remained open to narrow reduced-motion rules. Screen readers, INP, memory growth, GPU/battery cost, exhaustive WCAG contrast, and CI deployment were not measured. Any quoted figures need these limits alongside them.

## Lessons And An Intern Exercise

For a Feynman exercise, explain why each motion effect needs a start condition, running state, stop condition, and hidden/reduced-motion fallback. Then pick one HUD card and record its layer relationship to text, contrast, target size, keyboard path, and narrow-screen collapse. Mapping effects to a state machine demonstrates more engineering than adding another glow.

Before release, close AUD-004 and add physical-device, screen-reader, long-session cleanup, and deployment-workflow checks. Inferring a successful live deployment from a local build is the acceptance mistake this project most needs to avoid.
