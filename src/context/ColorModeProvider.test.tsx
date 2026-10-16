import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useTheme } from '@mui/material/styles'
import ColorModeProvider from './ColorModeProvider'
import { useColorMode } from '../hooks/useColorMode'

const CLAVE = 'power-trainer:tema'

// Muestra el modo que quedó aplicado y deja elegir uno
function Sonda() {
  const { preferencia, setPreferencia } = useColorMode()
  const modo = useTheme().palette.mode
  return (
    <>
      <p>
        preferencia: {preferencia} / modo: {modo}
      </p>
      <button onClick={() => setPreferencia('oscuro')}>oscuro</button>
      <button onClick={() => setPreferencia('claro')}>claro</button>
    </>
  )
}

const mostrar = () =>
  render(
    <ColorModeProvider>
      <Sonda />
    </ColorModeProvider>,
  )

describe('ColorModeProvider', () => {
  beforeEach(() => localStorage.clear())

  it('arranca en claro si no hay nada guardado', () => {
    mostrar()
    expect(screen.getByText('preferencia: claro / modo: light')).toBeInTheDocument()
  })

  it('aplica y guarda el modo oscuro', async () => {
    mostrar()
    await userEvent.click(screen.getByRole('button', { name: 'oscuro' }))

    expect(screen.getByText('preferencia: oscuro / modo: dark')).toBeInTheDocument()
    expect(localStorage.getItem(CLAVE)).toBe('oscuro')
  })

  it('recuerda la elección guardada al volver a abrir la app', () => {
    localStorage.setItem(CLAVE, 'oscuro')
    mostrar()
    expect(screen.getByText('preferencia: oscuro / modo: dark')).toBeInTheDocument()
  })

  it('ignora un valor guardado que no es válido', () => {
    localStorage.setItem(CLAVE, 'violeta')
    mostrar()
    expect(screen.getByText('preferencia: claro / modo: light')).toBeInTheDocument()
  })
})
