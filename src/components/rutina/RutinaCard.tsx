import { Box, Button, Card, Chip, Stack, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import type { Rutina } from '../../models/rutina'
import { formatearDescanso } from '../../utils/rutinaForm'

interface RutinaCardProps {
  rutina: Rutina
  mostrarCliente?: boolean
  mostrarProfesor?: boolean
  // Sin estas acciones la tarjeta es de solo lectura (vista del cliente)
  onEdit?: (rutina: Rutina) => void
  onDelete?: (rutina: Rutina) => void
}

const nombreCompleto = (p: { nombre: string; apellido: string } | null) =>
  p ? `${p.nombre} ${p.apellido}` : '—'

function RutinaCard({
  rutina,
  mostrarCliente = false,
  mostrarProfesor = false,
  onEdit,
  onDelete,
}: RutinaCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{ height: '100%', bgcolor: 'background.paper', display: 'flex', flexDirection: 'column' }}
    >
      <Box sx={{ p: 2, pb: 1 }}>
        <Stack direction="row" spacing={1} alignItems="flex-start" justifyContent="space-between">
          <Typography variant="h5" component="h2" sx={{ wordBreak: 'break-word' }}>
            {rutina.nombreRutina}
          </Typography>
          <Chip
            label={rutina.diaSemana ?? 'Sin día'}
            size="small"
            color="primary"
            variant={rutina.diaSemana ? 'filled' : 'outlined'}
            sx={{ flexShrink: 0 }}
          />
        </Stack>
        {(mostrarCliente || mostrarProfesor) && (
          <Stack sx={{ mt: 0.5 }}>
            {mostrarCliente && (
              <Typography variant="body2" color="text.secondary">
                Cliente: {nombreCompleto(rutina.cliente)} (DNI {rutina.dniCliente})
              </Typography>
            )}
            {mostrarProfesor && (
              <Typography variant="body2" color="text.secondary">
                Profesor: {nombreCompleto(rutina.profesor)}
              </Typography>
            )}
          </Stack>
        )}
      </Box>

      <Box component="ol" sx={{ m: 0, px: 2, pl: 4.5, flexGrow: 1 }}>
        {rutina.ejercicios.length === 0 && (
          <Typography variant="body2" color="text.secondary" component="li" sx={{ listStyle: 'none', ml: -2.5 }}>
            Sin ejercicios cargados.
          </Typography>
        )}
        {rutina.ejercicios.map((ejercicio) => {
          const descanso = formatearDescanso(ejercicio.descanso)
          return (
            <Box
              component="li"
              key={ejercicio.id}
              sx={{
                py: 0.75,
                '&:not(:last-of-type)': { borderBottom: '1px solid', borderColor: 'divider' },
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {ejercicio.nombreEjercicio}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {ejercicio.series} × {ejercicio.repeticiones}
                {descanso && ` · descanso ${descanso}`}
              </Typography>
            </Box>
          )
        })}
      </Box>

      {(onEdit || onDelete) && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.5,
            p: 2,
            pt: 1.5,
            '& > *': { flex: '1 1 auto' },
          }}
        >
          {onEdit && (
            <Button
              variant="contained"
              size="small"
              startIcon={<EditIcon />}
              onClick={() => onEdit(rutina)}
            >
              Editar
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => onDelete(rutina)}
            >
              Eliminar
            </Button>
          )}
        </Box>
      )}
    </Card>
  )
}

export default RutinaCard
