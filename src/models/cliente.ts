export interface Cliente {
  dni: number
  nombre: string
  apellido: string
  telefono: string
  email: string
  // Si puede entrar a la app con su cuenta
  activo: boolean
  // true mientras siga con la contraseña que le dio el admin (por defecto, su DNI)
  debeCambiarPassword: boolean
}

export interface ClienteInput {
  dni: number
  nombre: string
  apellido: string
  telefono: string
  email: string
  // Sin contraseña, la cuenta arranca con el DNI como contraseña inicial
  password?: string
}

// El DNI no se puede modificar; la contraseña solo se manda si se quiere resetear
export type ClienteUpdate = Partial<Omit<ClienteInput, 'dni'>> & { activo?: boolean }

export interface ClienteFormValues extends Omit<ClienteInput, 'password'> {
  password: string
  activo: boolean
}
