import { useMemo, useState } from 'react'
import { Box, Button, Grid, Typography } from '@mui/material'
import EventIcon from '@mui/icons-material/Event'
import GroupIcon from '@mui/icons-material/Group'
import InscriptosDialog from '../../../components/turno/InscriptosDialog'
import TurnoCard from '../../../components/turno/TurnoCard'
import EmptyState from '../../../components/ui/EmptyState'
import ErrorState from '../../../components/ui/ErrorState'
import ListSkeleton from '../../../components/ui/ListSkeleton'
import { useTurnos } from '../../../hooks/useTurnos'
import { hoyISO, sumarDias } from '../../../utils/membresia'
import { etiquetaDia } from '../../../utils/turno'
import type { Turno } from '../../../models/turno'

const DIAS = 7

// La agenda de la semana: las clases que dicta el profesor desde hoy, agrupadas por día
function MisClases() {
  const desde = useMemo(hoyISO, [])
  const hasta = sumarDias(desde, DIAS - 1)
  const { turnos, loading, error, reload } = useTurnos({ desde, hasta })
  const [viendo, setViendo] = useState<Turno | null>(null)

  const porDia = new Map<string, Turno[]>()
  for (const turno of turnos) {
    if (!turno.fecha) continue
    porDia.set(turno.fecha, [...(porDia.get(turno.fecha) ?? []), turno])
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" component="h1">
          Mis Clases
        </Typography>
        <Box sx={{ width: 56, height: 4, bgcolor: 'primary.main', borderRadius: 2, mt: 0.5 }} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, maxWidth: 560 }}>
          Las clases que dictás en los próximos {DIAS} días.
        </Typography>
      </Box>

      {loading && <ListSkeleton count={3} sizes={{ xs: 12, md: 6, xl: 4 }} />}
      {!loading && error && (
        <ErrorState message="No se pudieron cargar tus clases." onRetry={reload} />
      )}
      {!loading && !error && porDia.size === 0 && (
        <EmptyState
          icon={EventIcon}
          message="No tenés clases asignadas esta semana. Cuando el gimnasio te asigne turnos, los vas a ver acá."
        />
      )}

      {!loading && !error && porDia.size > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
          {[...porDia.entries()].map(([fecha, delDia]) => (
            <Box key={fecha} component="section">
              <Typography variant="h5" component="h2" sx={{ mb: 1.5 }}>
                {fecha === desde ? 'Hoy' : etiquetaDia(fecha)}
              </Typography>
              <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
                {delDia.map((turno) => (
                  <Grid item xs={12} md={6} xl={4} key={turno.idTurno}>
                    <TurnoCard
                      turno={turno}
                      acciones={
                        <Button
                          variant="outlined"
                          size="small"
                          fullWidth
                          startIcon={<GroupIcon />}
                          onClick={() => setViendo(turno)}
                        >
                          Ver inscriptos
                        </Button>
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Box>
      )}

      <InscriptosDialog turno={viendo} onClose={() => setViendo(null)} onChanged={reload} />
    </Box>
  )
}

export default MisClases
