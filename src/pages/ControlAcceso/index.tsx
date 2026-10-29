import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Alert, Box, Button, Card, Chip, Stack, TextField, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { accesoService } from '../../services/accesoService'
import { mensajeDeErrorApi } from '../../utils/apiError'
import { colorEstado, diasHasta, formatearFecha } from '../../utils/membresia'
import type { AccesoCliente } from '../../models/acceso'

// Aviso corto del tiempo que queda (o que pasó) hasta el vencimiento
function textoPlazo(fechaVencimiento: string): string {
  const dias = diasHasta(fechaVencimiento)
  if (dias < 0) {
    return dias === -1 ? 'Venció ayer' : `Venció hace ${Math.abs(dias)} días`
  }
  if (dias === 0) return 'Vence hoy'
  return dias === 1 ? 'Vence mañana' : `Vence en ${dias} días`
}

function ControlAcceso() {
  const [dni, setDni] = useState('')
  const [cargando, setCargando] = useState(false)
  const [resultado, setResultado] = useState<AccesoCliente | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const verificar = async (event: FormEvent) => {
    event.preventDefault()
    // Acepta el DNI con puntos o espacios (12.345.678)
    const limpio = dni.replace(/\D/g, '')
    if (!limpio) {
      setResultado(null)
      setError('Ingresá el número de DNI.')
      return
    }

    setCargando(true)
    setError(null)
    try {
      setResultado(await accesoService.verificar(Number(limpio)))
    } catch (err) {
      setResultado(null)
      setError(mensajeDeErrorApi(err, 'No se pudo verificar el DNI. Intentá nuevamente.'))
    } finally {
      setCargando(false)
      // Deja el DNI seleccionado para que el próximo se escriba encima
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }

  const membresia = resultado?.membresia ?? null

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" component="h1">
          Control de acceso
        </Typography>
        <Box sx={{ width: 56, height: 4, bgcolor: 'primary.main', borderRadius: 2, mt: 0.5 }} />
      </Box>

      <Box sx={{ maxWidth: 560, mx: 'auto' }}>
        <Box component="form" onSubmit={verificar} noValidate>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              autoFocus
              label="DNI del cliente"
              value={dni}
              onChange={(event) => setDni(event.target.value)}
              inputRef={inputRef}
              slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 12 } }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={cargando}
              sx={{ whiteSpace: 'nowrap', minWidth: 140 }}
            >
              {cargando ? 'Verificando...' : 'Verificar'}
            </Button>
          </Stack>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}

        {resultado && (
          <Card
            variant="outlined"
            sx={{
              mt: 3,
              p: 3,
              textAlign: 'center',
              borderWidth: 2,
              borderColor: resultado.puedeEntrar ? 'success.main' : 'error.main',
            }}
          >
            {resultado.puedeEntrar ? (
              <CheckCircleIcon color="success" sx={{ fontSize: 72 }} />
            ) : (
              <CancelIcon color="error" sx={{ fontSize: 72 }} />
            )}
            <Typography
              variant="h4"
              component="p"
              sx={{ fontWeight: 700, color: resultado.puedeEntrar ? 'success.main' : 'error.main' }}
            >
              {resultado.puedeEntrar ? 'PUEDE ENTRAR' : 'NO PUEDE ENTRAR'}
            </Typography>
            {resultado.motivo && (
              <Typography variant="body1" sx={{ mt: 0.5 }}>
                {resultado.motivo}
              </Typography>
            )}

            <Typography variant="h5" component="h2" sx={{ mt: 2 }}>
              {resultado.cliente.nombre} {resultado.cliente.apellido}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              DNI {resultado.cliente.dni}
            </Typography>

            {membresia && (
              <Stack spacing={1} alignItems="center" sx={{ mt: 2 }}>
                <Chip label={membresia.estado} color={colorEstado[membresia.estado]} />
                <Typography variant="body2">
                  Vigencia: {formatearFecha(membresia.fechaInicio)} al{' '}
                  {formatearFecha(membresia.fechaVencimiento)}
                </Typography>
                {(membresia.estado === 'Activa' ||
                  membresia.estado === 'Por vencer' ||
                  membresia.estado === 'Vencida') && (
                  <Typography variant="body2" color="text.secondary">
                    {textoPlazo(membresia.fechaVencimiento)}
                  </Typography>
                )}
              </Stack>
            )}
          </Card>
        )}
      </Box>
    </Box>
  )
}

export default ControlAcceso