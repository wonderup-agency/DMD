/*
Component: blog-slider
Webflow attribute: data-component="blog-slider" (on section_home-blog)
*/

import '../styles/blog-slider.css'

const gap = 8 // must match home-blog_list gap in Webflow

/**
 * Prev/next arrows for the Stories CMS list. The list is a native horizontal
 * scroller with scroll-snap (styled in Webflow); this only drives the arrows.
 * @param {HTMLElement[]} elements - All elements matching [data-component='blog-slider']
 */
export default function (elements) {
  const sliders = elements
    .map((root) => {
      const list = root.querySelector('.home-blog_list')
      const prev = root.querySelector('[data-blog-prev]')
      const next = root.querySelector('[data-blog-next]')
      if (!list || !prev || !next) {
        console.warn('[blog-slider] Missing list or arrows', root)
        return null
      }

      const step = () => {
        const item = list.querySelector('.home-blog_item')
        return item
          ? item.getBoundingClientRect().width + gap
          : list.clientWidth
      }

      const update = () => {
        prev.disabled = list.scrollLeft <= 2
        next.disabled =
          list.scrollLeft + list.clientWidth >= list.scrollWidth - 2
      }

      prev.addEventListener('click', () =>
        list.scrollBy({ left: -step(), behavior: 'smooth' })
      )
      next.addEventListener('click', () =>
        list.scrollBy({ left: step(), behavior: 'smooth' })
      )
      list.addEventListener('scroll', update, { passive: true })
      update()

      return update
    })
    .filter(Boolean)

  return {
    resize() {
      sliders.forEach((update) => update())
    },
  }
}
