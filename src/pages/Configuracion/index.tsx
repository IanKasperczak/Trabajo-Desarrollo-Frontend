import { useState } from 'react'
import { Alert, Box, Snackbar, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import SectionCard from '../../components/dashboard/common/SectionCard'
import CambiarPasswordForm from '../../components/auth/CambiarPasswordForm'
import { useAuth } from '../../hooks/useAuth'
import { useColorMode } from '../../hooks/useColorMode'
import type { PreferenciaTema } from '../../context/ColorModeContext'
import { roles } from '../../models/role'
import type { CambiarPasswordInput } from '../../models/usuario'
import { mensajeDeErrorApi } from '../../utils/apiError'

type SnackbarState = { message: string; severity: 'success' | 'error' } | null

// Pantalla común a los tres roles
function Configuracion() {
  const { usuario, cambiarPassword } = useAuth()
  const { preferencia, setPreferencia } = useColorMode()
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

        <SectionCard title="Apariencia">
          <Stack spacing={1.5}>
            <Typography variant="body2" color="text.secondary">
              Elegí cómo querés ver la app. Se guarda en este navegador.
            </Typography>
            <ToggleButtonGroup
              exclusive
              fullWidth
              size="small"
              value={preferencia}
              onChange={(_, nueva: PreferenciaTema | null) => {
                if (nueva) setPreferencia(nueva)
              }}
              aria-label="Tema de la aplicación"
            >
              <ToggleButton value="claro" sx={{ gap: 1 }}>
                <LightModeIcon fontSize="small" />
                Claro
              </ToggleButton>
              <ToggleButton value="oscuro" sx={{ gap: 1 }}>
                <DarkModeIcon fontSize="small" />
                Oscuro
              </ToggleButton>
              <ToggleButton value="sistema" sx={{ gap: 1 }}>
                <SettingsBrightnessIcon fontSize="small" />
                Sistema
              </ToggleButton>
            </ToggleButtonGroup>
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
