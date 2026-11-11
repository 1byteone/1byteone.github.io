# Motion Design System

Version 1.0 · Interaction Motion · Lifecycle · Reduced Motion

## 1. Purpose

Motion communicates hierarchy, state, and spatial relationships. It must not delay reading or task completion. This document records project guidance; the measured implementation is in [`../audit/MOTION-INVENTORY.md`](../audit/MOTION-INVENTORY.md).

## 2. Motion specification

Each authored effect MUST have a stable ID, a user-visible purpose, a trigger, motion parameters, a final state, a reduced-motion behavior, and a lifecycle/cleanup note.

```ts
type MotionSpec = {
  id: string;
  name: string;
  trigger: "load" | "hover" | "focus" | "click" | "scroll" | "loop";
  durationMs: number | "continuous";
  delayMs?: number;
  easing: string;
  reducedMotion: "disable" | "simplify" | "preserve";
  performance: "low" | "medium" | "high";
  cleanup: string;
};
```

## 3. Timing and movement guidance

These are project starting points, not platform requirements. Validate them against the interaction and device.

| Parameter | Project guidance | Use |
| --- | --- | --- |
| Duration | 150–800ms for discrete UI transitions | Keep ordinary controls responsive; longer sequences must be skippable. |
| Delay | 0–200ms | Use only when sequence order carries meaning. |
| Stagger | 40–100ms | Small groups; avoid delaying navigation availability. |
| Offset | 8–40px | Prefer restrained movement for reveals and transitions. |
| Scale | 0.96–1.04 | Keep text legible and avoid layout shift. |
| Blur | 0–8px | Optional and bounded; never blur content needed during the transition. |
| Easing | ease-out for entry; ease-in for exit; ease-in-out for state changes | Use CSS or a documented custom curve. |
| Repeat | Finite by default | Infinite loops require ambient purpose and a pause or reduced-motion alternative. |

Prefer `transform` and `opacity` for continuous or repeated movement. Avoid animating layout dimensions in a frame loop. Use Canvas or WebGL only where the content justifies it, cap device-pixel ratio, and pause work while hidden or offscreen.

## 4. State, accessibility, and lifecycle

- Default content MUST be readable before an animation completes.
- Every entrance effect MUST have a stable end state when JavaScript, IntersectionObserver, or animation support is unavailable.
- `prefers-reduced-motion: reduce` MUST remove nonessential camera, parallax, particle, and continuous effects, while keeping state and content understandable.
- Do not communicate progress only through movement, color, sound, or a transient visual cue.
- Timers, observers, animation frames, media playback, and event listeners MUST stop when their scope ends or becomes hidden/offscreen.
- Auto-moving content that runs alongside other content for more than five seconds must provide pause, stop, or hide behavior where WCAG 2.2.2 applies. User-triggered motion can be disabled to meet the stronger AAA intent in WCAG 2.3.3.
- Avoid rapid flashing. Any high-contrast or flicker effect requires an explicit safety review; decorative flashing is not permitted.

## 5. Motion review format

Record each review as:

`ID → component → trigger → start/end state → duration/easing → reduced-motion behavior → cleanup → viewport/device evidence → result`

Treat FPS as a sampled lab metric with the browser, viewport, duration, and workload stated. A single animation-frame sample is not a claim about field performance. LCP, CLS, and INP must be measured with appropriate APIs; label unavailable data `NOT MEASURED`.

## 6. Implementation policy

Use CSS for short transitions and geometry. Use native browser APIs for viewport visibility and media playback control. Introduce GSAP, Motion, Canvas, Three.js, or a smooth-scroll library only when a concrete effect requires that capability and the bundle, accessibility, and lifecycle cost is accepted. This Hugo site currently uses native CSS and JavaScript.

