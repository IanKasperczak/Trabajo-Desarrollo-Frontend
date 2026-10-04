import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Card, Typography } from '@mui/material'
import LockResetIcon from '@mui/icons-material/LockReset'
import { useAuth } from '../../../hooks/useAuth'
import { roleBase } from '../../../utils/navigation'

// Acceso rápido a Configuración mientras el usuario siga con la contraseña que le dio el admin.
// No se puede cerrar: desaparece solo cuando elige su propia contraseña
function AvisoPasswordInicial() {
  const { usuario } = useAuth()
  if (!usuario?.debeCambiarPassword) return null

  return (
    <Card
      variant="outlined"
      role="alert"
      sx={{
        mb: 2,
        p: 2,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: 2,
        borderLeft: 6,
        borderColor: 'warning.main',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flexGrow: 1 }}>
        <LockResetIcon color="warning" sx={{ mt: 0.25 }} />
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Elegí tu propia contraseña
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Todavía usás la contraseña que te dio el gimnasio (si no te dijeron otra, es tu DNI).
          </Typography>
        </Box>
      </Box>
      <Button
        component={RouterLink}
        to={`${roleBase[usuario.rol]}/configuracion`}
        variant="contained"
        sx={{ whiteSpace: 'nowrap' }}
      >
        Cambiar contraseña
      </Button>
    </Card>
  )
}

export default AvisoPasswordInicial
