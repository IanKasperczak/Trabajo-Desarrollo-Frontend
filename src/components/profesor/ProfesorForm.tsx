import { useEffect, useMemo, useState } from 'react'
import {
  Autocomplete,
  Button,
  Chip,
  CircularProgress,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
} from '@mui/material'
import type { Especialidad } from '../../models/especialidad'
import type { Profesor, ProfesorFormValues } from '../../models/profesor'

interface ProfesorFormProps {
  profesor: Profesor | null
  especialidades: Especialidad[]
  onCancel: () => void
  onSubmit: (values: ProfesorFormValues) => Promise<void>
}

const emptyForm: ProfesorFormValues = {
  dni: 0,
  nombre: '',
  apellido: '',
  telefono: '',
  email: '',
  especialidades: [],
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function ProfesorForm({
  profesor,
  especialidades,
  onCancel,
  onSubmit,
}: ProfesorFormProps) {
  const isEditing = profesor !== null
  const [form, setForm] = useState<ProfesorFormValues>(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (profesor) {
      setForm({
        dni: profesor.dni,
        nombre: profesor.nombre,
        apellido: profesor.apellido,
        telefono: profesor.telefono,
        email: profesor.email,
        especialidades: especialidades.filter((especialidad) =>
          profesor.especialidades.some(
            (asignada) => asignada.idEspecialidad === especialidad.id,
          ),
        ),
      })
    } else {
      setForm(emptyForm)
    }
  }, [profesor, especialidades])

  const isFormValid = useMemo(
    () =>
      (isEditing || form.dni > 0) &&
      form.nombre.trim() !== '' &&
      form.apellido.trim() !== '' &&
      form.telefono.trim() !== '' &&
      EMAIL_REGEX.test(form.email.trim()),
    [isEditing, form],
  )

  const handleChange =
    (field: keyof Omit<ProfesorFormValues, 'especialidades'>) =>
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
      await onSubmit({
        dni: form.dni,
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        telefono: form.telefono.trim(),
        email: form.email.trim(),
        especialidades: form.especialidades,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
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
          <Autocomplete
            multiple
            options={especialidades}
            getOptionLabel={(option) => option.nombre}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={form.especialidades}
            onChange={(_, value) =>
              setForm((prev) => ({ ...prev, especialidades: value }))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Especialidades"
                placeholder="Seleccionar especialidades"
                fullWidth
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option.nombre}
                  color="primary"
                  variant="outlined"
                  size="small"
                  {...getTagProps({ index })}
                />
              ))
            }
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="inherit" disabled={submitting}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!isFormValid || submitting}
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
    </>
  )
}

export default ProfesorForm