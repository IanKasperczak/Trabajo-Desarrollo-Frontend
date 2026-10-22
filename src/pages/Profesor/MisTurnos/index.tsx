import { useState } from 'react'
import { Box, Button, Grid, Typography } from '@mui/material'
import GroupIcon from '@mui/icons-material/Group'
import ScheduleIcon from '@mui/icons-material/Schedule'
import DiaSelector from '../../../components/turno/DiaSelector'
import InscriptosDialog from '../../../components/turno/InscriptosDialog'
import TurnoCard from '../../../components/turno/TurnoCard'
import EmptyState from '../../../components/ui/EmptyState'
import ErrorState from '../../../components/ui/ErrorState'
import ListSkeleton from '../../../components/ui/ListSkeleton'
import { useTurnos } from '../../../hooks/useTurnos'
import { hoyISO } from '../../../utils/membresia'
import { etiquetaDia } from '../../../utils/turno'
import type { Turno } from '../../../models/turno'

// Los turnos que dicta el profesor en el día elegido, con sus inscriptos y la asistencia.
// El backend ya filtra: solo llegan los turnos donde el profesor está asignado
function MisTurnos() {
  const [fecha, setFecha] = useState(hoyISO)
  const { turnos, loading, error, reload } = useTurnos({ fecha })
  const [viendo, setViendo] = useState<Turno | null>(null)

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" component="h1">
          Mis Turnos
        </Typography>
        <Box sx={{ width: 56, height: 4, bgcolor: 'primary.main', borderRadius: 2, mt: 0.5 }} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, maxWidth: 560 }}>
          Los turnos que dictás cada día. Entrá a Inscriptos para ver quién viene y registrar la
          asistencia.
        </Typography>
      </Box>

      <DiaSelector fecha={fecha} onChange={setFecha} />

      {loading && <ListSkeleton count={3} sizes={{ xs: 12, md: 6, xl: 4 }} />}
      {!loading && error && (
        <ErrorState message="No se pudieron cargar tus turnos." onRetry={reload} />
      )}
      {!loading && !error && turnos.length === 0 && (
        <EmptyState
          icon={ScheduleIcon}
          message={`No tenés turnos el ${etiquetaDia(fecha).toLowerCase()}.`}
        />
      )}
      {!loading && !error && turnos.length > 0 && (
        <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
          {turnos.map((turno) => (
            <Grid item xs={12} md={6} xl={4} key={turno.idTurno}>
              <TurnoCard
                turno={turno}
                acciones={
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    startIcon={<GroupIcon />}
                    onClick={() => setViendo(turno)}
                  >
                    Inscriptos y asistencia
                  </Button>
                }
              />
            </Grid>
          ))}
        </Grid>
      )}

      <InscriptosDialog turno={viendo} onClose={() => setViendo(null)} onChanged={reload} />
    </Box>
  )
}

export default MisTurnos
