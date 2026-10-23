# Documentación – Frontend

Frontend de **Power Trainer** (React 18 + Vite + TypeScript + MUI). Es una de las dos partes del proyecto; la otra es el [backend](https://github.com/Campesianoo/Trabajo-Desarrollo).

La documentación completa (instalación de ambas partes, arquitectura, API, decisiones de diseño, seguimiento, deploy) está en el repositorio del backend: **[docs del proyecto](https://github.com/Campesianoo/Trabajo-Desarrollo/blob/main/docs/README.md)**.

## Instalación rápida

```bash
npm install
cp .env.example .env    # completar API_PROXY_TARGET con la URL del backend
npm run dev             # http://localhost:5173
```

Necesita el backend levantado y un usuario para entrar (ver [instalación](https://github.com/Campesianoo/Trabajo-Desarrollo/blob/main/docs/instalacion.md)).

La app no llama al backend directo: pide todo a `/api` en su propio origen y Vite (en desarrollo) o Vercel (en producción, `vercel.json`) lo reenvían. Así la cookie de sesión es del mismo sitio.

## Scripts

| Comando | Qué hace |
|:-|:-|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Chequeo de tipos + build de producción |
| `npm run lint` | ESLint |
| `npm test` | Tests (Vitest + Testing Library) |

## Estructura

| Carpeta | Contenido |
|:-|:-|
| `src/pages` | Una carpeta por pantalla |
| `src/components` | Componentes por dominio (`cliente`, `membresia`, `rutina`, `auth`, `layout`, `ui`) |
| `src/services` | Una función por endpoint (axios con `withCredentials`) |
| `src/models` | Tipos de lo que devuelve la API |
| `src/context`, `src/hooks` | Sesión (`AuthProvider`, `useAuth`) y carga de datos (`useAsyncData`) |
| `src/routes` | Rutas por rol, protegidas con `ProtectedRoute` |
| `src/utils` | Formatos, navegación por rol, validaciones de formularios |

## Tests

46 tests en 7 archivos (utilidades de membresía y de turnos, `ProtectedRoute`, `ClienteCard`, `TurnoCard`, el diálogo de renovación y el selector de tema). Detalle y evidencia en [tests](https://github.com/Campesianoo/Trabajo-Desarrollo/blob/main/docs/tests.md).

## Pull requests

Listados en [seguimiento](https://github.com/Campesianoo/Trabajo-Desarrollo/blob/main/docs/seguimiento.md#pull-requests).
