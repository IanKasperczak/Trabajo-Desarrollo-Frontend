import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import ProfesorList from '../../components/profesor/ProfesorList'
import ProfesorFormDialog from '../../components/profesor/ProfesorFormDialog'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import ErrorState from '../../components/ui/ErrorState'
import EmptyState from '../../components/ui/EmptyState'
import ListSkeleton from '../../components/ui/ListSkeleton'
import { useAsyncData } from '../../hooks/useAsyncData'
import { profesorService } from '../../services/profesorService'
import type { Profesor, ProfesorInput } from '../../models/profesor'

type SnackbarState = { message: string; severity: 'success' | 'error' } | null

function Profesores() {
  const { data, loading, error, reload } = useAsyncData(profesorService.getAll)

  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Profesor | null>(null)
  const [deleting, setDeleting] = useState<Profesor | null>(null)
  const [snackbar, setSnackbar] = useState<SnackbarState>(null)

  const profesores = data ?? []
  const normalizedQuery = query.trim().toLowerCase()
  const filtered = normalizedQuery
    ? profesores.filter(
        (profesor) =>
          profesor.nombre.toLowerCase().includes(normalizedQuery) ||
          profesor.apellido.toLowerCase().includes(normalizedQuery) ||
          String(profesor.dni).includes(normalizedQuery),
      )
    : profesores

  const handleOpenCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const handleOpenEdit = (profesor: Profesor) => {
    setEditing(profesor)
    setFormOpen(true)
  }

  const handleSubmit = async (values: ProfesorInput) => {
    try {
      if (editing) {
        await profesorService.update(editing.dni, values)
        setSnackbar({ message: 'Profesor actualizado correctamente.', severity: 'success' })
      } else {
        await profesorService.create(values)
        setSnackbar({ message: 'Profesor creado correctamente.', severity: 'success' })
      }
      await reload()
      setFormOpen(false)
      setEditing(null)
    } catch {
      setSnackbar({
        message: 'No se pudo guardar el profesor. Intentá nuevamente.',
        severity: 'error',
      })
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleting) return
    try {
      await profesorService.delete(deleting.dni)
      setSnackbar({ message: 'Profesor eliminado correctamente.', severity: 'success' })
      await reload()
    } catch {
      setSnackbar({
        message: 'No se pudo eliminar el profesor. Intentá nuevamente.',
        severity: 'error',
      })
    } finally {
      setDeleting(null)
    }
  }

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
            Profesores
          </Typography>
          <Box
            sx={{
              width: 56,
              height: 4,
              bgcolor: 'primary.main',
              borderRadius: 2,
              mt: 0.5,
            }}
          />
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', sm: 'center' }}
        >
          <TextField
            size="small"
            placeholder="Buscar por nombre, apellido o DNI..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: '100%', sm: 300 } }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Nuevo Profesor
          </Button>
        </Stack>
      </Stack>

      {loading && <ListSkeleton />}

      {!loading && error && <ErrorState onRetry={reload} />}

      {!loading && !error && profesores.length === 0 && (
        <EmptyState message="Aún no hay profesores registrados. Creá el primero con el botón Nuevo Profesor." />
      )}

      {!loading && !error && profesores.length > 0 && filtered.length === 0 && (
        <EmptyState message="No se encontraron profesores que coincidan con la búsqueda." />
      )}

      {!loading && !error && filtered.length > 0 && (
        <ProfesorList
          profesores={filtered}
          onEdit={handleOpenEdit}
          onDelete={setDeleting}
        />
      )}

      <ProfesorFormDialog
        open={formOpen}
        profesor={editing}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={deleting !== null}
        title="Eliminar Profesor"
        message={
          deleting
            ? `¿Estás seguro de que querés eliminar a ${deleting.nombre} ${deleting.apellido}? Esta acción no se puede deshacer.`
            : ''
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleting(null)}
      />

      <Snackbar
        open={snackbar !== null}
        autoHideDuration={4000}
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

export default Profesores