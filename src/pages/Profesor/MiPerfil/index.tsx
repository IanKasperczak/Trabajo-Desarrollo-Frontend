import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Chip, Grid, Stack, Typography } from '@mui/material'
import LockResetIcon from '@mui/icons-material/LockReset'
import SectionCard from '../../../components/dashboard/common/SectionCard'
import AvisoPasswordInicial from '../../../components/dashboard/common/AvisoPasswordInicial'
import ErrorState from '../../../components/ui/ErrorState'
import ListSkeleton from '../../../components/ui/ListSkeleton'
import { useAsyncData } from '../../../hooks/useAsyncData'
import { useAuth } from '../../../hooks/useAuth'
import { profesorService } from '../../../services/profesorService'
import { roleBase } from '../../../utils/navigation'

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
  const { usuario } = useAuth()
  const dni = usuario?.dniProfesor ?? null
  const { data: profesor, loading, error, reload } = useAsyncData(() =>
    dni === null
      ? Promise.reject(new Error('La cuenta no está vinculada a un profesor'))
      : profesorService.getByDni(dni),
  )

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" component="h1">
          Mi Perfil
        </Typography>
        <Box sx={{ width: 56, height: 4, bgcolor: 'primary.main', borderRadius: 2, mt: 0.5 }} />
      </Box>

      <AvisoPasswordInicial />

      {loading && <ListSkeleton count={2} sizes={{ xs: 12, md: 6 }} />}

      {!loading && error && (
        <ErrorState message="No se pudieron cargar tus datos." onRetry={reload} />
      )}

      {!loading && !error && profesor && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <SectionCard title="Datos personales">
              <Stack spacing={1.5}>
                <Dato label="Nombre y apellido" value={`${profesor.nombre} ${profesor.apellido}`} />
                <Dato label="DNI" value={String(profesor.dni)} />
                <Dato label="Email de contacto" value={profesor.email} />
                <Dato label="Teléfono" value={profesor.telefono} />
                <Typography variant="caption" color="text.secondary">
                  Si algún dato está mal, pedile al administrador del gimnasio que lo corrija.
                </Typography>
              </Stack>
            </SectionCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <SectionCard title="Mis especialidades" sx={{ height: 'auto' }}>
                {profesor.especialidades.length > 0 ? (
                  <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                    {profesor.especialidades.map((esp) => (
                      <Chip
                        key={esp.idEspecialidad}
                        label={esp.nombre}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Todavía no tenés especialidades asignadas.
                  </Typography>
                )}
              </SectionCard>

              <SectionCard title="Mi cuenta" sx={{ height: 'auto' }}>
                <Stack spacing={1.5} alignItems="flex-start">
                  <Dato label="Email para iniciar sesión" value={usuario?.email ?? ''} />
                  <Button
                    component={RouterLink}
                    to={`${roleBase.profesor}/configuracion`}
                    variant="outlined"
                    startIcon={<LockResetIcon />}
                  >
                    Cambiar contraseña
                  </Button>
                </Stack>
              </SectionCard>
            </Stack>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}

export default MiPerfil
