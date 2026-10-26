/*
Component: hero-video
Webflow attribute: data-component="hero-video" (on home-hero_background, inside the Home Hero component)
Required: data-vimeo-id="1236634595"
Optional: data-vimeo-hash="4f6e2ce26f" (private link hash)
Play trigger: any element with data-hero-video-play inside the same hero section
*/

import '../styles/hero-video.css'

const vimeoOrigin = 'https://player.vimeo.com'

const playerUrl = (id, hash, params) => {
  const query = new window.URLSearchParams(params)
  if (hash) query.set('h', hash)
  return `${vimeoOrigin}/video/${id}?${query.toString()}`
}

const createIframe = (src, title) => {
  const iframe = document.createElement('iframe')
  iframe.src = src
  iframe.title = title
  iframe.allow = 'autoplay; fullscreen; picture-in-picture'
  iframe.setAttribute('allowfullscreen', '')
  iframe.setAttribute('frameborder', '0')
  return iframe
}

// Sends a Vimeo Player API command through postMessage (no SDK needed)
const command = (iframe, method, value) => {
  if (!iframe || !iframe.contentWindow) return
  const message = value === undefined ? { method } : { method, value }
  iframe.contentWindow.postMessage(JSON.stringify(message), vimeoOrigin)
}

/**
 * Video hero. Behind the hero content it plays the Vimeo video muted and on
 * loop (Vimeo background mode) over the poster image, and fades it in once
 * Vimeo reports it is playing. The "Play Video" button opens the full video
 * with sound in a native <dialog>; closing it removes the player.
 * @param {HTMLElement[]} elements - All elements matching [data-component='hero-video']
 */
export default function (elements) {
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches

  elements.forEach((background) => {
    const { vimeoId, vimeoHash } = background.dataset
    if (!vimeoId) {
      console.warn('[hero-video] Missing data-vimeo-id', background)
      return
    }

    const hero =
      background.closest('section, header') || background.parentElement
    let loop = null

    // ── Background loop (muted, no controls) ─────────────────────────
    if (!reduceMotion) {
      loop = createIframe(
        playerUrl(vimeoId, vimeoHash, {
          background: 1,
          autoplay: 1,
          loop: 1,
          muted: 1,
          autopause: 0,
          dnt: 1,
        }),
        'Background video'
      )
      loop.className = 'hero-video_loop'
      loop.setAttribute('aria-hidden', 'true')
      loop.tabIndex = -1
      background.appendChild(loop)

      window.addEventListener('message', (event) => {
        if (event.origin !== vimeoOrigin || event.source !== loop.contentWindow)
          return
        let data = event.data
        try {
          data = typeof data === 'string' ? JSON.parse(data) : data
        } catch {
          return
        }
        if (data.event === 'ready') command(loop, 'addEventListener', 'play')
        if (data.event === 'play')
          background.setAttribute('data-video-playing', '')
      })
    }

    // ── Full video in a dialog ───────────────────────────────────────
    const triggers = hero.querySelectorAll('[data-hero-video-play]')
    if (!triggers.length) return

    const dialog = document.createElement('dialog')
    dialog.className = 'hero-video_dialog'
    dialog.setAttribute('aria-label', 'Video')
    dialog.innerHTML = `
      <button class="hero-video_close" type="button" aria-label="Close video">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
        </svg>
      </button>
      <div class="hero-video_frame"></div>`
    document.body.appendChild(dialog)
    const frame = dialog.querySelector('.hero-video_frame')

    const open = (event) => {
      event.preventDefault()
      frame.replaceChildren(
        createIframe(
          playerUrl(vimeoId, vimeoHash, { autoplay: 1, dnt: 1 }),
          'DMD Systems Recovery video'
        )
      )
      command(loop, 'pause')
      dialog.showModal()
    }

    const close = () => dialog.close()

    triggers.forEach((trigger) => trigger.addEventListener('click', open))
    dialog.querySelector('.hero-video_close').addEventListener('click', close)

    // Click on the backdrop (outside the video) closes it
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) close()
    })

    // Escape and close() both land here: stop the full video, resume the loop
    dialog.addEventListener('close', () => {
      frame.replaceChildren()
      command(loop, 'play')
    })
  })
}
