

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

  }
  syncButtons()
}

export function initTheme() {
  setTheme(getStoredTheme() ?? getPreferredTheme())

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-theme-button]')
    if (!button) return
    setTheme(button.dataset.themeButton === 'dark' ? 'dark' : 'light')
  })
}