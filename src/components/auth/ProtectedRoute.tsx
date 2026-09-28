import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import type { Role } from '../../models/role'
import { roleBase } from '../../utils/navigation'
import FullPageLoader from './FullPageLoader'

interface ProtectedRouteProps {
  allowedRole: Role
  children: ReactNode
}

// Solo controla qué se muestra: la protección real de los datos la hace el backend
function ProtectedRoute({ allowedRole, children }: ProtectedRouteProps) {
  const { usuario, status } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <FullPageLoader />

  if (!usuario) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (usuario.rol !== allowedRole) {
    return <Navigate to={roleBase[usuario.rol]} replace />
  }

  return children
}

export default ProtectedRoute
