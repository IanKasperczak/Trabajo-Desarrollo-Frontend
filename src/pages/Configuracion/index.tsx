import { useState } from 'react'
import { Alert, Box, Snackbar, Stack, Typography } from '@mui/material'
import SectionCard from '../../components/dashboard/common/SectionCard'
import CambiarPasswordForm from '../../components/auth/CambiarPasswordForm'
import { useAuth } from '../../hooks/useAuth'
import { roles } from '../../models/role'
import type { CambiarPasswordInput } from '../../models/usuario'
import { mensajeDeErrorApi } from '../../utils/apiError'

type SnackbarState = { message: string; severity: 'success' | 'error' } | null

// Pantalla común a los tres roles
function Configuracion() {
  const { usuario, cambiarPassword } = useAuth()
  const [snackbar, setSnackbar] = useState<SnackbarState>(null)

  if (!usuario) return null
  const rolLabel = roles.find((r) => r.value === usuario.rol)?.label ?? usuario.rol

  const handleCambiarPassword = async (data: CambiarPasswordInput) => {
    try {
      await cambiarPassword(data)
      setSnackbar({ message: 'Contraseña actualizada correctamente.', severity: 'success' })
    } catch (err) {
      setSnackbar({
        message: mensajeDeErrorApi(err, 'No se pudo cambiar la contraseña. Intentá nuevamente.'),
        severity: 'error',
      })
      throw err
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" component="h1">
          Configuración
        </Typography>
        <Box sx={{ width: 56, height: 4, bgcolor: 'primary.main', borderRadius: 2, mt: 0.5 }} />
      </Box>

      <Stack spacing={2} sx={{ maxWidth: 560 }}>
        <SectionCard title="Tu cuenta">
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
              {usuario.email}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ pt: 1 }}>
              Rol
            </Typography>
            <Typography variant="body1">{rolLabel}</Typography>
          </Stack>
        </SectionCard>

        <SectionCard title="Cambiar contraseña">
          {usuario.debeCambiarPassword && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Todavía estás usando la contraseña que te dio el gimnasio (si no te dijeron otra, es
              tu DNI). Elegí una nueva para que nadie más pueda entrar con tu cuenta.
            </Alert>
          )}
          <CambiarPasswordForm onSubmit={handleCambiarPassword} />
        </SectionCard>
      </Stack>

      <Snackbar
        open={snackbar !== null}
        autoHideDuration={5000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar?.severity ?? 'success'}
          onClose={() => setSnackbar(null)}
          variant="filled"
        >
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Configuracion
