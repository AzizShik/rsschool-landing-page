/**
 * Favorite coffee slider — home page.
 *
 * The slides and arrows already exist as static markup in `home/index.html`;
 * this module only adds the movement, the indicators, and the ARIA state.
 *
 * Design notes (Figma frames `[D] slider` / `[M] slider`):
 *   - each slide is one full viewport wide and holds a single 480px card
 *     centred inside it, so exactly one card is on screen and the neighbours
 *     sit outside the clipped viewport
 *   - the arrows exist at 1440px and 768px but not at 380px, so the indicator
 *     bars are the only control on a phone
 */

/**
 * Wraps into 0..length-1 for any input, which is what makes the last → first
 * and first → last steps cycle without a branch. The double modulo normalises
 * a negative index, so going back from the first slide lands on the last.
 */
function wrapIndex(target, length) {
  return ((target % length) + length) % length
}

export function initSlider() {
  const slider = document.querySelector('.slider')
  const controls = document.querySelector('.slider__controls')
  const status = document.querySelector('[data-slider-status]')

  if (!slider || !controls) return

  const track = slider.querySelector('.slider__track')
  const slides = [...slider.querySelectorAll('.slide')]
  const prevButton = slider.querySelector('.slider__arrow--prev')
  const nextButton = slider.querySelector('.slider__arrow--next')

  if (!track || slides.length === 0) return

  // The only state. The track offset, the active bar and the announcement are
  // all derived from it in render(), so they cannot fall out of sync.
  let index = 0

  // Built from the slides rather than hardcoded in the HTML, so adding a slide
  // cannot leave the controls showing the wrong number of bars.
  const indicators = slides.map((_, position) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'slider__control'
    button.setAttribute('aria-label', `Go to slide ${position + 1} of ${slides.length}`)
    button.addEventListener('click', () => goTo(position))
    controls.append(button)
    return button
  })

  function render() {
    // The track is a block-level flex box inside a block-level viewport, so its
    // width is the viewport's width — it does NOT grow to fit its slides. Each
    // slide is `flex: 0 0 100%`, i.e. exactly one viewport wide, so advancing
    // one slide means translating the track by 100% of its own width.
    //
    // Dividing by the slide count here would be wrong: a percentage in
    // translateX resolves against the element's own border-box width, and that
    // is one slide, not all of them. It would move a third of a slide and leave
    // two slides half-visible.
    //
    // A percentage also means the offset stays correct when the window is
    // resized, with nothing to recompute.
    track.style.transform = `translateX(-${index * 100}%)`

    indicators.forEach((indicator, position) => {
      const isCurrent = position === index
      indicator.classList.toggle('is-active', isCurrent)
      indicator.toggleAttribute('aria-current', isCurrent)
    })

    if (status) {
      status.textContent = `Slide ${index + 1} of ${slides.length}`
    }
  }

  function goTo(target) {
    // Re-entering with an already-migrating transform is safe: the offset is
    // always recomputed from the index, so a burst of clicks settles on the
    // slide that was asked for last.
    index = wrapIndex(target, slides.length)
    render()
  }

  prevButton?.addEventListener('click', () => goTo(index - 1))
  nextButton?.addEventListener('click', () => goTo(index + 1))

  render()
}
