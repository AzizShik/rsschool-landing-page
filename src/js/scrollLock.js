

let holders = 0

let previousOverflow = ''
let previousPaddingRight = ''

function scrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth
}

export function lockScroll() {
  holders += 1

  if (holders > 1) return

  const body = document.body
  previousOverflow = body.style.overflow
  previousPaddingRight = body.style.paddingRight

  const width = scrollbarWidth()
  const currentPadding = Number.parseFloat(getComputedStyle(body).paddingRight) || 0

  body.style.overflow = 'hidden'

  if (width > 0) {
    body.style.paddingRight = `${currentPadding + width}px`
  }
}

export function unlockScroll() {
  if (holders === 0) return
  holders -= 1
  if (holders > 0) return

  document.body.style.overflow = previousOverflow
  document.body.style.paddingRight = previousPaddingRight
}
