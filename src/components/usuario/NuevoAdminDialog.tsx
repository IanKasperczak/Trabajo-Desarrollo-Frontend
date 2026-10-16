import { useEffect, useState } from 'react'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material'
import PasswordField from '../ui/PasswordField'
import type { NuevoAdminInput } from '../../models/usuario'

interface NuevoAdminDialogProps {
  open: boolean
  onClose: () => void
  // Si falla, tiene que lanzar el error para que el diálogo quede abierto con lo escrito
  onSubmit: (data: NuevoAdminInput) => Promise<void>
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_MIN = 8

function NuevoAdminDialog({ open, onClose, onSubmit }: NuevoAdminDialogProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setEmail('')
      setPassword('')
    }
  }, [open])

  const passwordError =
    password !== '' && password.length < PASSWORD_MIN ? `Mínimo ${PASSWORD_MIN} caracteres` : null
  const isValid = EMAIL_REGEX.test(email.trim()) && password.length >= PASSWORD_MIN

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await onSubmit({ email: email.trim(), password })
    } catch {
      // El padre ya mostró el error
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={submitting ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Nuevo administrador</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Va a poder gestionar todo el sistema. Al entrar, la app le va a recordar que elija su
          propia contraseña.
        </DialogContentText>
        <Stack spacing={2}>
          <TextField
            label="Email"
            type="email"
            autoComplete="off"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={submitting}
            required
            fullWidth
          />
          <PasswordField
            label="Contraseña inicial"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={passwordError !== null}
            helperText={passwordError ?? `Mínimo ${PASSWORD_MIN} caracteres`}
            disabled={submitting}
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
          disabled={!isValid || submitting}
          sx={{ minWidth: 110 }}
        >
          {submitting ? <CircularProgress size={20} color="inherit" /> : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default NuevoAdminDialog
