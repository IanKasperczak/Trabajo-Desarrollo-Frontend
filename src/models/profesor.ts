import type { Especialidad } from './especialidad'

export interface Profesor {
  id: number
  nombre: string
  apellido: string
  dni: string
  email: string
  telefono: string
  especialidades: Especialidad[]
}