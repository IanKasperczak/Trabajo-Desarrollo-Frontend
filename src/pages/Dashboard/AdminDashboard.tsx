import { Box, Grid, Typography } from '@mui/material'
import GroupIcon from '@mui/icons-material/Group'
import ScheduleIcon from '@mui/icons-material/Schedule'
import CardMembershipIcon from '@mui/icons-material/CardMembership'
import EventBusyIcon from '@mui/icons-material/EventBusy'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import BadgeIcon from '@mui/icons-material/Badge'
import StatCard from '../../components/dashboard/common/StatCard'
import SectionCard from '../../components/dashboard/common/SectionCard'
import BarsChart from '../../components/dashboard/common/BarsChart'
import GroupedBarsChart from '../../components/dashboard/common/GroupedBarsChart'
import RankingList from '../../components/dashboard/common/RankingList'
import AlertList from '../../components/dashboard/common/AlertList'
import QuickActions from '../../components/dashboard/common/QuickActions'
import type { QuickActionItem } from '../../components/dashboard/common/QuickActions'
import {
  adminAlerts,
  adminKpis,
  attendance,
  newClients,
  popularClasses,
  topProfessors,
} from '../../mocks/mockAdminDashboard'

const kpiIcons = [GroupIcon, ScheduleIcon, CardMembershipIcon, EventBusyIcon]

const adminQuickActions: QuickActionItem[] = [
  { label: 'Registrar cliente', icon: PersonAddIcon },
  { label: 'Crear clase', icon: EventAvailableIcon },
  { label: 'Registrar profesor', icon: BadgeIcon },
]

function AdminDashboard() {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" component="h1">
          Panel de Gestión
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

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {adminKpis.map((kpi, index) => (
          <Grid item xs={12} sm={6} lg={3} key={kpi.label}>
            <StatCard icon={kpiIcons[index]} {...kpi} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <SectionCard title="Nuevos clientes (últimos 14 días)">
            <BarsChart data={newClients} labelStep={2} />
          </SectionCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <SectionCard title="Asistencia por día">
            <GroupedBarsChart data={attendance} />
          </SectionCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <SectionCard title="Clases más populares">
            <RankingList items={popularClasses} suffix=" cupos" />
          </SectionCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <SectionCard title="Profesores con más alumnos">
            <RankingList items={topProfessors} suffix=" alumnos" />
          </SectionCard>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        <Grid item xs={12} md={6}>
          <SectionCard title="Alertas">
            <AlertList items={adminAlerts} />
          </SectionCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <SectionCard title="Acciones rápidas">
            <QuickActions items={adminQuickActions} />
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminDashboard