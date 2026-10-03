import { isAxiosError } from 'axios'

// Devuelve el mensaje del backend para errores del usuario (400, 403, 404, 409...).
// Para errores del servidor o de red usa el mensaje genérico, sin detalles internos.
export function mensajeDeErrorApi(error: unknown, mensajeGenerico: string): string {
  if (isAxiosError<{ message?: string }>(error)) {
    const status = error.response?.status ?? 0
    const message = error.response?.data?.message
    if (message && status >= 400 && status < 500 && status !== 401) return message
  }
  return mensajeGenerico
}
