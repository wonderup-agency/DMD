/*
Component: navbar
Webflow attribute: data-component="navbar" (root of the Navbar / Blured component)
*/

import '../styles/navbar.css'

const scrolledOffset = 24 // px from top before the nav compacts

/**
 * Compacts the nav once the page is scrolled: sets data-nav-scrolled on the
 * root, and navbar.css transitions the bar padding and logo width (84px -> ~54px
 * tall) and adds a soft shadow. The nav stays visible at all times.
 * @param {HTMLElement[]} elements - All elements matching [data-component='navbar']
 */
export default function (elements) {
  elements.forEach((nav) => {
    let ticking = false
    let scrolled = null

    const update = () => {
      ticking = false
      const next = window.scrollY > scrolledOffset
      if (next === scrolled) return // only touch the DOM when the state flips
      scrolled = next
      nav.toggleAttribute('data-nav-scrolled', next)
    }

    window.addEventListener(
      'scroll',
      () => {
        if (ticking) return
        ticking = true
        requestAnimationFrame(update)
      },
      { passive: true }
    )

    update()
  })
}
