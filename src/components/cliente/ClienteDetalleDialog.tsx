import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import type { Cliente } from '../../models/cliente'
import type { Rutina } from '../../models/rutina'
import { rutinaService } from '../../services/rutinaService'
import { colorEstado, formatearFecha } from '../../utils/membresia'
import { formatearDescanso } from '../../utils/rutinaForm'

interface ClienteDetalleDialogProps {
  cliente: Cliente | null
  onClose: () => void
}

function Dato({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
    </Box>
  )
}

function ClienteDetalleDialog({ cliente, onClose }: ClienteDetalleDialogProps) {
  const [rutinas, setRutinas] = useState<Rutina[] | null>(null)
  const [error, setError] = useState(false)
  const dni = cliente?.dni

  useEffect(() => {
    if (dni === undefined) return
    let cancelado = false
    setRutinas(null)
    setError(false)
    rutinaService
      .getAll()
      .then((todas) => {
        if (!cancelado) setRutinas(todas.filter((r) => r.dniCliente === dni))
      })
      .catch(() => {
        if (!cancelado) setError(true)
      })
    return () => {
      cancelado = true
    }
  }, [dni])

  const membresia = cliente?.membresia

  return (
    <Dialog open={cliente !== null} onClose={onClose} maxWidth="sm" fullWidth>
      {cliente && (
        <>
          <DialogTitle>
            {cliente.nombre} {cliente.apellido}
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
                <Dato label="DNI" value={String(cliente.dni)} />
                <Dato label="Email" value={cliente.email} />
                <Dato label="Teléfono" value={cliente.telefono ?? 'Sin teléfono'} />
              </Stack>

              {membresia !== undefined && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                      Membresía
                    </Typography>
                    {membresia ? (
                      <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap" useFlexGap>
                        <Chip label={membresia.estado} color={colorEstado[membresia.estado]} />
                        <Dato label="Inicio" value={formatearFecha(membresia.fechaInicio)} />
                        <Dato label="Vencimiento" value={formatearFecha(membresia.fechaVencimiento)} />
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Todavía no tiene ninguna membresía.
                      </Typography>
                    )}
                  </Box>
                </>
              )}

              <Divider />
              <Box>
                <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                  Rutinas asignadas
                </Typography>
                {rutinas === null && !error && <CircularProgress size={24} />}
                {error && (
                  <Typography variant="body2" color="error">
                    No se pudieron cargar las rutinas.
                  </Typography>
                )}
                {rutinas?.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No tiene rutinas asignadas.
                  </Typography>
                )}
                <Stack spacing={1.5}>
                  {rutinas?.map((rutina) => (
                    <Box key={rutina.idRutina}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle2">{rutina.nombreRutina}</Typography>
                        <Chip label={rutina.diaSemana ?? 'Sin día'} size="small" variant="outlined" />
                      </Stack>
                      {rutina.profesor && (
                        <Typography variant="caption" color="text.secondary">
                          Profesor: {rutina.profesor.nombre} {rutina.profesor.apellido}
                        </Typography>
                      )}
                      {rutina.ejercicios.map((ejercicio) => {
                        const descanso = formatearDescanso(ejercicio.descanso)
                        return (
                          <Typography key={ejercicio.id} variant="body2" sx={{ pl: 1 }}>
                            • {ejercicio.nombreEjercicio} — {ejercicio.series} × {ejercicio.repeticiones}
                            {descanso && ` · descanso ${descanso}`}
                          </Typography>
                        )
                      })}
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cerrar</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}

export default ClienteDetalleDialog
