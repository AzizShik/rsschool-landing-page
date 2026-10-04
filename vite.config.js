import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

import { THEME_ATTRIBUTE, THEME_STORAGE_KEY } from './src/js/theme.js'

function themeBootstrap() {
  return `<script>
      (function () {
        var attribute = ${JSON.stringify(THEME_ATTRIBUTE)}
        var key = ${JSON.stringify(THEME_STORAGE_KEY)}
        var theme = 'light'
        try {
          var stored = localStorage.getItem(key)
          if (stored === 'light' || stored === 'dark') {
            theme = stored
          } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            theme = 'dark'
          }
        } catch (error) {
        }
        document.documentElement.setAttribute(attribute, theme)
      })()
    </script>`
}

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
          .replace(/<!--[\s\S]*?-->/g, '')

        const footerPartial = readFooterPartial()
          .replace(/<!--[\s\S]*?-->/g, '')

        return html
          .replace(/<header\s+id="site-header"[^>]*>\s*<\/header>/, () => partial)
          .replace(/<footer\s+id="site-footer"[^>]*>\s*<\/footer>/, () => footerPartial)
          .replace('</head>', () => `    ${themeBootstrap()}\n  </head>`)
      },
    },
  }
}

function mainMapOnly() {
  return {
    name: 'main-map-only',
    generateBundle(_options, bundle) {
      for (const fileName of Object.keys(bundle)) {
        if (fileName.endsWith('.js.map') && fileName !== 'js/main.js.map') {
          delete bundle[fileName]
        }
      }
      for (const chunk of Object.values(bundle)) {
        if (chunk.type === 'chunk' && chunk.fileName !== 'js/main.js' && typeof chunk.code === 'string') {
          chunk.code = chunk.code.replace(/\n\/\/# sourceMappingURL=\S+\.map\s*$/, '')
        }
      }
    },
  }
}

export default defineConfig({
  root: 'src',
  plugins: [sharedHeader(), mainMapOnly()],
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    cssMinify: false,
    modulePreload: { polyfill: false },
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        home: fileURLToPath(new URL('./src/pages/home/index.html', import.meta.url)),
        menu: fileURLToPath(new URL('./src/pages/menu/index.html', import.meta.url)),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'home' || chunkInfo.name === 'menu') {
            return 'pages/[name]/[name].js'
          }
          return 'js/[name].js'
        },
        chunkFileNames: 'js/[name].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names?.[0] ?? assetInfo.name ?? ''
          const ext = name.slice(name.lastIndexOf('.')).toLowerCase()
          if (/\.(png|jpe?g|webp|gif|avif|ico|bmp)$/.test(ext)) return 'assets/images/[name][extname]'
          if (/\.svg$/.test(ext)) return 'assets/icons/[name][extname]'
          if (/\.(mp4|webm|ogg|mov)$/.test(ext)) return 'assets/videos/[name][extname]'
          if (/\.(woff2?|ttf|otf|eot)$/.test(ext)) return 'assets/fonts/[name][extname]'
          if (/\.css$/.test(ext)) {
            const base = name.slice(name.lastIndexOf('/') + 1, -ext.length)
            if (base === 'common') return 'css/main[extname]'
            if (base === 'home' || base === 'menu') return 'pages/[name]/[name][extname]'
            return 'css/[name][extname]'
          }
          if (/\.json$/.test(ext)) return 'data/[name][extname]'
          return 'assets/[name][extname]'
        },
        codeSplitting: {
          groups: [
            {
              name: 'main',
              test: /src[/\\]js[/\\](theme|burgerMenu|scrollLock)\.js$/,
            },
          ],
        },
      },
    },
  },
})