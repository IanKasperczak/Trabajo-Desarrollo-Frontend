import { Box, Card, Grid, Typography } from '@mui/material'
import EventIcon from '@mui/icons-material/Event'
import GroupIcon from '@mui/icons-material/Group'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import GroupsIcon from '@mui/icons-material/Groups'
import BadgeIcon from '@mui/icons-material/Badge'
import StatCard from '../../components/dashboard/common/StatCard'
import SectionCard from '../../components/dashboard/common/SectionCard'
import AlertList from '../../components/dashboard/common/AlertList'
import QuickActions from '../../components/dashboard/common/QuickActions'
import type { QuickActionItem } from '../../components/dashboard/common/QuickActions'
import {
  nextClass,
  profesorInfo,
  profesorKpis,
  profesorNotices,
  todayClasses,
  weeklySchedule,
} from '../../mocks/mockProfesorDashboard'

const kpiIcons = [EventIcon, GroupIcon, AccessTimeIcon]

const profesorQuickActions: QuickActionItem[] = [
  { label: 'Ver alumnos', icon: GroupsIcon },
  { label: 'Registrar asistencia', icon: BadgeIcon },
]

function ProfesorDashboard() {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" component="h1">
          Hola, {profesorInfo.nombre} {profesorInfo.apellido}
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

      <Card
        variant="outlined"
        sx={{
          mb: 2,
          p: 2,
          bgcolor: 'background.paper',
          borderLeft: 6,
          borderColor: 'primary.main',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary" component="div">
              PRÓXIMA CLASE
            </Typography>
            <Typography variant="h4" component="div">
              {nextClass.clase}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {nextClass.salon} · {nextClass.horario} · {nextClass.alumnos}{' '}
              alumnos
            </Typography>
          </Box>
        </Box>
      </Card>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {profesorKpis.map((kpi, index) => (
          <Grid item xs={12} sm={4} key={kpi.label}>
            <StatCard icon={kpiIcons[index]} {...kpi} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <SectionCard title="Clases del día">
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {todayClasses.map((clase) => (
                <Box
                  key={`${clase.hora}-${clase.clase}`}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    py: 1.25,
                    '&:not(:last-of-type)': {
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ width: 56, fontWeight: 600 }}
                  >
                    {clase.hora}
                  </Typography>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {clase.clase}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {clase.salon} · {clase.alumnos} alumnos
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </SectionCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <SectionCard title="Horario semanal">
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {weeklySchedule.map((dia) => (
                <Box
                  key={dia.dia}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    py: 1,
                    '&:not(:last-of-type)': {
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    },
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {dia.dia}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dia.clase}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dia.horario}
                  </Typography>
                </Box>
              ))}
            </Box>
          </SectionCard>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        <Grid item xs={12} md={6}>
          <SectionCard title="Avisos del gimnasio">
            <AlertList items={profesorNotices} />
          </SectionCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <SectionCard title="Acciones rápidas">
            <QuickActions items={profesorQuickActions} />
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ProfesorDashboard