# Tests end-to-end

Un navegador real (Playwright) recorre la app contra el backend y la base de datos reales. Detalle y evidencia en [docs/tests](https://github.com/Campesianoo/Trabajo-Desarrollo/blob/main/docs/tests.md#test-end-to-end-frontend).

## Cómo correrlos

1. Tener el backend corriendo con una base PostgreSQL (ver [instalación](https://github.com/Campesianoo/Trabajo-Desarrollo/blob/main/docs/instalacion.md)) y una cuenta de administrador (`pnpm run create-admin`).
2. En el frontend, una sola vez, instalar el navegador de prueba: `npx playwright install chromium` (o usar uno ya instalado con `E2E_BROWSER_CHANNEL=msedge`).
3. Correr los tests con las credenciales del admin:

```bash
# Linux / macOS
E2E_ADMIN_EMAIL=admin@correo.com E2E_ADMIN_PASSWORD=la-clave npm run test:e2e

# Windows (PowerShell)
$env:E2E_ADMIN_EMAIL = "admin@correo.com"; $env:E2E_ADMIN_PASSWORD = "la-clave"; npm run test:e2e
```

Levanta solo el frontend (Vite) y lo conecta al backend de `E2E_API_URL` (por defecto `http://localhost:3000`). Para probar una app **ya desplegada** se define `E2E_BASE_URL` con su dirección y no se levanta nada local. Las credenciales nunca se guardan en el repositorio.

## Variables

| Variable | Para qué |
|:-|:-|
| `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD` | Cuenta de administrador (obligatorias; sin ellas los tests que la necesitan se saltean) |
| `E2E_BASE_URL` | Dirección de una app ya desplegada. Si no se define, se levanta Vite en local |
| `E2E_API_URL` | Backend al que Vite reenvía `/api` (por defecto `http://localhost:3000`) |
| `E2E_PORT` | Puerto de Vite (por defecto 5173, el que el backend acepta en `FRONTEND_ORIGIN`) |
| `E2E_BROWSER_CHANNEL` | Por ejemplo `msedge` o `chrome` para usar un navegador ya instalado |

## Qué hay

- `acceso.spec.ts`: login, rutas protegidas y que un cliente no entre a las pantallas del administrador.
- `reserva.spec.ts`: el recorrido de los casos de uso Renovar membresía y Reservar turno, de punta a punta.
- `helpers.ts`: inicio de sesión, datos únicos por corrida y limpieza.

Cada corrida crea sus propios datos y los borra al terminar. Si una prueba falla, `npx playwright show-report` abre el reporte con capturas y el paso a paso.
