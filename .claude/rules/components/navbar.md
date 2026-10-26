# navbar

## Purpose

Custom scroll behavior for the site nav (Navbar / Blured component). Replaces the template IX2 "Navbar / Scroll", which shrank the nav and swapped in a second "Nav / Popup" nav.

## Webflow Setup

On the root element of the Navbar / Blured component (`navbar_wrapper is-static`):

data-component="navbar"

Nav / Popup is hidden on pages that use this nav.

## Behavior

- **Init**: Listens to scroll (rAF-throttled, DOM only touched when the state flips). Past 24px sets `data-nav-scrolled`: the bar compacts from 84px to ~54px (container padding 18px -> 8px, logo 88px -> 72px wide) and gets a soft shadow. Back at the top it returns to full height. The nav is always visible (one single nav, no popup). While the bottom of the bar is over a section with `data-nav-theme="dark"` (the video hero) it also sets `data-nav-dark`.
- **Resize**: Not used
- **Breakpoint**: Not used

## Styles

`src/styles/navbar.css`. Locks `.navbar_wrapper` transform and the `.navbar_component` solid white background/opacity with `!important` to neutralize the IX2 inline styles (the bar is always 100% opaque). Transitions `.navbar_container` padding, `.navbar_logo-link` width (relayout is limited to the fixed nav) and `.navbar_component` box-shadow. All three use 0.8s `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out quint) for a slow, soft compact. Respects `prefers-reduced-motion`.

Dark state (`data-nav-dark`, skipped while the mobile menu is open via `:has(.w-nav-button.w--open)`): translucent bar (white 8% + 16px blur), white `.navbar_link`, `.navbar_dropdown-toggle` and `.navbar_menu-button`, and the logo swaps to `.navbar_logo.is-light` (white DMD logo; hidden by default in Webflow with `display: none`).

## Dependencies

None.

## DOM Expectations

`[data-component='navbar']` containing `.navbar_component` and `.navbar_container`. For the dark state: two logo images, `.navbar_logo` and `.navbar_logo.is-light`.
