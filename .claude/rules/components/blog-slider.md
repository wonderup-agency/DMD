# blog-slider

## Purpose

Prev/next arrows for the Home blog section (Stories CMS list). The list itself is a native horizontal scroller with scroll-snap, styled in Webflow (`home-blog_list`, `home-blog_item`).

## Webflow Setup

On `section_home-blog`:

data-component="blog-slider"

Arrow buttons inside it carry `data-blog-prev` and `data-blog-next`.

## Behavior

- **Init**: Arrows scroll the list by one card (card width + 8px gap). Arrows get `disabled` at the start/end of the list.
- **Resize**: Recomputes the disabled state.
- **Breakpoint**: Not used

## Styles

`src/styles/blog-slider.css`: hides the scrollbar, hides a card tag whose CMS field is empty, dims disabled arrows.

## Dependencies

None.

## DOM Expectations

`.home-blog_list` with `.home-blog_item` children, plus `[data-blog-prev]` and `[data-blog-next]`.
