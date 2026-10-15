import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      // "@/..." apunta a src/ para evitar imports relativos largos (../../..)
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    // El build SSR (solo para pre-renderizar) empaqueta todas las dependencias
    ssr: { noExternal: true },
    build: {
      // El build SSR solo genera el HTML: no necesita copiar /public (imágenes, CV...)
      copyPublicDir: !isSsrBuild,
      rolldownOptions: {
        output: {
          // Separa las librerías en archivos propios: el navegador las descarga en paralelo
          // y las mantiene en caché aunque cambie el código de la página
          codeSplitting: {
            groups: [
              { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
              { name: 'motion', test: /node_modules[\\/](motion|framer-motion|motion-dom|motion-utils)[\\/]/ },
              { name: 'forms', test: /node_modules[\\/](zod|react-hook-form|@hookform)[\\/]/ },
            ],
          },
        },
      },
    },
    server: {
      port: 5173,
      // En desarrollo, las peticiones a /api se redirigen al backend local
      proxy: {
        '/api': {
          target: env.DEV_API_PROXY_TARGET || 'http://localhost:4000',
          changeOrigin: true,
        },
      },
    },
  }
})
