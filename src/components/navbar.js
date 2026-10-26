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
 * While the bar sits over a section marked data-nav-theme="dark" (the video
 * hero) it also sets data-nav-dark: translucent bar, white links and logo.
 * @param {HTMLElement[]} elements - All elements matching [data-component='navbar']
 */
export default function (elements) {
  elements.forEach((nav) => {
    let ticking = false
    let scrolled = null
    let dark = null
    const darkSections = document.querySelectorAll("[data-nav-theme='dark']")
    const bar = nav.querySelector('.navbar_component') || nav

    // True while the bottom of the bar is still over a dark section
    const isOverDark = () => {
      if (!darkSections.length) return false
      const line = bar.getBoundingClientRect().bottom
      return Array.from(darkSections).some((section) => {
        const rect = section.getBoundingClientRect()
        return rect.top <= line && rect.bottom > line
      })
    }

    const update = () => {
      ticking = false
      const nextScrolled = window.scrollY > scrolledOffset
      const nextDark = isOverDark()
      // only touch the DOM when a state flips
      if (nextScrolled !== scrolled) {
        scrolled = nextScrolled
        nav.toggleAttribute('data-nav-scrolled', nextScrolled)
      }
      if (nextDark !== dark) {
        dark = nextDark
        nav.toggleAttribute('data-nav-dark', nextDark)
      }
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
