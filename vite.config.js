import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  // Pages live in src/pages/ per project architecture
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        home: fileURLToPath(new URL('./src/pages/home/index.html', import.meta.url)),
        menu: fileURLToPath(new URL('./src/pages/menu/index.html', import.meta.url))
      }
    }
  }
})