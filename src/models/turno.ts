export interface TipoClase {
  idClase: number
  nombre: string
  descripcion: string | null
}

export interface TipoClaseInput {
  nombre: string
  descripcion: string
}

export interface PersonaResumen {
  dni: number
  nombre: string
  apellido: string
}

// 'activa' es la inscripción hecha; el profesor la pasa a 'asistio' o 'ausente'; el cliente la cancela
export type EstadoInscripcion = 'activa' | 'cancelada' | 'asistio' | 'ausente'

export interface Inscripcion {
  idInscripcion: number
  idTurno: number
  dniCliente: number
  fechaHoraInscripcion: string | null
  estado: EstadoInscripcion | null
  cliente?: PersonaResumen | null
}

export interface Turno {
  idTurno: number
  idClase: number
  // null = plantilla: se repite todos los días (el backend genera los turnos de los próximos 30)
  fecha: string | null
  // El backend los devuelve como HH:mm:ss
  horaInicio: string | null
  horaFin: string | null
  capacidadMaxima: number | null
  tipoClase: TipoClase | null
  profesores: PersonaResumen[]
  // Para el cliente solo trae su propia inscripción; para admin y profesor, todas
  inscripciones?: Inscripcion[]
  // Inscripciones vigentes (no canceladas): sirve para saber cuántos lugares quedan
  inscriptos: number
}

export interface TurnoInput {
  idClase: number
  fecha: string | null
  horaInicio: string
  horaFin: string
  capacidadMaxima: number
  dniProfesores: number[]
}

export interface TurnoFormValues {
  idClase: number | null
  // 'dia' = un turno en una fecha; 'diario' = plantilla que se repite todos los días
  modalidad: 'dia' | 'diario'
  fecha: string
  horaInicio: string
  horaFin: string
  capacidadMaxima: string
  dniProfesores: number[]
}

export interface FiltroTurnos {
  fecha?: string
  desde?: string
  hasta?: string
}
