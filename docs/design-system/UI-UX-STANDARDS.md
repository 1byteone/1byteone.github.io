# YOYO NIGHT CITY 2077 — UI/UX Standards

Version 1.0 · Design System · Component Standard · Accessibility Baseline

## 1. Purpose and scope

This document defines the visual and component language for the YOYO engineering archive. The official Cyberpunk 2077 public website is the visual reference for composition, typography, color, media, navigation, and motion. The site remains an independent personal portfolio: preserve its real content, routes, author identity, and sources. Do not imply official ownership or endorsement.

The requirements below use these terms:

- **MUST**: required for release or content integrity.
- **SHOULD**: the default project decision; document an exception when it materially improves the experience.
- **MAY**: optional when it serves a clear user need.

WCAG requirements are conformance criteria. Type sizes, animation timings, spacing, and preferred touch sizes in this system are project design guidance, not universal standards.

## 2. Visual design language

### Art direction

Use a black editorial canvas, broad signal-yellow fields, occasional cyan secondary signals, compressed display lettering, and locally stored photography. Reference the official site's campaign-media hierarchy and hard-edged controls. Use CSS geometry for the interface; editorial photographs are content, not UI skins.

Keep the visual hierarchy legible: page or campaign title first, primary action second, explanatory copy third, and technical metadata last. Use mono lettering only for actual labels, timestamps, commands, and measured values. Body copy remains a readable sans serif.

### Color and contrast

Use the named tokens in `DESIGN-TOKENS.json`. Yellow is a structural signal, not a glow applied to every control. Cyan identifies secondary action or status. Red is reserved for warning or critical state. Status MUST have text or another non-color cue.

Text and component boundaries MUST be checked against the rendered background. WCAG 2.2 AA text contrast targets are 4.5:1 for normal text and 3:1 for large text. Image overlays and translucent surfaces require rendered contrast checks; token values alone do not prove compliance.

### Typography

Use self-hosted Barlow Condensed as the current display fallback and a system sans for reading copy. Keep headings short and expressive; keep paragraphs comfortable to read. Prefer responsive `clamp()` sizes with content-driven wrapping over viewport-scaled typography that overflows. Avoid decorative tracking in Chinese text.

### Layout and density

- Keep navigation, reading content, and page actions on a shared alignment grid.
- Use asymmetric compositions only when the content hierarchy remains clear.
- Use strong horizontal rules and editorial rows for archives; reserve framed data panels for genuinely interactive or structured data.
- Let whitespace separate groups. Do not make every section a card or every element a HUD.
- On small screens, preserve content order and primary actions. Do not hide search, language selection, or navigation behind a control that cannot be reached by keyboard or touch.

## 3. Component contract

| Component | Required structure and behavior |
| --- | --- |
| Primary action | A real link for navigation or a button for an action; visible label; clear pressed/focus state; target at least 48px high by project guidance. |
| Secondary action | Lower visual emphasis than the primary action, while remaining readable and keyboard-visible. |
| Global navigation | Semantic `nav`, localized accessible name, current route indicated with `aria-current="page"`, responsive menu with synchronized `aria-expanded` and `aria-controls`. |
| Search dialog | Labeled dialog and search input; keyboard open/close; predictable focus entry and return; arrow/Enter behavior if results are selectable. |
| Archive row | One coherent link when the row is one action; title and summary remain visible without hover. |
| Editorial image | Locally available where practical, meaningful alternative text when informative, empty alt when decorative, dimensions or aspect ratio to reserve layout space. |
| Status indicator | Text label plus color/shape treatment; never color alone. |
| Expandable record | Native `details/summary` or equivalent button with state announced to assistive technology. |
| Data panel | Use for actual structured content or controls; label values and distinguish illustrative data from sourced facts. |

Components MUST provide default, hover, keyboard focus, active/pressed, disabled, loading, success, error, and empty states when those states apply. Avoid inventing states for static editorial content.

## 4. Content and asset integrity

- Preserve all factual résumé, education, work, project, and contact data from the existing content model.
- Do not invent awards, metrics, clients, performance claims, or attribution.
- Keep source and license information with external artwork and music references.
- Do not use HUD sheet crops, sticker assets, or image sprites as button, modal, panel, badge, or page-background surfaces.
- Any official game logo used in the portfolio is a brand mark only and must not imply endorsement.

## 5. Responsive and accessibility baseline

The release target is WCAG 2.2 AA for the authored interface. Review keyboard operation, focus visibility, reading order, labels, image alternatives, text scaling, contrast, reduced motion, and target spacing. WCAG 2.5.8 (AA) uses a 24 by 24 CSS-pixel minimum target size with defined spacing exceptions; 44 by 44 CSS pixels is a stronger project usability recommendation, not the AA minimum.

At minimum, inspect desktop, tablet, and mobile layouts. Check the smallest supported viewport and long Chinese and English labels. Touch gestures must not block page scrolling. Mobile-specific pointer effects MUST be removed or simplified.

## 6. Review checklist

- Can a new reader identify the page, primary action, and content category at a glance?
- Does the composition reference the official site's visual language while retaining YOYO's real content and routes?
- Is every action semantically correct and operable with keyboard and touch?
- Are focus, current, pressed, disabled, and error states visible and announced?
- Does text meet contrast targets on its actual rendered surface?
- Does the page work with reduced motion and at narrow widths without horizontal overflow?
- Are photographs editorial assets with valid local paths, dimensions, and appropriate alternatives?
- Can every factual claim be traced to supplied content or a cited source?

