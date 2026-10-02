import type { Especialidad } from './especialidad'

export interface ProfesorEspecialidad {
  idEspecialidad: number
  nombre: string
}

export interface Profesor {
  dni: number
  nombre: string
  apellido: string
  telefono: string
  email: string
  especialidades: ProfesorEspecialidad[]
}

export type ProfesorInput = Omit<Profesor, 'especialidades'>

export interface ProfesorFormValues extends ProfesorInput {
  especialidades: Especialidad[]
}