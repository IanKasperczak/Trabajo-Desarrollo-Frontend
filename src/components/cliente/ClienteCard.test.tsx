import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ClienteCard from './ClienteCard'
import type { Cliente } from '../../models/cliente'

const cliente: Cliente = {
  dni: 100,
  nombre: 'Ana',
  apellido: 'Gómez',
  telefono: null,
  email: 'ana@test.com',
  estado: true,
  activo: true,
  debeCambiarPassword: false,
}

const mostrar = (datos: Partial<Cliente>, expanded = false) => {
  const onDetail = vi.fn()
  render(
    <ClienteCard
      cliente={{ ...cliente, ...datos }}
      expanded={expanded}
      onToggle={() => {}}
      onDetail={onDetail}
      onEdit={() => {}}
      onDelete={() => {}}
    />,
  )
  return { onDetail }
}

describe('ClienteCard', () => {
  it('muestra nombre, DNI y el estado de la membresía con su vencimiento', () => {
    mostrar({
      membresia: { fechaInicio: '2026-10-01', fechaVencimiento: '2026-12-31', estado: 'Activa' },
    })

    expect(screen.getByText('Ana Gómez')).toBeInTheDocument()
    expect(screen.getByText('DNI: 100')).toBeInTheDocument()
    expect(screen.getByText('Activa')).toBeInTheDocument()
    expect(screen.getByText('Vence 31/12/2026')).toBeInTheDocument()
  })

  it('indica "Sin membresía" si nunca tuvo una', () => {
    mostrar({ membresia: null })
    expect(screen.getByText('Sin membresía')).toBeInTheDocument()
  })

  it('no muestra nada de membresía si el backend no la envió (vista del profesor)', () => {
    mostrar({})
    expect(screen.queryByText('Sin membresía')).not.toBeInTheDocument()
    expect(screen.queryByText('Activa')).not.toBeInTheDocument()
  })

  it('avisa que todavía tiene la contraseña inicial', () => {
    mostrar({ debeCambiarPassword: true })
    expect(screen.getByText('Contraseña inicial')).toBeInTheDocument()
  })

  it('abre el detalle del cliente al tocar "Ver detalle"', async () => {
    const { onDetail } = mostrar({}, true)

    await userEvent.click(screen.getByRole('button', { name: /ver detalle/i }))

    expect(onDetail).toHaveBeenCalledWith(expect.objectContaining({ dni: 100 }))
  })
})
