# hero-video

## Purpose

Video hero on the Home (Home Hero component, Figma "Home with images and alternative hero"). The Vimeo video plays muted on loop behind the hero content, and the "Play Video" button opens the full video with sound in a modal.

## Webflow Setup

On `home-hero_background` (first child of `section_home-hero`, absolute, full size):

data-component="hero-video"
data-vimeo-id="1236634595"
data-vimeo-hash="4f6e2ce26f" (hash of the private Vimeo link, optional for public videos)

Inside it, the poster image (`image-cover`, `loading="eager"`, `fetchpriority="high"`), which is what shows until the video plays and is the LCP image.

The play trigger is any element with `data-hero-video-play` inside the same hero (`home-hero_play`, a link with `href="#"` and `role="button"`).

The hero section also carries `data-nav-theme="dark"` (read by the navbar component, not this one).

## Behavior

- **Init**: Appends a Vimeo iframe in background mode (`background=1`, muted, loop, no controls) to the background block. Listens to the Vimeo Player postMessage API (no SDK) and sets `data-video-playing` on the first `play` event, so the iframe fades in over the poster. Creates a native `<dialog>` (close button first, then the frame) at the end of `body`. Clicking the trigger fills the dialog with a normal Vimeo player (`autoplay=1`, with sound), pauses the background loop and calls `showModal()`. Close button, backdrop click and Escape close it; on `close` the player iframe is removed (stops the audio) and the loop resumes.
- **Reduced motion**: The background loop is not created (poster only). The Play Video modal still works.
- **Resize**: Not used
- **Breakpoint**: Not used

## Styles

`src/styles/hero-video.css`: the loop iframe covers the hero like `object-fit: cover` using container query units (`container-type: size` on the background block; the video is ~1.9:1). Dialog: 90vw wide, frame at the video's ratio (426 / 224), dark backdrop, round close button above the top-right corner.

## Dependencies

None (Vimeo player loaded as an iframe). Background mode needs a paid Vimeo plan on the video owner's account (it is "starter", which supports it).

## DOM Expectations

`[data-component='hero-video']` inside the hero `section`/`header`, with `[data-hero-video-play]` somewhere in that same hero.
