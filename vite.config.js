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
function arrowIcon(direction) {
  const path = direction === 'left'
    ? 'M18.5 12H6M12 18L6 12L12 6'
    : 'M6 12H18.5M12.5 18L18.5 12L12.5 6'
  return `
      <svg class="arrow-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
        <path d="${path}" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
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

// Read on every transform: header.html is not in Vite's module graph (it's not
// imported anywhere), so a once-at-startup read would keep stale content in dev
// until the server is restarted. Re-reading per request makes edits to
// header.html appear on the next browser refresh.
function readHeaderPartial() {
  return readFileSync(headerPartialPath, 'utf-8')
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

        return html.replace(/<header\s+id="site-header"[^>]*>\s*<\/header>/, () => partial).replaceAll('{{CUP_ICON}}', cupIcon(20)).replaceAll('{{ARROW_LEFT}}', arrowIcon('left')).replaceAll('{{ARROW_RIGHT}}', arrowIcon('right'))
      },
    },
  }
}

export default defineConfig({
  root: 'src',
  plugins: [sharedHeader()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    // Assignment requires: readable, unminified output + source maps.
    sourcemap: true,
    minify: false,
    cssMinify: false,
    rollupOptions: {
      input: {
        home: fileURLToPath(new URL('./src/pages/home/index.html', import.meta.url)),
        menu: fileURLToPath(new URL('./src/pages/menu/index.html', import.meta.url))
      }
    }
  }
})