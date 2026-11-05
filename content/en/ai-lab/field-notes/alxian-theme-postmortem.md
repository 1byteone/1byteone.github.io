---
title: "The Alxian Theme: States, Live Data, And Fallbacks In An Interactive Personal Archive"
date: 2026-10-11
summary: "A review of moving an Alxian-style archive from a visual page to actionable profile, work, music, and social interactions."
lab_category: field-notes
cover: media/ai-lab/open-doodles-covers/hallucination-review.png
cover_alt: "An interactive archive illustration made from review marks, waveforms, and profile cards."
cover_credit: "Pablo Stanley / Open Doodles (CC0 1.0)"
translationKey: theme-alxian-postmortem
source_page: "theme-center/"
authors: [me]
---

> **Interaction milestone: 2026-10-11.** A sequence of commits that day covered the Alxian page theme, reference interaction alignment, live-data fallbacks, and social cards. “Complete” here means that interaction delivery, not that third-party live services are permanently available.

## More Interaction Means More Failure Paths

An Alxian-style archive exposes music charts, friend cards, resources, work, chat, and stack surfaces. A first pass often implements hover and modals but leaves blank states when data fails; age, repository counts, or music lists can also become stale snapshots. The result looks clickable without giving each state a result or explanation.

## State Machine And Data Contracts

Split navigation, modals, the player, live charts, friend QR, and API fallback into independent states. Every asynchronous source defines loading, success, empty, and error views; unavailable live data falls back to timestamped static data with its source shown in the UI. Load QR/contact data on demand, return focus when a modal closes, and label external music sources instead of treating a cross-origin failure as a site failure.

Validate state changes first—click, Enter/Escape, focus restoration, touch, and reduced motion—before adding more particles. Templates continue to use the site's own profile, project, and article data so reference identities do not leak into the archive.

The October 11 commits cover the page theme, interactions, cache invalidation, live data, and social cards. Afterward, data failures have fallbacks, modals and the player have close paths, and language/profile copy comes from site content. Long-session memory, physical mobile battery cost, full screen-reader flows, and third-party interface SLAs were not measured; one successful local request cannot stand in for those checks.

For a Feynman exercise, have an intern draw `chart click -> request -> loading -> data/fallback -> close/focus restore`, then write the user-facing message for a 429 music source. The lesson is that a high-interaction personal site is state management and failure design before it is visual effects.
