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
import KeyIcon from '@mui/icons-material/Key'
import type { Profesor } from '../../models/profesor'

interface ProfesorCardProps {
  profesor: Profesor
  expanded: boolean
  onToggle: () => void
  onEdit: (profesor: Profesor) => void
  onDelete: (profesor: Profesor) => void
  onDarAcceso: (profesor: Profesor) => void
}

function getInitials(nombre: string, apellido: string): string {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
}

function ProfesorCard({
  profesor,
  expanded,
  onToggle,
  onEdit,
  onDelete,
  onDarAcceso,
}: ProfesorCardProps) {
  const { dni, nombre, apellido, email, telefono, especialidades, tieneCuenta } = profesor

  return (
    <Card variant="outlined" sx={{ height: '100%', bgcolor: 'background.paper' }}>
      <Accordion
        expanded={expanded}
        onChange={onToggle}
        disableGutters
        elevation={0}
        sx={{
          '&::before': { display: 'none' },
          '&.Mui-expanded': { margin: 0 },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon color="primary" />}
          aria-controls={`profesor-${dni}-content`}
          id={`profesor-${dni}-header`}
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
              {/* span: el Accordion ya envuelve el resumen en un <h3> */}
              <Typography variant="h5" component="span" noWrap>
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
                  key={esp.idEspecialidad}
                  label={esp.nombre}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary" noWrap>
                DNI: {dni}
              </Typography>
              {!tieneCuenta && <Chip label="Sin acceso" size="small" variant="outlined" />}
            </Stack>
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
            <Box>
              <Typography variant="caption" color="text.secondary">
                Especialidades ({especialidades.length}):
              </Typography>
              <Stack
                direction="row"
                spacing={0.75}
                flexWrap="wrap"
                useFlexGap
                sx={{ rowGap: 0.75, mt: 0.75 }}
              >
                {especialidades.map((esp) => (
                  <Chip
                    key={esp.idEspecialidad}
                    label={esp.nombre}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {tieneCuenta
                ? 'Puede entrar a la app con su email.'
                : 'Todavía no tiene acceso a la app.'}
            </Typography>
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
              onClick={() => onEdit(profesor)}
            >
              Editar
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              size="small"
              onClick={() => onDelete(profesor)}
            >
              Eliminar
            </Button>
            {!tieneCuenta && (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<KeyIcon />}
                size="small"
                onClick={() => onDarAcceso(profesor)}
                sx={{ color: 'text.primary' }}
              >
                Dar acceso
              </Button>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Card>
  )
}

export default ProfesorCard