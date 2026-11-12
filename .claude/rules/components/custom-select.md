# custom-select

## Purpose

Custom dropdown for native Webflow Select fields, styled like the nav dropdown (white card, lime gliding highlight, staggered options). First used on the Contact form "How can we help?" field (Section / Contact component). The native `<select>` stays in the form, so Webflow form submission, the field name and browser `required` validation keep working.

## Webflow Setup

On the Select field, or on its field wrapper (`form_field-wrapper`) when Webflow won't take the attribute on the select (inside components the API rejects attribute writes with a component-map conflict):

data-component="custom-select"

Contact: set in the Designer on the "How can we help?" `form_field-wrapper` inside Section / Contact.

The field label should be a real `<label for="...">` pointing to the select id. An option with an empty value is used as the placeholder (Contact: "Select one...").

## Behavior

- **Init**: Wraps the select in `[data-cs]`, hides it visually (`[data-cs-native]`, still in the form, `tabindex=-1`, `aria-hidden`) and builds a `<button data-cs-trigger role="combobox">` (copies the select's classes, so it looks like the other inputs) with `[data-cs-value]` + chevron `[data-cs-icon]`, and a `<ul data-cs-list role="listbox">` with one `li[data-cs-option][role=option]` per non-empty option plus one `[data-cs-highlight]`. The label's `for` is moved to the trigger. Picking an option sets the select value and dispatches `input` + `change`.
- **Keyboard**: closed: Enter / Space / ArrowDown / ArrowUp open. Open: ArrowUp/Down, Home/End move (`aria-activedescendant`), Enter/Space pick, Escape closes and refocuses the trigger, Tab closes, typed letters jump to the first matching option (600ms buffer). Click outside closes.
- **Validation**: on the select's `invalid` event sets `data-cs-invalid` (red ring on the trigger) and focuses the trigger; cleared on `change`. Re-renders after the form `reset`.
- **Resize**: Not used
- **Breakpoint**: Not used

## Styles

`src/styles/custom-select.css`, same tokens and timing as `nav-dropdown.css`: card with 1.25rem radius, Dark 8% border, shadow `0 24px 48px -12px rgba(17,40,60,.22), 0 4px 12px rgba(17,40,60,.06)`, 0.5rem padding, opens 0.5rem below the trigger (fade + 4px blur, 8px rise, 0.98 scale, ease-out expo; closes 0.22s ease-in), max-height 20rem with scroll. Options 0.9375rem, staggered rise (24ms per `--i`). Hover/keyboard active option: shared highlight (Accent 16% + 2px inset Accent bar) glides between options and the text nudges 0.25rem. Selected option: semibold + lime dot on the right. Empty state shows the placeholder in Dark 48%. Trigger focus/open: 3px Accent 64% ring. Respects `prefers-reduced-motion`.

## Dependencies

None.

## DOM Expectations

`[data-component='custom-select']` is a `<select>` or contains one, inside a form. If no select is found it's skipped with a warning.
