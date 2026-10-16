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

// Cuenta vista desde la gestión de usuarios (admin)
export interface CuentaApi extends UsuarioApi {
  activo: boolean
  createdAt: string
}

export interface Cuenta extends Usuario {
  // false: no puede iniciar sesión
  activo: boolean
  createdAt: string
}

// Desde Usuarios solo se crean administradores: profesores y clientes tienen su propia pantalla
export interface NuevoAdminInput {
  email: string
  password: string
}

export interface CuentaUpdate {
  activo?: boolean
  // Contraseña nueva elegida por el admin: el usuario va a tener que cambiarla
  password?: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface CambiarPasswordInput {
  passwordActual: string
  passwordNueva: string
}
