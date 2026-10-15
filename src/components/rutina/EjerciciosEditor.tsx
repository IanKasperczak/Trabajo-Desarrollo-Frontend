import { Box, Button, Card, Grid, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import type { EjercicioFormValues } from '../../models/rutina'
import { ejercicioVacio, erroresEjercicio } from '../../utils/rutinaForm'

interface EjerciciosEditorProps {
  ejercicios: EjercicioFormValues[]
  onChange: (ejercicios: EjercicioFormValues[]) => void
  // Después de intentar guardar se marcan también los campos obligatorios vacíos
  mostrarErrores: boolean
  disabled?: boolean
}

type Campo = keyof Omit<EjercicioFormValues, 'key' | 'id'>

function EjerciciosEditor({ ejercicios, onChange, mostrarErrores, disabled }: EjerciciosEditorProps) {
  const actualizar = (key: string, campo: Campo, valor: string) =>
    onChange(ejercicios.map((e) => (e.key === key ? { ...e, [campo]: valor } : e)))

  const quitar = (key: string) => onChange(ejercicios.filter((e) => e.key !== key))

  return (
    <Stack spacing={1.5}>
      {ejercicios.map((ejercicio, index) => {
        const errores = erroresEjercicio(ejercicio)
        // Un campo vacío solo se marca después de intentar guardar
        const error = (campo: Campo) =>
          errores[campo] && (mostrarErrores || ejercicio[campo].trim() !== '')
            ? errores[campo]
            : undefined

        return (
          <Card key={ejercicio.key} variant="outlined" sx={{ p: 1.5, bgcolor: 'background.default' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="subtitle2">Ejercicio {index + 1}</Typography>
              <Tooltip title="Quitar ejercicio">
                <span>
                  <IconButton
                    size="small"
                    aria-label={`Quitar ejercicio ${index + 1}`}
                    onClick={() => quitar(ejercicio.key)}
                    disabled={disabled}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
            <Grid container spacing={1.5}>
              <Grid item xs={12}>
                <TextField
                  label="Nombre del ejercicio"
                  size="small"
                  value={ejercicio.nombreEjercicio}
                  onChange={(ev) => actualizar(ejercicio.key, 'nombreEjercicio', ev.target.value)}
                  error={Boolean(error('nombreEjercicio'))}
                  helperText={error('nombreEjercicio')}
                  disabled={disabled}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Series"
                  size="small"
                  inputMode="numeric"
                  value={ejercicio.series}
                  onChange={(ev) =>
                    actualizar(ejercicio.key, 'series', ev.target.value.replace(/\D/g, ''))
                  }
                  error={Boolean(error('series'))}
                  helperText={error('series')}
                  disabled={disabled}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={8} sm={4}>
                <TextField
                  label="Repeticiones"
                  size="small"
                  placeholder="12, 8-10, al fallo"
                  value={ejercicio.repeticiones}
                  onChange={(ev) => actualizar(ejercicio.key, 'repeticiones', ev.target.value)}
                  error={Boolean(error('repeticiones'))}
                  helperText={error('repeticiones')}
                  disabled={disabled}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Descanso (seg)"
                  size="small"
                  inputMode="numeric"
                  value={ejercicio.descanso}
                  onChange={(ev) =>
                    actualizar(ejercicio.key, 'descanso', ev.target.value.replace(/\D/g, ''))
                  }
                  error={Boolean(error('descanso'))}
                  helperText={error('descanso')}
                  disabled={disabled}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Card>
        )
      })}

      {ejercicios.length === 0 && (
        <Typography variant="body2" color={mostrarErrores ? 'error' : 'text.secondary'}>
          Agregá al menos un ejercicio.
        </Typography>
      )}

      <Box>
        <Button
          startIcon={<AddIcon />}
          onClick={() => onChange([...ejercicios, ejercicioVacio()])}
          disabled={disabled}
          sx={{ color: 'text.primary' }}
        >
          Agregar ejercicio
        </Button>
      </Box>
    </Stack>
  )
}

export default EjerciciosEditor
