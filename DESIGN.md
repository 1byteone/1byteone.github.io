---
name: YOYO Night City Engineering
description: A media-led YOYO engineering archive using the official Cyberpunk 2077 website's black-yellow visual language as a reference.
colors:
  graphite: "#0b0d12"
  graphite-deep: "#080a0e"
  panel: "#11141b"
  panel-soft: "#171b22"
  acid-yellow: "#fcee0a"
  telemetry-cyan: "#00f0ff"
  ink: "#f1f2ef"
  muted: "#a2a8b2"
  dim: "#69717d"
  rule: "#343943"
typography:
  display:
    fontFamily: "Refinery 25 style, Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "118px"
    fontWeight: 900
    lineHeight: 0.78
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Blender Pro style, Barlow Condensed, Arial, sans-serif"
    fontSize: "45px"
    fontWeight: 700
    lineHeight: 0.95
  title:
    fontFamily: "Blender Pro style, Barlow Condensed, Arial, sans-serif"
    fontSize: "27px"
    fontWeight: 700
    lineHeight: 1.05
  body:
    fontFamily: "Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Cascadia Code, Consolas, monospace"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.1em"
rounded:
  none: "0px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "28px"
  lg: "54px"
  xl: "102px"
components:
  button-primary:
    backgroundColor: "{colors.acid-yellow}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "48px"
  button-utility:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.none}"
    padding: "0 10px"
    height: "32px"
---

# Design System: YOYO Night City Engineering

## Overview

**Creative North Star: "Night City Editorial"**

YOYO remains an engineering blog and portfolio. The visual reference is the official Cyberpunk 2077 website, inspected at `https://www.cyberpunk.net/us/en/` on 2026-11-02. Closely recreate the public site's composition and visual behavior at pixel level: its high-contrast black canvas, signal-yellow fields, cyan secondary actions, compressed headline type, hard-edged navigation, media-led sections, and deliberate motion. Apply that treatment to YOYO's real content and routes. This is an unofficial personal portfolio, not the official game site or an endorsement.

Lead with YOYO's real engineering records while closely matching the referenced site's layouts and interactions. The user-provided local `logo-cyberpunk-2077-user.png` (or its transparent crop) is permitted solely as the header brand mark for this personal portfolio. Original locally stored photography may carry the hero and editorial covers; controls and panels use live HTML content and CSS geometry. User-supplied HUD sheets remain offline references and their sticker-like crops are not served in the interface.

**Key Characteristics:**
- Rich black surfaces with bold signal-yellow bands and small cyan/red accents.
- Condensed display lettering paired with readable sans-serif body text.
- Solid geometric buttons, angular menu regions, thick rules, and clear active states.
- Large, authored photography as content, with restrained image treatment.
- The user-provided local Cyberpunk 2077 logo may appear only in the global header; never imply the portfolio is official or endorsed.
- No character art or HUD/control crops in runtime UI; no fabricated project claims.

## Colors

The palette is near-black and ink-forward, with one deliberately rare acid signal and a cool telemetry counterpoint.

