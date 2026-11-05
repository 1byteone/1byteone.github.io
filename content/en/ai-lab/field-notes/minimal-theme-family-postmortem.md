---
title: "From A Theme Dropdown To A Theme Directory: Reviewing The Minimal Family Boundary"
date: 2026-10-23
summary: "A review of Minimal variants, content routes, and the global theme center, including how visual choices moved out of primary navigation."
lab_category: field-notes
cover: media/ai-lab/open-doodles-covers/rag-grounded-knowledge.png
cover_alt: "A reader seated beside books, used as an editorial illustration for technical reading and theme information architecture."
cover_credit: "Pablo Stanley / Open Doodles (CC0 1.0)"
translationKey: theme-minimal-family-postmortem
source_page: "theme-center/"
authors: [me]
---

> **Milestone date: 2026-10-23.** Commits from that day delivered Minimal-family previews, article templates, and theme-switcher route checks. This marks the first delivery of the Minimal family; it does not mean the later `ai-minimal-tech` product was implemented. The current registry still marks that item as planned.

## The Problem Was Not A Longer Menu

The requirement was to manage blogs with different visual styles and content purposes. Putting Minimal, Terminal, and Lab themes in the top bar mixes two questions: where a visitor wants to go and how they want the site to look. During implementation, a new theme was also placed under the Minimal parent. That contradicted the content-oriented family plan, so the theme hierarchy was corrected.

## Symptoms And Root Cause

The theme list kept growing, names did not explain use cases, and some switcher links returned visitors to the default presentation. Two boundaries were missing: **information architecture** versus **presentation**, and theme metadata describing family, preview route, lifecycle, and whether a theme could become the site default.

## What Changed

Primary navigation now serves content destinations such as articles, projects, and experiments. A theme directory handles discovery, preview, and switching. Minimal owns its article-oriented variants; the AI engineering directions sit under a separate `ai-engineering` family. Registry records expose `family`, `parent`, `role`, `scope`, `available`, `default_selectable`, and `preview_path`. A preview can therefore be visited without silently changing the site's default.

The model also makes unfinished work visible. Listing six AI engineering directions does not implement them: Minimal Tech, Technical Editorial, AI Product Studio, and Pixel World remain planned in the registry.

## Before, After, And Evidence

Before the change, the top bar mixed content navigation with an expanding collection of visual choices, while parent-child relationships existed mostly in names. Afterwards, navigation and theme management have separate roles, and family, preview route, and default eligibility are inspectable data. The October 23 commits cover family previews, article templates, the global switcher, and article-route checks. No conversion or usability-duration study was recorded, so this review does not claim a quantitative UX gain.

## A Feynman Exercise For AI Engineering Interns

Treat the registry as a small domain model: Theme is an entity, Parent and Family are relationships, Supports describes capabilities, and Status describes lifecycle. Explain to a teammate, without opening the code, why “articles, projects, experiments” are content routes while “minimal, terminal, pixel” are presentation strategies. Then give two failure examples caused by mixing those concepts.

The reusable lesson is to define route ownership, theme lifecycle, and default-selection semantics before building the gallery. Remaining work includes real pages for planned entries, per-variant acceptance criteria, and automated checks that compare registry declarations with CI route coverage.
