/*
Component: how-accordion
Webflow attribute: data-component="how-accordion" (on home-how_tabs, the Tabs wrapper)
*/

import '../styles/how-accordion.css'

const mobileQuery = window.matchMedia('(max-width: 767px)')

/**
 * How It Works steps. Each tab link expands its description (data-step-open).
 * Desktop/tablet: one step always open and the image pane follows it.
 * Mobile (<= 767px): works as an accordion, tapping an open step closes it.
 * The image panes are hidden on mobile (CSS); instead each step gets a copy of
 * its pane image inside its body ([data-step-media], shown only on mobile).
 *
 * Tab switching is handled here by position (link N <-> pane N), not by the
 * Webflow tab names (data-w-tab), so steps added through the API with a
 * duplicate tab name still work. Webflow's own tab click handler is blocked.
 * Replaces the template IX2 "Tab Accordion / Open|Close" height animation.
 * @param {HTMLElement[]} elements - All elements matching [data-component='how-accordion']
 */
export default function (elements) {
  elements.forEach((tabs) => {
    const links = Array.from(tabs.querySelectorAll('.home-how_tab-link'))
    const panes = Array.from(tabs.querySelectorAll('.home-how_pane'))
    if (!links.length) {
      console.warn('[how-accordion] No .home-how_tab-link found', tabs)
      return
    }
    if (panes.length !== links.length) {
      console.warn(
        `[how-accordion] ${links.length} steps but ${panes.length} panes`,
        tabs
      )
    }

    // Copy each pane's image into its step so the mobile accordion shows it
    links.forEach((link, i) => {
      const media =
        panes[i] && panes[i].querySelector('.home-how_image-wrapper')
      const body = link.querySelector('.home-how_step-text')
      if (!media || !body || body.querySelector('[data-step-media]')) return
      const copy = media.cloneNode(true)
      copy.setAttribute('data-step-media', '')
      copy.setAttribute('aria-hidden', 'true')
      copy.querySelectorAll('[id], [data-w-id]').forEach((el) => {
        el.removeAttribute('id')
        el.removeAttribute('data-w-id')
      })
      copy.querySelectorAll('img').forEach((img) => (img.loading = 'lazy'))
      body.appendChild(copy)
    })

    // Show pane N for link N (same classes Webflow uses, so styling is unchanged)
    const select = (link) => {
      const index = links.indexOf(link)
      links.forEach((l, i) => {
        const current = i === index
        l.classList.toggle('w--current', current)
        l.setAttribute('aria-selected', String(current))
        l.setAttribute('tabindex', current ? '0' : '-1')
      })
      panes.forEach((p, i) => {
        const active = i === index
        p.classList.toggle('w--tab-active', active)
        p.style.opacity = ''
        p.style.transition = ''
        p.toggleAttribute('data-pane-active', active)
      })
    }

    const open = (link) =>
      links.forEach((l) => l.toggleAttribute('data-step-open', l === link))

    // Start with the tab Webflow marks as current (or the first one)
    const initial =
      links.find((l) => l.classList.contains('w--current')) || links[0]
    select(initial)
    open(initial)

    // Capture phase on the wrapper: runs before the click reaches the link, so
    // stopping it here keeps Webflow's tab handler (bound on each link) out
    tabs.addEventListener(
      'click',
      (event) => {
        const link = event.target.closest('.home-how_tab-link')
        if (!link || !links.includes(link)) return
        event.preventDefault()
        event.stopPropagation()

        const isOpen = link.hasAttribute('data-step-open')
        if (mobileQuery.matches && isOpen) {
          link.removeAttribute('data-step-open')
          link.setAttribute('aria-expanded', 'false')
          return
        }
        select(link)
        open(link)
        links.forEach((l) =>
          l.setAttribute('aria-expanded', String(l === link))
        )
      },
      true
    )
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
