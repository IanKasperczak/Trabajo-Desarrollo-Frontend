import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import TurnoCard from './TurnoCard'
import type { Turno } from '../../models/turno'

const turno = (datos: Partial<Turno> = {}): Turno => ({
  idTurno: 1,
  idClase: 1,
  fecha: '2026-10-23',
  horaInicio: '07:00:00',
  horaFin: '08:00:00',
  capacidadMaxima: 10,
  tipoClase: { idClase: 1, nombre: 'Crossfit', descripcion: null },
  profesores: [{ dni: 301, nombre: 'Pablo', apellido: 'Ruiz' }],
  inscriptos: 3,
  ...datos,
})

describe('TurnoCard', () => {
  it('muestra el horario, la clase, el profesor y los lugares', () => {
    render(<TurnoCard turno={turno()} />)

    expect(screen.getByText('Crossfit')).toBeInTheDocument()
    expect(screen.getByText(/07:00/)).toBeInTheDocument()
    expect(screen.getByText('Pablo Ruiz')).toBeInTheDocument()
    expect(screen.getByText('3 de 10 lugares')).toBeInTheDocument()
    expect(screen.getByText('7 libres')).toBeInTheDocument()
  })

  it('avisa cuando el turno está completo', () => {
    render(<TurnoCard turno={turno({ capacidadMaxima: 3, inscriptos: 3 })} />)
    expect(screen.getByText('Completo')).toBeInTheDocument()
  })

  it('indica si no tiene profesor asignado', () => {
    render(<TurnoCard turno={turno({ profesores: [] })} />)
    expect(screen.getByText('Sin profesor asignado')).toBeInTheDocument()
  })

  it('una plantilla muestra "Todos los días" y no habla de lugares ocupados', () => {
    render(<TurnoCard turno={turno({ fecha: null })} mostrarFecha />)

    expect(screen.getByText('Todos los días')).toBeInTheDocument()
    expect(screen.getByText('10 lugares por turno')).toBeInTheDocument()
    expect(screen.queryByText(/de 10 lugares/)).not.toBeInTheDocument()
  })

  it('muestra las acciones que le pasa cada pantalla', () => {
    render(<TurnoCard turno={turno()} acciones={<button>Reservar lugar</button>} />)
    expect(screen.getByRole('button', { name: 'Reservar lugar' })).toBeInTheDocument()
  })
})
