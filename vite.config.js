import { defineConfig } from 'vite'
import { resolve } from 'path'
import { readdirSync, statSync } from 'fs'

function findHtmlFiles(dir) {
  return readdirSync(dir).flatMap(entry => {
    const fullPath = resolve(dir, entry)
    if (statSync(fullPath).isDirectory()) return findHtmlFiles(fullPath)
    if (entry.endsWith('.html')) return [fullPath]
    return []
  })
}

const srcDir = resolve(import.meta.dirname, 'src')

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: Object.fromEntries(
        findHtmlFiles(srcDir).map(file => [
          file.slice(srcDir.length + 1).replace(/\.html$/, '').replace(/\\/g, '/'),
          file
        ])
      )
    }
  }
})
