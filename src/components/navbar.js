/*
Component: navbar
Webflow attribute: data-component="navbar" (root of the Navbar / Blured component)
*/

import '../styles/navbar.css'

const scrolledOffset = 24 // px from top before the shadow appears
const hideAfter = 120 // never hide while the nav is still near the top
const tolerance = 8 // ignore tiny scroll jitters

/**
 * Hides the nav when scrolling down and shows it again on scroll up.
 * State is exposed as data attributes so styling stays in navbar.css:
 *   data-nav-scrolled  page is scrolled past scrolledOffset
 *   data-nav-hidden    nav is slid out of view
 * @param {HTMLElement[]} elements - All elements matching [data-component='navbar']
 */
export default function (elements) {
  elements.forEach((nav) => {
    let lastY = window.scrollY
    let ticking = false

    // Keep the nav visible while the mobile menu or a dropdown is open
    const isLocked = () =>
      nav.querySelector('.w--open, .w--nav-menu-open, [data-nav-menu-open]') !==
      null

    const update = () => {
      ticking = false
      const y = Math.max(window.scrollY, 0)

      nav.toggleAttribute('data-nav-scrolled', y > scrolledOffset)

      if (y <= hideAfter) {
        nav.removeAttribute('data-nav-hidden')
        lastY = y
        return
      }

      const delta = y - lastY
      if (Math.abs(delta) < tolerance) return

      if (delta > 0 && !isLocked()) nav.setAttribute('data-nav-hidden', '')
      else if (delta < 0) nav.removeAttribute('data-nav-hidden')
      lastY = y
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

    // Showing the nav on keyboard focus keeps it accessible
    nav.addEventListener('focusin', () =>
      nav.removeAttribute('data-nav-hidden')
    )

    update()
  })
}
