# Motion Inventory

Audit date: 2026-11-02. Source review: `static/css/cyberpunk2077.css`, `static/js/cyberpunk2077.js`, and Cyberpunk theme partials. Values are source-defined unless explicitly marked otherwise. This inventory describes the observed implementation, not every motion concept proposed in the source brief.

## Implemented

| ID | Effect / component | Trigger and source parameters | State and lifecycle | Reduced motion |
| --- | --- | --- | --- | --- |
| MOT-001 | Profile boot sequence | First visit or `?boot=1`; six text stages at 360ms intervals; automatic completion at 2700ms; CSS hero copy entrance 580ms with 120ms stagger. | `INITIALIZING` → `ACCESS GRANTED`; skip button calls finish; timers are cleared on finish; browser storage remembers completion. | Skipped; content shown immediately. |
| MOT-002 | Profile identity status transition | Boot completion updates status text; no scanline is present. | `VERIFYING` → `VERIFIED`; this is a textual state transition, not a visual scanner sweep. | Immediate status. |
| MOT-003 | Profile title glitch | Hover; 280ms and 220ms stepped clip-path effects, second layer delayed 30ms. | Finite text-only overlay; title remains readable. | CSS global motion reduction disables the keyframes. |
| MOT-004 | Profile scene parallax / target tracking | Pointer movement; scene offset up to 10px horizontal and 7px vertical; target offset up to 8px/6px. Scroll hero shift is capped at 42px with a 0.12 multiplier. | Resets on pointer leave; not enabled for reduced motion or narrow-pointer layouts. | Disabled. |
| MOT-005 | Profile rain particle canvas | Continuous `requestAnimationFrame`; drop count `max(24, round(width / 22))`; speed 1.5–3.9px/frame; opacity 0.12–0.44; canvas DPR capped at 1.5. | Pauses while hidden/offscreen; resumes on visibility; observer and resize listener live for page lifetime. Explicit SPA teardown is not applicable to current full-page navigation. | Not started. |
| MOT-006 | Status pulse | 1.8s infinite opacity cycle (`1` to `0.34`). | Decorative live-status dot; loops for document lifetime. | Disabled by reduced-motion rule. |
| MOT-007 | Global navigation and target-lock feedback | Menu panel 180ms opacity / 350ms transform; six links stagger by 40ms. Target lock uses 250ms transform/color transition. | Menu open/close state is managed by JS. Target text and `aria-pressed` change on click. | Menu transition removed; content remains available. |
| MOT-008 | Magnetic contact links | Pointer movement updates transform by up to 5px per axis; reset on pointer leave. | Enabled only outside reduced-motion and mobile media query; page-lifetime listeners. | Disabled. |
| MOT-009 | Mission timeline progress | Scroll/resize updates progress in `requestAnimationFrame`; track is positioned from chapter geometry. | Progress value is updated through a CSS custom property; no separate easing duration. | Scroll remains usable; no authored camera motion is required. |
| MOT-010 | Capability / section reveal | IntersectionObserver with root margin `0px 0px -8% 0px`, threshold `0.08`; 650ms opacity/18px transform transition. | Each element is observed until it enters the viewport; observer disconnects when motion mode is re-synced. | All reveal nodes are immediately visible. |
| MOT-012 | Target lock | User click toggles locked state; 250ms transform/color transition; corner brackets scale to 1.33. | Text changes to `TARGET LOCKED` / `SIGNAL: STABLE`; button exposes `aria-pressed`. | State remains available; transition is removed. |

## Not implemented or not found

| ID | Brief concept | Audit status |
| --- | --- | --- |
| MOT-011 | Terminal typewriter effect | Not implemented. Commands render their result immediately after submission. |
| MOT-013 | Image mask reveal | Not found. Editorial images use normal display and hover treatment. |
| MOT-014 | Data stream | Not found. |
| MOT-015 | Scroll-driven section transition | Not found as a separate effect; scroll currently updates profile HUD/timeline state only. |
| MOT-016 | State pulse as a state system | One decorative pulse exists (MOT-006); no shared status-state component contract was found. |

## Cross-cutting notes

- The CSS reduced-motion block uses a global near-zero animation/transition duration. JavaScript separately bypasses boot/reveal and hides the hero video, preserving content and state. The rendered alternative should be reviewed for any feedback that depends on an intermediate transition.
- `data-cp77-reveal` styles depend on JavaScript adding `cp77-motion-ready`; the script exposes all nodes immediately when reduced motion is preferred or IntersectionObserver is unavailable.
- Frame rate, CPU/GPU cost, long-session memory, and physical-device battery impact: `NOT MEASURED`.

