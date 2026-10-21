/*
Component: marquee
Webflow attribute: data-component="marquee" (on marquee_component)
Optional: data-marquee-speed="40" (px per second, default 40)
*/

import '../styles/marquee.css'

const defaultSpeed = 40 // px per second

/**
 * Infinite horizontal marquee. The track holds identical .marquee_list copies
 * (built in Webflow); each list is animated with a CSS keyframe that moves it
 * by its own width + gap, so the loop is seamless. This script only sets the
 * duration from the list width (constant speed at any breakpoint) and pauses
 * the animation while the marquee is off screen.
 * @param {HTMLElement[]} elements - All elements matching [data-component='marquee']
 */
export default function (elements) {
  const setDuration = (marquee) => {
    const list = marquee.querySelector('.marquee_list')
    if (!list) return
    const speed = Number(marquee.dataset.marqueeSpeed) || defaultSpeed
    const distance = list.getBoundingClientRect().width
    marquee.style.setProperty('--marquee-duration', `${distance / speed}s`)
  }

  const observer = new window.IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.toggleAttribute('data-marquee-paused', !entry.isIntersecting)
    })
  })

  elements.forEach((marquee) => {
    if (!marquee.querySelector('.marquee_list')) {
      console.warn('[marquee] No .marquee_list found', marquee)
      return
    }
    setDuration(marquee)
    observer.observe(marquee)
  })

  return {
    resize() {
      elements.forEach(setDuration)
    },
  }
}
