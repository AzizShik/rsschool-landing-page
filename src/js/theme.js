// Exported so the Vite plugin (vite.config.js) can inject a matching
// blocking <script> into <head> with the very same keys — the theme contract
// stays defined in exactly one place.
export const THEME_STORAGE_KEY = 'theme'
export const THEME_ATTRIBUTE = 'data-theme'

const THEMES = ['light', 'dark']

function normalizeTheme(value) {
  return THEMES.includes(value) ? value : null
}

function getStoredTheme() {
  try {
    return normalizeTheme(localStorage.getItem(THEME_STORAGE_KEY))
  } catch {
    return null
  }
}

function getPreferredTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function getCurrentTheme() {
  return document.documentElement.getAttribute(THEME_ATTRIBUTE) === 'dark' ? 'dark' : 'light'
}

function syncButton(button, theme) {
  const isDark = theme === 'dark'
  const isActive = button.dataset.themeButton === (isDark ? 'dark' : 'light')
  button.classList.toggle('theme-switch__button--active', isActive)
  button.setAttribute('aria-pressed', String(isActive))
}

function syncButtons() {
  const theme = getCurrentTheme()
  document.querySelectorAll('[data-theme-button]').forEach((button) => {
    syncButton(button, theme)
  })
}

export function setTheme(theme) {
  const next = normalizeTheme(theme) ?? 'light'
  document.documentElement.setAttribute(THEME_ATTRIBUTE, next)
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next)
  } catch {
    // localStorage may be unavailable (e.g. private mode) — theme still applies for this session
  }
  syncButtons()
}

/**
 * Applies the stored/preferred theme and wires up the theme switch buttons.
 * Call after the shared Header has been rendered, so the switch exists in the DOM.
 */
export function initTheme() {
  setTheme(getStoredTheme() ?? getPreferredTheme())

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-theme-button]')
    if (!button) return
    setTheme(button.dataset.themeButton === 'dark' ? 'dark' : 'light')
  })
}