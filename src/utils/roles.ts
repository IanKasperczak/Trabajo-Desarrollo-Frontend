import type { Role } from '../models/role'
import type { RolApi } from '../models/usuario'

// El backend llama "admin" a lo que en el front es "administrador"
export const rolDesdeApi: Record<RolApi, Role> = {
  admin: 'administrador',
  profesor: 'profesor',
  cliente: 'cliente',
}
