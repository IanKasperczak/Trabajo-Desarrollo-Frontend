import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Stack,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import type { Profesor } from '../../models/profesor'

interface ProfesorCardProps {
  profesor: Profesor
}

function getInitials(nombre: string, apellido: string): string {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
}

function ProfesorCard({ profesor }: ProfesorCardProps) {
  const { id, nombre, apellido, dni, email, telefono, especialidades } =
    profesor

  return (
    <Card
      variant="outlined"
      sx={{ height: '100%', bgcolor: 'background.paper' }}
    >
      <Accordion
        disableGutters
        elevation={0}
        sx={{
          '&::before': { display: 'none' },
          '&.Mui-expanded': { margin: 0 },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon color="primary" />}
          aria-controls={`profesor-${id}-content`}
          id={`profesor-${id}-header`}
          sx={{ px: 2, py: 1.5 }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              minWidth: 0,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: 'primary.main', color: 'text.primary' }}>
                {getInitials(nombre, apellido)}
              </Avatar>
              <Typography variant="h5" component="h3" noWrap>
                {nombre} {apellido}
              </Typography>
            </Box>
            <Stack
              direction="row"
              spacing={0.75}
              flexWrap="wrap"
              useFlexGap
              sx={{ rowGap: 0.75 }}
            >
              {especialidades.map((esp) => (
                <Chip
                  key={esp.id}
                  label={esp.nombre}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Stack>
            <Typography variant="body2" color="text.secondary">
              DNI: {dni}
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 2, pb: 2, pt: 0 }}>
          <Stack spacing={1.25} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon fontSize="small" color="action" />
              <Typography variant="body2">{email}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneIcon fontSize="small" color="action" />
              <Typography variant="body2">{telefono}</Typography>
            </Box>
          </Stack>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1.5,
              '& > *': { flex: '1 1 auto' },
            }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              size="small"
            >
              Editar
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              size="small"
            >
              Eliminar
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Card>
  )
}

export default ProfesorCard