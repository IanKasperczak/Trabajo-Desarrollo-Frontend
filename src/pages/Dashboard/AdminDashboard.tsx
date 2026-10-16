import { Box, Grid, Typography } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import CategoryIcon from '@mui/icons-material/Category'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CardMembershipIcon from '@mui/icons-material/CardMembership'
import StatCard from '../../components/dashboard/common/StatCard'
import SectionCard from '../../components/dashboard/common/SectionCard'
import RankingList from '../../components/dashboard/common/RankingList'
import AlertList from '../../components/dashboard/common/AlertList'
import AvisoPasswordInicial from '../../components/dashboard/common/AvisoPasswordInicial'
import QuickActions from '../../components/dashboard/common/QuickActions'
import type { QuickActionItem } from '../../components/dashboard/common/QuickActions'
import ErrorState from '../../components/ui/ErrorState'
import ListSkeleton from '../../components/ui/ListSkeleton'
import { useAsyncData } from '../../hooks/useAsyncData'
import { clienteService } from '../../services/clienteService'
import { profesorService } from '../../services/profesorService'
import { especialidadService } from '../../services/especialidadService'
import { usuarioService } from '../../services/usuarioService'
import { rutinaService } from '../../services/rutinaService'
import { membresiaService } from '../../services/membresiaService'
import type { AlertItem } from '../../models/dashboard'

const adminQuickActions: QuickActionItem[] = [
  { label: 'Clientes', icon: PersonIcon, to: '/admin/clientes' },
  { label: 'Profesores', icon: SupervisorAccountIcon, to: '/admin/profesores' },
  { label: 'Rutinas', icon: AssignmentIcon, to: '/admin/rutinas' },
  { label: 'Membresías', icon: CardMembershipIcon, to: '/admin/membresias' },
  { label: 'Especialidades', icon: CategoryIcon, to: '/admin/especialidades' },
  { label: 'Usuarios', icon: ManageAccountsIcon, to: '/admin/usuarios' },
]

const cargarResumen = async () => {
  const [clientes, profesores, especialidades, cuentas, rutinas, membresias] = await Promise.all([
    clienteService.getAll(),
    profesorService.getAll(),
    especialidadService.getAll(),
    usuarioService.getAll(),
    rutinaService.getAll(),
    membresiaService.getAll(),
  ])
  return { clientes, profesores, especialidades, cuentas, rutinas, membresias }
}

const plural = (n: number, singular: string, pluralForm: string) =>
  `${n} ${n === 1 ? singular : pluralForm}`

function AdminDashboard() {
  const { data, loading, error, reload } = useAsyncData(cargarResumen)

  const header = (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h3" component="h1">
        Panel de Gestión
      </Typography>
      <Box sx={{ width: 56, height: 4, bgcolor: 'primary.main', borderRadius: 2, mt: 0.5 }} />
    </Box>
  )

  if (loading || error || !data) {
    return (
      <Box>
        {header}
        <AvisoPasswordInicial />
        {loading ? (
          <ListSkeleton count={4} sizes={{ xs: 12, sm: 6, lg: 3 }} />
        ) : (
          <ErrorState message="No se pudo cargar el resumen." onRetry={reload} />
        )}
      </Box>
    )
  }

  const { clientes, profesores, especialidades, cuentas, rutinas, membresias } = data
  const membresiasPorVencer = membresias.filter((m) => m.estado === 'Por vencer').length
  const clientesConMembresia = new Set(
    membresias.filter((m) => m.estado !== 'Vencida').map((m) => m.dniCliente),
  )
  const clientesSinMembresia = clientes.filter((c) => !clientesConMembresia.has(c.dni)).length
  const clientesConRutina = new Set(rutinas.map((r) => r.dniCliente))
  const clientesSinRutina = clientes.filter((c) => !clientesConRutina.has(c.dni)).length
  const clientesConAcceso = clientes.filter((c) => c.activo).length
  const cuentasPasswordInicial = cuentas.filter((c) => c.activo && c.debeCambiarPassword).length
  const cuentasDeshabilitadas = cuentas.filter((c) => !c.activo).length
  const administradores = cuentas.filter((c) => c.rol === 'administrador').length

  const profesoresPorEspecialidad = especialidades
    .map((esp) => ({
      label: esp.nombre,
      value: profesores.filter((p) => p.especialidades.some((e) => e.idEspecialidad === esp.id))
        .length,
    }))
    .sort((a, b) => b.value - a.value)
  const especialidadesSinProfesor = profesoresPorEspecialidad.filter((e) => e.value === 0).length

  const pendientes: AlertItem[] = []
  if (clientesSinRutina > 0) {
    pendientes.push({
      severity: 'info',
      title: `${plural(clientesSinRutina, 'cliente', 'clientes')} sin rutina asignada`,
      description: 'Se cargan desde Rutinas.',
    })
  }
  if (clientesSinMembresia > 0) {
    pendientes.push({
      severity: 'warning',
      title: `${plural(clientesSinMembresia, 'cliente', 'clientes')} sin membresía vigente`,
      description: 'Se registran desde Membresías.',
    })
  }
  if (membresiasPorVencer > 0) {
    pendientes.push({
      severity: 'info',
      title: `${plural(membresiasPorVencer, 'membresía', 'membresías')} por vencer`,
      description: 'Vencen en los próximos 7 días.',
    })
  }
  if (cuentasPasswordInicial > 0) {
    pendientes.push({
      severity: 'info',
      title: `${plural(cuentasPasswordInicial, 'cuenta usa', 'cuentas usan')} todavía la contraseña inicial`,
      description: 'Cada usuario la cambia desde Configuración.',
    })
  }
  if (cuentasDeshabilitadas > 0) {
    pendientes.push({
      severity: 'info',
      title: plural(cuentasDeshabilitadas, 'cuenta deshabilitada', 'cuentas deshabilitadas'),
      description: 'Se pueden volver a habilitar desde Usuarios.',
    })
  }
  if (especialidadesSinProfesor > 0) {
    pendientes.push({
      severity: 'info',
      title: `${plural(especialidadesSinProfesor, 'especialidad', 'especialidades')} sin profesores asignados`,
    })
  }

  return (
    <Box>
      {header}
      <AvisoPasswordInicial />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={PersonIcon}
            label="Clientes"
            value={String(clientes.length)}
            hint={`${clientesConAcceso} con acceso a la app`}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={SupervisorAccountIcon}
            label="Profesores"
            value={String(profesores.length)}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={CategoryIcon}
            label="Especialidades"
            value={String(especialidades.length)}
            hint={
              especialidadesSinProfesor > 0
                ? `${especialidadesSinProfesor} sin profesores`
                : 'Todas tienen profesores'
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={ManageAccountsIcon}
            label="Cuentas"
            value={String(cuentas.length)}
            hint={plural(administradores, 'administrador', 'administradores')}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <SectionCard title="Pendientes">
            {pendientes.length > 0 ? (
              <AlertList items={pendientes} />
            ) : (
              <Typography variant="body2" color="text.secondary">
                No hay pendientes: todo está al día.
              </Typography>
            )}
          </SectionCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <SectionCard title="Profesores por especialidad">
            {profesoresPorEspecialidad.length > 0 ? (
              <RankingList items={profesoresPorEspecialidad.slice(0, 6)} />
            ) : (
              <Typography variant="body2" color="text.secondary">
                Todavía no hay especialidades cargadas.
              </Typography>
            )}
          </SectionCard>
        </Grid>
        <Grid item xs={12}>
          <SectionCard title="Accesos rápidos">
            <QuickActions items={adminQuickActions} />
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminDashboard
