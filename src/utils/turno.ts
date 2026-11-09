import type { Strikes } from '../models/cliente'
import type { Membresia } from '../models/membresia'
import type { EstadoInscripcion, Inscripcion, Turno } from '../models/turno'
import { formatearFecha, hoyISO, sumarDias } from './membresia'

// El backend genera los turnos de los próximos 30 días a partir de las plantillas
export const DIAS_ADELANTE = 29
// La inscripción se cierra 8 horas antes del turno (el backend es quien lo hace cumplir)
export const HORAS_ANTICIPACION = 8

export const formatearHora = (hora: string | null): string => (hora ? hora.slice(0, 5) : '—')

export const rangoHorario = (turno: Turno): string =>
  `${formatearHora(turno.horaInicio)} a ${formatearHora(turno.horaFin)}`

// '2026-10-22' -> 'Jueves 22 de octubre' (sin pasar por la zona horaria)
export const etiquetaDia = (fecha: string): string => {
  const [y, m, d] = fecha.split('-').map(Number)
  const texto = new Date(y, m - 1, d).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

export const rangoDeDias = (desde: string, dias: number) => ({
  desde,
  hasta: sumarDias(desde, dias),
})

export const cuposLibres = (turno: Turno): number =>
  Math.max(0, (turno.capacidadMaxima ?? 0) - turno.inscriptos)

export const estaCompleto = (turno: Turno): boolean => cuposLibres(turno) === 0

// La inscripción propia que sigue en pie (el cliente solo recibe las suyas)
export const miInscripcionVigente = (turno: Turno): Inscripcion | undefined =>
  turno.inscripciones?.find((i) => i.estado !== 'cancelada')

// Para reservar hace falta una membresía que cubra el día del turno (el backend lo exige igual)
export const membresiaCubre = (membresias: Membresia[], fecha: string): boolean =>
  membresias.some((m) => m.fechaInicio <= fecha && fecha <= m.fechaVencimiento)

// Hay alguna membresía que todavía no venció (aunque no cubra el día elegido)
export const tieneMembresiaAlDia = (membresias: Membresia[], hoy: string = hoyISO()): boolean =>
  membresias.some((m) => m.fechaVencimiento >= hoy)

// Strikes: con STRIKES_PARA_BLOQUEO ausencias en 30 días no puede reservar por 7 días (lo
// calcula el backend)
export const STRIKES_PARA_BLOQUEO = 3

// Al cliente se le habla de vos; al admin y al profesor, del cliente en tercera persona
export const textoStrikes = (
  { strikes, bloqueadoHasta }: Strikes,
  persona: 'vos' | 'cliente' = 'vos',
): string => {
  const vos = persona === 'vos'
  const tiene = vos ? 'Tenés' : 'Tiene'
  if (bloqueadoHasta) {
    const desde = formatearFecha(sumarDias(bloqueadoHasta, 1))
    return `${tiene} ${STRIKES_PARA_BLOQUEO} ausencias en los últimos 30 días: ${vos ? 'podés' : 'puede'} volver a reservar desde el ${desde}.`
  }
  const ausencias = strikes === 1 ? '1 ausencia' : `${strikes} ausencias`
  return `${tiene} ${ausencias} en los últimos 30 días. Con ${STRIKES_PARA_BLOQUEO} no ${vos ? 'vas' : 'va'} a poder reservar durante 7 días.`
}

// Horas que faltan para que empiece el turno (negativo si ya empezó), en la hora del navegador
export const horasParaInicio = (turno: Turno, ahora: Date = new Date()): number => {
  if (!turno.fecha || !turno.horaInicio) return Number.POSITIVE_INFINITY
  const [y, m, d] = turno.fecha.split('-').map(Number)
  const [hh, mm] = turno.horaInicio.split(':').map(Number)
  const inicio = new Date(y, m - 1, d, hh, mm)
  return (inicio.getTime() - ahora.getTime()) / 3600000
}

export const hoyEsDespuesDe = (fecha: string): boolean => fecha <= hoyISO()

export const ESTADO_LABEL: Record<EstadoInscripcion, string> = {
  activa: 'Inscripto',
  cancelada: 'Cancelada',
  asistio: 'Asistió',
  ausente: 'Ausente',
}

export const ESTADO_COLOR: Record<EstadoInscripcion, 'primary' | 'default' | 'success' | 'error'> = {
  activa: 'primary',
  cancelada: 'default',
  asistio: 'success',
  ausente: 'error',
}

export const estadoDeInscripcion = (inscripcion: Inscripcion): EstadoInscripcion =>
  inscripcion.estado ?? 'activa'
