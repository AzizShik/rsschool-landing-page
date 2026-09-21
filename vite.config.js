import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

/**
 * Shared Header — single source of truth.
 *
 * The header markup lives in `src/components/Header/header.html` (one partial)
 * and is injected into every page's `<header id="site-header"></header>` both
 * in dev and at build time, so the header exists in the static HTML without
 * needing JavaScript. Only per-page links/active states vary (see PAGES below).
 */

// Exact coffee-cup vector from Figma (component "coffee-cup", e.g. node 147809:7517):
// cup body + handle + two steam curls. stroke-width 1.5 at 20px, 3 at 40px.
function cupIcon(size) {
  const strokeWidth = size >= 40 ? 3 : 1.5
  return `
      <svg class="cup-icon" viewBox="0 0 20 20" width="${size}" height="${size}" aria-hidden="true" fill="none">
        <path d="M14.167 9.76667V11.6667C14.167 14.8883 11.5553 17.5 8.33366 17.5C5.112 17.5 2.50033 14.8883 2.50033 11.6667V9.76667C2.50033 9.4353 2.76896 9.16667 3.10033 9.16667H13.567C13.8984 9.16667 14.167 9.4353 14.167 9.76667Z" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M10.0003 7.50008C10.0003 6.66675 10.5956 5.83341 11.786 5.83341C13.101 5.83341 14.167 4.76743 14.167 3.45246V2.91675" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M6.66634 7.5V7.08333C6.66634 5.70262 7.78563 4.58333 9.16634 4.58333C10.0868 4.58333 10.833 3.83714 10.833 2.91667V2.5" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M13.333 9.16675H15.4163C16.5669 9.16675 17.4997 10.0995 17.4997 11.2501C17.4997 12.4007 16.5669 13.3334 15.4163 13.3334H14.1663" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" />
      </svg>`
}

// Slider chevron arrows (exact Figma "arrow-left"/"arrow-right" vectors):
// a horizontal bar plus a chevron, ~12.5×12 in a 24×24 canvas. The stroke is
// currentColor so arrows follow the theme and invert on hover.
// Footer social icons (24×24, stroke style matching "icon-light" — Figma
// exports no vector paths, so these are hand-drawn line glyphs, currentColor).
function socialIcon(name) {
  const paths = {
    twitter: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z',
    instagram:
      'M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5zM16 11.37a4 4 0 1 1-7.75 1.26A4 4 0 0 1 16 11.37zM17.53 6.47h.01',
    facebook: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
  }
  return `
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="${paths[name]}" />
      </svg>`
}

// Footer contact icons (20×20, stroke style, currentColor).
function contactIcon(name) {
  const paths = {
    pin: 'M10 17.3S4.5 12.2 4.5 8.4a5.5 5.5 0 0 1 11 0C15.5 12.2 10 17.3 10 17.3Z',
    pinDot: 'M10 10.3a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z',
    phone:
      'M17.5 13.6v2.5a1.6 1.6 0 0 1-1.7 1.7 14.3 14.3 0 0 1-6.2-2.2 14.4 14.4 0 0 1-4.4-4.4A14.3 14.3 0 0 1 3 4.8 1.6 1.6 0 0 1 4.7 3.1h2.5a1.6 1.6 0 0 1 1.6 1.4c.1.7.3 1.4.6 2a1.6 1.6 0 0 1-.4 1.7l-1 1a13 13 0 0 0 4.8 4.8l1-1a1.6 1.6 0 0 1 1.7-.4c.6.3 1.3.5 2 .6a1.6 1.6 0 0 1 1.4 1.6z',
    clock: 'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z',
    clockHands: 'M10 6.3V10l2.6 1.7',
  }
  const extra = name === 'pin' ? `\n        <circle cx="10" cy="8.4" r="1.8" />` : ''
  const second = name === 'clock' ? `\n        <path d="${paths.clockHands}" />` : ''
  return `
      <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="${paths[name]}" />${extra}${second}
      </svg>`
}

