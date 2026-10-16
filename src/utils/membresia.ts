import type { EstadoMembresia, Membresia } from '../models/membresia'

// Hoy (AAAA-MM-DD) en la hora local del navegador
export const hoyISO = (): string => {
  const d = new Date()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mes}-${dia}`
}

// Suma días a una fecha AAAA-MM-DD sin pasar por la zona horaria
export const sumarDias = (fecha: string, dias: number): string => {
  const [y, m, d] = fecha.split('-').map(Number)
  const resultado = new Date(Date.UTC(y, m - 1, d + dias))
  return resultado.toISOString().slice(0, 10)
}

// AAAA-MM-DD -> DD/MM/AAAA (sin crear un Date, para que la zona horaria no corra el día)
export const formatearFecha = (fecha: string): string => {
  const [y, m, d] = fecha.split('-')
  return `${d}/${m}/${y}`
}

const formatoPesos = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 2,
})
export const formatearImporte = (valor: number): string => formatoPesos.format(valor)

export const ESTADOS: EstadoMembresia[] = ['Activa', 'Por vencer', 'Vencida', 'Pendiente']

export const colorEstado: Record<EstadoMembresia, 'success' | 'warning' | 'error' | 'default'> = {
  Activa: 'success',
  'Por vencer': 'warning',
  Vencida: 'error',
  Pendiente: 'default',
}

// Días que faltan para el vencimiento (negativo si ya venció)
export const diasHasta = (fecha: string, desde: string = hoyISO()): number => {
  const [y1, m1, d1] = desde.split('-').map(Number)
  const [y2, m2, d2] = fecha.split('-').map(Number)
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000)
}

// La membresía que está rigiendo hoy (activa o por vencer); si no hay, la más reciente
export const membresiaVigente = (membresias: Membresia[]): Membresia | null => {
  const vigentes = membresias.filter((m) => m.estado === 'Activa' || m.estado === 'Por vencer')
  const ordenar = (lista: Membresia[]) =>
    [...lista].sort((a, b) => b.fechaVencimiento.localeCompare(a.fechaVencimiento))
  return ordenar(vigentes)[0] ?? ordenar(membresias)[0] ?? null
}
