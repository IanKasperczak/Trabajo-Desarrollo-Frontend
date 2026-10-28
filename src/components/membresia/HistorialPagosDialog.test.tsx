import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import type { Membresia } from '../../models/membresia'
import HistorialPagosDialog from './HistorialPagosDialog'
import MembresiaCard from './MembresiaCard'

const crearMembresia = (idMembresia: number, fechaPago: string): Membresia => ({
  idMembresia,
  dniCliente: 100,
  fechaPago,
  fechaInicio: fechaPago,
  fechaVencimiento: '2026-12-31',
  valor: 10000,
  estado: 'Vencida',
  cliente: { dni: 100, nombre: 'Ana', apellido: 'Gómez', email: 'ana@test.com' },
})

describe('HistorialPagosDialog', () => {
  it('muestra los pagos del cliente del más reciente al más antiguo', () => {
    render(
      <HistorialPagosDialog
        cliente="Ana Gómez"
        membresias={[
          crearMembresia(1, '2026-01-10'),
          crearMembresia(2, '2026-02-20'),
        ]}
        open
        onClose={() => {}}
      />,
    )

    const dialog = screen.getByRole('dialog')
    const pagos = within(dialog).getAllByText(/Pagó el/)

    expect(screen.getByText('Historial de pagos · Ana Gómez')).toBeInTheDocument()
    expect(pagos[0]).toHaveTextContent('20/02/2026')
    expect(pagos[1]).toHaveTextContent('10/01/2026')
    expect(within(dialog).getByText('Período: 20/02/2026 al 31/12/2026')).toBeInTheDocument()
    expect(within(dialog).getByText('Período: 10/01/2026 al 31/12/2026')).toBeInTheDocument()
  })

  it('permite cerrar el historial desde el diálogo', () => {
    const onClose = vi.fn()
    render(
      <HistorialPagosDialog
        cliente="Ana Gómez"
        membresias={[]}
        open
        onClose={onClose}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }))
    expect(onClose).toHaveBeenCalledOnce()
  })
})

describe('MembresiaCard', () => {
  it('permite abrir el historial desde la tarjeta de administración', () => {
    const membresia = crearMembresia(1, '2026-01-10')
    const onViewHistory = vi.fn()
    render(
      <MembresiaCard
        membresia={membresia}
        mostrarCliente
        onViewHistory={onViewHistory}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Historial' }))
    expect(onViewHistory).toHaveBeenCalledWith(membresia)
  })
})
