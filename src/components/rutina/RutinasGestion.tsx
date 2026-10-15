import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import RutinaCard from './RutinaCard'
import RutinaFormDialog from './RutinaFormDialog'
import ConfirmDialog from '../ui/ConfirmDialog'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'
import ListSkeleton from '../ui/ListSkeleton'
import { useAsyncData } from '../../hooks/useAsyncData'
import { rutinaService } from '../../services/rutinaService'
import { clienteService } from '../../services/clienteService'
import { profesorService } from '../../services/profesorService'
import { mensajeDeErrorApi } from '../../utils/apiError'
import { DIAS_SEMANA, ordenDia } from '../../utils/dias'
import { aEjercicioInput, cambiosEjercicio } from '../../utils/rutinaForm'
import type { PersonaResumen, Rutina, RutinaFormValues, RutinaUpdate } from '../../models/rutina'

interface RutinasGestionProps {
  // admin: ve y asigna cualquier profesor. profesor: solo las suyas, siempre a su nombre
  modo: 'admin' | 'profesor'
}

type SnackbarState = { message: string; severity: 'success' | 'error' } | null

const aPersona = ({ dni, nombre, apellido }: PersonaResumen): PersonaResumen => ({
  dni,
  nombre,
  apellido,
})

const ordenarPersonas = (a: PersonaResumen, b: PersonaResumen) =>
  a.apellido.localeCompare(b.apellido) || a.nombre.localeCompare(b.nombre)

