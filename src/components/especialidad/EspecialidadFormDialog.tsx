import { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import type { Especialidad, EspecialidadInput } from '../../models/especialidad'

interface EspecialidadFormDialogProps {
  open: boolean
  especialidad: Especialidad | null
  onClose: () => void
  onSubmit: (data: EspecialidadInput) => Promise<void>
}

function EspecialidadFormDialog({
  open,
  especialidad,
  onClose,
  onSubmit,
}: EspecialidadFormDialogProps) {
  const isEditing = especialidad !== null
  const [nombre, setNombre] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setNombre(especialidad?.nombre ?? '')
    }
  }, [open, especialidad])

  const isFormValid = nombre.trim() !== ''

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await onSubmit({ nombre })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        {isEditing ? 'Editar Especialidad' : 'Nueva Especialidad'}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Nombre"
          value={nombre}
          onChange={(event) => setNombre(event.target.value)}
          required
          fullWidth
          autoFocus
          sx={{ pt: 1 }}
        />
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

export default EspecialidadFormDialog