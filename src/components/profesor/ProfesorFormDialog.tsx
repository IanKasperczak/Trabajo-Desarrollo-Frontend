import { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material'
import type { Profesor, ProfesorInput } from '../../models/profesor'

interface ProfesorFormDialogProps {
  open: boolean
  profesor: Profesor | null
  onClose: () => void
  onSubmit: (data: ProfesorInput) => Promise<void>
}

const emptyForm: ProfesorInput = {
  dni: 0,
  nombre: '',
  apellido: '',
  telefono: '',
  email: '',
}

function ProfesorFormDialog({
  open,
  profesor,
  onClose,
  onSubmit,
}: ProfesorFormDialogProps) {
  const isEditing = profesor !== null
  const [form, setForm] = useState<ProfesorInput>(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(
        profesor
          ? {
              dni: profesor.dni,
              nombre: profesor.nombre,
              apellido: profesor.apellido,
              telefono: profesor.telefono,
              email: profesor.email,
            }
          : emptyForm,
      )
    }
  }, [open, profesor])

  const isFormValid =
    form.dni > 0 &&
    form.nombre.trim() !== '' &&
    form.apellido.trim() !== '' &&
    form.telefono.trim() !== '' &&
    form.email.trim() !== ''

  const handleChange =
    (field: keyof ProfesorInput) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === 'dni'
          ? Number(event.target.value.replace(/\D/g, ''))
          : event.target.value
      setForm((prev) => ({ ...prev, [field]: value }))
    }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await onSubmit(form)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? 'Editar Profesor' : 'Nuevo Profesor'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            label="DNI"
            type="text"
            inputMode="numeric"
            value={form.dni === 0 ? '' : form.dni}
            onChange={handleChange('dni')}
            disabled={isEditing}
            required
            fullWidth
          />
          <TextField
            label="Nombre"
            value={form.nombre}
            onChange={handleChange('nombre')}
            required
            fullWidth
          />
          <TextField
            label="Apellido"
            value={form.apellido}
            onChange={handleChange('apellido')}
            required
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            required
            fullWidth
          />
          <TextField
            label="Teléfono"
            value={form.telefono}
            onChange={handleChange('telefono')}
            required
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!isFormValid || submitting}
        >
          {isEditing ? 'Guardar' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProfesorFormDialog