/**
 * Shared page scroll lock.
 *
 * Both the burger menu and the product modal need to block page scrolling
 * while they are open, so the behaviour lives here once instead of being
 * written twice. Two independent implementations would fight each other:
 * opening the modal while the menu is open and then closing the modal would
 * restore scrolling while the menu is still showing.
 */

// How many overlays currently hold the page. A count rather than a boolean:
// scrolling is only restored once the last holder releases it.
let holders = 0

// The inline values in place before we touched them, so unlocking restores
// exactly what was there instead of clearing unrelated inline styles.
let previousOverflow = ''
let previousPaddingRight = ''

/**
 * Width of the classic scrollbar, i.e. the space that frees up when it
 * disappears. On Windows this is ~15px; on overlay-scrollbar systems (macOS,
 * mobile) it is 0 and no compensation is needed.
 */
function scrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth
}

/** Prevents the page from scrolling until the matching `unlockScroll()`. */
export function lockScroll() {
  holders += 1
  // Already locked — the extra holder just increments the count.
  if (holders > 1) return

  const body = document.body
  previousOverflow = body.style.overflow
  previousPaddingRight = body.style.paddingRight

  const width = scrollbarWidth()
  const currentPadding = Number.parseFloat(getComputedStyle(body).paddingRight) || 0

  body.style.overflow = 'hidden'

  // Hiding the scrollbar widens the content area by `width`, which would drag
  // centred content sideways. Padding it back keeps the layout exactly where
  // it was, so nothing appears to jump when the menu opens.
  if (width > 0) {
    body.style.paddingRight = `${currentPadding + width}px`
  }
}

/** Releases one hold on the page. Scrolling resumes at the last release. */
export function unlockScroll() {
  if (holders === 0) return
  holders -= 1
  if (holders > 0) return

  document.body.style.overflow = previousOverflow
  document.body.style.paddingRight = previousPaddingRight
}
