import { useEffect, useState } from 'react'
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
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import type { Membresia, Renovacion } from '../../models/membresia'
import { membresiaService } from '../../services/membresiaService'
import { mensajeDeErrorApi } from '../../utils/apiError'
import { colorEstado, diasHasta, formatearFecha, formatearImporte } from '../../utils/membresia'

interface ClienteBasico {
  dni: number
  nombre: string
  apellido: string
}

interface RenovarMembresiaDialogProps {
  cliente: ClienteBasico | null
  onClose: () => void
  // Se llama cuando la renovación quedó registrada, para que la pantalla actualice sus datos
  onRenovada: (membresia: Membresia) => void
}

function Dato({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 600 }} data-tabular>
        {value}
      </Typography>
    </Box>
  )
}

// Explica por qué la nueva membresía arranca en esa fecha
const explicacionInicio = (renovacion: Renovacion): string => {
  const { ultima } = renovacion
  if (!ultima) return 'Todavía no tiene ninguna membresía: empieza hoy.'
  if (ultima.fechaVencimiento >= renovacion.fechaPago && diasHasta(ultima.fechaVencimiento) >= 0) {
    return `Empieza el día siguiente al vencimiento de la actual (${formatearFecha(ultima.fechaVencimiento)}), sin perder ni superponer días.`
  }
  return 'La anterior ya venció: la nueva empieza hoy.'
}

// Caso de uso "Renovar membresía": el sistema calcula las fechas y el admin confirma el pago
function RenovarMembresiaDialog({ cliente, onClose, onRenovada }: RenovarMembresiaDialogProps) {
  const [renovacion, setRenovacion] = useState<Renovacion | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fechaPago, setFechaPago] = useState('')
  const [valor, setValor] = useState('')
  const [guardando, setGuardando] = useState(false)
  const dni = cliente?.dni

  useEffect(() => {
    if (dni === undefined) return
    let cancelado = false
    setRenovacion(null)
    setError(null)
    membresiaService
      .getRenovacion(dni)
      .then((datos) => {
        if (cancelado) return
        setRenovacion(datos)
        setFechaPago(datos.fechaPago)
        setValor(datos.valor === null ? '' : String(datos.valor))
      })
      .catch((err) => {
        if (!cancelado) setError(mensajeDeErrorApi(err, 'No se pudo calcular la renovación.'))
      })
    return () => {
      cancelado = true
    }
  }, [dni])

  const valorTexto = valor.trim().replace(',', '.')
  const valorNumero = valorTexto === '' ? NaN : Number(valorTexto)
  const valorError =
    valorTexto !== '' && (!Number.isFinite(valorNumero) || valorNumero < 0)
      ? 'Ingresá un importe válido'
      : null
  const esValido = renovacion !== null && fechaPago !== '' && Number.isFinite(valorNumero) && !valorError

  const confirmar = async () => {
    if (dni === undefined || !renovacion) return
    setGuardando(true)
    setError(null)
    try {
      const nueva = await membresiaService.renovar(dni, { fechaPago, valor: valorNumero })
      onRenovada(nueva)
    } catch (err) {
      setError(mensajeDeErrorApi(err, 'No se pudo registrar la renovación. Intentá nuevamente.'))
    } finally {
      setGuardando(false)
    }
  }

  return (
    <Dialog
      open={cliente !== null}
      onClose={guardando ? undefined : onClose}
      maxWidth="sm"
      fullWidth
    >
      {cliente && (
        <>
          <DialogTitle sx={{ pb: 1 }}>
            Renovar membresía
            <Typography
              variant="body2"
              color="text.secondary"
              component="p"
              sx={{ fontFamily: 'inherit', letterSpacing: 0 }}
            >
              {cliente.nombre} {cliente.apellido} · DNI {cliente.dni}
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {renovacion === null && !error && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress size={28} />
              </Box>
            )}
            {renovacion !== null && (
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
                    Membresía actual
                  </Typography>
                  {renovacion.ultima ? (
                    <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
                      <Chip
                        size="small"
                        label={renovacion.ultima.estado}
                        color={colorEstado[renovacion.ultima.estado]}
                      />
                      <Typography variant="body2" data-tabular>
                        Vence el {formatearFecha(renovacion.ultima.fechaVencimiento)}
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography variant="body2">No tiene membresías.</Typography>
                  )}
                </Box>

                <Box
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 2,
                    bgcolor: 'action.hover',
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Nueva membresía
                  </Typography>
                  <Stack direction="row" spacing={4} flexWrap="wrap" useFlexGap>
                    <Dato label="Desde" value={formatearFecha(renovacion.fechaInicio)} />
                    <Dato label="Hasta" value={formatearFecha(renovacion.fechaVencimiento)} />
                  </Stack>
                  <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 1 }}>
                    {explicacionInicio(renovacion)}
                  </Typography>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="Fecha de pago"
                    type="date"
                    value={fechaPago}
                    onChange={(event) => setFechaPago(event.target.value)}
                    disabled={guardando}
                    slotProps={{ inputLabel: { shrink: true } }}
                    required
                    fullWidth
                  />
                  <TextField
                    label="Importe"
                    inputMode="decimal"
                    value={valor}
                    onChange={(event) => setValor(event.target.value)}
                    error={valorError !== null}
                    helperText={
                      valorError ??
                      (renovacion.valor === null
                        ? 'Es la primera membresía: cargá el importe'
                        : `Último importe: ${formatearImporte(renovacion.valor)}`)
                    }
                    disabled={guardando}
                    slotProps={{
                      input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
                    }}
                    required
                    fullWidth
                  />
                </Stack>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="inherit" disabled={guardando}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={confirmar}
              disabled={!esValido || guardando}
              sx={{ minWidth: 150 }}
            >
              {guardando ? <CircularProgress size={20} color="inherit" /> : 'Registrar pago'}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}

export default RenovarMembresiaDialog
