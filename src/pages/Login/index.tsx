import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { isAxiosError } from 'axios'
import { useAuth } from '../../hooks/useAuth'
import FullPageLoader from '../../components/auth/FullPageLoader'
import type { Usuario } from '../../models/usuario'
import { roleBase } from '../../utils/navigation'
import { easeOut } from '../../styles/theme'

const mensajeDeError = (error: unknown) => {
  if (isAxiosError(error)) {
    if (error.response?.status === 401) return 'Email o contraseña incorrectos.'
    if (error.response?.status === 429) {
      return 'Demasiados intentos fallidos. Esperá unos minutos y volvé a intentar.'
    }
    if (error.response?.status === 400) return 'Completá el email y la contraseña.'
  }
  return 'No se pudo conectar con el servidor. Intentá nuevamente.'
}

// Solo vuelve a una ruta interna que corresponda al rol del usuario (evita open redirects)
const destinoPostLogin = (usuario: Usuario, from: unknown) => {
  const base = roleBase[usuario.rol]
  if (typeof from === 'string' && (from === base || from.startsWith(`${base}/`))) return from
  return base
}

function Login() {
  const { usuario, status, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: unknown } | null)?.from

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (status === 'loading') return <FullPageLoader />
  if (usuario && !submitting) return <Navigate to={destinoPostLogin(usuario, from)} replace />

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email.trim() || !password) {
      setError('Completá el email y la contraseña.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const logged = await login({ email: email.trim(), password })
      navigate(destinoPostLogin(logged, from), { replace: true })
    } catch (err) {
      setError(mensajeDeError(err))
      setPassword('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 4,
        bgcolor: '#1C1B17',
        backgroundImage:
          'radial-gradient(900px 480px at 50% -8%, rgba(255, 193, 7, 0.12), transparent 70%)',
      }}
    >
      <Paper
        component="main"
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 400,
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 28px 60px -16px rgba(0, 0, 0, 0.6)',
          animation: `page-enter 320ms ${easeOut} both`,
        }}
      >
        <Stack spacing={1} alignItems="center" sx={{ mb: 3 }}>
          <FitnessCenterIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" textAlign="center">
            Gimnasio Power Trainer
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ingresá con tu cuenta
          </Typography>
        </Stack>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            {error && (
              <Alert severity="error" role="alert">
                {error}
              </Alert>
            )}
            <TextField
              label="Email"
              type="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={submitting}
              autoFocus
              fullWidth
              required
            />
            <TextField
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={submitting}
              fullWidth
              required
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
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {submitting ? 'Ingresando...' : 'Ingresar'}
            </Button>
            <Typography variant="caption" color="text.secondary" textAlign="center">
              ¿No tenés cuenta? Pedísela a un administrador del gimnasio.
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
}

export default Login
