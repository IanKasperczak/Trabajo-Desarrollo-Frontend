import { Box, Button, Card, Chip, Stack, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import type { Membresia } from '../../models/membresia'
import { colorEstado, diasHasta, formatearFecha, formatearImporte } from '../../utils/membresia'

interface MembresiaCardProps {
  membresia: Membresia
  mostrarCliente?: boolean
  // Sin estas acciones la tarjeta es de solo lectura (vista del cliente)
  onEdit?: (membresia: Membresia) => void
  onDelete?: (membresia: Membresia) => void
}

function Dato({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
    </Box>
  )
}

// Aviso corto del tiempo que queda (o que pasó) según el estado
function textoPlazo(membresia: Membresia): string | null {
  const dias = diasHasta(membresia.fechaVencimiento)
  if (membresia.estado === 'Vencida') {
    const hace = Math.abs(dias)
    return hace === 1 ? 'Venció ayer' : `Venció hace ${hace} días`
  }
  if (membresia.estado === 'Por vencer') {
    if (dias === 0) return 'Vence hoy'
    return dias === 1 ? 'Vence mañana' : `Vence en ${dias} días`
  }
  return null
}

function MembresiaCard({ membresia, mostrarCliente = false, onEdit, onDelete }: MembresiaCardProps) {
  const { cliente, estado, fechaPago, fechaInicio, fechaVencimiento, valor } = membresia
  const plazo = textoPlazo(membresia)

  return (
    <Card variant="outlined" sx={{ height: '100%', bgcolor: 'background.paper', p: 2 }}>
      <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="flex-start">
        <Box sx={{ minWidth: 0 }}>
          {mostrarCliente && (
            <Typography variant="h6" component="h2" noWrap>
              {cliente ? `${cliente.nombre} ${cliente.apellido}` : `DNI ${membresia.dniCliente}`}
            </Typography>
          )}
          <Typography
            variant={mostrarCliente ? 'body2' : 'h5'}
            color={mostrarCliente ? 'text.secondary' : 'text.primary'}
          >
            {formatearImporte(valor)}
          </Typography>
        </Box>
        <Chip label={estado} size="small" color={colorEstado[estado]} sx={{ flexShrink: 0 }} />
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: 1.5,
          mt: 1.5,
        }}
      >
        <Dato label="Pagó el" value={formatearFecha(fechaPago)} />
        <Dato label="Desde" value={formatearFecha(fechaInicio)} />
        <Dato label="Vence el" value={formatearFecha(fechaVencimiento)} />
      </Box>

      {plazo && (
        <Typography
          variant="body2"
          color={estado === 'Vencida' ? 'error' : 'warning.main'}
          sx={{ mt: 1.5, fontWeight: 600 }}
        >
          {plazo}
        </Typography>
      )}

      {(onEdit || onDelete) && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 2, '& > *': { flex: '1 1 auto' } }}>
          {onEdit && (
            <Button
              variant="contained"
              size="small"
              startIcon={<EditIcon />}
              onClick={() => onEdit(membresia)}
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
              onClick={() => onDelete(membresia)}
            >
              Eliminar
            </Button>
          )}
        </Box>
      )}
    </Card>
  )
}

export default MembresiaCard
