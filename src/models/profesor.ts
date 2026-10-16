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

// Al crear un profesor se crea también su cuenta (contraseña inicial: su DNI)
export type ProfesorInput = Omit<Profesor, 'especialidades'>

export interface ProfesorFormValues extends ProfesorInput {
  especialidades: Especialidad[]
}