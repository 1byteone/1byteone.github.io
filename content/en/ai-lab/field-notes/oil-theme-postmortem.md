---
title: "The Oil Theme: Connecting An Illustration-Led Portfolio To Engineering Content Without An Empty Shell"
date: 2026-10-10
summary: "A review of routes, content density, and release boundaries while connecting the Oil portfolio homepage to real projects and technical articles."
lab_category: field-notes
cover: media/ai-lab/open-doodles-covers/rag-grounded-knowledge.png
cover_alt: "An editorial illustration of plants and structural lines, representing growth from concept to delivered work."
cover_credit: "Pablo Stanley / Open Doodles (CC0 1.0)"
translationKey: theme-oil-postmortem
source_page: "theme-center/"
authors: [me]
---

> **Verifiable milestone: 2026-10-10.** Commit `2b7e6af` records publishing the Oil portfolio theme from its development branch. Follow-up documentation and directory work landed on October 11; this review uses October 10 for the first delivery and separates later maintenance.

## Strong Art Direction Is Not Yet A Portfolio

Oil's illustration-led surface, expressive type, and work cards can create a sense of completion even when cards still contain template examples, links return to the default blog, or the stack page has no real projects. Oil is also a standalone theme. Sharing article data with Minimal does not mean its style tokens and route templates should be merged into the Minimal family.

## Implementation Boundary

Keep Oil's home/list/single/tech-stack routes independent while reading shared articles and projects through Hugo page collections. Templates own presentation; cards expose verified titles, summaries, states, and local permalinks. The stack page uses the shared content model for tools, documentation, and learning links. The registry marks Oil as standalone and the theme center owns its preview path, so the theme does not take over the default homepage.

## Before, After, And Evidence Limits

The earlier approach felt like a color-and-illustration swap. The delivery added an independent homepage, content routes, and a theme-center entry. The October 10 commit proves branch publication; it does not prove that every case study, external link, or personal detail is finally verified. A real release still needs clicks through projects, stack, language switching, and mobile cards, while contrast and keyboard focus must remain usable beneath the expressive surface.

For a Feynman exercise, ask an intern to explain the relationship between a content collection and a presentation template: why can one article be rendered by multiple themes while a theme must not rewrite the article's facts? Then require an accessible name, destination, failure fallback, and narrow-screen behavior for one illustrated card. This turns portfolio design from a mood board into a maintainable content adapter.

The transferable lesson is to record theme identity, content source, route ownership, and release status in registry data. A complete-looking homepage is not a data review.
