---
title: "Emil Pixel Terminal: Turning ‘Replication’ Into Testable Assets And States"
date: 2026-11-03
summary: "A milestone review of the Emil-inspired pixel terminal, its boot state, canvas, navigation, and hobby-page adaptation, with the remaining gap between prototype and asset-complete work."
lab_category: field-notes
cover: media/ai-lab/open-doodles-covers/prompt-design.png
cover_alt: "An illustration of interaction design through sketches, inputs, and prompt cards."
cover_credit: "Pablo Stanley / Open Doodles (CC0 1.0)"
translationKey: theme-emil-pixel-terminal-postmortem
source_page: "theme-center/"
authors: [me]
---

> **Milestone record: 2026-11-03.** This is a local interaction and multi-viewport checkpoint, not a declaration that the Emil theme is fully replicated. Its delivery note classifies the result as an interactive visual prototype; asset-level alignment remains incomplete.

## First Failure: Pixel Styling Without The Reference Work

The initial implementation reduced Emil.art navigation to a few simplified entries and replaced artwork with Canvas wireframes and generic particles. Buttons responded, but the four Hobby categories (Minecraft/UI, Capes, Art, Other) lacked their content density, work details, image inspection, and page-level interactions. Feedback that About, Hobby, and the homepage felt empty showed that reproducing the opening mood does not reproduce the whole website.

## Turn “Complete” Into Acceptance Objects

The page was decomposed into Boot and Active states. The start control, keyboard entry/exit, category selection, state canvas, detail routes, sound toggle, and mobile layout each need separate checks. Site content belongs to the local work/article model; hobby categories use dedicated data and local assets instead of sending visitors to the reference site. An inspection canvas must expose actual assets rather than use one abstract wireframe as a substitute for a catalog.

The engineering vocabulary separates CRT compositor, sprite/particle layer, pixel wireframe renderer, pointer state, audio feedback, and content adapter. This makes symptoms easier to locate: blurry media is an asset/layout collision, a weak menu is a state-feedback/focus problem, and a moving hero does not prove routes or keyboard controls work.

## Milestone Gains And Remaining Gaps

By November 3, Boot/Active states, keyboard category selection, sound toggling, and drag inspection could be checked; desktop `1440×1000` and mobile `390×844` had no horizontal overflow. However, type, cursor, particle composition, five artwork scenes, and transition timing were still local approximations, not asset-by-asset matches. The four Hobby pages and source catalog also had content gaps. Performance numbers from another theme must not be attributed to Emil, and working buttons alone do not justify a “complete clone” claim.

## A Replication Method For Interns

For a Feynman exercise, select one reference page, list every state aloud, then explain how mouse, keyboard, and touch change those states. Label each image as a required asset, decoration, content, or placeholder. For every state, record input, output, failure fallback, and screenshot evidence. An asset inventory and page matrix before animation work help prevent particles from hiding missing content.

The release gate should include local data and images for all five work categories, reference/local comparisons for each interaction state, type and cursor assets, touch regression, reduced-motion behavior, and keyboard focus. The current work can be presented as a prototype postmortem; it should not be described as source-level-complete replication.
