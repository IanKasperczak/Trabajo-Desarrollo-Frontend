export type EstadoActividad = 'inactivo' | 'enfermedad' | 'constancia'
export type NivelActividad = 'alto' | 'medio' | 'bajo'

export interface Cliente {
  id: number
  nombre: string
  apellido: string
  dni: string
  email: string
  telefono: string
  fechaNacimiento: string
  direccion: string
  sexo: 'masculino' | 'femenino' | 'otro'
  estado: EstadoActividad
  nivelActividad: NivelActividad
  activo: boolean
}