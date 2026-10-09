export interface Cliente {
  dni: number
  nombre: string
  apellido: string
  telefono: string | null
  email: string | null
  estado: boolean
  // Si tiene cuenta para entrar a la app (es opcional)
  tieneCuenta: boolean
  // Si puede entrar a la app (false si no tiene cuenta)
  activo: boolean
  // true mientras siga con la contraseña que le dio el admin (por defecto, su DNI)
  debeCambiarPassword: boolean
}

export interface ClienteInput {
  dni: number
  nombre: string
  apellido: string
  telefono?: string
  // Obligatorio si se le crea la cuenta: es el usuario con el que entra
  email?: string
  // También le crea la cuenta; la contraseña inicial es el DNI
  crearCuenta?: boolean
}

// El DNI no se puede modificar. activo y password solo aplican si tiene cuenta
export interface ClienteUpdate {
  nombre?: string
  apellido?: string
  telefono?: string
  email?: string
  estado?: boolean
  activo?: boolean
  password?: string
}

export interface ClienteFormValues {
  dni: number
  nombre: string
  apellido: string
  telefono: string
  email: string
  // Al editar: vacía significa "no cambiarla"
  password: string
  activo: boolean
  crearCuenta: boolean
}
