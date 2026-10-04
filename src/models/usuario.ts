import type { Role } from './role'

// Rol tal como lo devuelve el backend
export type RolApi = 'admin' | 'profesor' | 'cliente'

export interface UsuarioApi {
  id: number
  email: string
  rol: RolApi
  dniProfesor: number | null
  debeCambiarPassword: boolean
}

export interface Usuario {
  id: number
  email: string
  rol: Role
  dniProfesor: number | null
  // true mientras siga con la contraseña que le dio el admin (por defecto, su DNI)
  debeCambiarPassword: boolean
}

export interface LoginInput {
  email: string
  password: string
}

export interface CambiarPasswordInput {
  passwordActual: string
  passwordNueva: string
}
