import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { ColorModeContext } from './ColorModeContext'
import type { PreferenciaTema } from './ColorModeContext'
import { crearTema } from '../styles/theme'

const STORAGE_KEY = 'power-trainer:tema'
const CONSULTA_OSCURO = '(prefers-color-scheme: dark)'

const esPreferencia = (valor: unknown): valor is PreferenciaTema =>
  valor === 'claro' || valor === 'oscuro' || valor === 'sistema'

// El almacenamiento puede no estar disponible (modo privado, datos bloqueados): se ignora
const leerPreferencia = (): PreferenciaTema => {
  try {
    const guardada = localStorage.getItem(STORAGE_KEY)
    if (esPreferencia(guardada)) return guardada
  } catch {
    // sin almacenamiento: usa el valor por defecto
  }
  return 'claro'
}

const sistemaEsOscuro = () =>
  typeof window.matchMedia === 'function' && window.matchMedia(CONSULTA_OSCURO).matches

// Aplica el tema elegido (claro, oscuro o el del dispositivo) a toda la app
function ColorModeProvider({ children }: { children: ReactNode }) {
  const [preferencia, setPreferenciaState] = useState<PreferenciaTema>(leerPreferencia)
  const [oscuroDelSistema, setOscuroDelSistema] = useState(sistemaEsOscuro)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const consulta = window.matchMedia(CONSULTA_OSCURO)
    const alCambiar = (evento: MediaQueryListEvent) => setOscuroDelSistema(evento.matches)
    consulta.addEventListener('change', alCambiar)
    return () => consulta.removeEventListener('change', alCambiar)
  }, [])

  const setPreferencia = useCallback((nueva: PreferenciaTema) => {
    setPreferenciaState(nueva)
    try {
      localStorage.setItem(STORAGE_KEY, nueva)
    } catch {
      // se aplica igual en esta sesión
    }
  }, [])

  const oscuro = preferencia === 'sistema' ? oscuroDelSistema : preferencia === 'oscuro'
  const modo = oscuro ? 'dark' : 'light'
  const tema = useMemo(() => crearTema(modo), [modo])
  const valor = useMemo(() => ({ preferencia, setPreferencia }), [preferencia, setPreferencia])

  return (
    <ColorModeContext.Provider value={valor}>
      <ThemeProvider theme={tema}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default ColorModeProvider
