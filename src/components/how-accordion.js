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
 * tapping an open step closes it. The image panes are hidden on mobile (CSS);
 * instead each step gets a copy of its pane image inside its body
 * ([data-step-media], shown only on mobile).
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

    // Copy each pane's image into its step so the mobile accordion shows it
    links.forEach((link) => {
      const tab = link.getAttribute('data-w-tab')
      const pane = tabs.querySelector(
        `.w-tab-pane[data-w-tab="${window.CSS.escape(tab || '')}"]`
      )
      const media = pane && pane.querySelector('.home-how_image-wrapper')
      const body = link.querySelector('.home-how_step-text')
      if (!media || !body || body.querySelector('[data-step-media]')) return
      const copy = media.cloneNode(true)
      copy.setAttribute('data-step-media', '')
      copy.setAttribute('aria-hidden', 'true')
      copy.querySelectorAll('[id], [data-w-id]').forEach((el) => {
        el.removeAttribute('id')
        el.removeAttribute('data-w-id')
      })
      body.appendChild(copy)
    })

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