### Primary
- **Signal Yellow** (#fcee0a): Primary action, active navigation, prominent bands, and key labels.
- **Signal Cyan** (#00f0ff): Secondary action and occasional contrast state.

### Neutral
- **Graphite** (#0b0d12): Page canvas and dominant field.
- **Graphite Deep** (#080a0e): Deep image/panel recesses.
- **Panel** (#11141b): Signal modules, command dialog, and dossier surfaces.
- **Panel Soft** (#171b22): Hover rows and selected result states.
- **Ink** (#f1f2ef): Headlines and high-priority copy.
- **Muted** (#a2a8b2): Supporting descriptions and record summaries.
- **Dim** (#69717d): Metadata, timestamps, and secondary labels.
- **Rule** (#343943): Structural dividers and boundaries.

### Named Rules
**The Media Contrast Rule.** Yellow may occupy a full section or deliberate content band; pair it with black geometry and dark photographic sections so it reads as the reference site's composition, not a scattered accent wash.

## Typography

**Display Font:** Refinery 25 style for display headings; retain the local Barlow Condensed fallback where a close-weight licensed font is unavailable.
**Body Font:** Blender Pro style / Arial, sans-serif
**Label/Mono Font:** Cascadia Code / Consolas / monospace

**Character:** Use compressed display lettering for campaign-scale titles and section heads, with Blender-style plain sans text for paragraphs and uppercase controls. Mono remains an occasional engineering metadata voice; it must not dominate navigation or reading text.

### Hierarchy
- **Display** (900, 118px desktop / 68px mobile, .78 line-height): First-viewport FIELD NOTES and major identity statements.
- **Headline** (700, 45px desktop / 36px mobile, .95 line-height): Section and page headings.
- **Title** (700, 27px desktop / 23px mobile, 1.05 line-height): Project and journal rows.
- **Body** (400, 15px, 1.6 line-height): Descriptions and article content.
- **Label** (400, 10px, .1em tracking, uppercase): Navigation, metadata, and evidence state labels.

### Named Rules
**The Two Voices Rule.** Use display type for the claim and mono type for the evidence around it; do not turn body copy into decorative HUD noise.

## Layout

Keep YOYO's content and route hierarchy. On the homepage, use a photographic first viewport with a confident title/action grouping; follow with image-led editorial features and dense archive rows. The site reference uses a fixed horizontal navigation assembled from distinct dark geometric zones, generous image scale, and bold section transitions. Collapse navigation and editorial grids cleanly on narrow screens without hiding search or language controls.

## Elevation & Depth

The system is flat by default. Depth comes from photography, solid black/yellow contrast, hard separators, and deliberate image overlays. Avoid HUD sticker decoration, floating glass panels, and repetitive glow treatments.

## Shapes

Controls use angular silhouettes and clipped/trapezoidal ends built from CSS. Primary separators may be 2-4px black or yellow; archive rows use clear rules rather than individual game-HUD frames. Do not use raster UI skins or cropped HUD components as button, navigation, panel, modal, badge, or page-background surfaces.

## Components

### Buttons
- **Shape:** Solid black or signal-yellow control with an angular/trapezoidal end, composed in CSS.
- **Primary:** Signal Yellow fill with black text; minimum 48px height and a decisive, compact label.
- **Secondary:** Black fill or transparent control with a cyan/white state; keep action hierarchy clear.
- **Hover / Focus:** Brief color shift or 1-2px motion; use an explicit high-contrast keyboard focus ring.

### Navigation
- **Style:** Fixed/sticky dark menu zones, uppercase condensed labels, clear separators, and yellow active/hover state. Retain YOYO route names; the user-provided local logo is allowed only as the global header mark.
- **Behavior:** Preserve search, language selection, keyboard operation, and responsive menu behavior.

### Chips
- **Style:** Small text-first labels separated by spacing or a thin rule. Tags describe the record; they are not tiny HUD stickers.

### Cards / Containers
- **Style:** Let real cover photography lead editorial cards; use typography and CSS borders/corners for the frame.
- **Asset behavior:** Photos remain editorial assets. Do not render reference-sheet crops or UI sprite images as control chrome.

### Command Search
- **Style:** A focused dark dialog with a clear yellow or cyan boundary, simple input, and ruled result list.
- **Behavior:** `⌘K` / `Ctrl-K` opens it; arrow keys select; Enter navigates; Escape closes.

## Do's and Don'ts

- **Do** lead with a real project or article record.
- **Do** use clear black/yellow/cyan geometry and deliberate site-style motion.
- **Do** reserve local imagery for the hero and editorial covers.
- **Do** keep Chinese and English copy factual and parallel.
- **Do** preserve keyboard operation, reduced motion, and visible focus states.
- **Don't** present the portfolio as official or endorsed. Keep the user-provided logo limited to the global header; do not add it to UI controls or editorial content.
- **Don't** use HUD crops or sprite images for controls, frames, navigation, modals, badges, or page backgrounds.
- **Don't** invent awards, metrics, clients, or project outcomes.
- **Don't** turn every element into a glowing yellow panel.
