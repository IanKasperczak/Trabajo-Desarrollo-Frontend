import { expect, request } from '@playwright/test'
import type { APIRequestContext, Page } from '@playwright/test'

export const ADMIN = {
  email: process.env.E2E_ADMIN_EMAIL ?? '',
  password: process.env.E2E_ADMIN_PASSWORD ?? '',
}
export const hayAdmin = Boolean(ADMIN.email && ADMIN.password)
export const MOTIVO_SIN_ADMIN =
  'Definí E2E_ADMIN_EMAIL y E2E_ADMIN_PASSWORD (una cuenta de administrador) para correr los tests e2e'

// Fecha (AAAA-MM-DD) de hoy más N días, en la hora de Argentina como el backend
export const fechaEnDias = (dias: number): string => {
  const hoy = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' })
  const [y, m, d] = hoy.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d + dias)).toISOString().slice(0, 10)
}

// Datos únicos para cada corrida, así los tests no chocan con lo que ya hay en la base
export const datosDePrueba = () => {
  const dni = 80_000_000 + Math.floor(Math.random() * 9_000_000)
  return { dni, nombre: 'E2E', apellido: `Prueba${dni}`, email: `e2e.${dni}@test.com` }
}

export async function iniciarSesion(page: Page, email: string, password: string) {
  await page.goto('/login')
  await page.locator('input[name="email"]').fill(email)
  await page.locator('input[name="password"]').fill(password)
  await page.getByRole('button', { name: 'Ingresar' }).click()
}

export async function cerrarSesion(page: Page) {
  await page.getByRole('button', { name: 'Cerrar sesión' }).click()
  await expect(page).toHaveURL(/\/login/)
}

// Cliente HTTP ya logueado como admin: sirve para preparar datos y para limpiar al terminar
export async function apiAdmin(baseURL: string): Promise<APIRequestContext> {
  const api = await request.newContext({ baseURL })
  const res = await api.post('/api/auth/login', {
    data: { email: ADMIN.email, password: ADMIN.password },
  })
  if (!res.ok()) throw new Error(`No se pudo iniciar sesión como admin (${res.status()})`)
  return api
}

export async function crearClienteApi(
  api: APIRequestContext,
  cliente: { dni: number; nombre: string; apellido: string; email: string },
) {
  const res = await api.post('/api/clientes', { data: cliente })
  if (!res.ok()) throw new Error(`No se pudo crear el cliente de prueba (${res.status()})`)
}

// Borra lo que creó la prueba. El cliente se borra primero: se lleva sus membresías, su cuenta
// y sus inscripciones, y después ya se pueden borrar el turno y la clase. Si algo falla no rompe
// la prueba: solo avisa por consola
export async function limpiar(
  api: APIRequestContext,
  { dni, clase, fechaTurno }: { dni?: number; clase?: string; fechaTurno?: string },
) {
  const intentar = async (descripcion: string, accion: () => Promise<unknown>) => {
    try {
      await accion()
    } catch (error) {
      console.warn(`Limpieza: no se pudo ${descripcion}`, error)
    }
  }

  if (dni) await intentar('borrar el cliente', () => api.delete(`/api/clientes/${dni}`))

  if (clase) {
    if (fechaTurno) {
      await intentar('borrar los turnos', async () => {
        const turnos = (await (await api.get(`/api/turnos?fecha=${fechaTurno}`)).json()) as {
          idTurno: number
          tipoClase: { nombre: string } | null
        }[]
        for (const turno of turnos.filter((t) => t.tipoClase?.nombre === clase)) {
          await api.delete(`/api/turnos/${turno.idTurno}`)
        }
      })
    }
    await intentar('borrar la clase', async () => {
      const tipos = (await (await api.get('/api/turnos/tipos-clase')).json()) as {
        idClase: number
        nombre: string
      }[]
      for (const tipo of tipos.filter((t) => t.nombre === clase)) {
        await api.delete(`/api/turnos/tipos-clase/${tipo.idClase}`)
      }
    })
  }
}
