import { expect, test } from '@playwright/test'
import {
  ADMIN,
  MOTIVO_SIN_ADMIN,
  apiAdmin,
  cerrarSesion,
  crearClienteApi,
  datosDePrueba,
  hayAdmin,
  iniciarSesion,
  limpiar,
} from './helpers'

test.describe('Acceso y roles', () => {
  test('sin sesión, una pantalla protegida manda al login', async ({ page }) => {
    await page.goto('/admin/clientes')
    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole('heading', { name: /Gimnasio Power Trainer/i })).toBeVisible()
  })

  test('con credenciales incorrectas muestra un mensaje y no entra', async ({ page }) => {
    await iniciarSesion(page, 'nadie@test.com', 'una-clave-incorrecta')

    await expect(page.getByRole('alert')).toContainText('Email o contraseña incorrectos')
    await expect(page).toHaveURL(/\/login/)
  })

  test.describe('con una cuenta de administrador', () => {
    test.skip(!hayAdmin, MOTIVO_SIN_ADMIN)

    test('el administrador entra a su panel, ve el menú completo y puede cerrar sesión', async ({
      page,
    }) => {
      await iniciarSesion(page, ADMIN.email, ADMIN.password)

      await expect(page).toHaveURL(/\/admin$/)
      // El menú lateral (el panel también trae accesos rápidos con los mismos nombres)
      const menu = page.getByRole('list').getByRole('link')
      for (const seccion of ['Clientes', 'Profesores', 'Turnos', 'Membresías', 'Usuarios']) {
        await expect(menu.filter({ hasText: seccion }).first()).toBeVisible()
      }

      await cerrarSesion(page)
      // Con la sesión cerrada ya no puede volver al panel
      await page.goto('/admin')
      await expect(page).toHaveURL(/\/login/)
    })

    test('un cliente entra a su pantalla y no puede entrar a las del administrador', async ({
      page,
      baseURL,
    }) => {
      const datos = datosDePrueba()
      const api = await apiAdmin(baseURL!)
      try {
        await crearClienteApi(api, datos)

        // La contraseña inicial de un cliente nuevo es su DNI
        await iniciarSesion(page, datos.email, String(datos.dni))
        await expect(page).toHaveURL(/\/cliente$/)
        await expect(page.getByRole('link', { name: 'Reservar Clase' })).toBeVisible()
        await expect(page.getByRole('link', { name: 'Usuarios' })).toHaveCount(0)

        await page.goto('/admin/clientes')
        await expect(page).toHaveURL(/\/cliente$/)
      } finally {
        await limpiar(api, { dni: datos.dni })
        await api.dispose()
      }
    })
  })
})
