import { useEffect, useState } from 'react'
import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import type { Profesor } from '../../models/profesor'
import type { TipoClase, Turno, TurnoFormValues } from '../../models/turno'
import { hoyISO } from '../../utils/membresia'

interface TurnoFormDialogProps {
  open: boolean
  turno: Turno | null
  tiposClase: TipoClase[]
  profesores: Profesor[]
  // Fecha que se está mirando: un turno nuevo arranca en ese día
  fechaInicial?: string
  onClose: () => void
  // Si falla, tiene que lanzar el error para que el diálogo quede abierto con lo escrito
  onSubmit: (values: TurnoFormValues) => Promise<void>
}

const valoresIniciales = (turno: Turno | null, fechaInicial: string): TurnoFormValues =>
  turno
    ? {
        idClase: turno.idClase,
        modalidad:
          turno.fecha === null || turno.idTurnoPlantilla != null ? 'diario' : 'dia',
        fecha: turno.fecha ?? fechaInicial,
        horaInicio: turno.horaInicio?.slice(0, 5) ?? '',
        horaFin: turno.horaFin?.slice(0, 5) ?? '',
        capacidadMaxima: String(turno.capacidadMaxima ?? ''),
        dniProfesores: turno.profesores.map((p) => p.dni),
      }
    : {
        idClase: null,
        modalidad: 'dia',
        fecha: fechaInicial,
        horaInicio: '',
        horaFin: '',
        capacidadMaxima: '',
        dniProfesores: [],
      }

const etiquetaProfesor = (p: Profesor) => `${p.apellido}, ${p.nombre}`

function TurnoFormDialog({
  open,
  turno,
  tiposClase,
  profesores,
  fechaInicial = hoyISO(),
  onClose,
  onSubmit,
}: TurnoFormDialogProps) {
  const [form, setForm] = useState<TurnoFormValues>(() => valoresIniciales(null, fechaInicial))
  const [submitting, setSubmitting] = useState(false)
  const isEditing = turno !== null

  useEffect(() => {
    if (open) setForm(valoresIniciales(turno, fechaInicial))
  }, [open, turno, fechaInicial])

  const capacidad = Number(form.capacidadMaxima)
  const horarioError =
    form.horaInicio && form.horaFin && form.horaFin <= form.horaInicio
      ? 'La hora de fin tiene que ser posterior a la de inicio'
      : null
  const capacidadError =
    form.capacidadMaxima !== '' && (!Number.isInteger(capacidad) || capacidad < 1)
      ? 'Ingresá un número entero mayor a 0'
      : null

  const esValido =
    form.idClase !== null &&
    form.horaInicio !== '' &&
    form.horaFin !== '' &&
    horarioError === null &&
    form.capacidadMaxima !== '' &&
    capacidadError === null &&
    (form.modalidad === 'diario' || form.fecha !== '')

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await onSubmit(form)
    } catch {
      // El padre ya mostró el error
    } finally {
      setSubmitting(false)
    }
  }

  const seleccionados = profesores.filter((p) => form.dniProfesores.includes(p.dni))

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      sx={{ '& .MuiDialog-paper': { m: { xs: 1, sm: 2 }, width: { xs: '100%', sm: 520 } } }}
    >
      <DialogTitle>{isEditing ? 'Editar turno' : 'Nuevo turno'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            select
            label="Clase"
            value={form.idClase ?? ''}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, idClase: Number(event.target.value) }))
            }
            disabled={submitting}
            required
            fullWidth
            helperText={tiposClase.length === 0 ? 'Primero creá una clase en la sección Clases' : ' '}
          >
            {tiposClase.map((tipo) => (
              <MenuItem key={tipo.idClase} value={tipo.idClase}>
                {tipo.nombre}
              </MenuItem>
            ))}
          </TextField>

          <div>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
              Cuándo
            </Typography>
            <ToggleButtonGroup
              exclusive
              fullWidth
              size="small"
              value={form.modalidad}
              onChange={(_, valor: TurnoFormValues['modalidad'] | null) => {
                if (valor) setForm((prev) => ({ ...prev, modalidad: valor }))
              }}
              disabled={submitting || isEditing}
              aria-label="Cuándo se dicta"
            >
              <ToggleButton value="dia">Un día</ToggleButton>
              <ToggleButton value="diario">Todos los días</ToggleButton>
            </ToggleButtonGroup>
            <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 0.75 }}>
              {isEditing
                ? form.modalidad === 'diario'
                  ? 'Este turno pertenece a una repetición diaria. Los cambios se aplican a todos los turnos generados.'
                  : 'Un turno ya creado no pasa de "un día" a "todos los días", ni al revés.'
                : form.modalidad === 'diario'
                  ? 'Se generan los turnos de los próximos 30 días y se siguen generando cada día.'
                  : 'Se crea un solo turno en la fecha elegida.'}
            </Typography>
          </div>

          {form.modalidad === 'dia' && (
            <TextField
              label="Fecha"
              type="date"
              value={form.fecha}
              onChange={(event) => setForm((prev) => ({ ...prev, fecha: event.target.value }))}
              disabled={submitting}
              slotProps={{ inputLabel: { shrink: true } }}
              required
              fullWidth
            />
          )}

          <Stack direction="row" spacing={2}>
            <TextField
              label="Desde"
              type="time"
              value={form.horaInicio}
              onChange={(event) => setForm((prev) => ({ ...prev, horaInicio: event.target.value }))}
              disabled={submitting}
              slotProps={{ inputLabel: { shrink: true } }}
              required
              fullWidth
            />
            <TextField
              label="Hasta"
              type="time"
              value={form.horaFin}
              onChange={(event) => setForm((prev) => ({ ...prev, horaFin: event.target.value }))}
              error={horarioError !== null}
              helperText={horarioError ?? ' '}
              disabled={submitting}
              slotProps={{ inputLabel: { shrink: true } }}
              required
              fullWidth
            />
          </Stack>

          <TextField
            label="Lugares"
            inputMode="numeric"
            value={form.capacidadMaxima}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, capacidadMaxima: event.target.value.trim() }))
            }
            error={capacidadError !== null}
            helperText={capacidadError ?? ' '}
            disabled={submitting}
            required
            fullWidth
          />

          <Autocomplete
            multiple
            options={profesores}
            value={seleccionados}
            onChange={(_, value) =>
              setForm((prev) => ({ ...prev, dniProfesores: value.map((p) => p.dni) }))
            }
            getOptionLabel={etiquetaProfesor}
            isOptionEqualToValue={(a, b) => a.dni === b.dni}
            noOptionsText="No hay profesores que coincidan"
            disabled={submitting}
            renderInput={(params) => (
              <TextField {...params} label="Profesores" helperText="Podés asignar más de uno" />
            )}
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
          disabled={!esValido || submitting}
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
    </Dialog>
  )
}

export default TurnoFormDialog
