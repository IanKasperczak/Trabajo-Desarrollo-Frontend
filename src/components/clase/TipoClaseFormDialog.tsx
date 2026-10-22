import { useEffect, useState } from 'react'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material'
import type { TipoClase, TipoClaseInput } from '../../models/turno'

interface TipoClaseFormDialogProps {
  open: boolean
  tipo: TipoClase | null
  onClose: () => void
  // Si falla, tiene que lanzar el error para que el diálogo quede abierto con lo escrito
  onSubmit: (values: TipoClaseInput) => Promise<void>
}

const NOMBRE_MAX = 80

function TipoClaseFormDialog({ open, tipo, onClose, onSubmit }: TipoClaseFormDialogProps) {
  const [form, setForm] = useState<TipoClaseInput>({ nombre: '', descripcion: '' })
  const [submitting, setSubmitting] = useState(false)
  const isEditing = tipo !== null

  useEffect(() => {
    if (open) setForm({ nombre: tipo?.nombre ?? '', descripcion: tipo?.descripcion ?? '' })
  }, [open, tipo])

  const nombreError = form.nombre.length > NOMBRE_MAX ? `Máximo ${NOMBRE_MAX} caracteres` : null
  const esValido = form.nombre.trim() !== '' && nombreError === null

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await onSubmit({ nombre: form.nombre.trim(), descripcion: form.descripcion.trim() })
    } catch {
      // El padre ya mostró el error
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      sx={{ '& .MuiDialog-paper': { m: { xs: 1, sm: 2 }, width: { xs: '100%', sm: 480 } } }}
    >
      <DialogTitle>{isEditing ? 'Editar clase' : 'Nueva clase'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            label="Nombre"
            value={form.nombre}
            onChange={(event) => setForm((prev) => ({ ...prev, nombre: event.target.value }))}
            error={nombreError !== null}
            helperText={nombreError ?? 'Por ejemplo: Crossfit, Musculación, Funcional'}
            disabled={submitting}
            autoFocus
            required
            fullWidth
          />
          <TextField
            label="Descripción"
            value={form.descripcion}
            onChange={(event) => setForm((prev) => ({ ...prev, descripcion: event.target.value }))}
            disabled={submitting}
            multiline
            minRows={2}
            maxRows={5}
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
          {submitting ? (
            <CircularProgress size={20} color="inherit" />
          ) : isEditing ? (
            'Guardar'
          ) : (
            'Crear'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TipoClaseFormDialog