// App-store button logos (36×36). Exact vector paths provided by the user
// (Figma-exported App Store / Google Play glyphs). Fills use currentColor so
// the icons follow the store-button text color in both themes.
function storeIcon(name) {
  if (name === 'apple') {
    return `
      <svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true" fill="none">
        <path fill="currentColor" d="M26.7073 18.6307C26.6704 14.6324 30.065 12.6872 30.2203 12.5966C28.2977 9.86366 25.3178 9.49026 24.2707 9.46048C21.7679 9.20369 19.3403 10.9206 18.0654 10.9206C16.765 10.9206 14.8017 9.48529 12.6858 9.52747C9.96293 9.56841 7.41566 11.1055 6.0186 13.4923C3.13542 18.359 5.28572 25.5108 8.04802 29.4446C9.42981 31.3712 11.0444 33.5223 13.1578 33.4466C15.2254 33.3635 15.9978 32.1614 18.4929 32.1614C20.9651 32.1614 21.6903 33.4466 23.8457 33.3983C26.0647 33.3635 27.4618 31.463 28.7952 29.519C30.392 27.3108 31.0333 25.1362 31.0588 25.0245C31.0066 25.0071 26.7493 23.4229 26.7073 18.6307Z" />
        <path fill="currentColor" d="M22.6357 6.87268C23.7477 5.51675 24.5086 3.67205 24.2974 1.80005C22.6879 1.86952 20.675 2.88554 19.5159 4.21169C18.4903 5.38029 17.5742 7.29571 17.8109 9.097C19.6189 9.2285 21.4753 8.20752 22.6357 6.87268Z" />
      </svg>`
  }
  return `
      <svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true" fill="none">
        <path fill="currentColor" d="M3.7558 3.20297C3.39335 3.57289 3.18359 4.14884 3.18359 4.89471V31.4994C3.18359 32.2453 3.39335 32.8212 3.7558 33.1911L3.84525 33.2723L19.1359 18.37V18.0181L3.84525 3.11575L3.7558 3.20297Z" />
        <path fill="currentColor" d="M26.0776 23.34L20.9863 18.37V18.0181L26.0837 13.0482L26.1979 13.1128L32.2345 16.4617C33.9573 17.4121 33.9573 18.976 32.2345 19.9324L26.1979 23.2753L26.0776 23.34V23.34Z" />
        <path fill="currentColor" d="M25.2733 24.2007L20.0617 19.1195L4.68164 34.1166C5.25384 34.7031 6.18695 34.7737 7.24807 34.1873L25.2733 24.2007" />
        <path fill="currentColor" d="M25.2733 12.1876L7.24807 2.20103C6.18695 1.62058 5.25384 1.69125 4.68164 2.27772L20.0617 17.2688L25.2733 12.1876Z" />
      </svg>`
}

// Slider chevron arrows (exact Figma "arrow-left"/"arrow-right" vectors):
// a horizontal bar plus a chevron, ~12.5×12 in a 24×24 canvas. The stroke is
// currentColor so arrows follow the theme and invert on hover.
function arrowIcon(direction) {
  const path = direction === 'left'
    ? 'M18.5 12H6M12 18L6 12L12 6'
    : 'M6 12H18.5M12.5 18L18.5 12L12.5 6'
  return `
      <svg class="arrow-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
        <path d="${path}" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      </svg>`
}

// Menu "refresh" (load-more) button icon (24×24). Exact vector paths provided
// by the user (Figma-exported). Strokes use currentColor so the icon follows
// the button color in both themes.
function refreshIcon() {
  return `
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor">
        <path d="M21.8883 13.5C21.1645 18.3113 17.013 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C16.1006 2 19.6248 4.46819 21.1679 8" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M17 8H21.4C21.7314 8 22 7.73137 22 7.4V3" stroke-linecap="round" stroke-linejoin="round" />
      </svg>`
}

// Per-page placeholder values for the shared header partial.
const PAGES = [
  {
    match: 'pages/home/index.html',
    vars: {
      '{{PAGE_HOME}}': './index.html',
      '{{PAGE_MENU}}': '../menu/index.html',
      '{{ANCHOR_ROOT}}': '',
      '{{MENU_CLASS}}': '',
      '{{MENU_CURRENT}}': '',
    },
  },
  {
    match: 'pages/menu/index.html',
    vars: {
      '{{PAGE_HOME}}': '../home/index.html',
      '{{PAGE_MENU}}': './index.html',
      '{{ANCHOR_ROOT}}': '../home/index.html',
      '{{MENU_CLASS}}': ' is-active',
      '{{MENU_CURRENT}}': ' aria-current="page"',
    },
  },
]

const headerPartialPath = fileURLToPath(new URL('./src/components/Header/header.html', import.meta.url))
const footerPartialPath = fileURLToPath(new URL('./src/components/Footer/footer.html', import.meta.url))

// Read on every transform: header/footer partials are not in Vite's module
// graph (they are never imported), so a once-at-startup read would keep stale
// content in dev until the server is restarted. Re-reading per request makes
// edits appear on the next browser refresh.
function readHeaderPartial() {
  return readFileSync(headerPartialPath, 'utf-8')
}

function readFooterPartial() {
  return readFileSync(footerPartialPath, 'utf-8')
}

function sharedHeader() {
  return {
    name: 'shared-header',
    transformIndexHtml: {
      // Inject before Vite's asset processing so <img src> in the partial
      // (e.g. the logo) is rewritten to hashed output paths in the build.
      order: 'pre',
      handler(html, ctx) {
        const target = String(ctx.filename || ctx.path || '').replace(/\\/g, '/')
        const page = PAGES.find((p) => target.endsWith(p.match))
        if (!page) return html

        const partial = readHeaderPartial()
          .replaceAll('{{PAGE_HOME}}', page.vars['{{PAGE_HOME}}'])
          .replaceAll('{{PAGE_MENU}}', page.vars['{{PAGE_MENU}}'])
          .replaceAll('{{ANCHOR_ROOT}}', page.vars['{{ANCHOR_ROOT}}'])
          .replaceAll('{{MENU_CLASS}}', page.vars['{{MENU_CLASS}}'])
          .replaceAll('{{MENU_CURRENT}}', page.vars['{{MENU_CURRENT}}'])
          .replaceAll('{{CUP_ICON_40}}', cupIcon(40))
          .replaceAll('{{CUP_ICON}}', cupIcon(20))
          // Keep the partial readable, don't ship its documentation in the page.
          .replace(/<!--[\s\S]*?-->/g, '')

        const footerPartial = readFooterPartial()
          .replaceAll('{{TWITTER}}', socialIcon('twitter'))
          .replaceAll('{{INSTAGRAM}}', socialIcon('instagram'))
          .replaceAll('{{FACEBOOK}}', socialIcon('facebook'))
          .replaceAll('{{PIN_ICON}}', contactIcon('pin'))
          .replaceAll('{{PHONE_ICON}}', contactIcon('phone'))
          .replaceAll('{{CLOCK_ICON}}', contactIcon('clock'))
          .replace(/<!--[\s\S]*?-->/g, '')

        return html
          .replace(/<header\s+id="site-header"[^>]*>\s*<\/header>/, () => partial)
          .replace(/<footer\s+id="site-footer"[^>]*>\s*<\/footer>/, () => footerPartial)
          .replaceAll('{{CUP_ICON}}', cupIcon(20))
          .replaceAll('{{ARROW_LEFT}}', arrowIcon('left'))
          .replaceAll('{{ARROW_RIGHT}}', arrowIcon('right'))
          .replaceAll('{{REFRESH_ICON}}', refreshIcon())
          .replaceAll('{{APPLE_ICON}}', storeIcon('apple'))
          .replaceAll('{{PLAY_ICON}}', storeIcon('play'))
      },
    },
  }
}

export default defineConfig({
  root: 'src',
  plugins: [sharedHeader()],
  // Relative asset base so the built site works when hosted under a
  // sub-path such as GitHub Pages (https://user.github.io/repo/).
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    // Assignment requires: readable, unminified output + source maps.
    sourcemap: true,
    minify: false,
    cssMinify: false,
    rollupOptions: {
      input: {
        // src/index.html stays the dev-server root redirect; for the build
        // the dist-root redirect is copied from src/public/index.html.
        home: fileURLToPath(new URL('./src/pages/home/index.html', import.meta.url)),
        menu: fileURLToPath(new URL('./src/pages/menu/index.html', import.meta.url))
      }
    }
  }
})