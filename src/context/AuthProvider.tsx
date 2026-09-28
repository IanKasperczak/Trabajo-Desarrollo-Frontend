import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { setUnauthorizedHandler } from '../api/api'
import { authService } from '../services/authService'
import type { LoginInput, Usuario } from '../models/usuario'
import { AuthContext } from './AuthContext'
import type { AuthStatus } from './AuthContext'

interface AuthProviderProps {
  children: ReactNode
}

function AuthProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  const clearSession = useCallback(() => {
    setUsuario(null)
    setStatus('unauthenticated')
  }, [])

  // La cookie es httpOnly: la única forma de saber si hay sesión es preguntarle al backend
  useEffect(() => {
    let cancelled = false
    authService
      .me()
      .then((data) => {
        if (cancelled) return
        setUsuario(data)
        setStatus('authenticated')
      })
      .catch(() => {
        if (!cancelled) clearSession()
      })
    return () => {
      cancelled = true
    }
  }, [clearSession])

  // Cualquier 401 posterior (sesión vencida o revocada) cierra la sesión en el front
  useEffect(() => {
    setUnauthorizedHandler(clearSession)
    return () => setUnauthorizedHandler(null)
  }, [clearSession])

  const login = useCallback(async (data: LoginInput) => {
    const logged = await authService.login(data)
    setUsuario(logged)
    setStatus('authenticated')
    return logged
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      clearSession()
    }
  }, [clearSession])

  const value = useMemo(
    () => ({ usuario, status, login, logout }),
    [usuario, status, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
