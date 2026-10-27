import { useState } from 'react'
import { Alert, Box, Button, Grid, Snackbar, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import GroupIcon from '@mui/icons-material/Group'
import ScheduleIcon from '@mui/icons-material/Schedule'
import DiaSelector from '../../components/turno/DiaSelector'
import InscriptosDialog from '../../components/turno/InscriptosDialog'
import TurnoCard from '../../components/turno/TurnoCard'
import TurnoFormDialog from '../../components/turno/TurnoFormDialog'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import ListSkeleton from '../../components/ui/ListSkeleton'
import { useAsyncData } from '../../hooks/useAsyncData'
import { useTurnos } from '../../hooks/useTurnos'
import { profesorService } from '../../services/profesorService'
import { tipoClaseService, turnoService } from '../../services/turnoService'
import { mensajeDeErrorApi } from '../../utils/apiError'
import { hoyISO } from '../../utils/membresia'
import { etiquetaDia } from '../../utils/turno'
import type { Turno, TurnoFormValues, TurnoInput } from '../../models/turno'

type SnackbarState = { message: string; severity: 'success' | 'error' } | null

const aInput = (values: TurnoFormValues): TurnoInput => ({
  idClase: values.idClase as number,
  fecha: values.modalidad === 'diario' ? null : values.fecha,
  horaInicio: values.horaInicio,
  horaFin: values.horaFin,
  capacidadMaxima: Number(values.capacidadMaxima),
  dniProfesores: values.dniProfesores,
})

// Clases del día: los turnos de una fecha con sus lugares y sus inscriptos. Acá se crean los
// turnos (de un día o "todos los días") y se registra la asistencia
function Turnos() {
  const [fecha, setFecha] = useState(hoyISO)
  const { turnos, loading, error, reload } = useTurnos({ fecha })
  const plantillas = useAsyncData(turnoService.getPlantillas)
  const tipos = useAsyncData(tipoClaseService.getAll)
  const profesores = useAsyncData(profesorService.getAll)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Turno | null>(null)
  const [deleting, setDeleting] = useState<Turno | null>(null)
  const [viendo, setViendo] = useState<Turno | null>(null)
  const [snackbar, setSnackbar] = useState<SnackbarState>(null)

  const abrirNuevo = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const abrirEditar = (turno: Turno) => {
    setEditing(turno)
    setFormOpen(true)
  }
  const cerrarForm = () => {
    setFormOpen(false)
    setEditing(null)
  }

  const recargarTodo = async () => {
    await Promise.all([reload(), plantillas.reload()])
  }

  const handleSubmit = async (values: TurnoFormValues) => {
    try {
      if (editing) {
        await turnoService.update(editing.idTurno, aInput(values))
        setSnackbar({ message: 'Turno actualizado correctamente.', severity: 'success' })
      } else {
        await turnoService.create(aInput(values))
        setSnackbar({
          message:
            values.modalidad === 'diario'
              ? 'Turno creado: se generaron los próximos 30 días.'
              : 'Turno creado correctamente.',
          severity: 'success',
        })
      }
      await recargarTodo()
      cerrarForm()
    } catch (err) {
      setSnackbar({
        message: mensajeDeErrorApi(err, 'No se pudo guardar el turno. Intentá nuevamente.'),
        severity: 'error',
      })
      throw err
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleting) return
    try {
      await turnoService.delete(deleting.idTurno)
      setSnackbar({ message: 'Turno eliminado correctamente.', severity: 'success' })
      await recargarTodo()
    } catch (err) {
      setSnackbar({
        message: mensajeDeErrorApi(err, 'No se pudo eliminar el turno. Intentá nuevamente.'),
        severity: 'error',
      })
    } finally {
      setDeleting(null)
    }
  }

  const acciones = (turno: Turno) => (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      <Button
        variant="outlined"
        size="small"
        startIcon={<GroupIcon />}
        onClick={() => setViendo(turno)}
        sx={{ flex: '1 1 auto' }}
      >
        Inscriptos
      </Button>
      <Button
        variant="contained"
        size="small"
        startIcon={<EditIcon />}
        onClick={() => abrirEditar(turno)}
        sx={{ flex: '1 1 auto' }}
      >
        Editar
      </Button>
      <Button
        variant="outlined"
        color="error"
        size="small"
        startIcon={<DeleteIcon />}
        onClick={() => setDeleting(turno)}
        sx={{ flex: '1 1 auto' }}
      >
        Eliminar
      </Button>
    </Stack>
  )

  const listaPlantillas = plantillas.data ?? []

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'flex-end' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h3" component="h1">
            Turnos
          </Typography>
          <Box sx={{ width: 56, height: 4, bgcolor: 'primary.main', borderRadius: 2, mt: 0.5 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, maxWidth: 560 }}>
            Las clases de cada día, con sus lugares y quiénes se anotaron.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={abrirNuevo}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Nuevo turno
        </Button>
      </Stack>

      <DiaSelector fecha={fecha} onChange={setFecha} />

      {loading && <ListSkeleton count={3} sizes={{ xs: 12, md: 6, xl: 4 }} />}
      {!loading && error && <ErrorState onRetry={reload} />}
      {!loading && !error && turnos.length === 0 && (
        <EmptyState
          icon={ScheduleIcon}
          message={`No hay turnos el ${etiquetaDia(fecha).toLowerCase()}. Creá uno con el botón Nuevo turno.`}
        />
      )}
      {!loading && !error && turnos.length > 0 && (
        <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
          {turnos.map((turno) => (
            <Grid item xs={12} md={6} xl={4} key={turno.idTurno}>
              <TurnoCard turno={turno} acciones={acciones(turno)} />
            </Grid>
          ))}
        </Grid>
      )}

      {listaPlantillas.length > 0 && (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" component="h2">
            Turnos que se repiten todos los días
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2, maxWidth: 620 }}>
            Cada uno genera los turnos de los próximos 30 días. Si lo editás, los cambios se aplican
            a todos los turnos generados. Si lo eliminás, los turnos ya generados quedan como están.
          </Typography>
          <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
            {listaPlantillas.map((turno) => (
              <Grid item xs={12} md={6} xl={4} key={turno.idTurno}>
                <TurnoCard
                  turno={turno}
                  mostrarFecha
                  acciones={
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => abrirEditar(turno)}
                        sx={{ flex: '1 1 auto' }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => setDeleting(turno)}
                        sx={{ flex: '1 1 auto' }}
                      >
                        Eliminar
                      </Button>
                    </Stack>
                  }
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <TurnoFormDialog
        open={formOpen}
        turno={editing}
        tiposClase={tipos.data ?? []}
        profesores={profesores.data ?? []}
        fechaInicial={fecha}
        onClose={cerrarForm}
        onSubmit={handleSubmit}
      />

      <InscriptosDialog turno={viendo} onClose={() => setViendo(null)} onChanged={reload} />

      <ConfirmDialog
        open={deleting !== null}
        title="Eliminar turno"
        message={
          deleting
            ? deleting.fecha === null
              ? 'Este turno deja de repetirse todos los días. Los turnos que ya se generaron no se borran. ¿Querés continuar?'
              : '¿Estás seguro de que querés eliminar este turno? Si tiene inscriptos no se puede eliminar.'
            : ''
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleting(null)}
      />

      <Snackbar
        open={snackbar !== null}
        autoHideDuration={5000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar?.severity ?? 'success'}
          onClose={() => setSnackbar(null)}
          variant="filled"
        >
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Turnos
