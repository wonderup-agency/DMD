# counter

## Purpose

Count-up animation for statistic numbers (Home Intro stat cards: 440,000 / 9,400 / 4B / 643,447). Reusable on any number on the site.

## Webflow Setup

On the element that holds the number (in Home Intro: the `heading-style-h4` inside each `home-intro_stat-card`):

data-component="counter"

Optional: `data-counter-duration="2"` (seconds, default 2), `data-counter-start="0"` (default 0).

The number text is written in Webflow as it should finally read. Prefix and suffix text is kept as is: `$2.3M`, `4B`, `98%`, `1,900+` all work. Commas and decimals in the source text are kept in the animated value.

## Behavior

- **Init**: Parses each element's text into prefix / number / suffix, locks its current width (`min-width`) so the layout doesn't jump, sets it to the start value and counts up (ease-out expo) when 60% of it is in view. Runs once per element. At the end the original Webflow text is restored exactly. With `prefers-reduced-motion` nothing is touched and the static number shows.
- **Resize**: Not used
- **Breakpoint**: Not used

## Styles

`src/styles/counter.css`: `font-variant-numeric: tabular-nums` so digits don't wobble while counting.

## Dependencies

None.

## DOM Expectations

The element's text must contain one number (`\d[\d,]*(\.\d+)?`). Elements without a number are skipped with a warning. For a number inside a sentence, wrap just the number in a span and put the attribute on the span.
