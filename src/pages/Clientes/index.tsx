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
import ClienteList from '../../components/cliente/ClienteList'
import ClienteFormDialog from '../../components/cliente/ClienteFormDialog'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import ErrorState from '../../components/ui/ErrorState'
import EmptyState from '../../components/ui/EmptyState'
import ListSkeleton from '../../components/ui/ListSkeleton'
import { useAsyncData } from '../../hooks/useAsyncData'
import { clienteService } from '../../services/clienteService'
import { mensajeDeErrorApi } from '../../utils/apiError'
import type { Cliente, ClienteFormValues, ClienteUpdate } from '../../models/cliente'

type SnackbarState = { message: string; severity: 'success' | 'error' } | null

function Clientes() {
  const { data, loading, error, reload } = useAsyncData(clienteService.getAll)

  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Cliente | null>(null)
  const [deleting, setDeleting] = useState<Cliente | null>(null)
  const [snackbar, setSnackbar] = useState<SnackbarState>(null)

  const clientes = data ?? []
  const normalizedQuery = query.trim().toLowerCase()
  const filtered = normalizedQuery
    ? clientes.filter(
        (cliente) =>
          cliente.nombre.toLowerCase().includes(normalizedQuery) ||
          cliente.apellido.toLowerCase().includes(normalizedQuery) ||
          (cliente.email ?? '').toLowerCase().includes(normalizedQuery) ||
          String(cliente.dni).includes(normalizedQuery),
      )
    : clientes

  const handleOpenCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const handleOpenEdit = (cliente: Cliente) => {
    setEditing(cliente)
    setFormOpen(true)
  }

  const handleClose = () => {
    setFormOpen(false)
    setEditing(null)
  }

  const handleSubmit = async (values: ClienteFormValues) => {
    try {
      if (editing) {
        const cambios: ClienteUpdate = {
          nombre: values.nombre,
          apellido: values.apellido,
          telefono: values.telefono,
          email: values.email,
        }
        // La cuenta solo se toca si existe
        if (editing.tieneCuenta) {
          cambios.activo = values.activo
          if (values.password) cambios.password = values.password
        }
        await clienteService.update(editing.dni, cambios)
        setSnackbar({ message: 'Cliente actualizado correctamente.', severity: 'success' })
      } else {
        await clienteService.create({
          dni: values.dni,
          nombre: values.nombre,
          apellido: values.apellido,
          telefono: values.telefono,
          email: values.email,
          crearCuenta: values.crearCuenta,
        })
        setSnackbar({
          message: values.crearCuenta
            ? 'Cliente creado. Ya puede entrar a la app con su email y su DNI como contraseña.'
            : 'Cliente creado correctamente.',
          severity: 'success',
        })
      }
      await reload()
      handleClose()
    } catch (err) {
      setSnackbar({
        message: mensajeDeErrorApi(err, 'No se pudo guardar el cliente. Intentá nuevamente.'),
        severity: 'error',
      })
    }
  }

  const handleDarAcceso = async (cliente: Cliente) => {
    try {
      await clienteService.crearCuenta(cliente.dni)
      setSnackbar({
        message: `${cliente.nombre} ya puede entrar a la app con su email y su DNI como contraseña.`,
        severity: 'success',
      })
      await reload()
    } catch (err) {
      setSnackbar({
        message: mensajeDeErrorApi(err, 'No se pudo dar acceso al cliente. Intentá nuevamente.'),
        severity: 'error',
      })
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleting) return
    try {
      await clienteService.delete(deleting.dni)
      setSnackbar({ message: 'Cliente eliminado correctamente.', severity: 'success' })
      await reload()
    } catch (err) {
      setSnackbar({
        message: mensajeDeErrorApi(err, 'No se pudo eliminar el cliente. Intentá nuevamente.'),
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
            Clientes
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
            placeholder="Buscar por nombre, DNI o email..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              },
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
            Nuevo Cliente
          </Button>
        </Stack>
      </Stack>

      {loading && <ListSkeleton />}

      {!loading && error && <ErrorState onRetry={reload} />}

      {!loading && !error && clientes.length === 0 && (
        <EmptyState message="Aún no hay clientes registrados. Creá el primero con el botón Nuevo Cliente." />
      )}

      {!loading && !error && clientes.length > 0 && filtered.length === 0 && (
        <EmptyState message="No se encontraron clientes que coincidan con la búsqueda." />
      )}

      {!loading && !error && filtered.length > 0 && (
        <ClienteList
          clientes={filtered}
          onEdit={handleOpenEdit}
          onDelete={setDeleting}
          onDarAcceso={handleDarAcceso}
        />
      )}

      <ClienteFormDialog
        open={formOpen}
        cliente={editing}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={deleting !== null}
        title="Eliminar Cliente"
        message={
          deleting
            ? `¿Estás seguro de que querés eliminar a ${deleting.nombre} ${deleting.apellido}?${deleting.tieneCuenta ? ' También se elimina su cuenta y ya no va a poder entrar a la app.' : ''} Esta acción no se puede deshacer.`
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

export default Clientes
