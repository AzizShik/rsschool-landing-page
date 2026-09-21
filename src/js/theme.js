const STORAGE_KEY = 'theme'
const THEME_ATTRIBUTE = 'data-theme'

function getStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY)
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
  document.documentElement.setAttribute(THEME_ATTRIBUTE, theme)
  try {
    localStorage.setItem(STORAGE_KEY, theme)
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