import { expect, test } from '@playwright/test'
import {
  ADMIN,
  MOTIVO_SIN_ADMIN,
  apiAdmin,
  cerrarSesion,
  datosDePrueba,
  fechaEnDias,
  hayAdmin,
  iniciarSesion,
  limpiar,
} from './helpers'

// Recorre los tres casos de uso del trabajo, de punta a punta y por la interfaz:
//   CUU 3 Renovar membresía (admin)  ->  habilita  ->  CUU 1 Reservar turno (cliente)
// y deja el turno con su inscripto para el CUU 2 (registrar asistencia).
test.describe('Del alta del cliente a su reserva', () => {
  test.skip(!hayAdmin, MOTIVO_SIN_ADMIN)

  test('el admin prepara la clase y la membresía, y el cliente reserva su lugar', async ({
    page,
    baseURL,
  }) => {
    const datos = datosDePrueba()
    const clase = `E2E Clase ${datos.dni}`
    // 3 días adelante: cumple la anticipación de 8 horas y entra en la membresía de 30 días
    const fechaTurno = fechaEnDias(3)
    const api = await apiAdmin(baseURL!)

    try {
      await iniciarSesion(page, ADMIN.email, ADMIN.password)
      await expect(page).toHaveURL(/\/admin$/)

      await test.step('el admin crea una clase', async () => {
        await page.goto('/admin/clases')
        await page.getByRole('button', { name: 'Nueva clase' }).click()
        const dialogo = page.getByRole('dialog')
        await dialogo.getByLabel('Nombre').fill(clase)
        await dialogo.getByRole('button', { name: 'Crear' }).click()

        await expect(page.getByRole('heading', { name: clase })).toBeVisible()
      })

      await test.step('el admin da de alta al cliente', async () => {
        await page.goto('/admin/clientes')
        await page.getByRole('button', { name: 'Nuevo Cliente' }).click()
        const dialogo = page.getByRole('dialog')
        await dialogo.getByLabel('DNI').fill(String(datos.dni))
        await dialogo.getByLabel('Nombre').fill(datos.nombre)
        await dialogo.getByLabel('Apellido').fill(datos.apellido)
        await dialogo.getByLabel('Email').fill(datos.email)
        await dialogo.getByRole('button', { name: 'Crear' }).click()

        await expect(page.getByText('Cliente creado')).toBeVisible()
      })

      await test.step('CUU 3: el admin renueva la membresía y el sistema calcula las fechas', async () => {
        await page.getByPlaceholder(/Buscar por nombre/).fill(String(datos.dni))
        await expect(page.getByText('Sin membresía')).toBeVisible()
        await page.getByRole('button', { name: new RegExp(String(datos.dni)) }).click()
        await page.getByRole('button', { name: 'Renovar membresía' }).click()

        const dialogo = page.getByRole('dialog')
        // Todavía no tiene ninguna: empieza hoy y el importe lo carga el admin
        await expect(dialogo.getByText(/Todavía no tiene ninguna membresía/)).toBeVisible()
        await dialogo.getByLabel('Importe').fill('15000')
        await dialogo.getByRole('button', { name: 'Registrar pago' }).click()

        await expect(page.getByText(/renovada correctamente/)).toBeVisible()
        await expect(page.getByText('Activa', { exact: true })).toBeVisible()
      })

      await test.step('el admin crea un turno de esa clase', async () => {
        await page.goto('/admin/turnos')
        await page.getByLabel('Elegir una fecha').fill(fechaTurno)
        await page.getByRole('button', { name: 'Nuevo turno' }).click()

        const dialogo = page.getByRole('dialog')
        await dialogo.getByRole('combobox', { name: 'Clase' }).click()
        await page.getByRole('option', { name: clase }).click()
        await dialogo.getByLabel('Desde').fill('10:00')
        await dialogo.getByLabel('Hasta').fill('11:00')
        await dialogo.getByLabel('Lugares').fill('5')
        await dialogo.getByRole('button', { name: 'Crear' }).click()

        await expect(page.getByText('Turno creado')).toBeVisible()
        await expect(page.getByRole('heading', { name: clase })).toBeVisible()
        await expect(page.getByText('0 de 5 lugares')).toBeVisible()
      })

      await cerrarSesion(page)

      await test.step('CUU 1: el cliente entra con su DNI y reserva un lugar', async () => {
        await iniciarSesion(page, datos.email, String(datos.dni))
        await expect(page).toHaveURL(/\/cliente$/)

        await page.goto('/cliente/reservar-clase')
        await page.getByLabel('Elegir una fecha').fill(fechaTurno)
        const tarjeta = page.locator('.MuiCard-root', {
          has: page.getByRole('heading', { name: clase }),
        })
        await tarjeta.getByRole('button', { name: 'Reservar lugar' }).click()

        await expect(page.getByText(/tu lugar quedó reservado/)).toBeVisible()
        await expect(tarjeta.getByText('Reservado')).toBeVisible()
        await expect(tarjeta.getByText('1 de 5 lugares')).toBeVisible()
      })

      await test.step('la reserva aparece en Mis Clases', async () => {
        await page.goto('/cliente/mis-clases')
        await expect(page.getByRole('heading', { name: 'Próximas' })).toBeVisible()
        await expect(page.getByRole('heading', { name: clase })).toBeVisible()
      })

      await cerrarSesion(page)

      await test.step('el admin ve al cliente anotado en el detalle del turno', async () => {
        await iniciarSesion(page, ADMIN.email, ADMIN.password)
        await expect(page).toHaveURL(/\/admin$/)
        await page.goto('/admin/turnos')
        await page.getByLabel('Elegir una fecha').fill(fechaTurno)
        await expect(page.getByText('1 de 5 lugares')).toBeVisible()

        await page.getByRole('button', { name: 'Inscriptos' }).click()
        const dialogo = page.getByRole('dialog')
        await expect(dialogo.getByText(`${datos.apellido}, ${datos.nombre}`)).toBeVisible()
        await expect(dialogo.getByText(`DNI ${datos.dni}`)).toBeVisible()
      })
    } finally {
      await limpiar(api, { dni: datos.dni, clase, fechaTurno })
      await api.dispose()
    }
  })
})
