# navbar

## Purpose

Custom scroll behavior for the site nav (Navbar / Blured component). Replaces the template IX2 "Navbar / Scroll", which shrank the nav and swapped in a second "Nav / Popup" nav.

## Webflow Setup

On the root element of the Navbar / Blured component (`navbar_wrapper is-static`):

data-component="navbar"

Nav / Popup is hidden on pages that use this nav.

## Behavior

- **Init**: Listens to scroll (rAF-throttled, DOM only touched when the state flips). Past 24px sets `data-nav-scrolled`: the bar compacts from 84px to ~54px (container padding 18px -> 8px, logo 88px -> 72px wide) and gets a soft shadow. Back at the top it returns to full height. The nav is always visible (one single nav, no popup).
- **Resize**: Not used
- **Breakpoint**: Not used

## Styles

`src/styles/navbar.css`. Locks `.navbar_wrapper` transform with `!important` to neutralize the IX2 inline transforms. Transitions `.navbar_container` padding, `.navbar_logo-link` width (relayout is limited to the fixed nav) and `.navbar_component` box-shadow. Respects `prefers-reduced-motion`.

## Dependencies

None.

## DOM Expectations

`[data-component='navbar']` containing `.navbar_component` and `.navbar_container`.
