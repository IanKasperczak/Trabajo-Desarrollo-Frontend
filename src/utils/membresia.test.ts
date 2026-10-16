import { describe, expect, it } from 'vitest'
import type { Membresia } from '../models/membresia'
import { diasHasta, formatearFecha, membresiaVigente, sumarDias } from './membresia'

const membresia = (estado: Membresia['estado'], fechaVencimiento: string): Membresia => ({
  idMembresia: 1,
  dniCliente: 100,
  fechaPago: '2026-01-01',
  fechaInicio: '2026-01-01',
  fechaVencimiento,
  valor: 100,
  estado,
  cliente: null,
})

describe('formatearFecha', () => {
  it('pasa de AAAA-MM-DD a DD/MM/AAAA sin correr el día', () => {
    expect(formatearFecha('2026-10-01')).toBe('01/10/2026')
  })
})

describe('sumarDias', () => {
  it('suma días cruzando meses y años', () => {
    expect(sumarDias('2026-10-16', 30)).toBe('2026-11-15')
    expect(sumarDias('2026-12-31', 1)).toBe('2027-01-01')
  })

  it('respeta los años bisiestos', () => {
    expect(sumarDias('2028-02-28', 1)).toBe('2028-02-29')
  })
})

describe('diasHasta', () => {
  it('cuenta los días que faltan y da negativo si ya pasó', () => {
    expect(diasHasta('2026-10-20', '2026-10-16')).toBe(4)
    expect(diasHasta('2026-10-16', '2026-10-16')).toBe(0)
    expect(diasHasta('2026-10-10', '2026-10-16')).toBe(-6)
  })
})

describe('membresiaVigente', () => {
  it('prefiere la que está rigiendo hoy sobre una vencida más nueva', () => {
    const vigente = membresiaVigente([
      membresia('Vencida', '2026-12-31'),
      membresia('Activa', '2026-11-01'),
    ])
    expect(vigente?.estado).toBe('Activa')
  })

  it('si no hay vigentes devuelve la que vence más tarde', () => {
    const ultima = membresiaVigente([
      membresia('Vencida', '2026-03-01'),
      membresia('Vencida', '2026-05-01'),
    ])
    expect(ultima?.fechaVencimiento).toBe('2026-05-01')
  })

  it('devuelve null si no hay membresías', () => {
    expect(membresiaVigente([])).toBeNull()
  })
})
