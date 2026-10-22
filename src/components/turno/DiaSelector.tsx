import { Box, Button, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { hoyISO, sumarDias } from '../../utils/membresia'
import { etiquetaDia } from '../../utils/turno'

interface DiaSelectorProps {
  fecha: string
  onChange: (fecha: string) => void
  // Límites opcionales (por ejemplo, el cliente solo reserva de hoy en adelante)
  min?: string
  max?: string
}

function DiaSelector({ fecha, onChange, min, max }: DiaSelectorProps) {
  const anterior = sumarDias(fecha, -1)
  const siguiente = sumarDias(fecha, 1)
  const puedeIrAtras = !min || anterior >= min
  const puedeIrAdelante = !max || siguiente <= max
  const esHoy = fecha === hoyISO()

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.5}
      alignItems={{ xs: 'stretch', sm: 'center' }}
      sx={{ mb: 2.5 }}
    >
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Tooltip title="Día anterior">
          <span>
            <IconButton
              aria-label="Día anterior"
              onClick={() => onChange(anterior)}
              disabled={!puedeIrAtras}
            >
              <ChevronLeftIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Box sx={{ minWidth: { sm: 220 }, flexGrow: 1, textAlign: 'center' }}>
          <Typography variant="h6" component="p" aria-live="polite">
            {etiquetaDia(fecha)}
          </Typography>
        </Box>
        <Tooltip title="Día siguiente">
          <span>
            <IconButton
              aria-label="Día siguiente"
              onClick={() => onChange(siguiente)}
              disabled={!puedeIrAdelante}
            >
              <ChevronRightIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          type="date"
          size="small"
          value={fecha}
          onChange={(event) => event.target.value && onChange(event.target.value)}
          slotProps={{
            htmlInput: { min, max, 'aria-label': 'Elegir una fecha' },
          }}
          sx={{ flexGrow: 1 }}
        />
        <Button variant="outlined" onClick={() => onChange(hoyISO())} disabled={esHoy}>
          Hoy
        </Button>
      </Stack>
    </Stack>
  )
}

export default DiaSelector
