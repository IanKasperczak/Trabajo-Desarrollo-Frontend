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
import MembresiaCard from '../../components/membresia/MembresiaCard'
import MembresiaFormDialog from '../../components/membresia/MembresiaFormDialog'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import ListSkeleton from '../../components/ui/ListSkeleton'
import { useAsyncData } from '../../hooks/useAsyncData'
import { clienteService } from '../../services/clienteService'
import { membresiaService } from '../../services/membresiaService'
import { mensajeDeErrorApi } from '../../utils/apiError'
import { ESTADOS, formatearFecha, formatearImporte } from '../../utils/membresia'
import type { ClienteResumen, Membresia, MembresiaFormValues } from '../../models/membresia'

type SnackbarState = { message: string; severity: 'success' | 'error' } | null
type FiltroEstado = 'todos' | (typeof ESTADOS)[number]

function Membresias() {
  const { data, loading, error, reload } = useAsyncData(async () => {
    const [membresias, clientes] = await Promise.all([
      membresiaService.getAll(),
      clienteService.getAll(),
    ])
    const resumenes: ClienteResumen[] = clientes
      .map(({ dni, nombre, apellido, email }) => ({ dni, nombre, apellido, email }))
      .sort((a, b) => a.apellido.localeCompare(b.apellido) || a.nombre.localeCompare(b.nombre))
    return { membresias, clientes: resumenes }
  })

  const [query, setQuery] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('todos')
  const [formOpen, setFormOpen] = useState(false)
  const [editando, setEditando] = useState<Membresia | null>(null)
  const [eliminando, setEliminando] = useState<Membresia | null>(null)
  const [snackbar, setSnackbar] = useState<SnackbarState>(null)

  const normalizedQuery = query.trim().toLowerCase()
  const membresias = (data?.membresias ?? []).filter((m) => {
    if (filtroEstado !== 'todos' && m.estado !== filtroEstado) return false
    if (!normalizedQuery) return true
    const texto = [m.cliente?.nombre, m.cliente?.apellido, m.cliente?.email, String(m.dniCliente)]
      .join(' ')
      .toLowerCase()
    return texto.includes(normalizedQuery)
  })

  const abrirNueva = () => {
    setEditando(null)
    setFormOpen(true)
  }

  const abrirEdicion = (membresia: Membresia) => {
    setEditando(membresia)
    setFormOpen(true)
  }

  const cerrarFormulario = () => {
    setFormOpen(false)
    setEditando(null)
  }

  const handleSubmit = async (values: MembresiaFormValues) => {
    try {
      const datos = {
        fechaPago: values.fechaPago,
        fechaInicio: values.fechaInicio,
        fechaVencimiento: values.fechaVencimiento,
        valor: Number(values.valor),
      }
      if (editando) {
        await membresiaService.update(editando.idMembresia, datos)
        setSnackbar({ message: 'Membresía actualizada correctamente.', severity: 'success' })
      } else {
        await membresiaService.create({ dniCliente: values.dniCliente as number, ...datos })
        setSnackbar({ message: 'Membresía registrada correctamente.', severity: 'success' })
      }
      cerrarFormulario()
      await reload()
    } catch (err) {
      setSnackbar({
        message: mensajeDeErrorApi(err, 'No se pudo guardar la membresía. Intentá nuevamente.'),
        severity: 'error',
      })
      throw err
    }
  }

  const handleConfirmDelete = async () => {
    if (!eliminando) return
    try {
      await membresiaService.delete(eliminando.idMembresia)
      setSnackbar({ message: 'Membresía eliminada correctamente.', severity: 'success' })
      await reload()
    } catch (err) {
      setSnackbar({
        message: mensajeDeErrorApi(err, 'No se pudo eliminar la membresía. Intentá nuevamente.'),
        severity: 'error',
      })
    } finally {
      setEliminando(null)
    }
  }

  const sinMembresias = (data?.membresias.length ?? 0) === 0

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
            Membresías
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
            placeholder="Buscar por cliente, DNI o email..."
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
            sx={{ width: { xs: '100%', sm: 280 } }}
          />
          <TextField
            select
            size="small"
            label="Estado"
            value={filtroEstado}
            onChange={(event) => setFiltroEstado(event.target.value as FiltroEstado)}
            sx={{ width: { xs: '100%', sm: 160 } }}
          >
            <MenuItem value="todos">Todos</MenuItem>
            {ESTADOS.map((estado) => (
              <MenuItem key={estado} value={estado}>
                {estado}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={abrirNueva}
            disabled={!data}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Nueva membresía
          </Button>
        </Stack>
      </Stack>

      {loading && <ListSkeleton count={4} sizes={{ xs: 12, md: 6, lg: 4 }} />}

      {!loading && error && <ErrorState onRetry={reload} />}

      {!loading && !error && sinMembresias && (
        <EmptyState message="Todavía no hay membresías registradas. Cargá la primera con el botón Nueva membresía." />
      )}

      {!loading && !error && !sinMembresias && membresias.length === 0 && (
        <EmptyState message="No se encontraron membresías que coincidan con la búsqueda." />
      )}

      {!loading && !error && membresias.length > 0 && (
        <Grid container spacing={2}>
          {membresias.map((membresia) => (
            <Grid item xs={12} md={6} lg={4} key={membresia.idMembresia}>
              <MembresiaCard
                membresia={membresia}
                mostrarCliente
                onEdit={abrirEdicion}
                onDelete={setEliminando}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {data && (
        <MembresiaFormDialog
          open={formOpen}
          membresia={editando}
          clientes={data.clientes}
          onClose={cerrarFormulario}
          onSubmit={handleSubmit}
        />
      )}

      <ConfirmDialog
        open={eliminando !== null}
        title="Eliminar membresía"
        message={
          eliminando
            ? `¿Eliminar la membresía de ${eliminando.cliente ? `${eliminando.cliente.nombre} ${eliminando.cliente.apellido}` : `DNI ${eliminando.dniCliente}`} (${formatearImporte(eliminando.valor)}, vence el ${formatearFecha(eliminando.fechaVencimiento)})? Esta acción no se puede deshacer.`
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

export default Membresias
