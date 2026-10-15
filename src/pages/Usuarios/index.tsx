import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  InputAdornment,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import CuentaItem from '../../components/usuario/CuentaItem'
import NuevoAdminDialog from '../../components/usuario/NuevoAdminDialog'
import ResetPasswordDialog from '../../components/usuario/ResetPasswordDialog'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import ListSkeleton from '../../components/ui/ListSkeleton'
import { useAsyncData } from '../../hooks/useAsyncData'
import { useAuth } from '../../hooks/useAuth'
import { usuarioService } from '../../services/usuarioService'
import { profesorService } from '../../services/profesorService'
import { mensajeDeErrorApi } from '../../utils/apiError'
import type { Role } from '../../models/role'
import type { Cuenta, NuevoAdminInput } from '../../models/usuario'

type SnackbarState = { message: string; severity: 'success' | 'error' } | null
type FiltroRol = Role | 'todos'

const ORDEN_ROL: Record<Role, number> = { administrador: 0, profesor: 1, cliente: 2 }

const filtrosRol: { value: FiltroRol; label: string }[] = [
  { value: 'todos', label: 'Todos los roles' },
  { value: 'administrador', label: 'Administradores' },
  { value: 'profesor', label: 'Profesores' },
  { value: 'cliente', label: 'Clientes' },
]

// Los profesores se cargan para mostrar a quién pertenece cada cuenta de profesor
const cargarDatos = async () => {
  const [cuentas, profesores] = await Promise.all([
    usuarioService.getAll(),
    profesorService.getAll(),
  ])
  const nombreProfesor = new Map(profesores.map((p) => [p.dni, `${p.nombre} ${p.apellido}`]))
  return { cuentas, nombreProfesor }
}

function Usuarios() {
  const { usuario } = useAuth()
  const { data, loading, error, reload } = useAsyncData(cargarDatos)

  const [query, setQuery] = useState('')
  const [filtroRol, setFiltroRol] = useState<FiltroRol>('todos')
  const [creando, setCreando] = useState(false)
  const [reseteando, setReseteando] = useState<Cuenta | null>(null)
  const [eliminando, setEliminando] = useState<Cuenta | null>(null)
  const [snackbar, setSnackbar] = useState<SnackbarState>(null)

  const detalleDe = (cuenta: Cuenta) => {
    if (cuenta.dniProfesor === null) return undefined
    const nombre = data?.nombreProfesor.get(cuenta.dniProfesor)
    return `Profesor: ${nombre ?? `DNI ${cuenta.dniProfesor}`}`
  }

  const cuentas = [...(data?.cuentas ?? [])].sort(
    (a, b) => ORDEN_ROL[a.rol] - ORDEN_ROL[b.rol] || a.email.localeCompare(b.email),
  )
  const normalizedQuery = query.trim().toLowerCase()
  const filtradas = cuentas.filter(
    (cuenta) =>
      (filtroRol === 'todos' || cuenta.rol === filtroRol) &&
      (!normalizedQuery ||
        cuenta.email.includes(normalizedQuery) ||
        (detalleDe(cuenta) ?? '').toLowerCase().includes(normalizedQuery)),
  )

  const mostrarError = (err: unknown, generico: string) =>
    setSnackbar({ message: mensajeDeErrorApi(err, generico), severity: 'error' })

  const handleCrear = async (datos: NuevoAdminInput) => {
    try {
      await usuarioService.createAdmin(datos)
      setSnackbar({ message: 'Administrador creado correctamente.', severity: 'success' })
      setCreando(false)
      await reload()
    } catch (err) {
      mostrarError(err, 'No se pudo crear el administrador. Intentá nuevamente.')
      throw err
    }
  }

  const handleResetPassword = async (cuenta: Cuenta, password: string) => {
    try {
      await usuarioService.update(cuenta.id, { password })
      setSnackbar({
        message: `Contraseña de ${cuenta.email} actualizada. Pasásela para que pueda entrar.`,
        severity: 'success',
      })
      setReseteando(null)
      await reload()
    } catch (err) {
      mostrarError(err, 'No se pudo cambiar la contraseña. Intentá nuevamente.')
      throw err
    }
  }

  const handleToggleActivo = async (cuenta: Cuenta) => {
    try {
      await usuarioService.update(cuenta.id, { activo: !cuenta.activo })
      setSnackbar({
        message: cuenta.activo
          ? `Se deshabilitó el acceso de ${cuenta.email}.`
          : `Se habilitó el acceso de ${cuenta.email}.`,
        severity: 'success',
      })
      await reload()
    } catch (err) {
      mostrarError(err, 'No se pudo actualizar la cuenta. Intentá nuevamente.')
    }
  }

  const handleConfirmDelete = async () => {
    if (!eliminando) return
    try {
      await usuarioService.delete(eliminando.id)
      setSnackbar({ message: 'Cuenta eliminada correctamente.', severity: 'success' })
      await reload()
    } catch (err) {
      mostrarError(err, 'No se pudo eliminar la cuenta. Intentá nuevamente.')
    } finally {
      setEliminando(null)
    }
  }

  const mensajeEliminar = !eliminando
    ? ''
    : eliminando.rol === 'profesor'
      ? `¿Eliminar la cuenta ${eliminando.email}? El profesor sigue cargado, pero ya no va a poder entrar a la app (le podés crear otra cuenta desde Profesores).`
      : `¿Eliminar la cuenta ${eliminando.email}? Ya no va a poder entrar a la app. Esta acción no se puede deshacer.`

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
            Usuarios
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
            placeholder="Buscar por email o nombre..."
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
            sx={{ width: { xs: '100%', sm: 260 } }}
          />
          <TextField
            select
            size="small"
            label="Rol"
            value={filtroRol}
            onChange={(event) => setFiltroRol(event.target.value as FiltroRol)}
            sx={{ width: { xs: '100%', sm: 190 } }}
          >
            {filtrosRol.map((filtro) => (
              <MenuItem key={filtro.value} value={filtro.value}>
                {filtro.label}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreando(true)}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Nuevo administrador
          </Button>
        </Stack>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Las cuentas de profesores y clientes se crean desde sus pantallas. Acá podés crear
        administradores y habilitar, deshabilitar o resetear la contraseña de cualquier cuenta.
      </Typography>

      {loading && <ListSkeleton count={4} sizes={{ xs: 12 }} />}

      {!loading && error && <ErrorState onRetry={reload} />}

      {!loading && !error && filtradas.length === 0 && (
        <EmptyState message="No se encontraron cuentas que coincidan con la búsqueda." />
      )}

      {!loading && !error && filtradas.length > 0 && (
        <Card variant="outlined" sx={{ bgcolor: 'background.paper' }}>
          {filtradas.map((cuenta) => (
            <CuentaItem
              key={cuenta.id}
              cuenta={cuenta}
              detalle={detalleDe(cuenta)}
              esPropia={cuenta.id === usuario?.id}
              onToggleActivo={handleToggleActivo}
              onResetPassword={setReseteando}
              onDelete={setEliminando}
            />
          ))}
        </Card>
      )}

      <NuevoAdminDialog open={creando} onClose={() => setCreando(false)} onSubmit={handleCrear} />

      <ResetPasswordDialog
        cuenta={reseteando}
        onClose={() => setReseteando(null)}
        onSubmit={handleResetPassword}
      />

      <ConfirmDialog
        open={eliminando !== null}
        title="Eliminar cuenta"
        message={mensajeEliminar}
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

export default Usuarios
