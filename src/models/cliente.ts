export interface Cliente {
  dni: number
  nombre: string
  apellido: string
  telefono: string
  email: string
  // Si puede entrar a la app con su cuenta
  activo: boolean
}

export interface ClienteInput {
  dni: number
  nombre: string
  apellido: string
  telefono: string
  email: string
  password: string
}

// El DNI no se puede modificar; la contraseña solo se manda si se quiere resetear
export type ClienteUpdate = Partial<Omit<ClienteInput, 'dni'>> & { activo?: boolean }

export interface ClienteFormValues extends ClienteInput {
  activo: boolean
}
