import { useEffect, useState } from 'react'
import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import EjerciciosEditor from './EjerciciosEditor'
import type { PersonaResumen, Rutina, RutinaFormValues } from '../../models/rutina'
import { DIAS_SEMANA } from '../../utils/dias'
import { ejercicioValido, rutinaAFormulario } from '../../utils/rutinaForm'

interface RutinaFormDialogProps {
  open: boolean
  rutina: Rutina | null
  clientes: PersonaResumen[]
  // Solo el admin elige el profesor; si es null, la rutina queda a nombre de quien la crea
  profesores: PersonaResumen[] | null
  onClose: () => void
  // Si falla, tiene que lanzar el error para que el diálogo quede abierto con lo escrito
  onSubmit: (values: RutinaFormValues) => Promise<void>
}

const etiquetaPersona = (p: PersonaResumen) => `${p.apellido}, ${p.nombre} (DNI ${p.dni})`

function RutinaFormDialog({
  open,
  rutina,
  clientes,
  profesores,
  onClose,
  onSubmit,
}: RutinaFormDialogProps) {
  const [form, setForm] = useState<RutinaFormValues>(() => rutinaAFormulario(null))
  const [mostrarErrores, setMostrarErrores] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(rutinaAFormulario(rutina))
      setMostrarErrores(false)
    }
  }, [open, rutina])

  const eligeProfesor = profesores !== null
  // Si la rutina tiene un día escrito a mano que no está en la lista, se conserva como opción
  const dias: readonly string[] = DIAS_SEMANA
  const opcionesDia =
    form.diaSemana && !dias.includes(form.diaSemana) ? [...dias, form.diaSemana] : dias

  const errores = {
    nombreRutina: !form.nombreRutina.trim() ? 'Obligatorio' : undefined,
    cliente: form.dniCliente === null ? 'Elegí un cliente' : undefined,
    profesor: eligeProfesor && form.dniProfesor === null ? 'Elegí un profesor' : undefined,
  }
  const esValido =
    !errores.nombreRutina &&
    !errores.cliente &&
    !errores.profesor &&
    form.ejercicios.length > 0 &&
    form.ejercicios.every(ejercicioValido)

  const handleSubmit = async () => {
    if (!esValido) {
      setMostrarErrores(true)
      return
    }
    setSubmitting(true)
    try {
      await onSubmit(form)
    } catch {
      // El padre ya mostró el error
    } finally {
      setSubmitting(false)
    }
  }

  const clienteElegido = clientes.find((c) => c.dni === form.dniCliente) ?? null
  const profesorElegido = profesores?.find((p) => p.dni === form.dniProfesor) ?? null

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      sx={{ '& .MuiDialog-paper': { m: { xs: 1, sm: 2 }, width: { xs: '100%', sm: 600 } } }}
    >
      <DialogTitle>{rutina ? 'Editar rutina' : 'Nueva rutina'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            label="Nombre de la rutina"
            placeholder="Ej.: Tren superior"
            value={form.nombreRutina}
            onChange={(e) => setForm((prev) => ({ ...prev, nombreRutina: e.target.value }))}
            error={mostrarErrores && Boolean(errores.nombreRutina)}
            helperText={mostrarErrores ? errores.nombreRutina : undefined}
            disabled={submitting}
            required
            fullWidth
          />
          <TextField
            select
            label="Día"
            value={form.diaSemana}
            onChange={(e) => setForm((prev) => ({ ...prev, diaSemana: e.target.value }))}
            disabled={submitting}
            fullWidth
          >
            <MenuItem value="">Sin día asignado</MenuItem>
            {opcionesDia.map((dia) => (
              <MenuItem key={dia} value={dia}>
                {dia}
              </MenuItem>
            ))}
          </TextField>
          <Autocomplete
            options={clientes}
            value={clienteElegido}
            onChange={(_, value) => setForm((prev) => ({ ...prev, dniCliente: value?.dni ?? null }))}
            getOptionLabel={etiquetaPersona}
            isOptionEqualToValue={(a, b) => a.dni === b.dni}
            noOptionsText="No hay clientes que coincidan"
            disabled={submitting}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cliente"
                required
                error={mostrarErrores && Boolean(errores.cliente)}
                helperText={mostrarErrores ? errores.cliente : undefined}
              />
            )}
          />
          {eligeProfesor && (
            <Autocomplete
              options={profesores}
              value={profesorElegido}
              onChange={(_, value) =>
                setForm((prev) => ({ ...prev, dniProfesor: value?.dni ?? null }))
              }
              getOptionLabel={etiquetaPersona}
              isOptionEqualToValue={(a, b) => a.dni === b.dni}
              noOptionsText="No hay profesores que coincidan"
              disabled={submitting}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Profesor a cargo"
                  required
                  error={mostrarErrores && Boolean(errores.profesor)}
                  helperText={mostrarErrores ? errores.profesor : undefined}
                />
              )}
            />
          )}

          <Divider />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Ejercicios
          </Typography>
          <EjerciciosEditor
            ejercicios={form.ejercicios}
            onChange={(ejercicios) => setForm((prev) => ({ ...prev, ejercicios }))}
            mostrarErrores={mostrarErrores}
            disabled={submitting}
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
          disabled={submitting}
          sx={{ minWidth: 110 }}
        >
          {submitting ? <CircularProgress size={20} color="inherit" /> : rutina ? 'Guardar' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RutinaFormDialog
