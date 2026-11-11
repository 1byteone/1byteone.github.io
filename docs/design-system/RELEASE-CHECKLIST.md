# UI/UX and Motion Release Checklist

Use this list for design review, implementation review, regression, and release evidence. A checked intention is not proof; attach a test result or mark the item `NOT TESTED`.

## Scope and content

- [x] Product identity, route structure, locale, and primary tasks are preserved in the sampled routes.
- [x] Factual profile and project copy inspected against the existing author and content records.
- [x] Official reference use remains clearly unofficial; no implied endorsement.
- [ ] Images, audio, fonts, and artwork have a known local path and source/license note.
- [ ] No UI screenshot crop is used as a runtime control or panel skin.

## Visual and component quality

- [x] Visual hierarchy is clear in desktop, tablet, and mobile screenshot samples.
- [ ] Body, large text, placeholders, icons, and controls pass rendered contrast review.
- [ ] Long Chinese and English labels wrap without clipping or overlap.
- [ ] Buttons, navigation, archive rows, dialogs, empty states, and errors use correct semantics.
- [ ] Focus, current, selected, pressed, disabled, loading, success, and error states are covered where applicable.
- [x] Primary actions are visible and touchable without hover in the sampled viewports.

## Interaction and accessibility

- [ ] Keyboard-only route navigation, search, disclosure, tabs, and menu behavior pass.
- [ ] Focus enters and returns from dialogs predictably; there is no focus trap outside the dialog.
- [ ] Accessible names, `aria-expanded`, `aria-current`, `aria-selected`, and pressed states match the UI.
- [ ] Screen-reader status changes are text-based and announced where needed.
- [ ] Images have appropriate alternative text; decorative images use empty alt.
- [x] Reduced-motion mode preserves information and state while disabling major motion in browser emulation.
- [ ] Pointer-only effects are optional; touch scrolling remains available.
- [ ] WCAG 2.2 AA target-size checks include exceptions and spacing, not a 44px-only proxy.

## Motion and engineering

- [ ] Each authored effect has an ID, trigger, timing, final state, reduced-motion policy, and lifecycle note.
- [ ] Continuous work pauses while hidden/offscreen and has no unbounded animation loop.
- [ ] No animation blocks first paint, reading, navigation, or form submission.
- [ ] Layout shift, layout thrash, excessive filters, memory growth, and console errors are checked.
- [ ] Images have reserved dimensions and noncritical media is deferred or appropriately compressed.
- [ ] No new animation dependency is introduced without a concrete need and bundle rationale.

## Verification and release decision

- [x] Hugo production build succeeds with Hugo Extended 0.162.0 required by deployment.
- [x] Required routes return 200 in the built preview.
- [x] Desktop, tablet, and mobile screenshots are saved with viewport and environment metadata.
- [x] Search, mobile menu, and page-specific controls are exercised; theme selection and language-link destinations are NOT TESTED.
- [x] Reduced motion is exercised in a browser with the system preference emulated.
- [x] Browser console and failed network requests are reviewed against a static production build.
- [ ] LCP/CLS/INP/FPS/memory values are measured with method and environment or marked `NOT MEASURED`.
- [ ] Issues are listed with severity, reproduction steps, owner/file, remediation, and status.
- [ ] No P0/P1 issue remains open for `PASS`; any unresolved blocker yields `CONDITIONAL PASS` or `FAIL`.

