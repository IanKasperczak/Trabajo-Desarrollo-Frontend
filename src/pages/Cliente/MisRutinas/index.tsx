import { Box, Grid, Typography } from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'
import RutinaCard from '../../../components/rutina/RutinaCard'
import EmptyState from '../../../components/ui/EmptyState'
import ErrorState from '../../../components/ui/ErrorState'
import ListSkeleton from '../../../components/ui/ListSkeleton'
import { useAsyncData } from '../../../hooks/useAsyncData'
import { rutinaService } from '../../../services/rutinaService'
import { ordenDia } from '../../../utils/dias'

// El backend devuelve solo las rutinas del cliente que inició sesión
function MisRutinas() {
  const { data, loading, error, reload } = useAsyncData(rutinaService.getAll)
  const rutinas = [...(data ?? [])].sort((a, b) => ordenDia(a.diaSemana) - ordenDia(b.diaSemana))

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" component="h1">
          Mis Rutinas
        </Typography>
        <Box sx={{ width: 56, height: 4, bgcolor: 'primary.main', borderRadius: 2, mt: 0.5 }} />
      </Box>

      {loading && <ListSkeleton count={3} sizes={{ xs: 12, md: 6, lg: 4 }} />}

      {!loading && error && (
        <ErrorState message="No se pudieron cargar tus rutinas." onRetry={reload} />
      )}

      {!loading && !error && rutinas.length === 0 && (
        <EmptyState
          icon={AssignmentIcon}
          message="Todavía no tenés rutinas asignadas. Cuando tu profesor te cargue una, la vas a ver acá."
        />
      )}

      {!loading && !error && rutinas.length > 0 && (
        <Grid container spacing={2}>
          {rutinas.map((rutina) => (
            <Grid item xs={12} md={6} lg={4} key={rutina.idRutina}>
              <RutinaCard rutina={rutina} mostrarProfesor />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export default MisRutinas
