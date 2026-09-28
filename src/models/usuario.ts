import type { Role } from './role'

// Rol tal como lo devuelve el backend
export type RolApi = 'admin' | 'profesor' | 'cliente'

export interface UsuarioApi {
  id: number
  email: string
  rol: RolApi
  dniProfesor: number | null
}

export interface Usuario {
  id: number
  email: string
  rol: Role
  dniProfesor: number | null
}

export interface LoginInput {
  email: string
  password: string
}
