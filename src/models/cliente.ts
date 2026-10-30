import type { EstadoMembresia } from './membresia'

// La membresía en curso (o la próxima, o la última vencida) del cliente
export interface MembresiaResumen {
  fechaInicio: string
  fechaVencimiento: string
  estado: EstadoMembresia
}

// Ausencias a turnos reservados. Con 3 en 30 días no puede reservar por 7 días
export interface Strikes {
  // Ausencias en los últimos 30 días
  strikes: number
  // Último día (inclusive) en que no puede reservar; null si no está bloqueado
  bloqueadoHasta: string | null
}

export interface Cliente {
  dni: number
  nombre: string
  apellido: string
  telefono: string | null
  // También es el usuario con el que entra a la app
  email: string
  estado: boolean
  // Si puede entrar a la app
  activo: boolean
  // true mientras siga con la contraseña que le dio el admin (por defecto, su DNI)
  debeCambiarPassword: boolean
  // Solo la recibe el admin (null si nunca tuvo); el profesor no ve las membresías
  membresia?: MembresiaResumen | null
  // Solo en el detalle de un cliente y en el perfil propio
  strikes?: Strikes
}

export interface ClienteInput {
  dni: number
  nombre: string
  apellido: string
  telefono?: string
  // Es el usuario con el que entra a la app. Al crear el cliente se crea también su cuenta
  // (contraseña inicial: el DNI)
  email: string
}

// El DNI no se puede modificar
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
}
