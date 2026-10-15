export const DIAS_SEMANA = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
] as const

// Las rutinas sin día (o con un día escrito distinto) van al final
export function ordenDia(dia: string | null): number {
  const index = DIAS_SEMANA.findIndex((d) => d.toLowerCase() === dia?.trim().toLowerCase())
  return index === -1 ? DIAS_SEMANA.length : index
}
