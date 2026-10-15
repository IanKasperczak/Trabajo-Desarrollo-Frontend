import { useEffect, useMemo, useState } from 'react'
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import PasswordField from '../ui/PasswordField'
import type { Cliente, ClienteFormValues } from '../../models/cliente'

interface ClienteFormProps {
  cliente: Cliente | null
  onCancel: () => void
  onSubmit: (values: ClienteFormValues) => Promise<void>
}

const emptyForm: ClienteFormValues = {
  dni: 0,
  nombre: '',
  apellido: '',
  telefono: '',
  email: '',
  password: '',
  activo: true,
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_MIN = 8

type CampoDeTexto = 'dni' | 'nombre' | 'apellido' | 'telefono' | 'email' | 'password'

function ClienteForm({ cliente, onCancel, onSubmit }: ClienteFormProps) {
  const isEditing = cliente !== null
  const [form, setForm] = useState<ClienteFormValues>(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setForm(
      cliente
        ? {
            dni: cliente.dni,
            nombre: cliente.nombre,
            apellido: cliente.apellido,
            telefono: cliente.telefono ?? '',
            email: cliente.email,
            password: '',
            activo: cliente.activo,
          }
        : emptyForm,
    )
  }, [cliente])

  // El email es obligatorio: es el usuario con el que entra a la app
  const email = form.email.trim()
  const emailError =
    email === '' ? null : !EMAIL_REGEX.test(email) ? 'Email inválido' : null
  const passwordError =
    form.password !== '' && form.password.length < PASSWORD_MIN
      ? `Mínimo ${PASSWORD_MIN} caracteres`
      : null

  const isFormValid = useMemo(
    () =>
      (isEditing || form.dni > 0) &&
      form.nombre.trim() !== '' &&
      form.apellido.trim() !== '' &&
      email !== '' &&
      emailError === null &&
      passwordError === null,
    [isEditing, form, email, emailError, passwordError],
  )

  const handleChange =
    (field: CampoDeTexto) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === 'dni' ? Number(event.target.value.replace(/\D/g, '')) : event.target.value
      setForm((prev) => ({ ...prev, [field]: value }))
    }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await onSubmit({
        ...form,
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        telefono: form.telefono.trim(),
        email,
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
            helperText={isEditing ? 'El DNI no se puede modificar' : undefined}
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
            label="Teléfono"
            type="tel"
            value={form.telefono}
            onChange={handleChange('telefono')}
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            autoComplete="off"
            value={form.email}
            onChange={handleChange('email')}
            error={emailError !== null}
            helperText={emailError ?? 'Es el usuario con el que entra a la app'}
            required
            fullWidth
          />

          <Divider />
          <Typography variant="subtitle2" color="text.secondary">
            Acceso a la app
          </Typography>

          {!isEditing && (
            <Typography variant="body2" color="text.secondary">
              Se le crea la cuenta: va a entrar con su email y su DNI como contraseña, y después elige
              la suya desde Configuración.
            </Typography>
          )}

          {isEditing && (
            <>
              <PasswordField
                label="Nueva contraseña (opcional)"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange('password')}
                error={passwordError !== null}
                helperText={
                  passwordError ??
                  'Dejala vacía para no cambiarla. Si la cambiás, se cierran sus sesiones abiertas y se le pide que elija una propia.'
                }
                fullWidth
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={form.activo}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, activo: event.target.checked }))
                    }
                  />
                }
                label={form.activo ? 'Acceso a la app habilitado' : 'Acceso a la app deshabilitado'}
              />
            </>
          )}
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

export default ClienteForm
