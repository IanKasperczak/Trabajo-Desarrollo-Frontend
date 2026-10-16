import { useEffect, useState } from 'react'
import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material'
import type { ClienteResumen, Membresia, MembresiaFormValues } from '../../models/membresia'
import { hoyISO, sumarDias } from '../../utils/membresia'

interface MembresiaFormDialogProps {
  open: boolean
  membresia: Membresia | null
  clientes: ClienteResumen[]
  onClose: () => void
  // Si falla, tiene que lanzar el error para que el diálogo quede abierto con lo escrito
  onSubmit: (values: MembresiaFormValues) => Promise<void>
}

// Una membresía nueva arranca como la más común: paga hoy y dura 30 días
const valoresIniciales = (membresia: Membresia | null): MembresiaFormValues => {
  if (membresia) {
    return {
      dniCliente: membresia.dniCliente,
      fechaPago: membresia.fechaPago,
      fechaInicio: membresia.fechaInicio,
      fechaVencimiento: membresia.fechaVencimiento,
      valor: String(membresia.valor),
    }
  }
  const hoy = hoyISO()
  return {
    dniCliente: null,
    fechaPago: hoy,
    fechaInicio: hoy,
    fechaVencimiento: sumarDias(hoy, 30),
    valor: '',
  }
}

const etiqueta = (c: ClienteResumen) => `${c.apellido}, ${c.nombre} (DNI ${c.dni})`

type CampoFecha = 'fechaPago' | 'fechaInicio' | 'fechaVencimiento'

function MembresiaFormDialog({
  open,
  membresia,
  clientes,
  onClose,
  onSubmit,
}: MembresiaFormDialogProps) {
  const [form, setForm] = useState<MembresiaFormValues>(() => valoresIniciales(null))
  const [submitting, setSubmitting] = useState(false)
  const isEditing = membresia !== null

  useEffect(() => {
    if (open) setForm(valoresIniciales(membresia))
  }, [open, membresia])

  const valorTexto = form.valor.trim().replace(',', '.')
  const valorNumero = valorTexto === '' ? NaN : Number(valorTexto)
  const valorError =
    valorTexto === '' ? null : !Number.isFinite(valorNumero) || valorNumero < 0 ? 'Ingresá un importe válido' : null
  const fechasError =
    form.fechaInicio && form.fechaVencimiento && form.fechaInicio > form.fechaVencimiento
      ? 'El inicio no puede ser posterior al vencimiento'
      : null

  const esValido =
    form.dniCliente !== null &&
    form.fechaPago !== '' &&
    form.fechaInicio !== '' &&
    form.fechaVencimiento !== '' &&
    Number.isFinite(valorNumero) &&
    valorError === null &&
    fechasError === null

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await onSubmit({ ...form, valor: String(valorNumero) })
    } catch {
      // El padre ya mostró el error
    } finally {
      setSubmitting(false)
    }
  }

  const cambiarFecha = (campo: CampoFecha) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [campo]: event.target.value }))

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      sx={{ '& .MuiDialog-paper': { m: { xs: 1, sm: 2 }, width: { xs: '100%', sm: 520 } } }}
    >
      <DialogTitle>{isEditing ? 'Editar membresía' : 'Nueva membresía'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Autocomplete
            options={clientes}
            value={clientes.find((c) => c.dni === form.dniCliente) ?? null}
            onChange={(_, value) => setForm((prev) => ({ ...prev, dniCliente: value?.dni ?? null }))}
            getOptionLabel={etiqueta}
            isOptionEqualToValue={(a, b) => a.dni === b.dni}
            noOptionsText="No hay clientes que coincidan"
            disabled={submitting || isEditing}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cliente"
                required
                helperText={
                  isEditing
                    ? 'El cliente no se puede cambiar: si está mal, eliminá la membresía y creala de nuevo'
                    : ' '
                }
              />
            )}
          />
          <TextField
            label="Fecha de pago"
            type="date"
            value={form.fechaPago}
            onChange={cambiarFecha('fechaPago')}
            disabled={submitting}
            slotProps={{ inputLabel: { shrink: true } }}
            required
            fullWidth
          />
          <TextField
            label="Inicio"
            type="date"
            value={form.fechaInicio}
            onChange={cambiarFecha('fechaInicio')}
            disabled={submitting}
            slotProps={{ inputLabel: { shrink: true } }}
            required
            fullWidth
          />
          <TextField
            label="Vencimiento"
            type="date"
            value={form.fechaVencimiento}
            onChange={cambiarFecha('fechaVencimiento')}
            error={fechasError !== null}
            helperText={fechasError ?? ' '}
            disabled={submitting}
            slotProps={{ inputLabel: { shrink: true } }}
            required
            fullWidth
          />
          <TextField
            label="Importe"
            inputMode="decimal"
            value={form.valor}
            onChange={(event) => setForm((prev) => ({ ...prev, valor: event.target.value }))}
            error={valorError !== null}
            helperText={valorError ?? ' '}
            disabled={submitting}
            slotProps={{
              input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
            }}
            required
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={submitting}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!esValido || submitting}
          sx={{ minWidth: 110 }}
        >
          {submitting ? <CircularProgress size={20} color="inherit" /> : isEditing ? 'Guardar' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MembresiaFormDialog
