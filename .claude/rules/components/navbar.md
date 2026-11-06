# navbar

## Purpose

Custom scroll behavior for the site nav (Navbar / Blured component). Replaces the template IX2 "Navbar / Scroll", which shrank the nav and swapped in a second "Nav / Popup" nav.

## Webflow Setup

On the root element of the Navbar / Blured component (`navbar_wrapper is-static`):

data-component="navbar"

Nav / Popup is hidden on pages that use this nav.

## Behavior

- **Init (dropdowns)**: Numbers the items of each `.navbar_menu-dropdown` (`--i` on every `.navbar_menu-dropdown-link` / `.navbar_menu-dropdown-label`) for the staggered entrance. On desktop with a real pointer (`(hover: hover) and (pointer: fine) and (min-width: 992px)`) it sets `data-hover="true"` and `data-delay="180"` on each dropdown and calls `Webflow.require('dropdown').ready()` so the Webflow dropdowns open on hover (click keeps working). Touch devices and the mobile menu stay click/tap only.
- **Init (gliding hover, desktop only)**: Wraps each link's content in `<span data-dd-text>` and prepends one `<span data-dd-highlight aria-hidden>` to each `.navbar_menu-dropdown-list`, and sets `data-dd-glide` on the nav root. On `pointerenter` / `focus` of a link it writes the link's box (relative to the list, scale-corrected while the list is still scaling in) to `--hl-x`, `--hl-y`, `--hl-w`, `--hl-h` and sets `data-visible`, so the highlight glides from link to link (also across columns). Coming from hidden it sets `data-snap` for one frame so it fades in on the link instead of sliding from the last spot. Leaving the list (or focus leaving it) removes `data-visible`.
- **Init**: Listens to scroll (rAF-throttled, DOM only touched when the state flips). Past 24px sets `data-nav-scrolled`: the bar compacts from 84px to ~54px (container padding 18px -> 8px, logo 88px -> 72px wide) and gets a soft shadow. Back at the top it returns to full height. The nav is always visible (one single nav, no popup). While the bottom of the bar is over a section with `data-nav-theme="dark"` (the video hero) it also sets `data-nav-dark`.
- **Resize**: Not used
- **Breakpoint**: Not used

## Styles

`src/styles/navbar.css`. Locks `.navbar_wrapper` transform and the `.navbar_component` solid white background/opacity with `!important` to neutralize the IX2 inline styles (the bar is always 100% opaque). Transitions `.navbar_container` padding, `.navbar_logo-link` width (relayout is limited to the fixed nav) and `.navbar_component` box-shadow. All three use 0.8s `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out quint) for a slow, soft compact. Respects `prefers-reduced-motion`.

Dark state (`data-nav-dark`, skipped while the mobile menu is open via `:has(.w-nav-button.w--open)`): translucent bar (white 8% + 16px blur), white `.navbar_link`, `.navbar_dropdown-toggle`, `.navbar_menu-button`, `.navbar_menu-dropdown-toggle` and its `.navbar_menu-dropdown-icon`; the dropdown toggle hover / open tint becomes white 14% instead of BG 1 (the card stays white), and the logo swaps to `.navbar_logo.is-light` (white DMD logo; hidden by default in Webflow with `display: none`).

Dropdown motion lives in `src/styles/nav-dropdown.css`. Webflow toggles `.w--open` on the toggle and the list. On desktop (>= 992px) the list is forced to `display: block !important` and hidden with `visibility` / `opacity` / `transform` so it can ease in (0.4s fade and 4px blur -> 0, 0.65s rise 8px and 0.98 -> 1 scale from the top left, ease-out expo `cubic-bezier(0.16, 1, 0.3, 1)`) and out (0.22s ease-in). A `::before` bridge covers the gap between toggle and card so hovering down doesn't close it. Items rise in staggered (`nav-dd-item-in`, 5px, 0.6s, 24ms per `--i`, 50ms base). The chevron (`.navbar_menu-dropdown-icon`) rotates 180deg while open and the open toggle keeps the BG 1 tint. Links (`.navbar_menu-dropdown-link`) become flex rows with a chevron arrow (`::after`, 1.5px border) that slides in on hover/focus, and their text (`[data-dd-text]`) nudges 0.25rem right. On desktop with `data-dd-glide`, the Webflow per-link hover (Accent 16% background, lime left border, padding jump) is neutralized and replaced by `[data-dd-highlight]`: Accent 16% fill + 2px inset Accent bar, same radius as the link, moved with `transform` and sized with `width`/`height` (0.5s ease-out expo, `--dd-glide`). Headings (`.navbar_menu-dropdown-label` and `.navbar_menu-dropdown-link.is-group`, styled in Webflow as 0.75rem uppercase, bold, 0.1em tracking, Dark 64%, group link Dark on hover) get a 0.375rem lime dot (`::before`) in front; links use `justify-content: flex-start` and the arrow is pushed right with `margin-left: auto`. Below 992px only the stagger, chevron, arrow and text nudge run (the list is static in the mobile menu and links keep the Webflow hover). Respects `prefers-reduced-motion` (opacity only, no stagger, no glide).

## Dependencies

None.

## DOM Expectations

`[data-component='navbar']` containing `.navbar_component` and `.navbar_container`. Dropdowns: native Webflow Dropdown elements with classes `navbar_menu-dropdown` > `navbar_menu-dropdown-toggle` (with `.navbar_menu-dropdown-icon`) + `navbar_menu-dropdown-list` (links `.navbar_menu-dropdown-link`, optional labels `.navbar_menu-dropdown-label`). Do not set `display` on `navbar_menu-dropdown-list` in Webflow; use an inner wrapper for grid layouts. For the dark state: two logo images, `.navbar_logo` and `.navbar_logo.is-light`.
