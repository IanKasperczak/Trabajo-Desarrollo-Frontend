import { useState } from 'react'
import type { FormEvent } from 'react'
import { Box, Button, CircularProgress, Stack } from '@mui/material'
import PasswordField from '../ui/PasswordField'
import type { CambiarPasswordInput } from '../../models/usuario'

interface CambiarPasswordFormProps {
  // Si falla, tiene que lanzar el error para que el formulario conserve lo escrito
  onSubmit: (data: CambiarPasswordInput) => Promise<void>
}

const PASSWORD_MIN = 8
// bcrypt (en el backend) solo usa los primeros 72 bytes
const PASSWORD_MAX_BYTES = 72

const emptyForm = { actual: '', nueva: '', repetida: '' }

function CambiarPasswordForm({ onSubmit }: CambiarPasswordFormProps) {
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  const bytes = new TextEncoder().encode(form.nueva).length
  const errorNueva =
    form.nueva === ''
      ? null
      : form.nueva.length < PASSWORD_MIN
        ? `Mínimo ${PASSWORD_MIN} caracteres`
        : bytes > PASSWORD_MAX_BYTES
          ? 'Es demasiado larga'
          : form.nueva === form.actual
            ? 'Tiene que ser distinta de la actual'
            : null
  const errorRepetida =
    form.repetida !== '' && form.repetida !== form.nueva ? 'Las contraseñas no coinciden' : null

  const isFormValid =
    form.actual !== '' &&
    form.nueva !== '' &&
    errorNueva === null &&
    form.repetida === form.nueva

  const handleChange =
    (field: keyof typeof emptyForm) => (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: event.target.value }))

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isFormValid) return
    setSubmitting(true)
    try {
      await onSubmit({ passwordActual: form.actual, passwordNueva: form.nueva })
      setForm(emptyForm)
    } catch {
      // El padre ya mostró el error; se deja el formulario como estaba para corregirlo
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={2}>
        <PasswordField
          label="Contraseña actual"
          name="current-password"
          autoComplete="current-password"
          value={form.actual}
          onChange={handleChange('actual')}
          disabled={submitting}
          required
          fullWidth
        />
        <PasswordField
          label="Contraseña nueva"
          name="new-password"
          autoComplete="new-password"
          value={form.nueva}
          onChange={handleChange('nueva')}
          error={errorNueva !== null}
          helperText={errorNueva ?? `Mínimo ${PASSWORD_MIN} caracteres`}
          disabled={submitting}
          required
          fullWidth
        />
        <PasswordField
          label="Repetí la contraseña nueva"
          name="new-password-repeat"
          autoComplete="new-password"
          value={form.repetida}
          onChange={handleChange('repetida')}
          error={errorRepetida !== null}
          helperText={errorRepetida ?? ' '}
          disabled={submitting}
          required
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          disabled={!isFormValid || submitting}
          startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
          sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
        >
          {submitting ? 'Guardando...' : 'Cambiar contraseña'}
        </Button>
      </Stack>
    </Box>
  )
}

export default CambiarPasswordForm
