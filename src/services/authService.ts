import api from '../api/api'
import type { Role } from '../models/role'
import type { LoginInput, RolApi, Usuario, UsuarioApi } from '../models/usuario'

const rolDesdeApi: Record<RolApi, Role> = {
  admin: 'administrador',
  profesor: 'profesor',
  cliente: 'cliente',
}

const toUsuario = (usuario: UsuarioApi): Usuario => ({
  ...usuario,
  rol: rolDesdeApi[usuario.rol],
})

export const authService = {
  login: async (data: LoginInput): Promise<Usuario> => {
    const response = await api.post<UsuarioApi>('/auth/login', data)
    return toUsuario(response.data)
  },
  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },
  me: async (): Promise<Usuario> => {
    const response = await api.get<UsuarioApi>('/auth/me')
    return toUsuario(response.data)
  },
}
