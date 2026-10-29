import type { Membresia } from './membresia'

// Resultado del control de ingreso: lo calcula el backend a partir del DNI
export interface AccesoCliente {
  cliente: {
    dni: number
    nombre: string
    apellido: string
    activo: boolean
  }
  // La membresía que rige hoy (o la más reciente); null si nunca tuvo una
  membresia: Omit<Membresia, 'cliente'> | null
  puedeEntrar: boolean
  // Por qué no puede entrar; null si puede
  motivo: string | null
}