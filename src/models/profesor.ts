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
  // Si tiene cuenta para entrar a la app
  tieneCuenta: boolean
}

export type ProfesorInput = Omit<Profesor, 'especialidades' | 'tieneCuenta'>

// Al crear: con crearCuenta también se le crea la cuenta (contraseña inicial: su DNI)
export interface ProfesorCreateInput extends ProfesorInput {
  crearCuenta?: boolean
}

export interface ProfesorFormValues extends ProfesorInput {
  especialidades: Especialidad[]
  crearCuenta: boolean
}