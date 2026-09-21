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

function getCurrentTheme() {
  return document.documentElement.getAttribute(THEME_ATTRIBUTE) === 'dark' ? 'dark' : 'light'
}

function applyToggleState(toggle, theme) {
  const isDark = theme === 'dark'
  toggle.setAttribute('aria-pressed', String(isDark))
}

function syncToggles() {
  const theme = getCurrentTheme()
  document.querySelectorAll('[data-theme-toggle]').forEach((toggle) => {
    applyToggleState(toggle, theme)
  })
}

export function setTheme(theme) {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, theme)
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // localStorage may be unavailable (e.g. private mode) — theme still applies for this session
  }
  syncToggles()
}

function initTheme() {
  setTheme(getStoredTheme() ?? getPreferredTheme())

  document.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-theme-toggle]')
    if (!toggle) return
    setTheme(getCurrentTheme() === 'dark' ? 'light' : 'dark')
  })
}

initTheme()