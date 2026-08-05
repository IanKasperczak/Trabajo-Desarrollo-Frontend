import { Box, Card, Chip, Grid, Typography } from '@mui/material'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import CardMembershipIcon from '@mui/icons-material/CardMembership'
import AssignmentIcon from '@mui/icons-material/Assignment'
import NewspaperIcon from '@mui/icons-material/Newspaper'
import StarIcon from '@mui/icons-material/Star'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import SectionCard from '../../components/dashboard/common/SectionCard'
import QuickActions from '../../components/dashboard/common/QuickActions'
import type { QuickActionItem } from '../../components/dashboard/common/QuickActions'
import {
  clienteInfo,
  news,
  nextReservedClass,
  promos,
  routine,
} from '../../mocks/mockClienteDashboard'

const clienteQuickActions: QuickActionItem[] = [
  { label: 'Reservar clase', icon: EventAvailableIcon },
  { label: 'Renovar membresía', icon: CardMembershipIcon },
  { label: 'Ver rutina', icon: AssignmentIcon },
]

function ClienteDashboard() {
  const proximaAVencer = clienteInfo.diasRestantes <= 7

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h3" component="h1">
          Hola, {clienteInfo.nombre}
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

      {proximaAVencer && (
        <Card
          variant="outlined"
          sx={{
            mb: 2,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            borderLeft: 6,
            borderColor: 'warning.main',
            bgcolor: 'background.paper',
          }}
        >
          <WarningAmberIcon color="warning" />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Tu membresía vence en {clienteInfo.diasRestantes} días. Renová antes
            de la fecha para no perder acceso.
          </Typography>
        </Card>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <SectionCard title="Noticias">
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {news.map((item) => (
                <Box
                  key={item.title}
                  sx={{
                    display: 'flex',
                    gap: 1.5,
                    py: 1.25,
                    '&:not(:last-of-type)': {
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    },
                  }}
                >
                  <NewspaperIcon
                    fontSize="small"
                    sx={{ color: 'primary.dark', mt: 0.25, flexShrink: 0 }}
                  />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <SectionCard
            title="Próxima clase reservada"
            action={
              <Chip
                label={nextReservedClass.fecha}
                size="small"
                color="primary"
                variant="outlined"
              />
            }
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="h4" component="div">
                {nextReservedClass.clase}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {nextReservedClass.horario}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {nextReservedClass.salon} · {nextReservedClass.profesor}
              </Typography>
            </Box>
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <SectionCard title="Estado de la membresía">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Plan {clienteInfo.plan}
                </Typography>
                <Chip
                  label="Activa"
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Vence el {clienteInfo.vencimiento} ({clienteInfo.diasRestantes}{' '}
                días restantes)
              </Typography>
            </Box>
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <SectionCard title="Rutina asignada">
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {routine.map((dia) => (
                <Box
                  key={dia.dia}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    py: 1,
                    '&:not(:last-of-type)': {
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ width: 80, fontWeight: 600 }}
                  >
                    {dia.dia}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dia.ejercicios}
                  </Typography>
                </Box>
              ))}
            </Box>
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <SectionCard title="Promociones">
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {promos.map((item) => (
                <Box
                  key={item.title}
                  sx={{
                    display: 'flex',
                    gap: 1.5,
                    py: 1.25,
                    '&:not(:last-of-type)': {
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    },
                  }}
                >
                  <StarIcon
                    fontSize="small"
                    sx={{ color: 'primary.dark', mt: 0.25, flexShrink: 0 }}
                  />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <SectionCard title="Acciones rápidas">
            <QuickActions items={clienteQuickActions} />
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ClienteDashboard