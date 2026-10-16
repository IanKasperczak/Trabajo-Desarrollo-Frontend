import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Chip, Grid, Skeleton, Stack, Typography } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CardMembershipIcon from '@mui/icons-material/CardMembership'
import SettingsIcon from '@mui/icons-material/Settings'
import SectionCard from '../../components/dashboard/common/SectionCard'
import AvisoPasswordInicial from '../../components/dashboard/common/AvisoPasswordInicial'
import QuickActions from '../../components/dashboard/common/QuickActions'
import type { QuickActionItem } from '../../components/dashboard/common/QuickActions'
import { useAsyncData } from '../../hooks/useAsyncData'
import { useAuth } from '../../hooks/useAuth'
import { clienteService } from '../../services/clienteService'
import { membresiaService } from '../../services/membresiaService'
import { rutinaService } from '../../services/rutinaService'
import { ordenDia } from '../../utils/dias'
import {
  colorEstado,
  diasHasta,
  formatearFecha,
  formatearImporte,
  membresiaVigente,
} from '../../utils/membresia'

const clienteQuickActions: QuickActionItem[] = [
  { label: 'Mis rutinas', icon: AssignmentIcon, to: '/cliente/mis-rutinas' },
  { label: 'Mi membresía', icon: CardMembershipIcon, to: '/cliente/mi-membresia' },
  { label: 'Mi perfil', icon: AccountCircleIcon, to: '/cliente/mi-perfil' },
  { label: 'Configuración', icon: SettingsIcon, to: '/cliente/configuracion' },
]

const MAX_RUTINAS_VISIBLES = 4

function ClienteDashboard() {
  const { usuario } = useAuth()
  // El backend devuelve solo las rutinas del cliente que inició sesión
  const { data, loading, error } = useAsyncData(rutinaService.getAll)
  // Si falla, el saludo queda genérico: no vale la pena un error aparte
  const { data: perfil } = useAsyncData(clienteService.getMiPerfil)
  const { data: membresias, loading: cargandoMembresia } = useAsyncData(membresiaService.getAll)
  const vigente = membresiaVigente(membresias ?? [])
  const rutinas = [...(data ?? [])].sort((a, b) => ordenDia(a.diaSemana) - ordenDia(b.diaSemana))

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" component="h1">
          {perfil ? `Hola, ${perfil.nombre}` : 'Hola'}
        </Typography>
        <Box sx={{ width: 56, height: 4, bgcolor: 'primary.main', borderRadius: 2, mt: 0.5 }} />
      </Box>

      <AvisoPasswordInicial />

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <SectionCard
            title="Tu membresía"
            action={
              <Button
                component={RouterLink}
                to="/cliente/mi-membresia"
                size="small"
                sx={{ color: 'text.primary' }}
              >
                Ver detalle
              </Button>
            }
          >
            {cargandoMembresia && <Skeleton variant="text" width="70%" />}
            {!cargandoMembresia && !vigente && (
              <Typography variant="body2" color="text.secondary">
                Todavía no tenés una membresía registrada.
              </Typography>
            )}
            {vigente && (
              <Stack spacing={0.75}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formatearImporte(vigente.valor)}
                  </Typography>
                  <Chip label={vigente.estado} size="small" color={colorEstado[vigente.estado]} />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {vigente.estado === 'Vencida' ? 'Venció el' : 'Vence el'}{' '}
                  {formatearFecha(vigente.fechaVencimiento)}
                  {vigente.estado === 'Por vencer' &&
                    ` (en ${diasHasta(vigente.fechaVencimiento)} días)`}
                </Typography>
              </Stack>
            )}
          </SectionCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <SectionCard
            title="Tus rutinas"
            action={
              rutinas.length > 0 ? (
                <Button
                  component={RouterLink}
                  to="/cliente/mis-rutinas"
                  size="small"
                  sx={{ color: 'text.primary' }}
                >
                  Ver todas
                </Button>
              ) : undefined
            }
          >
            {loading && <Skeleton variant="text" width="70%" />}
            {!loading && error && (
              <Typography variant="body2" color="text.secondary">
                No se pudieron cargar tus rutinas.
              </Typography>
            )}
            {!loading && !error && rutinas.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Todavía no tenés rutinas asignadas.
              </Typography>
            )}
            {!loading && !error && rutinas.length > 0 && (
              <Stack>
                {rutinas.slice(0, MAX_RUTINAS_VISIBLES).map((rutina) => (
                  <Box
                    key={rutina.idRutina}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                      py: 1,
                      '&:not(:last-of-type)': { borderBottom: '1px solid', borderColor: 'divider' },
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                        {rutina.nombreRutina}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {rutina.ejercicios.length}{' '}
                        {rutina.ejercicios.length === 1 ? 'ejercicio' : 'ejercicios'}
                      </Typography>
                    </Box>
                    {rutina.diaSemana && (
                      <Chip label={rutina.diaSemana} size="small" color="primary" variant="outlined" />
                    )}
                  </Box>
                ))}
              </Stack>
            )}
          </SectionCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <SectionCard title="Tu cuenta" sx={{ height: 'auto' }}>
              <Typography variant="body2" color="text.secondary">
                Iniciaste sesión como
              </Typography>
              <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                {usuario?.email}
              </Typography>
            </SectionCard>
            <SectionCard title="Accesos rápidos" sx={{ height: 'auto' }}>
              <QuickActions items={clienteQuickActions} />
            </SectionCard>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ClienteDashboard
