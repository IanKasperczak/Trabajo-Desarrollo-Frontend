import type { ReactNode } from 'react'
import { Box, Card, Chip, Stack, Typography } from '@mui/material'
import GroupIcon from '@mui/icons-material/Group'
import PersonIcon from '@mui/icons-material/Person'
import type { Turno } from '../../models/turno'
import { cuposLibres, estaCompleto, formatearHora } from '../../utils/turno'

interface TurnoCardProps {
  turno: Turno
  // Botones o avisos de abajo (cada pantalla pone los suyos)
  acciones?: ReactNode
  // Un chip extra junto al cupo (por ejemplo "Inscripto" para el cliente)
  etiqueta?: ReactNode
  // Para las plantillas, que no tienen fecha: se muestra "Todos los días"
  mostrarFecha?: boolean
}

function TurnoCard({ turno, acciones, etiqueta, mostrarFecha = false }: TurnoCardProps) {
  const capacidad = turno.capacidadMaxima ?? 0
  const completo = estaCompleto(turno)
  const libres = cuposLibres(turno)

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2, gap: 1.25 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h4" component="p" data-tabular sx={{ lineHeight: 1 }}>
            {formatearHora(turno.horaInicio)}
            <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              a {formatearHora(turno.horaFin)}
            </Typography>
          </Typography>
          <Typography variant="h6" component="h2" sx={{ mt: 0.5, wordBreak: 'break-word' }}>
            {turno.tipoClase?.nombre ?? 'Clase'}
          </Typography>
          {mostrarFecha && (
            <Typography variant="caption" color="text.secondary">
              {turno.fecha ? turno.fecha.split('-').reverse().join('/') : 'Todos los días'}
            </Typography>
          )}
        </Box>
        {etiqueta}
      </Stack>

      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ minWidth: 0 }}>
        <PersonIcon fontSize="small" color="action" />
        <Typography variant="body2" color="text.secondary" noWrap>
          {turno.profesores.length > 0
            ? turno.profesores.map((p) => `${p.nombre} ${p.apellido}`).join(', ')
            : 'Sin profesor asignado'}
        </Typography>
      </Stack>

      {turno.fecha !== null && (
        <Stack direction="row" spacing={1} alignItems="center">
          <GroupIcon fontSize="small" color="action" />
          <Typography variant="body2" data-tabular>
            {turno.inscriptos} de {capacidad} lugares
          </Typography>
          <Chip
            size="small"
            label={completo ? 'Completo' : `${libres} libre${libres === 1 ? '' : 's'}`}
            color={completo ? 'error' : libres <= 2 ? 'warning' : 'success'}
            variant={completo ? 'filled' : 'outlined'}
          />
        </Stack>
      )}
      {turno.fecha === null && (
        <Typography variant="body2" color="text.secondary" data-tabular>
          {capacidad} lugares por turno
        </Typography>
      )}

      {acciones && <Box sx={{ mt: 'auto', pt: 1 }}>{acciones}</Box>}
    </Card>
  )
}

export default TurnoCard
