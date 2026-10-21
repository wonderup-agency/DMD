# marquee

## Purpose

Infinite horizontal marquee for the Home testimonials (replaces the template IX2 "Marquee - Left", which was bound to the original Home B element and never ran on the DMD component).

## Webflow Setup

On `marquee_component` (inside the Home Testimonials component):

data-component="marquee"

Optional `data-marquee-speed="40"` (px per second). Structure in Webflow: `marquee_component` > `marquee_track` (flex, gap 8px) > identical `marquee_list` copies (currently 3).

## Behavior

- **Init**: Sets `--marquee-duration` from the width of one list divided by the speed, so the scroll speed stays constant at any breakpoint. An IntersectionObserver sets `data-marquee-paused` while the marquee is off screen. Hover also pauses it.
- **Resize**: Recomputes the duration.
- **Breakpoint**: Not used

## Styles

`src/styles/marquee.css`: `marquee-scroll` keyframe moves each list by `-100% - 8px` (list width + track gap), linear and infinite. Respects `prefers-reduced-motion`.

## Dependencies

None.

## DOM Expectations

`[data-component='marquee']` containing `.marquee_list` elements. The keyframe gap (8px) must match the `marquee_track` gap in Webflow.
