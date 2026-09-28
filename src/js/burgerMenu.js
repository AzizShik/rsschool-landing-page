/**
 * Burger menu — shared Header behaviour, runs on both pages.
 *
 * The markup already exists in `components/Header/header.html` and is injected
 * into every page by the `sharedHeader` Vite plugin, so nothing here builds
 * DOM. This module only wires behaviour to it.
 *
 * Design notes (Figma frames `[M] Burger` / `[T] Burger`):
 *   - the panel is not a full-screen overlay: it starts 20px below the 60px
 *     header bar and runs to the bottom of the viewport, full width
 *   - the close icon is an 11.31px box, which is exactly what two 16px lines
 *     rotated ±45° produce — the burger icon is morphed, not swapped
 */
import { lockScroll, unlockScroll } from './scrollLock.js'

/** The assignment fixes the mobile menu at 768px and below. */
const MOBILE_QUERY = '(max-width: 768px)'

const LABEL_CLOSED = 'Open menu'
const LABEL_OPEN = 'Close menu'

/** Used only if the duration token is missing or unparseable. */
const FALLBACK_DURATION_MS = 300

/**
 * With reduced motion the CSS transition is disabled, so there is nothing to
 * wait for. Hiding the panel on a timer anyway would leave it in the document
 * — and its links still reachable by Tab — for no visual reason.
 */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

/**
 * Reads the close animation length from the design token so the timer that
 * re-applies `hidden` never disagrees with the CSS transition.
 */
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

  // Everything focusable while the panel is open: the trigger stays reachable
  // so the menu can be dismissed with the keyboard, then the panel's links.
  const focusable = [trigger, ...panelLinks]

  /** Moves the page behind the panel out of reach while it is open. */
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
    // `hidden` implies display:none, which cannot be transitioned. Revealing
    // the panel first and adding the class on the next frame gives the
    // transition a starting style to animate from.
    window.requestAnimationFrame(() => panel.classList.add('is-open'))

    trigger.setAttribute('aria-expanded', 'true')
    trigger.setAttribute('aria-label', LABEL_OPEN)

    lockScroll()
    setBackgroundInert(true)
    panelLinks[0]?.focus()
  }

  /**
   * @param {object} [options]
   * @param {boolean} [options.restoreFocus=true] Return focus to the trigger.
   *   Pass false when closing because of navigation or a breakpoint change —
   *   yanking focus back to the button after the user has moved on is worse
   *   than leaving it where the browser puts it.
   */
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

    // Keep the panel in the document until the fade-out finishes, otherwise
    // it would disappear instantly instead of animating.
    hideTimer = window.setTimeout(() => {
      if (!isOpen) panel.hidden = true
    }, closeDuration())
  }

  trigger.addEventListener('click', () => (isOpen ? close() : open()))

  // One delegated document listener for both keys, installed once — a listener
  // added per open/close cycle would accumulate on every toggle.
  document.addEventListener('keydown', (event) => {
    if (!isOpen) return

    if (event.key === 'Escape') {
      event.preventDefault()
      close()
      return
    }

    if (event.key !== 'Tab') return

    // The panel covers the page and scrolling is locked, so Tab is kept
    // cycling inside it rather than reaching the obscured content behind.
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

  // Following a link navigates or scrolls, so the menu must not stay open —
  // and must not pull focus back to the trigger.
  panel.addEventListener('click', (event) => {
    if (event.target.closest('a')) close({ restoreFocus: false })
  })

  // Growing past the breakpoint must actively close the menu: the burger
  // button disappears, so an open panel would be left with no way to dismiss it.
  mobile.addEventListener('change', (event) => {
    if (!event.matches) close({ restoreFocus: false })
  })
}
