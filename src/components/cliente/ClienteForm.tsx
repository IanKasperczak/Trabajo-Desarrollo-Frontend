import { useEffect, useMemo, useState } from 'react'
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
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

type CampoDeTexto = keyof Omit<ClienteFormValues, 'activo'>

function ClienteForm({ cliente, onCancel, onSubmit }: ClienteFormProps) {
  const isEditing = cliente !== null
  const [form, setForm] = useState<ClienteFormValues>(emptyForm)
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setForm(cliente ? { ...cliente, password: '' } : emptyForm)
    setShowPassword(false)
  }, [cliente])

  // Al crear la contraseña es obligatoria; al editar, vacía significa "no cambiarla"
  const passwordError =
    form.password !== '' && form.password.length < PASSWORD_MIN
      ? `Mínimo ${PASSWORD_MIN} caracteres`
      : null
  const passwordValida = isEditing ? passwordError === null : form.password.length >= PASSWORD_MIN

  const isFormValid = useMemo(
    () =>
      (isEditing || form.dni > 0) &&
      form.nombre.trim() !== '' &&
      form.apellido.trim() !== '' &&
      form.telefono.trim() !== '' &&
      EMAIL_REGEX.test(form.email.trim()) &&
      passwordValida,
    [isEditing, form, passwordValida],
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
        email: form.email.trim(),
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
            required
            fullWidth
          />

          <Divider />
          <Typography variant="subtitle2" color="text.secondary">
            Cuenta para entrar a la app
          </Typography>
          <TextField
            label="Email"
            type="email"
            autoComplete="off"
            value={form.email}
            onChange={handleChange('email')}
            helperText="Es el usuario con el que el cliente inicia sesión"
            required
            fullWidth
          />
          <TextField
            label={isEditing ? 'Nueva contraseña (opcional)' : 'Contraseña inicial'}
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange('password')}
            error={passwordError !== null}
            helperText={
              passwordError ??
              (isEditing
                ? 'Dejala vacía para no cambiarla. Si la cambiás, se cierran sus sesiones abiertas.'
                : `Mínimo ${PASSWORD_MIN} caracteres. Pasásela al cliente para su primer ingreso.`)
            }
            required={!isEditing}
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          {isEditing && (
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
