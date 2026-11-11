# how-accordion

## Purpose

How It Works steps (Home How It Works component). Each step expands its description. On mobile the steps work as a real accordion. Replaces the template IX2 "Tab Accordion / Open|Close".

## Webflow Setup

On `home-how_tabs` (the Tabs wrapper) inside the Home How It Works component:

data-component="how-accordion"

## Behavior

- **Init**: Opens the Webflow current tab (`data-step-open`). Clicking a step opens it and closes the others. On mobile (<= 767px) clicking the open step closes it, and the image panes (`.home-how_tabs-content`) are hidden; instead, on init each step gets a clone of its pane's `.home-how_image-wrapper` (matched by position, ids and `data-w-id` stripped) appended to its `.home-how_step-text` as `[data-step-media]`, visible only on mobile (4:3). Sets `aria-expanded` on the tab links.
- **Tab switching (custom)**: Steps and panes are paired by position (link N <-> `.home-how_pane` N), not by Webflow tab name (`data-w-tab`). The click handler is a capture-phase listener on the Tabs wrapper that calls `preventDefault` + `stopPropagation`, so the click never reaches the link and Webflow's tab handler (bound on each link) never runs; the component toggles the same Webflow classes itself (`w--current`, `aria-selected`, `tabindex` on links; `w--tab-active` + `data-pane-active` on panes). Reason: step 6 was added through the Webflow API by moving a tab from a temporary Tabs widget, and it kept the name "Tab 3" (the API can't rename tabs), which made Webflow open two panes. Adding more steps the same way is safe as long as each link has a pane in the same position.
- **Resize**: Not used
- **Breakpoint**: When leaving mobile, re-opens the current step if all were closed.

## Styles

`src/styles/how-accordion.css`: `.home-how_step-body` animates `grid-template-rows` 0fr -> 1fr (0.6s ease-out). The `.home-how_step-text` padding (16px / 48px, 24px bottom on mobile) is moved to its first child so the collapsed row reaches 0px. `height` is locked with `!important` to neutralize the IX2 inline heights. The active pane fades in (`how-pane-in`, 0.3s, like the Webflow tabs fade). Respects `prefers-reduced-motion`.

## Dependencies

None.

## DOM Expectations

`.home-how_tab-link` > `.home-how_step` > `.home-how_step-body` > `.home-how_step-text` (single child, required by the grid-rows technique). One `.home-how_pane` per step, in the same order as the links (currently 6).
