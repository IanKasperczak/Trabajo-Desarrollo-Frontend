import { useContext } from 'react'
import { ColorModeContext } from '../context/ColorModeContext'

export function useColorMode() {
  const context = useContext(ColorModeContext)
  if (!context) throw new Error('useColorMode debe usarse dentro de <ColorModeProvider>')
  return context
}
