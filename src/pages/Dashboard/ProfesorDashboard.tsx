import { Box, Chip, Grid, Skeleton, Stack, Typography } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import AssignmentIcon from '@mui/icons-material/Assignment'
import SettingsIcon from '@mui/icons-material/Settings'
import StatCard from '../../components/dashboard/common/StatCard'
import SectionCard from '../../components/dashboard/common/SectionCard'
import AvisoPasswordInicial from '../../components/dashboard/common/AvisoPasswordInicial'
import QuickActions from '../../components/dashboard/common/QuickActions'
import type { QuickActionItem } from '../../components/dashboard/common/QuickActions'
import ErrorState from '../../components/ui/ErrorState'
import { useAsyncData } from '../../hooks/useAsyncData'
import { useAuth } from '../../hooks/useAuth'
import { profesorService } from '../../services/profesorService'
import { rutinaService } from '../../services/rutinaService'

const profesorQuickActions: QuickActionItem[] = [
  { label: 'Mis rutinas', icon: AssignmentIcon, to: '/profesor/mis-rutinas' },
  { label: 'Mi perfil', icon: AccountCircleIcon, to: '/profesor/mi-perfil' },
  { label: 'Configuración', icon: SettingsIcon, to: '/profesor/configuracion' },
]

function ProfesorDashboard() {
  const { usuario } = useAuth()
  const dni = usuario?.dniProfesor ?? null
  const { data, loading, error, reload } = useAsyncData(async () => {
    if (dni === null) throw new Error('La cuenta no está vinculada a un profesor')
    // El backend devuelve solo las rutinas de este profesor
    const [profesor, rutinas] = await Promise.all([
      profesorService.getByDni(dni),
      rutinaService.getAll(),
    ])
    return { profesor, rutinas }
  })

  const profesor = data?.profesor
  const rutinas = data?.rutinas ?? []
  const clientesConRutina = new Set(rutinas.map((r) => r.dniCliente)).size

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" component="h1">
          {profesor ? `Hola, ${profesor.nombre}` : 'Hola'}
        </Typography>
        <Box sx={{ width: 56, height: 4, bgcolor: 'primary.main', borderRadius: 2, mt: 0.5 }} />
      </Box>

      <AvisoPasswordInicial />

      {!loading && error ? (
        <ErrorState message="No se pudieron cargar tus datos." onRetry={reload} />
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <StatCard
              icon={AssignmentIcon}
              label="Rutinas que cargaste"
              value={loading ? '…' : String(rutinas.length)}
              hint={
                loading
                  ? undefined
                  : `Para ${clientesConRutina} ${clientesConRutina === 1 ? 'cliente' : 'clientes'}`
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SectionCard title="Tus especialidades">
              {loading || !profesor ? (
                <Stack direction="row" spacing={0.75}>
                  <Skeleton variant="rounded" width={90} height={32} />
                  <Skeleton variant="rounded" width={110} height={32} />
                </Stack>
              ) : profesor.especialidades.length > 0 ? (
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
                  Todavía no tenés especialidades asignadas. Consultalo con el administrador.
                </Typography>
              )}
            </SectionCard>
          </Grid>
          <Grid item xs={12}>
            <SectionCard title="Accesos rápidos">
              <QuickActions items={profesorQuickActions} />
            </SectionCard>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}

export default ProfesorDashboard
