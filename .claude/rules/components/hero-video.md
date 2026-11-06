# hero-video

## Purpose

Video hero on the Home (Home Hero component, Figma "Home with images and alternative hero"). A caption-free cut of the video plays muted on loop behind the hero content, and the "Play Video" button opens the full video (with sound and burned-in captions) in a modal. Both are native `<video>` files hosted as Webflow assets (previously Vimeo).

## Webflow Setup

On `home-hero_background` (first child of `section_home-hero`, absolute, full size):

data-component="hero-video"
data-video-src="https://cdn.prod.website-files.com/6ad7c761ff25eeec46a2a451/6aee3eb239211ec5d11a03a1_dmd-home-hero-loop.mp4" (background loop: muted, no captions; the source video has captions burned into the bottom of the frame, so this cut is cropped to the top 1600x900 of the 1920x1080 frame, ~8.5 MB)
data-video-full="https://cdn.prod.website-files.com/6ad7c761ff25eeec46a2a451/6aee3eb3e02a8e7457522e80_dmd-home-video-full.mp4" (full video with sound and captions, 1600x900, ~7.6 MB; optional, without it the Play Video trigger does nothing)

Inside it, the poster image (`image-cover`, `loading="eager"`, `fetchpriority="high"`), which is what shows until the video plays and is the LCP image.

The play trigger is any element with `data-hero-video-play` inside the same hero (`home-hero_play`, a link with `href="#"` and `role="button"`).

The hero section also carries `data-nav-theme="dark"` (read by the navbar component, not this one).

## Behavior

- **Init**: Appends a native `<video>` (`muted`, `loop`, `autoplay`, `playsinline`, no controls, `aria-hidden`) with `data-video-src` to the background block and sets `data-video-playing` on its first `playing` event, so it fades in over the poster. An IntersectionObserver plays it only while the hero is on screen. Skipped when the browser reports Save-Data. Creates a native `<dialog>` (close button first, then the frame) at the end of `body`. Clicking the trigger fills the dialog with a `<video controls autoplay>` of `data-video-full`, pauses the loop and calls `showModal()`. Close button, backdrop click and Escape close it; on `close` the player is paused and removed and the loop resumes.
- **Reduced motion**: The background loop is not created (poster only). The Play Video modal still works.
- **Resize**: Not used
- **Breakpoint**: Not used

## Styles

`src/styles/hero-video.css`: the loop `<video>` fills the background block (`inset: 0`, `object-fit: cover`) and fades in (opacity 1s). Dialog: `min(90vw, 160vh)` wide, frame at the video's ratio (16 / 9), dark backdrop, round close button above the top-right corner.

## Dependencies

None. Videos are plain mp4 Webflow assets (uploaded through the Assets API; Webflow caps video assets at 30 MB).

## DOM Expectations

`[data-component='hero-video']` inside the hero `section`/`header`, with `[data-hero-video-play]` somewhere in that same hero.
