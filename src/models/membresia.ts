// El backend calcula el estado con las fechas; no se guarda
export type EstadoMembresia = 'Pendiente' | 'Activa' | 'Por vencer' | 'Vencida'

export interface ClienteResumen {
  dni: number
  nombre: string
  apellido: string
  email: string
}

export interface Membresia {
  idMembresia: number
  dniCliente: number
  // Fechas como AAAA-MM-DD
  fechaPago: string
  fechaInicio: string
  fechaVencimiento: string
  valor: number
  estado: EstadoMembresia
  cliente: ClienteResumen | null
}

export interface MembresiaInput {
  dniCliente: number
  fechaPago: string
  fechaInicio: string
  fechaVencimiento: string
  valor: number
}

// El cliente de una membresía no se puede cambiar
export type MembresiaUpdate = Partial<Omit<MembresiaInput, 'dniCliente'>>

export interface MembresiaFormValues {
  dniCliente: number | null
  fechaPago: string
  fechaInicio: string
  fechaVencimiento: string
  // Se edita como texto
  valor: string
}
