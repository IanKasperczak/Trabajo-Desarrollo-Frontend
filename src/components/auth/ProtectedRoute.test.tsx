import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import { AuthContext, type AuthContextValue } from '../../context/AuthContext'
import type { Role } from '../../models/role'

const sesion = (rol: Role | null, status: AuthContextValue['status'] = 'authenticated') =>
  ({
    usuario: rol
      ? { id: 1, email: 'x@test.com', rol, dniProfesor: null, debeCambiarPassword: false }
      : null,
    status: rol || status === 'loading' ? status : 'unauthenticated',
    login: async () => {
      throw new Error('no usado')
    },
    logout: async () => {},
    cambiarPassword: async () => {},
  }) as AuthContextValue

const renderizar = (auth: AuthContextValue) =>
  render(
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="administrador">
                <p>Panel de administración</p>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<p>Pantalla de login</p>} />
          <Route path="/cliente" element={<p>Inicio del cliente</p>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )

describe('ProtectedRoute', () => {
  it('deja pasar al rol permitido', () => {
    renderizar(sesion('administrador'))
    expect(screen.getByText('Panel de administración')).toBeInTheDocument()
  })

  it('manda al login si no hay sesión', () => {
    renderizar(sesion(null))
    expect(screen.getByText('Pantalla de login')).toBeInTheDocument()
  })

  it('manda a un cliente a su propio inicio si intenta entrar a /admin', () => {
    renderizar(sesion('cliente'))
    expect(screen.getByText('Inicio del cliente')).toBeInTheDocument()
    expect(screen.queryByText('Panel de administración')).not.toBeInTheDocument()
  })

  it('no muestra el contenido mientras se restaura la sesión', () => {
    renderizar(sesion(null, 'loading'))
    expect(screen.queryByText('Panel de administración')).not.toBeInTheDocument()
    expect(screen.queryByText('Pantalla de login')).not.toBeInTheDocument()
  })
})
