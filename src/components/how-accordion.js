/*
Component: how-accordion
Webflow attribute: data-component="how-accordion" (on home-how_tabs, the Tabs wrapper)
*/

import '../styles/how-accordion.css'

const mobileQuery = window.matchMedia('(max-width: 767px)')

/**
 * How It Works steps. Each tab link expands its description (data-step-open).
 * Desktop/tablet: behaves like the Webflow tabs, one step always open and the
 * image pane follows the active tab. Mobile (<= 767px): works as an accordion,
 * tapping an open step closes it and the image panes are hidden (CSS).
 * Replaces the template IX2 "Tab Accordion / Open|Close" height animation.
 * @param {HTMLElement[]} elements - All elements matching [data-component='how-accordion']
 */
export default function (elements) {
  elements.forEach((tabs) => {
    const links = Array.from(tabs.querySelectorAll('.home-how_tab-link'))
    if (!links.length) {
      console.warn('[how-accordion] No .home-how_tab-link found', tabs)
      return
    }

    const open = (link) =>
      links.forEach((l) => l.toggleAttribute('data-step-open', l === link))

    // Start with the tab Webflow marks as current (or the first one)
    open(links.find((l) => l.classList.contains('w--current')) || links[0])

    links.forEach((link) => {
      link.addEventListener('click', () => {
        const isOpen = link.hasAttribute('data-step-open')
        if (mobileQuery.matches && isOpen) {
          link.removeAttribute('data-step-open')
          link.setAttribute('aria-expanded', 'false')
          return
        }
        open(link)
        links.forEach((l) =>
          l.setAttribute('aria-expanded', String(l === link))
        )
      })
    })
  })

  return {
    // Back on desktop, make sure one step is open again
    breakpoint() {
      if (mobileQuery.matches) return
      elements.forEach((tabs) => {
        const links = Array.from(tabs.querySelectorAll('.home-how_tab-link'))
        if (links.some((l) => l.hasAttribute('data-step-open'))) return
        const current =
          links.find((l) => l.classList.contains('w--current')) || links[0]
        if (current) current.setAttribute('data-step-open', '')
      })
    },
  }
}
