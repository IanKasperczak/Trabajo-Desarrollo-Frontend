import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material'
import type { Membresia } from '../../models/membresia'
import { colorEstado, formatearFecha, formatearImporte } from '../../utils/membresia'

interface HistorialPagosDialogProps {
  cliente: string
  membresias: Membresia[]
  open: boolean
  onClose: () => void
}

function HistorialPagosDialog({
  cliente,
  membresias,
  open,
  onClose,
}: HistorialPagosDialogProps) {
  const historial = [...membresias].sort(
    (a, b) => b.fechaPago.localeCompare(a.fechaPago) || b.idMembresia - a.idMembresia,
  )

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Historial de pagos · {cliente}</DialogTitle>
      <DialogContent dividers>
        {historial.length === 0 ? (
          <Typography color="text.secondary">No hay pagos registrados.</Typography>
        ) : (
          <Stack spacing={1.5}>
            {historial.map((membresia) => (
              <Stack
                key={membresia.idMembresia}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Stack spacing={0.25}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatearImporte(membresia.valor)} · Pagó el {formatearFecha(membresia.fechaPago)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Período: {formatearFecha(membresia.fechaInicio)} al{' '}
                    {formatearFecha(membresia.fechaVencimiento)}
                  </Typography>
                </Stack>
                <Chip
                  label={membresia.estado}
                  size="small"
                  color={colorEstado[membresia.estado]}
                />
              </Stack>
            ))}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  )
}

export default HistorialPagosDialog
