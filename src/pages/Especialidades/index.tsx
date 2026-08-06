import { useState } from 'react'
import { Alert, Box, Button, Snackbar, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EspecialidadList from '../../components/especialidad/EspecialidadList'
import EspecialidadFormDialog from '../../components/especialidad/EspecialidadFormDialog'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import ErrorState from '../../components/ui/ErrorState'
import EmptyState from '../../components/ui/EmptyState'
import ListSkeleton from '../../components/ui/ListSkeleton'
import { useAsyncData } from '../../hooks/useAsyncData'
import { especialidadService } from '../../services/especialidadService'
import type { Especialidad, EspecialidadInput } from '../../models/especialidad'

type SnackbarState = { message: string; severity: 'success' | 'error' } | null

function Especialidades() {
  const { data, loading, error, reload } = useAsyncData(
    especialidadService.getAll,
  )

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Especialidad | null>(null)
  const [deleting, setDeleting] = useState<Especialidad | null>(null)
  const [snackbar, setSnackbar] = useState<SnackbarState>(null)

  const especialidades = data ?? []

  const handleOpenCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const handleOpenEdit = (especialidad: Especialidad) => {
    setEditing(especialidad)
    setFormOpen(true)
  }

  const handleSubmit = async (values: EspecialidadInput) => {
    try {
      if (editing) {
        await especialidadService.update(editing.id, values)
        setSnackbar({
          message: 'Especialidad actualizada correctamente.',
          severity: 'success',
        })
      } else {
        await especialidadService.create(values)
        setSnackbar({
          message: 'Especialidad creada correctamente.',
          severity: 'success',
        })
      }
      await reload()
      setFormOpen(false)
      setEditing(null)
    } catch {
      setSnackbar({
        message: 'No se pudo guardar la especialidad. Intentá nuevamente.',
        severity: 'error',
      })
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleting) return
    try {
      await especialidadService.delete(deleting.id)
      setSnackbar({
        message: 'Especialidad eliminada correctamente.',
        severity: 'success',
      })
      await reload()
    } catch {
      setSnackbar({
        message: 'No se pudo eliminar la especialidad. Intentá nuevamente.',
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
            Especialidades
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

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{ whiteSpace: 'nowrap', alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
        >
          Nueva Especialidad
        </Button>
      </Stack>

      {loading && <ListSkeleton sizes={{ xs: 12, sm: 6, md: 4, lg: 3 }} />}

      {!loading && error && <ErrorState onRetry={reload} />}

      {!loading && !error && especialidades.length === 0 && (
        <EmptyState message="Aún no hay especialidades registradas. Creá la primera con el botón Nueva Especialidad." />
      )}

      {!loading && !error && especialidades.length > 0 && (
        <EspecialidadList
          especialidades={especialidades}
          onEdit={handleOpenEdit}
          onDelete={setDeleting}
        />
      )}

      <EspecialidadFormDialog
        open={formOpen}
        especialidad={editing}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={deleting !== null}
        title="Eliminar Especialidad"
        message={
          deleting
            ? `¿Estás seguro de que querés eliminar la especialidad "${deleting.nombre}"? Esta acción no se puede deshacer.`
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

export default Especialidades