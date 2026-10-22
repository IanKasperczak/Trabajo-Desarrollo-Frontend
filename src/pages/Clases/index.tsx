import { useState } from 'react'
import { Alert, Box, Button, Card, Grid, Snackbar, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import EventIcon from '@mui/icons-material/Event'
import TipoClaseFormDialog from '../../components/clase/TipoClaseFormDialog'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import ListSkeleton from '../../components/ui/ListSkeleton'
import { useAsyncData } from '../../hooks/useAsyncData'
import { tipoClaseService } from '../../services/turnoService'
import { mensajeDeErrorApi } from '../../utils/apiError'
import type { TipoClase, TipoClaseInput } from '../../models/turno'

type SnackbarState = { message: string; severity: 'success' | 'error' } | null

// Los tipos de clase del gimnasio (Crossfit, Musculación...). Los turnos se arman sobre ellos
function Clases() {
  const { data, loading, error, reload } = useAsyncData(tipoClaseService.getAll)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<TipoClase | null>(null)
  const [deleting, setDeleting] = useState<TipoClase | null>(null)
  const [snackbar, setSnackbar] = useState<SnackbarState>(null)

  const tipos = data ?? []

  const handleClose = () => {
    setFormOpen(false)
    setEditing(null)
  }

  const handleSubmit = async (values: TipoClaseInput) => {
    try {
      if (editing) {
        await tipoClaseService.update(editing.idClase, values)
        setSnackbar({ message: 'Clase actualizada correctamente.', severity: 'success' })
      } else {
        await tipoClaseService.create(values)
        setSnackbar({ message: 'Clase creada correctamente.', severity: 'success' })
      }
      await reload()
      handleClose()
    } catch (err) {
      setSnackbar({
        message: mensajeDeErrorApi(err, 'No se pudo guardar la clase. Intentá nuevamente.'),
        severity: 'error',
      })
      throw err
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleting) return
    try {
      await tipoClaseService.delete(deleting.idClase)
      setSnackbar({ message: 'Clase eliminada correctamente.', severity: 'success' })
      await reload()
    } catch (err) {
      setSnackbar({
        message: mensajeDeErrorApi(err, 'No se pudo eliminar la clase. Intentá nuevamente.'),
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
            Clases
          </Typography>
          <Box sx={{ width: 56, height: 4, bgcolor: 'primary.main', borderRadius: 2, mt: 0.5 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, maxWidth: 560 }}>
            Los tipos de clase que da el gimnasio. Los horarios y los cupos se definen en Turnos.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Nueva clase
        </Button>
      </Stack>

      {loading && <ListSkeleton count={4} sizes={{ xs: 12, md: 6, xl: 4 }} />}
      {!loading && error && <ErrorState onRetry={reload} />}
      {!loading && !error && tipos.length === 0 && (
        <EmptyState
          icon={EventIcon}
          message="Todavía no hay clases. Creá la primera (por ejemplo Crossfit) y después armá sus turnos."
        />
      )}

      {!loading && !error && tipos.length > 0 && (
        <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
          {tipos.map((tipo) => (
            <Grid item xs={12} md={6} xl={4} key={tipo.idClase}>
              <Card sx={{ height: '100%', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="h5" component="h2" sx={{ wordBreak: 'break-word' }}>
                  {tipo.nombre}
                </Typography>
                <Typography
                  variant="body2"
                  color={tipo.descripcion ? 'text.primary' : 'text.secondary'}
                  sx={{ flexGrow: 1, wordBreak: 'break-word' }}
                >
                  {tipo.descripcion ?? 'Sin descripción'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, pt: 1, '& > *': { flex: '1 1 auto' } }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => {
                      setEditing(tipo)
                      setFormOpen(true)
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => setDeleting(tipo)}
                  >
                    Eliminar
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <TipoClaseFormDialog open={formOpen} tipo={editing} onClose={handleClose} onSubmit={handleSubmit} />

      <ConfirmDialog
        open={deleting !== null}
        title="Eliminar clase"
        message={
          deleting
            ? `¿Estás seguro de que querés eliminar la clase ${deleting.nombre}? Si tiene turnos, primero hay que eliminarlos.`
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

export default Clases
