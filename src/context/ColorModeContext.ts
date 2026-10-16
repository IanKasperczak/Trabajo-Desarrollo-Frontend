import { createContext } from 'react'

// 'sistema' sigue la preferencia del dispositivo
export type PreferenciaTema = 'claro' | 'oscuro' | 'sistema'

export interface ColorModeContextValue {
  preferencia: PreferenciaTema
  setPreferencia: (preferencia: PreferenciaTema) => void
}

export const ColorModeContext = createContext<ColorModeContextValue | null>(null)
