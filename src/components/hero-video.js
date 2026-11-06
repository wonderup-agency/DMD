/*
Component: hero-video
Webflow attribute: data-component="hero-video" (on home-hero_background, inside the Home Hero component)
Required: data-video-src="<mp4 url>" (muted background loop, Webflow asset, no captions)
Optional: data-video-full="<mp4 url>" (full video with sound for the Play Video dialog)
Play trigger: any element with data-hero-video-play inside the same hero section
*/

import '../styles/hero-video.css'

/**
 * Creates a <video> element with the given attributes.
 * @param {string} src - Video URL
 * @param {Object} options - Boolean attributes to set (muted, loop, ...)
 * @returns {HTMLVideoElement}
 */
const createVideo = (src, options) => {
  const video = document.createElement('video')
  Object.entries(options).forEach(([key, value]) => {
    if (value) video.setAttribute(key, '')
    video[key] = value
  })
  video.src = src
  return video
}

/**
 * Video hero. Behind the hero content it plays a muted loop (native <video>,
 * hosted as a Webflow asset) over the poster image and fades it in once it
 * is playing. The loop pauses while the hero is off screen. The "Play Video"
 * button opens the full video with sound in a native <dialog>; closing it
 * removes the player and resumes the loop.
 * @param {HTMLElement[]} elements - All elements matching [data-component='hero-video']
 */
export default function (elements) {
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches
  const saveData = Boolean(window.navigator.connection?.saveData)

  elements.forEach((background) => {
    const { videoSrc, videoFull } = background.dataset
    if (!videoSrc) {
      console.warn('[hero-video] Missing data-video-src', background)
      return
    }

    const hero =
      background.closest('section, header') || background.parentElement
    let loop = null

    // ── Background loop (muted, no controls) ─────────────────────────
    if (!reduceMotion && !saveData) {
      loop = createVideo(videoSrc, {
        muted: true,
        loop: true,
        autoplay: true,
        playsInline: true,
      })
      loop.className = 'hero-video_loop'
      loop.preload = 'auto'
      loop.setAttribute('aria-hidden', 'true')
      loop.tabIndex = -1
      loop.addEventListener(
        'playing',
        () => background.setAttribute('data-video-playing', ''),
        { once: true }
      )
      background.appendChild(loop)

      // Only play while the hero is on screen
      const observer = new window.IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) loop.play().catch(() => {})
        else loop.pause()
      })
      observer.observe(background)
    }

    // ── Full video in a dialog ───────────────────────────────────────
    const triggers = hero.querySelectorAll('[data-hero-video-play]')
    if (!triggers.length || !videoFull) return

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
      const player = createVideo(videoFull, {
        controls: true,
        autoplay: true,
        playsInline: true,
      })
      player.setAttribute('aria-label', 'DMD Systems Recovery video')
      frame.replaceChildren(player)
      loop?.pause()
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
      frame.querySelector('video')?.pause()
      frame.replaceChildren()
      loop?.play().catch(() => {})
    })
  })
}
