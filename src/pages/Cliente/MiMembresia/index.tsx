import { Box, Card, Chip, Grid, Stack, Typography } from '@mui/material'
import CardMembershipIcon from '@mui/icons-material/CardMembership'
import SectionCard from '../../../components/dashboard/common/SectionCard'
import AvisoPasswordInicial from '../../../components/dashboard/common/AvisoPasswordInicial'
import MembresiaCard from '../../../components/membresia/MembresiaCard'
import EmptyState from '../../../components/ui/EmptyState'
import ErrorState from '../../../components/ui/ErrorState'
import ListSkeleton from '../../../components/ui/ListSkeleton'
import { useAsyncData } from '../../../hooks/useAsyncData'
import { membresiaService } from '../../../services/membresiaService'
import {
  colorEstado,
  formatearFecha,
  formatearImporte,
  membresiaVigente,
} from '../../../utils/membresia'

// El backend devuelve solo las membresías del cliente que inició sesión
function MiMembresia() {
  const { data, loading, error, reload } = useAsyncData(membresiaService.getAll)
  const membresias = data ?? []
  const vigente = membresiaVigente(membresias)
  const historial = membresias.filter((m) => m.idMembresia !== vigente?.idMembresia)

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" component="h1">
          Mi Membresía
        </Typography>
        <Box sx={{ width: 56, height: 4, bgcolor: 'primary.main', borderRadius: 2, mt: 0.5 }} />
      </Box>

      <AvisoPasswordInicial />

      {loading && <ListSkeleton count={2} sizes={{ xs: 12, md: 6 }} />}

      {!loading && error && (
        <ErrorState message="No se pudo cargar tu membresía." onRetry={reload} />
      )}

      {!loading && !error && membresias.length === 0 && (
        <EmptyState
          icon={CardMembershipIcon}
          message="Todavía no tenés ninguna membresía registrada. Cuando abones, el gimnasio la va a cargar y la vas a ver acá."
        />
      )}

      {!loading && !error && vigente && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <SectionCard
              title={
                vigente.estado === 'Vencida' ? 'Tu última membresía' : 'Tu membresía actual'
              }
            >
              <Box sx={{ mx: -2, mt: -2, mb: -2 }}>
                <MembresiaCard membresia={vigente} />
              </Box>
            </SectionCard>
          </Grid>

          {historial.length > 0 && (
            <Grid item xs={12} md={6}>
              <SectionCard title="Historial de pagos">
                <Stack>
                  {historial.map((m) => (
                    <Card
                      key={m.idMembresia}
                      variant="outlined"
                      sx={{ p: 1.5, mb: 1, '&:last-of-type': { mb: 0 } }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={1}
                      >
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatearImporte(m.valor)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatearFecha(m.fechaInicio)} al {formatearFecha(m.fechaVencimiento)}
                          </Typography>
                        </Box>
                        <Chip label={m.estado} size="small" color={colorEstado[m.estado]} />
                      </Stack>
                    </Card>
                  ))}
                </Stack>
              </SectionCard>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  )
}

export default MiMembresia
