import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

// dopo la build copia index.html in 404.html.
// Vercel usa 404.html per gli indirizzi che non esistono (codice 404 vero):
// così si carica comunque il sito e React mostra la pagina "Page not found".
const copy404 = () => ({
  name: 'copy-404',
  closeBundle() {
    const out = resolve(__dirname, 'dist')
    copyFileSync(resolve(out, 'index.html'), resolve(out, '404.html'))
  },
})

export default defineConfig({
  plugins: [react(), copy404()],
})
