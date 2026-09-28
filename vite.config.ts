import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')

  return {
    plugins: [react()],
    build: {
      chunkSizeWarningLimit: 700,
    },
    server: {
      // El front le pide todo a su propio origen (/api) y Vite lo reenvía al backend:
      // así la cookie de sesión es del mismo sitio y ningún navegador la bloquea
      proxy: {
        '/api': {
          target: env.API_PROXY_TARGET || 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
  }
})
