import { useMemo, useState } from 'react'
import { Alert, Box, Button, Chip, Grid, Snackbar, Typography } from '@mui/material'
import EventIcon from '@mui/icons-material/Event'
import TurnoCard from '../../../components/turno/TurnoCard'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import EmptyState from '../../../components/ui/EmptyState'
import ErrorState from '../../../components/ui/ErrorState'
import ListSkeleton from '../../../components/ui/ListSkeleton'
import { useTurnos } from '../../../hooks/useTurnos'
import { turnoService } from '../../../services/turnoService'
import { mensajeDeErrorApi } from '../../../utils/apiError'
import { hoyISO, sumarDias } from '../../../utils/membresia'
import {
  DIAS_ADELANTE,
  ESTADO_COLOR,
  ESTADO_LABEL,
  estadoDeInscripcion,
  etiquetaDia,
  miInscripcionVigente,
} from '../../../utils/turno'
import type { Inscripcion, Turno } from '../../../models/turno'

type SnackbarState = { message: string; severity: 'success' | 'error' } | null

interface MiClase {
  turno: Turno
  inscripcion: Inscripcion
}

const DIAS_HISTORIAL = 60

// Las clases a las que se anotó el cliente: las próximas (se pueden cancelar) y el historial
function MisClases() {
  const hoy = useMemo(hoyISO, [])
  const { turnos, loading, error, reload } = useTurnos({
    desde: sumarDias(hoy, -DIAS_HISTORIAL),
    hasta: sumarDias(hoy, DIAS_ADELANTE),
  })
  const [cancelando, setCancelando] = useState<Turno | null>(null)
  const [snackbar, setSnackbar] = useState<SnackbarState>(null)

  // El backend le manda al cliente solo sus propias inscripciones en cada turno
  const mias: MiClase[] = turnos.flatMap((turno) => {
    const todas = turno.inscripciones ?? []
    const inscripcion = miInscripcionVigente(turno) ?? todas[todas.length - 1]
    return inscripcion ? [{ turno, inscripcion }] : []
  })
  const proximas = mias
    .filter(({ turno, inscripcion }) => (turno.fecha ?? '') >= hoy && inscripcion.estado === 'activa')
    .sort((a, b) => `${a.turno.fecha}${a.turno.horaInicio}`.localeCompare(`${b.turno.fecha}${b.turno.horaInicio}`))
  const historial = mias
    .filter((clase) => !proximas.includes(clase))
    .sort((a, b) => `${b.turno.fecha}${b.turno.horaInicio}`.localeCompare(`${a.turno.fecha}${a.turno.horaInicio}`))

  const confirmarCancelacion = async () => {
    if (!cancelando) return
    try {
      await turnoService.cancelarInscripcion(cancelando.idTurno)
      setSnackbar({ message: 'Cancelaste tu lugar.', severity: 'success' })
      await reload()
    } catch (err) {
      setSnackbar({
        message: mensajeDeErrorApi(err, 'No se pudo cancelar el lugar. Intentá nuevamente.'),
        severity: 'error',
      })
    } finally {
      setCancelando(null)
    }
  }

  const tarjeta = ({ turno, inscripcion }: MiClase, conAccion: boolean) => {
    const estado = estadoDeInscripcion(inscripcion)
    return (
      <Grid item xs={12} md={6} xl={4} key={turno.idTurno}>
        <TurnoCard
          turno={turno}
          mostrarFecha
          etiqueta={
            <Chip
              size="small"
              label={ESTADO_LABEL[estado]}
              color={ESTADO_COLOR[estado]}
              variant={estado === 'activa' ? 'outlined' : 'filled'}
            />
          }
          acciones={
            conAccion ? (
              <Button
                variant="outlined"
                color="error"
                size="small"
                fullWidth
                onClick={() => setCancelando(turno)}
              >
                Cancelar mi lugar
              </Button>
            ) : undefined
          }
        />
      </Grid>
    )
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" component="h1">
          Mis Clases
        </Typography>
        <Box sx={{ width: 56, height: 4, bgcolor: 'primary.main', borderRadius: 2, mt: 0.5 }} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, maxWidth: 560 }}>
          Tus reservas y las clases a las que ya fuiste.
        </Typography>
      </Box>

      {loading && <ListSkeleton count={3} sizes={{ xs: 12, md: 6, xl: 4 }} />}
      {!loading && error && (
        <ErrorState message="No se pudieron cargar tus clases." onRetry={reload} />
      )}
      {!loading && !error && mias.length === 0 && (
        <EmptyState
          icon={EventIcon}
          message="Todavía no reservaste ninguna clase. Entrá a Reservar Clase para anotarte."
        />
      )}

      {!loading && !error && proximas.length > 0 && (
        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 1.5 }}>
            Próximas
          </Typography>
          <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
            {proximas.map((clase) => tarjeta(clase, true))}
          </Grid>
        </Box>
      )}

      {!loading && !error && historial.length > 0 && (
        <Box component="section">
          <Typography variant="h5" component="h2" sx={{ mb: 1.5 }}>
            Historial
          </Typography>
          <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
            {historial.map((clase) => tarjeta(clase, false))}
          </Grid>
        </Box>
      )}

      <ConfirmDialog
        open={cancelando !== null}
        title="Cancelar mi lugar"
        message={
          cancelando?.fecha
            ? `¿Querés cancelar tu lugar en ${cancelando.tipoClase?.nombre ?? 'la clase'} del ${etiquetaDia(cancelando.fecha).toLowerCase()}?`
            : ''
        }
        confirmLabel="Cancelar mi lugar"
        onConfirm={confirmarCancelacion}
        onCancel={() => setCancelando(null)}
      />

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

export default MisClases
