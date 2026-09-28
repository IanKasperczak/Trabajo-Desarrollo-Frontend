import { useState } from 'react'
import { Button, Stack, Tooltip, Typography, useMediaQuery } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import type { Theme } from '@mui/material'
import { useAuth } from '../../hooks/useAuth'
import { roles } from '../../models/role'

function UserMenu() {
  const { usuario, logout } = useAuth()
  const showDetails = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))
  const [loggingOut, setLoggingOut] = useState(false)

  if (!usuario) return null

  const rolLabel = roles.find((r) => r.value === usuario.rol)?.label ?? usuario.rol

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logout()
    } finally {
      setLoggingOut(false)
    }
  }

  const button = (
    <Button
      size="small"
      onClick={handleLogout}
      disabled={loggingOut}
      startIcon={<LogoutIcon />}
      aria-label="Cerrar sesión"
      sx={{
        minWidth: 36,
        px: 1,
        color: 'rgba(255, 255, 255, 0.85)',
        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
      }}
    >
      {showDetails ? 'Cerrar sesión' : ''}
    </Button>
  )

  return (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
      {showDetails && (
        <Stack sx={{ minWidth: 0, textAlign: 'right' }}>
          <Typography variant="body2" noWrap sx={{ color: '#FFFFFF', maxWidth: 220 }}>
            {usuario.email}
          </Typography>
          <Typography variant="caption" sx={{ color: '#FFC107' }}>
            {rolLabel}
          </Typography>
        </Stack>
      )}
      {showDetails ? (
        button
      ) : (
        <Tooltip title="Cerrar sesión">
          {/* span: Tooltip no puede escuchar eventos de un botón deshabilitado */}
          <span>{button}</span>
        </Tooltip>
      )}
    </Stack>
  )
}

export default UserMenu
