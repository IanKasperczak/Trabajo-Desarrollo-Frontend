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
import type { Cliente } from '../../models/cliente'

interface ClienteCardProps {
  cliente: Cliente
  expanded: boolean
  onToggle: () => void
  onEdit: (cliente: Cliente) => void
  onDelete: (cliente: Cliente) => void
}

function getInitials(nombre: string, apellido: string): string {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
}

function ClienteCard({ cliente, expanded, onToggle, onEdit, onDelete }: ClienteCardProps) {
  const { dni, nombre, apellido, email, telefono, activo } = cliente

  return (
    <Card
      variant="outlined"
      sx={{ height: '100%', bgcolor: 'background.paper', opacity: activo ? 1 : 0.75 }}
    >
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
          aria-controls={`cliente-${dni}-content`}
          id={`cliente-${dni}-header`}
          sx={{ px: 2, py: 1.5 }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
              <Avatar sx={{ bgcolor: 'primary.main', color: 'text.primary' }}>
                {getInitials(nombre, apellido)}
              </Avatar>
              {/* span: el Accordion ya envuelve el resumen en un <h3> */}
              <Typography variant="h5" component="span" noWrap>
                {nombre} {apellido}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary" noWrap>
                DNI: {dni}
              </Typography>
              {!activo && <Chip label="Sin acceso" size="small" variant="outlined" />}
            </Stack>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 2, pb: 2, pt: 0 }}>
          <Stack spacing={1.25} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              <EmailIcon fontSize="small" color="action" />
              <Typography variant="body2" noWrap>
                {email}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneIcon fontSize="small" color="action" />
              <Typography variant="body2">{telefono}</Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {activo ? 'Puede entrar a la app con su email.' : 'Su acceso a la app está deshabilitado.'}
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
              onClick={() => onEdit(cliente)}
            >
              Editar
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              size="small"
              onClick={() => onDelete(cliente)}
            >
              Eliminar
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Card>
  )
}

export default ClienteCard
