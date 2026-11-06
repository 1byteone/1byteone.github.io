# Termfolio Enhancement Roadmap

## Design Plan

Keep the current terminal identity, but balance it with clearer professional signals. The site should still feel like Waleed, not a generic executive portfolio, while making the first impression safer to share with Saudi, enterprise, and senior audiences.

Shipped in the current release:

- Preserve the terminal hero, themes, widgets, vCard, and playful utilities.
- Add a professional signal panel beside the portrait so the casual image has context.
- Add Arabic routes with the same layout and the Thmanyah typeface.
- Keep terminal copy and terminal commands in English across languages.
- Add article digest cards for skim-first readers.
- Add a lab bench for experiments instead of presenting them as polished client projects.
- Add practical no-login tools as a reason to return, without adding a database or account layer.
- Set Vercel as the default theme while keeping theme switching available.
- Polish Arabic copy so it reads naturally instead of as a literal translation.

## Completed Enhancement Work

1. Tighten first impression
   - Keep the portrait and terminal, but make the role, credibility, and work domains visible within the first viewport.
   - Avoid over-explaining. Use short proof signals: People Lab, AI products, analytics, shipped outcomes.

2. Improve reading experience
   - Replace decorative skim cards with a "lazy read" digest that gives the point, key sentences, section jumps, and a memory hook.
   - Make the voice honest and a little funny: useful for people who want the idea without sending the post to ChatGPT.
   - Keep full reading controls: focus mode, theme, font size, spacing, progress, and table of contents.
   - Add Arabic UI labels and Arabic typography while respecting the article's original language.

3. Build bilingual trust
   - Mirror the main routes in Arabic: home, about, blog, post, contact, lab, splitter, and digital card.
   - Use Thmanyah for Arabic UI and reading.
   - Keep terminal interactions English to preserve the site's core concept.

4. Reframe projects as experiments
   - Use "lab" and "experiments" language, not "projects" or "case studies."
   - Link to public GitHub repos with short context about why each experiment exists.

5. Polish quality tells
   - Remove heavy side-tab borders.
   - Rewrite Arabic copy as natural Arabic, not literal translation.
   - Keep terms like Terminal, AI, People Analytics, vCard, QR, and GitHub in English where translation would feel forced.
   - Strengthen typography hierarchy with mono UI, serif reading, and Thmanyah Arabic surfaces.

## Shipped Feature Work

1. Useful public tools
   - Bill splitter: split totals, service charge, tax, payers, paid amounts, portions, and settlement notes.
   - QR generator: turn any link, note, phone, or Wi-Fi text into a downloadable QR.
   - Short link: create a compact public link through a no-login shortener, while storing nothing in this site.
   - WhatsApp link: generate a click-to-chat link with a ready message.
   - Calendar file: create a small `.ics` file that opens in Apple Calendar, Google Calendar, or Outlook.
   - Image shrinker: resize/compress a local image in the browser before sending it.
   - Share card maker: turn a quote or announcement into a clean image for social sharing with `waok.dev` attribution.

## Future Roadmap

1. Return hooks without accounts
   - Save tool state locally.
   - Copy/share outputs cleanly.
   - Add "recent tools" or "pin this tool" using localStorage only.

2. Portfolio-native utility paths
   - Let terminal commands open tools.
   - Keep tools discoverable from home and lab, not hidden behind a portfolio-only nav.
   - Make each tool useful even if the visitor does not care about the portfolio yet.
   - Avoid tools that feel too corporate or rarely used by normal people, such as salary calculators, decision matrices, unit converters, generic text counters, and password generators.

3. Arabic-first expansions
   - Add original Arabic articles rather than only translating chrome.
   - Keep Arabic concise, sharp, and editorial. The target is clear Arabic in the spirit of Thmanyah's product writing, not padded formal translation.
   - Add Arabic-specific tools only when they are immediately useful to everyday visitors.

4. Proof without over-claiming
   - Add a "systems shipped" strip with concise outcomes.
   - Keep experiments separate from professional experience.
   - Link to CV and vCard from clearer contexts.
