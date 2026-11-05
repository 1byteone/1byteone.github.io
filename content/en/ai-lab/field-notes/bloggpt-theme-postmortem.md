---
title: "The BlogGPT Theme: Make A Technical Blog A Workspace, Not An Article List"
date: 2026-10-22
summary: "A review of BlogGPT's workspace layout, article/resource routes, theme selector, and the follow-up AI component lab."
lab_category: field-notes
cover: media/ai-lab/open-doodles-covers/agent-tool-boundary.png
cover_alt: "An AI engineering workspace illustrated through tool boundaries, inputs, and output cards."
cover_credit: "Pablo Stanley / Open Doodles (CC0 1.0)"
translationKey: theme-bloggpt-postmortem
source_page: "theme-center/"
authors: [me]
---

> **Delivery milestone: 2026-10-22.** Commit `c1c2127` records deploying the BlogGPT theme and selector; the interactive AI component lab followed on October 23. The date refers to the first theme deployment, while the lab is a later capability.

## Many Entry Points Need One Workspace

When articles, resources, categories, archives, About, status, and chat each use a different shell, visitors lose context between pages. A selector that changes the root site also makes the BlogGPT workspace compete with other themes. An “AI” button can become another problem if its input, output, error, and offline boundaries are not explicit.

## Workspace Fix

Register BlogGPT as an independent site theme with home, list, single, resource, chat, friends, tech-stack, categories, archives, about, search, status, and 404 routes. Sidebar, search, article content, resource cards, and status panels use the same site data; the preview uses an isolated path. The AI component lab defines its own input, rendering, and error states. Demo responses must not be presented as model measurements.

Markdown, code blocks, tags, and archives share one content model. Active navigation, back paths, and locale URLs stay consistent across templates. The important path is search -> article -> related resource -> theme center, not the number of cards on the homepage.

The October 22 commit proves a browsable workspace and selector; the October 23 AI component lab is a follow-up interaction. BlogGPT is registered as a production theme with a complete capability list, but production AI services, real-call metrics, and data permissions still need separate checks. A chat page is not proof of a reliable AI backend.

For a Feynman exercise, ask an intern to describe the path from a search term to an article, related resource, and theme center without inspecting visual code. Then add timeout, empty-search, and missing-page fallbacks. Workspace quality comes from path continuity, content accuracy, and explainable errors.
