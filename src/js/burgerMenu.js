

import { lockScroll, unlockScroll } from './scrollLock.js'

const MOBILE_QUERY = '(max-width: 768px)'

const LABEL_CLOSED = 'Open menu'
const LABEL_OPEN = 'Close menu'

const FALLBACK_DURATION_MS = 300

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

function closeDuration() {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--transition-duration')
    .trim()

  const value = Number.parseFloat(raw)
  if (!Number.isFinite(value)) return FALLBACK_DURATION_MS

  return raw.endsWith('ms') ? value : value * 1000
}

export function initBurgerMenu() {
  const trigger = document.querySelector('.header__burger')
  const panel = document.querySelector('.burger-menu')

  if (!trigger || !panel) return

  const mobile = window.matchMedia(MOBILE_QUERY)
  const panelLinks = [...panel.querySelectorAll('a')]

  let isOpen = false
  let hideTimer = 0

  const focusable = [trigger, ...panelLinks]

  function setBackgroundInert(inert) {
    for (const region of document.querySelectorAll('main, footer')) {
      region.toggleAttribute('inert', inert)
    }
  }

  function open() {
    if (isOpen) return
    isOpen = true

    window.clearTimeout(hideTimer)
    panel.hidden = false

    window.requestAnimationFrame(() => panel.classList.add('is-open'))

    trigger.setAttribute('aria-expanded', 'true')
    trigger.setAttribute('aria-label', LABEL_OPEN)

    lockScroll()
    setBackgroundInert(true)
    panelLinks[0]?.focus()
  }

  function close({ restoreFocus = true } = {}) {
    if (!isOpen) return
    isOpen = false

    panel.classList.remove('is-open')
    trigger.setAttribute('aria-expanded', 'false')
    trigger.setAttribute('aria-label', LABEL_CLOSED)

    unlockScroll()
    setBackgroundInert(false)
    if (restoreFocus) trigger.focus()

    if (reduceMotion.matches) {
      panel.hidden = true
      return
    }

    hideTimer = window.setTimeout(() => {
      if (!isOpen) panel.hidden = true
    }, closeDuration())
  }

  trigger.addEventListener('click', () => (isOpen ? close() : open()))

  document.addEventListener('keydown', (event) => {
    if (!isOpen) return

    if (event.key === 'Escape') {
      event.preventDefault()
      close()
      return
    }

    if (event.key !== 'Tab') return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement

    if (event.shiftKey && (active === first || !panel.contains(active))) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  })

  panel.addEventListener('click', (event) => {
    if (event.target.closest('a')) close({ restoreFocus: false })
  })

  mobile.addEventListener('change', (event) => {
    if (!event.matches) close({ restoreFocus: false })
  })
}
