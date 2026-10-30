import { describe, expect, it } from 'vitest'
import type { Membresia } from '../models/membresia'
import type { Inscripcion, Turno } from '../models/turno'
import {
  cuposLibres,
  estaCompleto,
  etiquetaDia,
  formatearHora,
  horasParaInicio,
  membresiaCubre,
  miInscripcionVigente,
  textoStrikes,
  tieneMembresiaAlDia,
} from './turno'

const turno = (datos: Partial<Turno> = {}): Turno => ({
  idTurno: 1,
  idClase: 1,
  fecha: '2026-10-23',
  horaInicio: '10:00:00',
  horaFin: '11:00:00',
  capacidadMaxima: 10,
  tipoClase: null,
  profesores: [],
  inscriptos: 0,
  ...datos,
})

const inscripcion = (estado: Inscripcion['estado']): Inscripcion => ({
  idInscripcion: 1,
  idTurno: 1,
  dniCliente: 100,
  fechaHoraInscripcion: null,
  estado,
})

describe('formatearHora', () => {
  it('recorta los segundos', () => {
    expect(formatearHora('07:30:00')).toBe('07:30')
  })

  it('muestra un guion si no hay hora', () => {
    expect(formatearHora(null)).toBe('—')
  })
})

describe('etiquetaDia', () => {
  it('escribe el día completo en español con la inicial en mayúscula', () => {
    expect(etiquetaDia('2026-10-22')).toBe('Jueves, 22 de octubre')
  })
})

describe('cupos', () => {
  it('calcula los lugares libres', () => {
    expect(cuposLibres(turno({ inscriptos: 4 }))).toBe(6)
  })

  it('nunca da negativo y marca el turno completo', () => {
    const lleno = turno({ capacidadMaxima: 2, inscriptos: 3 })
    expect(cuposLibres(lleno)).toBe(0)
    expect(estaCompleto(lleno)).toBe(true)
    expect(estaCompleto(turno({ inscriptos: 9 }))).toBe(false)
  })
})

describe('miInscripcionVigente', () => {
  it('ignora las canceladas', () => {
    expect(miInscripcionVigente(turno({ inscripciones: [inscripcion('cancelada')] }))).toBeUndefined()
  })

  it('devuelve la que sigue en pie (activa, asistió o ausente)', () => {
    const vigente = inscripcion('activa')
    expect(
      miInscripcionVigente(turno({ inscripciones: [inscripcion('cancelada'), vigente] })),
    ).toBe(vigente)
  })

  it('sin inscripciones no hay nada', () => {
    expect(miInscripcionVigente(turno())).toBeUndefined()
  })
})

describe('horasParaInicio', () => {
  const ahora = new Date(2026, 9, 22, 12, 0)

  it('cuenta las horas que faltan', () => {
    expect(horasParaInicio(turno({ fecha: '2026-10-23', horaInicio: '10:00:00' }), ahora)).toBe(22)
  })

  it('da negativo si el turno ya empezó', () => {
    expect(horasParaInicio(turno({ fecha: '2026-10-22', horaInicio: '07:00:00' }), ahora)).toBe(-5)
  })

  it('una plantilla (sin fecha) no tiene inicio', () => {
    expect(horasParaInicio(turno({ fecha: null }), ahora)).toBe(Number.POSITIVE_INFINITY)
  })
})

const membresia = (fechaInicio: string, fechaVencimiento: string): Membresia => ({
  idMembresia: 1,
  dniCliente: 100,
  fechaPago: fechaInicio,
  fechaInicio,
  fechaVencimiento,
  valor: 100,
  estado: 'Activa',
  cliente: null,
})

describe('membresiaCubre', () => {
  const lista = [membresia('2026-10-01', '2026-10-31')]

  it('cubre los días entre el inicio y el vencimiento, incluidos los extremos', () => {
    expect(membresiaCubre(lista, '2026-10-01')).toBe(true)
    expect(membresiaCubre(lista, '2026-10-15')).toBe(true)
    expect(membresiaCubre(lista, '2026-10-31')).toBe(true)
  })

  it('no cubre antes del inicio ni después del vencimiento', () => {
    expect(membresiaCubre(lista, '2026-09-30')).toBe(false)
    expect(membresiaCubre(lista, '2026-11-01')).toBe(false)
  })

  it('sin membresías no cubre nada', () => {
    expect(membresiaCubre([], '2026-10-15')).toBe(false)
  })
})

describe('tieneMembresiaAlDia', () => {
  it('es verdadero mientras alguna no haya vencido', () => {
    expect(tieneMembresiaAlDia([membresia('2026-10-01', '2026-10-31')], '2026-10-31')).toBe(true)
  })

  it('es falso si todas vencieron o no hay ninguna', () => {
    expect(tieneMembresiaAlDia([membresia('2026-09-01', '2026-09-30')], '2026-10-01')).toBe(false)
    expect(tieneMembresiaAlDia([], '2026-10-01')).toBe(false)
  })
})

describe('textoStrikes', () => {
  it('avisa cuántas ausencias tiene mientras no está bloqueado', () => {
    expect(textoStrikes({ strikes: 1, bloqueadoHasta: null })).toBe(
      'Tenés 1 ausencia en los últimos 30 días. Con 3 no vas a poder reservar durante 7 días.',
    )
  })

  it('con el bloqueo dice desde qué día puede volver a reservar', () => {
    expect(textoStrikes({ strikes: 3, bloqueadoHasta: '2026-11-04' })).toBe(
      'Tenés 3 ausencias en los últimos 30 días: podés volver a reservar desde el 05/11/2026.',
    )
  })

  it('al admin y al profesor les habla del cliente', () => {
    expect(textoStrikes({ strikes: 3, bloqueadoHasta: '2026-11-04' }, 'cliente')).toBe(
      'Tiene 3 ausencias en los últimos 30 días: puede volver a reservar desde el 05/11/2026.',
    )
  })
})
