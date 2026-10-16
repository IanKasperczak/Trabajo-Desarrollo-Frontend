import { useEffect, useState } from 'react'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import PasswordField from '../ui/PasswordField'
import type { Cuenta } from '../../models/usuario'

interface ResetPasswordDialogProps {
  cuenta: Cuenta | null
  onClose: () => void
  // Si falla, tiene que lanzar el error para que el diálogo quede abierto con lo escrito
  onSubmit: (cuenta: Cuenta, password: string) => Promise<void>
}

const PASSWORD_MIN = 8

function ResetPasswordDialog({ cuenta, onClose, onSubmit }: ResetPasswordDialogProps) {
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setPassword('')
  }, [cuenta])

  const passwordError =
    password !== '' && password.length < PASSWORD_MIN ? `Mínimo ${PASSWORD_MIN} caracteres` : null

  const handleSubmit = async () => {
    if (!cuenta) return
    setSubmitting(true)
    try {
      await onSubmit(cuenta, password)
    } catch {
      // El padre ya mostró el error
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={cuenta !== null}
      onClose={submitting ? undefined : onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Resetear contraseña</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2, wordBreak: 'break-word' }}>
          Nueva contraseña para <strong>{cuenta?.email}</strong>. Se cierran sus sesiones abiertas
          y, al volver a entrar, la app le va a recordar que elija una propia.
        </DialogContentText>
        <PasswordField
          label="Contraseña nueva"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={passwordError !== null}
          helperText={passwordError ?? `Mínimo ${PASSWORD_MIN} caracteres`}
          disabled={submitting}
          required
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={submitting}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={password.length < PASSWORD_MIN || submitting}
          sx={{ minWidth: 110 }}
        >
          {submitting ? <CircularProgress size={20} color="inherit" /> : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ResetPasswordDialog
