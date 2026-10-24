import { defineConfig, devices } from '@playwright/test'

// Tests end-to-end: un navegador real recorre la app con el backend y la base reales.
//
// Variables (ver docs/README.md y e2e/README.md):
//   E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD  cuenta de administrador (obligatorias)
//   E2E_BASE_URL     URL de la app ya desplegada; si no se define, se levanta Vite en local
//   E2E_API_URL      backend al que Vite reenvía /api (por defecto http://localhost:3000)
//   E2E_PORT         puerto de Vite (por defecto 5173, el que acepta el backend en FRONTEND_ORIGIN)
//   E2E_BROWSER_CHANNEL  por ejemplo "msedge" para usar el Edge instalado en vez de bajar Chromium
const puerto = Number(process.env.E2E_PORT ?? 5173)
const urlExterna = process.env.E2E_BASE_URL
const baseURL = urlExterna ?? `http://localhost:${puerto}`

export default defineConfig({
  testDir: './e2e',
  timeout: 90_000,
  expect: { timeout: 10_000 },
  // Los tests comparten la base de datos: se corren de a uno
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    // El backend calcula "hoy" en hora de Argentina; el navegador tiene que coincidir
    locale: 'es-AR',
    timezoneId: 'America/Argentina/Buenos_Aires',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: process.env.E2E_BROWSER_CHANNEL || undefined },
    },
  ],
  webServer: urlExterna
    ? undefined
    : {
        command: `npm run dev -- --port ${puerto} --strictPort`,
        url: baseURL,
        reuseExistingServer: true,
        timeout: 60_000,
        env: { API_PROXY_TARGET: process.env.E2E_API_URL ?? 'http://localhost:3000' },
      },
})
