import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // Envía la cookie httpOnly de sesión en cada request
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// En estas rutas un 401 es una respuesta esperada, no una sesión vencida
const RUTAS_SIN_REDIRECCION = ['/auth/login', '/auth/me']

let onUnauthorized: (() => void) | null = null

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  onUnauthorized = handler
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? ''
    if (error.response?.status === 401 && !RUTAS_SIN_REDIRECCION.includes(url)) {
      onUnauthorized?.()
    }
    return Promise.reject(error)
  },
)

export default api
