---
title: "LZW Personal Archive: Static Theme Delivery And Personal Data Integration Are Different States"
date: 2026-11-01
summary: "A review of adapting the archive-style personal site to Hugo, its homepage interactions, isolated preview route, and why real personal data needs its own acceptance pass."
lab_category: field-notes
cover: media/ai-lab/open-doodles-covers/agent-tool-boundary.png
cover_alt: "An editorial illustration representing system boundaries and component collaboration."
cover_credit: "Pablo Stanley / Open Doodles (CC0 1.0)"
translationKey: theme-lzw-archive-postmortem
source_page: "theme-center/"
authors: [me]
---

> **Theme delivery date: 2026-11-01.** Commit `639b405` records the LZW Archive deployment and isolated preview route. Completing a template does not mean its sample identity, résumé, projects, and contact data have been replaced or reviewed.

## Root Has One Owner

The archive template expects `/` to be its portfolio homepage, but the site already has a default blog and other themes. Mounting it at the root would make the default homepage and theme preview compete. Keeping it only as a screenshot would not test article links, asset paths, or switching. This is a **route-ownership** problem in a multi-theme static site, not a CSS conflict.

## Fix: An Isolated Preview Route

Give LZW the `/themes/lzw-archive/` preview path and point both the registry and switcher there. Keep the default theme as a separate site setting. The Hugo adaptation retains archive labels, paper noise, stamps/tape, section rules, typewriter, clock, count-up numbers, scroll reveals, card tilt, and the Konami easter egg. Native JavaScript and static HTML/CSS avoid introducing another runtime framework.

## Before/After And Content Boundaries

The initial approach risked making one preview theme own the root route. Afterwards, the content-first default site and archive theme have separate entry points; the gallery can expose LZW without changing the default presentation. About/resume templates and interaction structures exist, but the delivery note explicitly retains sample identity content. Name, city, project metrics, email, résumé PDF, SEO metadata, and external-link validity still require real data. Template placeholders must not be published as personal facts.

The November 1 deployment/preview-isolation commit is route-level evidence. It does not prove all personal information is verified or that every GitHub Pages CI run succeeded. A useful next step is a build-time placeholder scan plus a preview checklist that clicks project links, résumé downloads, mail links, and anchors on each page.

## A Feynman Exercise For Interns

Draw the path from default site route to theme registry, preview route, page template, and static assets. Ask a new developer to explain what breaks if any step is changed to `/`. Then ask why homepage animation alone does not define delivery: identity accuracy, privacy, link validity, and build paths are also product acceptance criteria.

The transferable lesson is to track **template completion, content personalization, and deployment verification** separately. Static sites still need route design and content review; a publish button is not a data audit.
