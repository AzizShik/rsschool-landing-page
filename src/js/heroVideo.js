/**
 * Hero background video.
 *
 * Playback is started from here rather than by an `autoplay` attribute, so that
 * `prefers-reduced-motion` can hold the element on its poster. A decorative
 * loop is motion the visitor never asked for, and the poster is the same
 * photograph as the CSS fallback, so nothing is lost by not playing it.
 *
 * The `muted` attribute lives in the HTML on purpose: the autoplay policy only
 * exempts a video that is already silent at the moment playback is requested,
 * and setting `video.muted` from script is not reliably honoured.
 *
 * Without JavaScript the video simply stays on its poster, which is the
 * intended static appearance.
 */

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

export function initHeroVideo() {
  const video = document.querySelector('[data-hero-video]')
  if (!video) return

  if (window.matchMedia(REDUCED_MOTION).matches) return

  // Rejected when the browser refuses to autoplay. The poster stays visible and
  // nothing else depends on playback, so this is deliberately not rethrown.
  video.play().catch(() => {})
}
