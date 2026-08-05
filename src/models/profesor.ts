export type Nivel = 'principiante' | 'intermedio' | 'avanzado'
export type DiasDisponibles = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes'

export interface Profesor {
  nombre: string
  apellido: string
  dni: string
  email: string
  telefono: string  
}