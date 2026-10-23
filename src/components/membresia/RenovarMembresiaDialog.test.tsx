import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RenovarMembresiaDialog from './RenovarMembresiaDialog'
import { membresiaService } from '../../services/membresiaService'
import type { Membresia, Renovacion } from '../../models/membresia'

vi.mock('../../services/membresiaService', () => ({
  membresiaService: { getRenovacion: vi.fn(), renovar: vi.fn() },
}))

const cliente = { dni: 100, nombre: 'Ana', apellido: 'Gómez' }

const ultima: Membresia = {
  idMembresia: 1,
  dniCliente: 100,
  fechaPago: '2099-12-01',
  fechaInicio: '2099-12-01',
  fechaVencimiento: '2099-12-31',
  valor: 25000,
  estado: 'Activa',
  cliente: null,
}

const conMembresia: Renovacion = {
  ultima,
  fechaPago: '2026-10-22',
  fechaInicio: '2100-01-01',
  fechaVencimiento: '2100-01-31',
  valor: 25000,
}

const sinMembresia: Renovacion = {
  ultima: null,
  fechaPago: '2026-10-22',
  fechaInicio: '2026-10-22',
  fechaVencimiento: '2026-11-21',
  valor: null,
}

const mostrar = (onRenovada = vi.fn()) => {
  render(<RenovarMembresiaDialog cliente={cliente} onClose={() => {}} onRenovada={onRenovada} />)
  return { onRenovada }
}

describe('RenovarMembresiaDialog', () => {
  beforeEach(() => {
    vi.mocked(membresiaService.getRenovacion).mockReset()
    vi.mocked(membresiaService.renovar).mockReset()
  })

  it('muestra las fechas que calculó el sistema y el importe de la última vez', async () => {
    vi.mocked(membresiaService.getRenovacion).mockResolvedValue(conMembresia)
    mostrar()

    expect(await screen.findByText('01/01/2100')).toBeInTheDocument()
    expect(screen.getByText('31/01/2100')).toBeInTheDocument()
    expect(screen.getByText(/día siguiente al vencimiento/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/importe/i)).toHaveValue('25000')
  })

  it('registra el pago con la fecha y el importe y avisa a la pantalla', async () => {
    const nueva = { ...ultima, idMembresia: 2 }
    vi.mocked(membresiaService.getRenovacion).mockResolvedValue(conMembresia)
    vi.mocked(membresiaService.renovar).mockResolvedValue(nueva)
    const { onRenovada } = mostrar()

    await userEvent.click(await screen.findByRole('button', { name: 'Registrar pago' }))

    await waitFor(() => expect(onRenovada).toHaveBeenCalledWith(nueva))
    expect(membresiaService.renovar).toHaveBeenCalledWith(100, {
      fechaPago: '2026-10-22',
      valor: 25000,
    })
  })

  it('la primera vez hay que cargar el importe: el botón queda deshabilitado hasta entonces', async () => {
    vi.mocked(membresiaService.getRenovacion).mockResolvedValue(sinMembresia)
    mostrar()

    const boton = await screen.findByRole('button', { name: 'Registrar pago' })
    expect(screen.getByText(/todavía no tiene ninguna membresía/i)).toBeInTheDocument()
    expect(boton).toBeDisabled()

    await userEvent.type(screen.getByLabelText(/importe/i), '18000')
    expect(boton).toBeEnabled()
  })

  it('rechaza un importe inválido', async () => {
    vi.mocked(membresiaService.getRenovacion).mockResolvedValue(sinMembresia)
    mostrar()

    await userEvent.type(await screen.findByLabelText(/importe/i), 'abc')
    expect(screen.getByText('Ingresá un importe válido')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Registrar pago' })).toBeDisabled()
  })

  it('si falla el registro, muestra el error y no avisa que se renovó', async () => {
    vi.mocked(membresiaService.getRenovacion).mockResolvedValue(conMembresia)
    vi.mocked(membresiaService.renovar).mockRejectedValue(new Error('caída'))
    const { onRenovada } = mostrar()

    await userEvent.click(await screen.findByRole('button', { name: 'Registrar pago' }))

    expect(await screen.findByText(/no se pudo registrar la renovación/i)).toBeInTheDocument()
    expect(onRenovada).not.toHaveBeenCalled()
  })
})
