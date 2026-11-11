# Interaction States

Version 1.0 · Component State Contract · Keyboard and Touch

## 1. Shared state model

| State | Required user feedback | Implementation notes |
| --- | --- | --- |
| Default | Name and action are visible | Prefer native links, buttons, inputs, and disclosure elements. |
| Hover | Optional pointer feedback | Must not be the only way to discover information or operate a control. |
| Focus | Clear, high-contrast focus indicator | Use `:focus-visible`; do not remove the browser outline without a replacement. |
| Active / selected | Current state is visually distinct and programmatically exposed | Use `aria-current`, `aria-pressed`, `aria-selected`, or native state as appropriate. |
| Pressed | Immediate feedback for an activated button | The effect should not shift nearby layout. |
| Disabled | Inoperable and clearly disabled | Use native `disabled` where available; explain an unavailable action when useful. |
| Loading | Work is in progress | Expose status text with a live region when the change is not otherwise announced. |
| Success | Operation completed | Provide a persistent enough confirmation and a resulting state. |
| Error | What failed and a recovery route | Do not rely on red alone. Keep user input where possible. |
| Empty | No matching or available records | State the reason when known and the next useful action. |

Do not create decorative fake loading, success, or error states for static content.

## 2. Keyboard contract

- `Tab` and `Shift+Tab` move through visible controls in DOM order.
- `Enter` activates links and buttons; `Space` activates buttons and native toggles.
- `Escape` closes transient menus and dialogs and restores focus to the opening control.
- Arrow-key navigation is appropriate for composite widgets such as tabs, listboxes, and menus; do not add custom key handling to ordinary links.
- A dialog must contain focus while open, expose its title, and return focus when closed.
- A mobile navigation toggle must keep `aria-expanded` in sync with the visible menu and identify the controlled navigation element.

## 3. Component-specific states

### Global navigation

Current page: `aria-current="page"` plus a visible active treatment. Mobile open: menu visible, toggle expanded, body scroll policy intentional, and focus placed within the menu. On close: restore focus to the toggle. Reduced motion: reveal the same links without stagger delays.

### Command search

Closed: dialog is absent from interaction. Open: focus moves to the labeled search input; background controls are inert; results and empty state are announced through semantic structure. Arrow keys change the selected result; `Enter` navigates; `Escape` closes and returns focus.

### Tabs and map selectors

Only the selected tab belongs in the sequential tab order. Arrow keys, Home, and End move selection. The active tab and panel IDs must reference each other; hidden panels must be removed from accessibility navigation.

### Expandable records

Use native `details/summary` where possible. The summary remains keyboard-operable and its open/closed state is exposed by the browser. Do not convey the state only with a chevron.

### Toggle actions

A persistent binary choice uses `aria-pressed` or an equivalent native control. Update the accessible label only if the control's action name changes; otherwise preserve a stable name and expose the pressed state.

### Forms and terminal-style inputs

Every input has a programmatic label. Preserve user input on error, provide a textual status, and keep error/success output in an appropriate live region. Decorative command-line styling does not replace normal form semantics.

## 4. Touch and responsive interaction

WCAG 2.2 AA target-size minimum is 24 by 24 CSS pixels subject to its exceptions. This project recommends 44 by 44 CSS pixels for frequent touch controls. Ensure adjacent compact controls have enough separation to avoid accidental activation. Test with emulated touch and, before a device-specific release, a physical mobile device.

Hover and magnetic effects are enhancements only. They MUST be absent or inert for touch-only pointers, and cannot be required to read or activate an item.

