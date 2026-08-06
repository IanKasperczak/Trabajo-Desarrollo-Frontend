export interface Especialidad {
  id: number
  nombre: string
}

export type EspecialidadInput = Pick<Especialidad, 'nombre'>