function RutinasGestion({ modo }: RutinasGestionProps) {
  const esAdmin = modo === 'admin'
  const { data, loading, error, reload } = useAsyncData(async () => {
    const [rutinas, clientes, profesores] = await Promise.all([
      rutinaService.getAll(),
      clienteService.getAll(),
      esAdmin ? profesorService.getAll() : Promise.resolve(null),
    ])
    return {
      rutinas,
      clientes: clientes.map(aPersona).sort(ordenarPersonas),
      profesores: profesores ? profesores.map(aPersona).sort(ordenarPersonas) : null,
    }
  })

  const [query, setQuery] = useState('')
  const [filtroDia, setFiltroDia] = useState('todos')
  const [formOpen, setFormOpen] = useState(false)
  const [editando, setEditando] = useState<Rutina | null>(null)
  const [eliminando, setEliminando] = useState<Rutina | null>(null)
  const [snackbar, setSnackbar] = useState<SnackbarState>(null)

  const normalizedQuery = query.trim().toLowerCase()
  const persona = (p: PersonaResumen | null) => (p ? `${p.nombre} ${p.apellido}` : '')
  const rutinas = [...(data?.rutinas ?? [])]
    .filter((r) => {
      const coincideDia =
        filtroDia === 'todos' ||
        (filtroDia === 'sin' ? !r.diaSemana : r.diaSemana?.toLowerCase() === filtroDia.toLowerCase())
      const texto = [r.nombreRutina, persona(r.cliente), String(r.dniCliente), persona(r.profesor)]
        .join(' ')
        .toLowerCase()
      return coincideDia && (!normalizedQuery || texto.includes(normalizedQuery))
    })
    .sort(
      (a, b) =>
        (a.cliente?.apellido ?? '').localeCompare(b.cliente?.apellido ?? '') ||
        ordenDia(a.diaSemana) - ordenDia(b.diaSemana),
    )

  const abrirNueva = () => {
    setEditando(null)
    setFormOpen(true)
  }

  const abrirEdicion = (rutina: Rutina) => {
    setEditando(rutina)
    setFormOpen(true)
  }

  const cerrarFormulario = () => {
    setFormOpen(false)
    setEditando(null)
  }

  const crear = async (values: RutinaFormValues) => {
    await rutinaService.create({
      nombreRutina: values.nombreRutina.trim(),
      diaSemana: values.diaSemana || null,
      dniCliente: values.dniCliente as number,
      ...(esAdmin ? { dniProfesor: values.dniProfesor as number } : {}),
      ejercicios: values.ejercicios.map(aEjercicioInput),
    })
  }

  // La API edita la rutina y cada ejercicio por separado: se mandan solo los cambios
  const guardarCambios = async (original: Rutina, values: RutinaFormValues) => {
    const id = original.idRutina
    const cambios: RutinaUpdate = {}
    const nombre = values.nombreRutina.trim()
    const dia = values.diaSemana || null
    if (nombre !== original.nombreRutina) cambios.nombreRutina = nombre
    if (dia !== original.diaSemana) cambios.diaSemana = dia
    if (values.dniCliente !== original.dniCliente) cambios.dniCliente = values.dniCliente as number
    if (esAdmin && values.dniProfesor !== original.dniProfesor) {
      cambios.dniProfesor = values.dniProfesor as number
    }
    if (Object.keys(cambios).length) await rutinaService.update(id, cambios)

    const originales = new Map(original.ejercicios.map((e) => [e.id, e]))
    const conservados = new Set<number>()
    for (const fila of values.ejercicios) {
      if (fila.id === undefined) continue
      conservados.add(fila.id)
      const previo = originales.get(fila.id)
      const diferencia = previo ? cambiosEjercicio(previo, aEjercicioInput(fila)) : {}
      if (Object.keys(diferencia).length) {
        await rutinaService.updateEjercicio(id, fila.id, diferencia)
      }
    }
    for (const ejercicio of original.ejercicios) {
      if (!conservados.has(ejercicio.id)) await rutinaService.deleteEjercicio(id, ejercicio.id)
    }
    for (const fila of values.ejercicios) {
      if (fila.id === undefined) await rutinaService.addEjercicio(id, aEjercicioInput(fila))
    }
  }

  const handleSubmit = async (values: RutinaFormValues) => {
    if (!editando) {
      try {
        await crear(values)
        setSnackbar({ message: 'Rutina creada correctamente.', severity: 'success' })
        cerrarFormulario()
        await reload()
      } catch (err) {
        setSnackbar({
          message: mensajeDeErrorApi(err, 'No se pudo crear la rutina. Intentá nuevamente.'),
          severity: 'error',
        })
        throw err
      }
      return
    }

    try {
      await guardarCambios(editando, values)
      setSnackbar({ message: 'Rutina actualizada correctamente.', severity: 'success' })
    } catch (err) {
      // Pueden haber quedado guardados algunos cambios: se recarga para mostrar el estado real
      setSnackbar({
        message: mensajeDeErrorApi(
          err,
          'No se pudieron guardar todos los cambios. Revisá la rutina y volvé a intentar.',
        ),
        severity: 'error',
      })
    }
    cerrarFormulario()
    await reload()
  }

  const handleConfirmDelete = async () => {
    if (!eliminando) return
    try {
      await rutinaService.delete(eliminando.idRutina)
      setSnackbar({ message: 'Rutina eliminada correctamente.', severity: 'success' })
      await reload()
    } catch (err) {
      setSnackbar({
        message: mensajeDeErrorApi(err, 'No se pudo eliminar la rutina. Intentá nuevamente.'),
        severity: 'error',
      })
    } finally {
      setEliminando(null)
    }
  }

  const sinRutinas = (data?.rutinas.length ?? 0) === 0

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', md: 'flex-end' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h3" component="h1">
            {esAdmin ? 'Rutinas' : 'Mis Rutinas'}
          </Typography>
          <Box sx={{ width: 56, height: 4, bgcolor: 'primary.main', borderRadius: 2, mt: 0.5 }} />
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', sm: 'center' }}
        >
          <TextField
            size="small"
            placeholder={esAdmin ? 'Buscar por rutina, cliente o profesor...' : 'Buscar por rutina o cliente...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ width: { xs: '100%', sm: 280 } }}
          />
          <TextField
            select
            size="small"
            label="Día"
            value={filtroDia}
            onChange={(e) => setFiltroDia(e.target.value)}
            sx={{ width: { xs: '100%', sm: 160 } }}
          >
            <MenuItem value="todos">Todos los días</MenuItem>
            {DIAS_SEMANA.map((dia) => (
              <MenuItem key={dia} value={dia}>
                {dia}
              </MenuItem>
            ))}
            <MenuItem value="sin">Sin día</MenuItem>
          </TextField>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={abrirNueva}
            disabled={!data}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Nueva rutina
          </Button>
        </Stack>
      </Stack>

      {loading && <ListSkeleton count={4} sizes={{ xs: 12, md: 6, lg: 4 }} />}

      {!loading && error && <ErrorState onRetry={reload} />}

      {!loading && !error && sinRutinas && (
        <EmptyState message="Todavía no hay rutinas. Creá la primera con el botón Nueva rutina." />
      )}

      {!loading && !error && !sinRutinas && rutinas.length === 0 && (
        <EmptyState message="No se encontraron rutinas que coincidan con la búsqueda." />
      )}

      {!loading && !error && rutinas.length > 0 && (
        <Grid container spacing={2}>
          {rutinas.map((rutina) => (
            <Grid item xs={12} md={6} lg={4} key={rutina.idRutina}>
              <RutinaCard
                rutina={rutina}
                mostrarCliente
                mostrarProfesor={esAdmin}
                onEdit={abrirEdicion}
                onDelete={setEliminando}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {data && (
        <RutinaFormDialog
          open={formOpen}
          rutina={editando}
          clientes={data.clientes}
          profesores={data.profesores}
          onClose={cerrarFormulario}
          onSubmit={handleSubmit}
        />
      )}

      <ConfirmDialog
        open={eliminando !== null}
        title="Eliminar rutina"
        message={
          eliminando
            ? `¿Eliminar la rutina "${eliminando.nombreRutina}"${eliminando.cliente ? ` de ${eliminando.cliente.nombre} ${eliminando.cliente.apellido}` : ''}? También se eliminan sus ${eliminando.ejercicios.length} ejercicios. Esta acción no se puede deshacer.`
            : ''
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setEliminando(null)}
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

export default RutinasGestion
