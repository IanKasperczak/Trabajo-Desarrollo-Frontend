import { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import UndoIcon from '@mui/icons-material/Undo'
import type { Inscripcion, Turno } from '../../models/turno'
import { turnoService } from '../../services/turnoService'
import { mensajeDeErrorApi } from '../../utils/apiError'
import {
  ESTADO_COLOR,
  ESTADO_LABEL,
  estadoDeInscripcion,
  etiquetaDia,
  hoyEsDespuesDe,
  rangoHorario,
} from '../../utils/turno'

interface InscriptosDialogProps {
  turno: Turno | null
  onClose: () => void
  // Avisa que cambió algo (para refrescar los lugares ocupados de la lista)
  onChanged?: () => void
}

const nombreDe = (inscripcion: Inscripcion) =>
  inscripcion.cliente
    ? `${inscripcion.cliente.apellido}, ${inscripcion.cliente.nombre}`
    : `DNI ${inscripcion.dniCliente}`

// Clientes anotados en un turno. Acá se registra la asistencia (admin y profesor del turno)
function InscriptosDialog({ turno, onClose, onChanged }: InscriptosDialogProps) {
  const [inscripciones, setInscripciones] = useState<Inscripcion[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [guardando, setGuardando] = useState<number | null>(null)
  const idTurno = turno?.idTurno

  const cargar = useCallback(async () => {
    if (idTurno === undefined) return
    try {
      setInscripciones(await turnoService.getInscripciones(idTurno))
      setError(null)
    } catch (err) {
      setError(mensajeDeErrorApi(err, 'No se pudieron cargar los inscriptos.'))
    }
  }, [idTurno])

  useEffect(() => {
    setInscripciones(null)
    setError(null)
    void cargar()
  }, [cargar])

  const registrar = async (dni: number, estado: 'activa' | 'asistio' | 'ausente') => {
    if (idTurno === undefined) return
    setGuardando(dni)
    try {
      await turnoService.registrarAsistencia(idTurno, dni, estado)
      await cargar()
      onChanged?.()
    } catch (err) {
      setError(mensajeDeErrorApi(err, 'No se pudo registrar la asistencia.'))
    } finally {
      setGuardando(null)
    }
  }

  const vigentes = inscripciones?.filter((i) => i.estado !== 'cancelada') ?? []
  const canceladas = inscripciones?.filter((i) => i.estado === 'cancelada') ?? []
  // La asistencia se registra el día del turno o después (el backend lo exige igual)
  const puedeRegistrar = turno?.fecha ? hoyEsDespuesDe(turno.fecha) : false

  return (
    <Dialog open={turno !== null} onClose={onClose} maxWidth="sm" fullWidth>
      {turno && (
        <>
          <DialogTitle sx={{ pb: 1 }}>
            {turno.tipoClase?.nombre ?? 'Clase'}
            <Typography
              variant="body2"
              color="text.secondary"
              component="p"
              sx={{ fontFamily: 'inherit', letterSpacing: 0 }}
            >
              {turno.fecha ? etiquetaDia(turno.fecha) : 'Todos los días'} · {rangoHorario(turno)}
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {inscripciones === null && !error && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress size={28} />
              </Box>
            )}
            {inscripciones !== null && (
              <Stack spacing={2}>
                <Typography variant="body2" color="text.secondary" data-tabular>
                  {vigentes.length} de {turno.capacidadMaxima ?? 0} lugares ocupados
                </Typography>

                {!puedeRegistrar && vigentes.length > 0 && (
                  <Alert severity="info">
                    La asistencia se puede registrar el día del turno o después.
                  </Alert>
                )}

                {vigentes.length === 0 && (
                  <Typography variant="body1" color="text.secondary">
                    Todavía no hay clientes inscriptos en este turno.
                  </Typography>
                )}

                <Stack divider={<Box sx={{ borderTop: 1, borderColor: 'divider' }} />}>
                  {vigentes.map((inscripcion) => {
                    const estado = estadoDeInscripcion(inscripcion)
                    const ocupado = guardando === inscripcion.dniCliente
                    return (
                      <Stack
                        key={inscripcion.idInscripcion}
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        sx={{ py: 1.25 }}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {nombreDe(inscripcion)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" data-tabular>
                            DNI {inscripcion.dniCliente}
                          </Typography>
                        </Box>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          flexWrap="wrap"
                          useFlexGap
                        >
                          <Chip
                            size="small"
                            label={ESTADO_LABEL[estado]}
                            color={ESTADO_COLOR[estado]}
                            variant={estado === 'activa' ? 'outlined' : 'filled'}
                          />
                          {puedeRegistrar && estado === 'activa' && (
                            <>
                              <Button
                                size="small"
                                variant="contained"
                                startIcon={<CheckIcon />}
                                disabled={ocupado}
                                onClick={() => registrar(inscripcion.dniCliente, 'asistio')}
                              >
                                Asistió
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                startIcon={<CloseIcon />}
                                disabled={ocupado}
                                onClick={() => registrar(inscripcion.dniCliente, 'ausente')}
                              >
                                Faltó
                              </Button>
                            </>
                          )}
                          {puedeRegistrar && estado !== 'activa' && (
                            <Button
                              size="small"
                              color="inherit"
                              startIcon={<UndoIcon />}
                              disabled={ocupado}
                              onClick={() => registrar(inscripcion.dniCliente, 'activa')}
                            >
                              Deshacer
                            </Button>
                          )}
                        </Stack>
                      </Stack>
                    )
                  })}
                </Stack>

                {canceladas.length > 0 && (
                  <Typography variant="caption" color="text.secondary">
                    {canceladas.length === 1 ? 'Canceló su lugar' : 'Cancelaron su lugar'}:{' '}
                    {canceladas.map((i) => nombreDe(i)).join(' · ')}
                  </Typography>
                )}
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cerrar</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}

export default InscriptosDialog
