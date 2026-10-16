export interface Ejercicio {
  id: number
  idRutina: number
  nombreEjercicio: string
  series: number
  // Texto libre: "12", "10-12", "al fallo", "30 seg"...
  repeticiones: string
  // Segundos de descanso entre series
  descanso: number | null
}

export interface PersonaResumen {
  dni: number
  nombre: string
  apellido: string
}

export interface Rutina {
  idRutina: number
  nombreRutina: string
  diaSemana: string | null
  dniCliente: number
  dniProfesor: number
  ejercicios: Ejercicio[]
  cliente: PersonaResumen | null
  profesor: PersonaResumen | null
}

export type EjercicioInput = Omit<Ejercicio, 'id' | 'idRutina'>

export interface RutinaInput {
  nombreRutina: string
  diaSemana: string | null
  dniCliente: number
  // Solo lo manda el admin: si la crea un profesor, el backend usa el suyo
  dniProfesor?: number
  ejercicios: EjercicioInput[]
}

export type RutinaUpdate = Partial<Omit<RutinaInput, 'ejercicios'>>

// Valores del formulario: los números se editan como texto
export interface EjercicioFormValues {
  // Identifica la fila en el formulario; los ejercicios ya guardados además tienen id
  key: string
  id?: number
  nombreEjercicio: string
  series: string
  repeticiones: string
  descanso: string
}

export interface RutinaFormValues {
  nombreRutina: string
  diaSemana: string
  dniCliente: number | null
  dniProfesor: number | null
  ejercicios: EjercicioFormValues[]
}
