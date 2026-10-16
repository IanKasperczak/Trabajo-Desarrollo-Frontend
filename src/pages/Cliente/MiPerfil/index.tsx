import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import LockResetIcon from '@mui/icons-material/LockReset'
import SectionCard from '../../../components/dashboard/common/SectionCard'
import AvisoPasswordInicial from '../../../components/dashboard/common/AvisoPasswordInicial'
import ErrorState from '../../../components/ui/ErrorState'
import ListSkeleton from '../../../components/ui/ListSkeleton'
import { useAsyncData } from '../../../hooks/useAsyncData'
import { clienteService } from '../../../services/clienteService'
import { mensajeDeErrorApi } from '../../../utils/apiError'
import { roleBase } from '../../../utils/navigation'

// Mismo límite que valida el backend
const TELEFONO_MAX = 30

type SnackbarState = { message: string; severity: 'success' | 'error' } | null

function Dato({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
        {value}
      </Typography>
    </Box>
  )
}

function MiPerfil() {
  const { data: cliente, loading, error, reload } = useAsyncData(clienteService.getMiPerfil)

  const [telefono, setTelefono] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [snackbar, setSnackbar] = useState<SnackbarState>(null)

  useEffect(() => {
    if (cliente) setTelefono(cliente.telefono ?? '')
  }, [cliente])

  const telefonoLimpio = telefono.trim()
  const hayCambios = cliente !== null && telefonoLimpio !== (cliente.telefono ?? '')
  const telefonoError =
    telefonoLimpio.length > TELEFONO_MAX ? `Máximo ${TELEFONO_MAX} caracteres` : null

  const handleGuardar = async () => {
    setGuardando(true)
    try {
      await clienteService.updateMiPerfil(telefonoLimpio)
      await reload()
      setSnackbar({ message: 'Teléfono actualizado correctamente.', severity: 'success' })
    } catch (err) {
      setSnackbar({
        message: mensajeDeErrorApi(err, 'No se pudo guardar el teléfono. Intentá nuevamente.'),
        severity: 'error',
      })
    } finally {
      setGuardando(false)
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" component="h1">
          Mi Perfil
        </Typography>
        <Box sx={{ width: 56, height: 4, bgcolor: 'primary.main', borderRadius: 2, mt: 0.5 }} />
      </Box>

      <AvisoPasswordInicial />

      {loading && !cliente && <ListSkeleton count={2} sizes={{ xs: 12, md: 6 }} />}

      {!loading && error && (
        <ErrorState message="No se pudieron cargar tus datos." onRetry={reload} />
      )}

      {cliente && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <SectionCard title="Datos personales">
              <Stack spacing={1.5}>
                <Dato label="Nombre y apellido" value={`${cliente.nombre} ${cliente.apellido}`} />
                <Dato label="DNI" value={String(cliente.dni)} />
                <Box>
                  <TextField
                    label="Teléfono"
                    type="tel"
                    value={telefono}
                    onChange={(event) => setTelefono(event.target.value)}
                    error={telefonoError !== null}
                    helperText={telefonoError ?? ' '}
                    disabled={guardando}
                    size="small"
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    onClick={handleGuardar}
                    disabled={!hayCambios || telefonoError !== null || guardando}
                    startIcon={guardando ? <CircularProgress size={18} color="inherit" /> : null}
                    sx={{ mt: 0.5 }}
                  >
                    {guardando ? 'Guardando...' : 'Guardar teléfono'}
                  </Button>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Si el nombre o el DNI están mal, pedile al administrador del gimnasio que los
                  corrija.
                </Typography>
              </Stack>
            </SectionCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <SectionCard title="Mi cuenta" sx={{ height: 'auto' }}>
              <Stack spacing={1.5} alignItems="flex-start">
                <Dato label="Email para iniciar sesión" value={cliente.email} />
                <Button
                  component={RouterLink}
                  to={`${roleBase.cliente}/configuracion`}
                  variant="outlined"
                  startIcon={<LockResetIcon />}
                >
                  Cambiar contraseña
                </Button>
              </Stack>
            </SectionCard>
          </Grid>
        </Grid>
      )}

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

export default MiPerfil
