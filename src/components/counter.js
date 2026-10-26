/*
Component: counter
Webflow attribute: data-component="counter" (on the element holding the number, e.g. "440,000", "4B", "$2.3M", "98%")
Optional: data-counter-duration="2" (seconds, default 2)
          data-counter-start="0"    (start value, default 0)
*/

import '../styles/counter.css'

const defaultDuration = 2 // seconds

// Splits "$643,447+" into prefix "$", number "643,447", suffix "+"
const numberPattern = /^(\D*?)(-?\d[\d,]*(?:\.\d+)?)(.*)$/s

const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

function parse(el) {
  const raw = el.textContent.trim()
  const match = raw.match(numberPattern)
  if (!match) return null

  const [, prefix, numberText, suffix] = match
  const decimals = (numberText.split('.')[1] || '').length
  return {
    raw,
    prefix,
    suffix,
    target: parseFloat(numberText.replace(/,/g, '')),
    decimals,
    useGrouping: numberText.includes(','),
  }
}

/**
 * Counts each number up from 0 when it scrolls into view. Prefix and suffix
 * text (currency, "B", "%", "+") stays fixed; only the digits animate.
 * The final value is always the exact text set in Webflow.
 * @param {HTMLElement[]} elements - All elements matching [data-component='counter']
 */
export default function (elements) {
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches
  if (reduceMotion) return

  const format = (value, data) =>
    data.prefix +
    value.toLocaleString('en-US', {
      minimumFractionDigits: data.decimals,
      maximumFractionDigits: data.decimals,
      useGrouping: data.useGrouping,
    }) +
    data.suffix

  const run = (el, data) => {
    const duration =
      (Number(el.dataset.counterDuration) || defaultDuration) * 1000
    const start = Number(el.dataset.counterStart) || 0
    const t0 = window.performance.now()

    const tick = (now) => {
      const progress = Math.min((now - t0) / duration, 1)
      const value = start + (data.target - start) * easeOutExpo(progress)
      el.textContent = format(value, data)
      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        el.textContent = data.raw
      }
    }
    requestAnimationFrame(tick)
  }

  const items = new Map()

  const observer = new window.IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        observer.unobserve(entry.target)
        run(entry.target, items.get(entry.target))
      })
    },
    { threshold: 0.6 }
  )

  elements.forEach((el) => {
    const data = parse(el)
    if (!data) {
      console.warn('[counter] No number found in', el)
      return
    }
    items.set(el, data)
    // Keep the box at its final width so the layout doesn't jump while counting
    el.style.minWidth = `${el.getBoundingClientRect().width}px`
    el.textContent = format(Number(el.dataset.counterStart) || 0, data)
    observer.observe(el)
  })
}
