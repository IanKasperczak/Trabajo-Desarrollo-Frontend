import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { roleBase } from '../../utils/navigation'
import FullPageLoader from './FullPageLoader'

function HomeRedirect() {
  const { usuario, status } = useAuth()

  if (status === 'loading') return <FullPageLoader />
  return <Navigate to={usuario ? roleBase[usuario.rol] : '/login'} replace />
}

export default HomeRedirect
