/*
Component: navbar
Webflow attribute: data-component="navbar" (root of the Navbar / Blured component)
*/

import '../styles/navbar.css'
import '../styles/nav-dropdown.css'

const scrolledOffset = 24 // px from top before the nav compacts
const hoverDelay = 180 // ms Webflow waits before closing a hovered dropdown

/**
 * Dropdown polish (styles in nav-dropdown.css):
 * - numbers the items of each list (--i) so they enter staggered
 * - on desktop with a real pointer, switches the Webflow dropdowns to
 *   open on hover (data-hover / data-delay) and re-inits the Webflow
 *   dropdown module so it picks the attributes up. Click still works.
 * @param {HTMLElement} nav - Navbar root
 */
function setupDropdowns(nav) {
  const dropdowns = nav.querySelectorAll('.navbar_menu-dropdown')
  if (!dropdowns.length) return

  dropdowns.forEach((dropdown) => {
    dropdown
      .querySelectorAll(
        '.navbar_menu-dropdown-link, .navbar_menu-dropdown-label'
      )
      .forEach((item, index) => item.style.setProperty('--i', index))
  })

  const canHover = window.matchMedia(
    '(hover: hover) and (pointer: fine) and (min-width: 992px)'
  ).matches
  if (!canHover) return

  dropdowns.forEach((dropdown) => {
    dropdown.setAttribute('data-hover', 'true')
    dropdown.setAttribute('data-delay', String(hoverDelay))
    setupGlide(dropdown)
  })
  nav.setAttribute('data-dd-glide', '')

  const webflowDropdown = window.Webflow?.require?.('dropdown')
  if (webflowDropdown && typeof webflowDropdown.ready === 'function') {
    webflowDropdown.ready()
  }
}

/**
 * Gliding hover (desktop only): one highlight per dropdown list that moves
 * to the hovered link instead of each link blinking its own background.
 * Also wraps each link's text in [data-dd-text] so it can nudge right.
 * @param {HTMLElement} dropdown - .navbar_menu-dropdown
 */
function setupGlide(dropdown) {
  const list = dropdown.querySelector('.navbar_menu-dropdown-list')
  const links = dropdown.querySelectorAll('.navbar_menu-dropdown-link')
  if (!list || !links.length) return

  links.forEach((link) => {
    if (link.querySelector('[data-dd-text]')) return
    const text = document.createElement('span')
    text.setAttribute('data-dd-text', '')
    while (link.firstChild) text.appendChild(link.firstChild)
    link.appendChild(text)
  })

  const highlight = document.createElement('span')
  highlight.setAttribute('data-dd-highlight', '')
  highlight.setAttribute('aria-hidden', 'true')
  list.prepend(highlight)

  const moveTo = (link) => {
    const listRect = list.getBoundingClientRect()
    const rect = link.getBoundingClientRect()
    // the list may be mid scale-in: undo the scale so the offsets are exact
    const scale = listRect.width / list.offsetWidth || 1
    const x = (rect.left - listRect.left) / scale - list.clientLeft
    const y = (rect.top - listRect.top) / scale - list.clientTop
    const wasHidden = !highlight.hasAttribute('data-visible')
    // coming from hidden: jump into place, then only fade in
    highlight.toggleAttribute('data-snap', wasHidden)
    highlight.style.setProperty('--hl-x', `${x}px`)
    highlight.style.setProperty('--hl-y', `${y}px`)
    highlight.style.setProperty('--hl-w', `${rect.width / scale}px`)
    highlight.style.setProperty('--hl-h', `${rect.height / scale}px`)
    if (wasHidden) {
      // commit the snapped position before turning the glide back on
      void highlight.offsetWidth
      highlight.setAttribute('data-visible', '')
      requestAnimationFrame(() => highlight.removeAttribute('data-snap'))
    }
  }

  const hide = () => highlight.removeAttribute('data-visible')

  links.forEach((link) => {
    link.addEventListener('pointerenter', () => moveTo(link))
    link.addEventListener('focus', () => moveTo(link))
  })
  list.addEventListener('pointerleave', hide)
  list.addEventListener('focusout', (event) => {
    if (!list.contains(event.relatedTarget)) hide()
  })
}

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
    setupDropdowns(nav)

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
