

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

export function initHeroVideo() {
  const video = document.querySelector('[data-hero-video]')
  if (!video) return

  if (window.matchMedia(REDUCED_MOTION).matches) return

  video.play().catch(() => {})
}
