export type Role = 'administrador' | 'profesor' | 'cliente'

export const roles: { value: Role; label: string }[] = [
  { value: 'administrador', label: 'Administrador' },
  { value: 'profesor', label: 'Profesor' },
  { value: 'cliente', label: 'Cliente' },
]