---
title: "Termfolio Remix: Three Rounds Of Rework Across Frameworks, Chinese Content, And Local Images"
date: 2026-10-27
summary: "How deployment boundaries, localization, static-asset paths, and image provenance converged after adopting Termfolio's Next.js source."
lab_category: field-notes
cover: media/ai-lab/open-doodles-covers/python-debugging.png
cover_alt: "An illustration of engineering troubleshooting through code and debugging notes."
cover_credit: "Pablo Stanley / Open Doodles (CC0 1.0)"
translationKey: theme-termfolio-postmortem
source_page: "theme-center/"
authors: [me]
---

> **Delivery milestone: 2026-10-27.** Termfolio preview, fonts and Bitmap assets, and static client scripts were committed that day. The date marks a runnable preview, not a live server-side API deployment.

## The Framework Choice Has A Boundary

The user confirmed that using `wa1939/termfolio` directly was acceptable. The key decision was to respect its Next.js/React runtime instead of forcing React components into Hugo templates. The repository now contains both a standalone Next.js application and a terminal entry in Hugo's theme center: the former owns full application interactions, while the latter provides discovery and preview. Shared Git history does not make their article data, image paths, or server capabilities automatically shared.

## Three Concrete Problems

First, pages loaded but much of the experience remained English. This was not a font issue: locale copy, Chinese content sources, and language routes did not yet share a consistent contract. Translating controls alone cannot translate article bodies. Second, article images or related illustrations were missing, and some cards sent readers to Icons8. A source-page URL had been used as if it were an image or destination, while static script and `public` asset paths also differed between development and publication output. Third, the API key was described as something to “encrypt on the frontend.” A browser user can inspect a key delivered to the browser; obfuscation and bundling do not make it secret. Static GitHub Pages also cannot run a Next.js API Route.

## Fixes And Security Model

Keep the Next.js App Router. Read Chinese articles from local Markdown, and generate locale copy and language-switch paths through one adapter. Use local clean image derivatives, with provenance and license records separate from display assets. Article cards continue to link to local article routes instead of sending readers to the source or provider page. Verify fonts, images, and scripts in the build output rather than only on the development server.

Run Agnes behind the server-side `/api/agnes/chat` route. Read `AGNES_API_KEY` from the environment and constrain request size, history length, timeouts, and error mapping. The security goal is to keep the key out of the client bundle, not to encrypt it and ship it to the browser. That requires a server-capable deployment target; static Pages alone cannot host the route.

## Before, After, And A Learning Method

The early state had English-heavy pages, broken asset links, and an incorrect deployment assumption. The converged design is a Chinese-first Next.js application with local article routes, a local illustration library, and a server-side secret boundary. The October 27 commits prove that the preview, fonts/Bitmap assets, and client scripts entered the delivery. They do not prove the production API is deployed, and no unrun performance metric is claimed.

For an intern's Feynman review, answer four questions: where does the secret live, where does content come from, where should each link go, and where is each file after the build? If the deployment boundary between static assets and server APIs is unclear, draw the request flow before changing configuration. For media, verify each source license; a reachable web page is not proof of redistribution rights, and a learning-use statement does not grant permission to remove watermarks or redistribute derivatives.
