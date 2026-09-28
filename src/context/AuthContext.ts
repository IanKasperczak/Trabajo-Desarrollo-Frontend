import { createContext } from 'react'
import type { LoginInput, Usuario } from '../models/usuario'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export interface AuthContextValue {
  usuario: Usuario | null
  status: AuthStatus
  login: (data: LoginInput) => Promise<Usuario>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
