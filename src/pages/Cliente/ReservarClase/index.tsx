import { useMemo, useState } from 'react'
import { Alert, Box, Button, Chip, Grid, Snackbar, Typography } from '@mui/material'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import ScheduleIcon from '@mui/icons-material/Schedule'
import DiaSelector from '../../../components/turno/DiaSelector'
import TurnoCard from '../../../components/turno/TurnoCard'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import EmptyState from '../../../components/ui/EmptyState'
import ErrorState from '../../../components/ui/ErrorState'
import ListSkeleton from '../../../components/ui/ListSkeleton'
import { useAsyncData } from '../../../hooks/useAsyncData'
import { useTurnos } from '../../../hooks/useTurnos'
import { membresiaService } from '../../../services/membresiaService'
import { turnoService } from '../../../services/turnoService'
import { mensajeDeErrorApi } from '../../../utils/apiError'
import { hoyISO, sumarDias } from '../../../utils/membresia'
import {
  DIAS_ADELANTE,
  HORAS_ANTICIPACION,
  estaCompleto,
  etiquetaDia,
  horasParaInicio,
  membresiaCubre,
  miInscripcionVigente,
  tieneMembresiaAlDia,
} from '../../../utils/turno'
import type { Turno } from '../../../models/turno'

type SnackbarState = { message: string; severity: 'success' | 'error' } | null

// El cliente elige un día y reserva un lugar. Las reglas las hace cumplir el backend (cupo,
// 8 horas de anticipación, un turno por día); acá se avisa antes para no frustrar al usuario
function ReservarClase() {
  const hoy = useMemo(hoyISO, [])
  const [fecha, setFecha] = useState(hoy)
  const { turnos, loading, error, reload } = useTurnos({ fecha })
  // El cliente solo recibe sus propias membresías. Mientras cargan no se bloquea nada: el
  // backend valida igual
  const membresias = useAsyncData(membresiaService.getAll)
  const misMembresias = membresias.data
  const sinMembresiaAlDia = misMembresias !== null && !tieneMembresiaAlDia(misMembresias)

  const [procesando, setProcesando] = useState<number | null>(null)
  const [cancelando, setCancelando] = useState<Turno | null>(null)
  const [snackbar, setSnackbar] = useState<SnackbarState>(null)

  const yaTengoTurnoEseDia = turnos.some((t) => miInscripcionVigente(t))

  const reservar = async (turno: Turno) => {
    setProcesando(turno.idTurno)
    try {
      await turnoService.inscribirse(turno.idTurno)
      setSnackbar({ message: 'Listo, tu lugar quedó reservado.', severity: 'success' })
      await reload()
    } catch (err) {
      setSnackbar({
        message: mensajeDeErrorApi(err, 'No se pudo reservar el lugar. Intentá nuevamente.'),
        severity: 'error',
      })
    } finally {
      setProcesando(null)
    }
  }

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

  const acciones = (turno: Turno) => {
    const mia = miInscripcionVigente(turno)
    if (mia) {
      return (
        <Button variant="outlined" color="error" size="small" fullWidth onClick={() => setCancelando(turno)}>
          Cancelar mi lugar
        </Button>
      )
    }
    const motivo = (() => {
      if (horasParaInicio(turno) < HORAS_ANTICIPACION) {
        return horasParaInicio(turno) < 0
          ? 'Este turno ya empezó'
          : `Se reserva hasta ${HORAS_ANTICIPACION} horas antes`
      }
      if (estaCompleto(turno)) return 'No quedan lugares'
      if (misMembresias !== null && !membresiaCubre(misMembresias, turno.fecha ?? fecha)) {
        return sinMembresiaAlDia
          ? 'Necesitás una membresía vigente'
          : 'Tu membresía no cubre este día'
      }
      if (yaTengoTurnoEseDia) return 'Ya tenés un turno este día'
      return null
    })()

    return (
      <Box>
        <Button
          variant="contained"
          size="small"
          fullWidth
          disabled={motivo !== null || procesando === turno.idTurno}
          onClick={() => reservar(turno)}
        >
          Reservar lugar
        </Button>
        {motivo && (
          <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 0.75, textAlign: 'center' }}>
            {motivo}
          </Typography>
        )}
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" component="h1">
          Reservar Clase
        </Typography>
        <Box sx={{ width: 56, height: 4, bgcolor: 'primary.main', borderRadius: 2, mt: 0.5 }} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, maxWidth: 560 }}>
          Elegí el día y reservá tu lugar. Necesitás una membresía vigente, podés reservar hasta{' '}
          {HORAS_ANTICIPACION} horas antes y un turno por día.
        </Typography>
      </Box>

      {sinMembresiaAlDia && (
        <Alert severity="warning" sx={{ mb: 2.5 }}>
          Para reservar necesitás una membresía vigente. Consultá en el gimnasio para renovarla.
        </Alert>
      )}

      <DiaSelector fecha={fecha} onChange={setFecha} min={hoy} max={sumarDias(hoy, DIAS_ADELANTE)} />

      {loading && <ListSkeleton count={3} sizes={{ xs: 12, md: 6, xl: 4 }} />}
      {!loading && error && (
        <ErrorState message="No se pudieron cargar los turnos." onRetry={reload} />
      )}
      {!loading && !error && turnos.length === 0 && (
        <EmptyState
          icon={ScheduleIcon}
          message={`No hay clases el ${etiquetaDia(fecha).toLowerCase()}. Probá con otro día.`}
        />
      )}
      {!loading && !error && turnos.length > 0 && (
        <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
          {turnos.map((turno) => (
            <Grid item xs={12} md={6} xl={4} key={turno.idTurno}>
              <TurnoCard
                turno={turno}
                etiqueta={
                  miInscripcionVigente(turno) ? (
                    <Chip
                      size="small"
                      color="primary"
                      icon={<EventAvailableIcon />}
                      label="Reservado"
                    />
                  ) : undefined
                }
                acciones={acciones(turno)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <ConfirmDialog
        open={cancelando !== null}
        title="Cancelar mi lugar"
        message="¿Querés cancelar tu lugar en este turno? Lo van a poder tomar otros clientes."
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

export default ReservarClase
