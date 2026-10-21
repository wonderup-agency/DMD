# navbar

## Purpose

Custom scroll behavior for the site nav (Navbar / Blured component). Replaces the template IX2 "Navbar / Scroll", which shrank the nav and swapped in a second "Nav / Popup" nav.

## Webflow Setup

On the root element of the Navbar / Blured component (`navbar_wrapper is-static`):

data-component="navbar"

Nav / Popup is hidden on pages that use this nav.

## Behavior

- **Init**: Listens to scroll (rAF-throttled). Past 24px sets `data-nav-scrolled` (soft shadow). Past 120px, scrolling down sets `data-nav-hidden` (slides `.navbar_outer` up), scrolling up removes it. Never hides while the mobile menu or a dropdown is open, and shows again on keyboard focus.
- **Resize**: Not used
- **Breakpoint**: Not used

## Styles

`src/styles/navbar.css`. Locks `.navbar_wrapper` transform with `!important` to neutralize the IX2 inline transforms; motion is applied to `.navbar_outer`. Respects `prefers-reduced-motion`.

## Dependencies

None.

## DOM Expectations

`[data-component='navbar']` containing `.navbar_outer` and `.navbar_component`.
