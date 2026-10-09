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
import type { Cliente } from '../../models/cliente'

interface ClienteCardProps {
  cliente: Cliente
  expanded: boolean
  onToggle: () => void
  onEdit: (cliente: Cliente) => void
  onDelete: (cliente: Cliente) => void
  onDarAcceso: (cliente: Cliente) => void
}

function getInitials(nombre: string, apellido: string): string {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
}

function textoAcceso({ tieneCuenta, activo, debeCambiarPassword }: Cliente): string {
  if (!tieneCuenta) return 'Todavía no tiene acceso a la app.'
  if (!activo) return 'Su acceso a la app está deshabilitado.'
  if (debeCambiarPassword) return 'Puede entrar con su email. Todavía no eligió su propia contraseña.'
  return 'Puede entrar a la app con su email.'
}

function ClienteCard({
  cliente,
  expanded,
  onToggle,
  onEdit,
  onDelete,
  onDarAcceso,
}: ClienteCardProps) {
  const { dni, nombre, apellido, email, telefono, tieneCuenta, activo, debeCambiarPassword } =
    cliente
  const puedeEntrar = tieneCuenta && activo

  return (
    <Card
      variant="outlined"
      sx={{ height: '100%', bgcolor: 'background.paper', opacity: puedeEntrar ? 1 : 0.85 }}
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
              {!puedeEntrar && <Chip label="Sin acceso" size="small" variant="outlined" />}
              {puedeEntrar && debeCambiarPassword && (
                <Chip label="Contraseña inicial" size="small" color="warning" variant="outlined" />
              )}
            </Stack>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 2, pb: 2, pt: 0 }}>
          <Stack spacing={1.25} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              <EmailIcon fontSize="small" color="action" />
              <Typography variant="body2" noWrap color={email ? 'text.primary' : 'text.secondary'}>
                {email ?? 'Sin email'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneIcon fontSize="small" color="action" />
              <Typography variant="body2" color={telefono ? 'text.primary' : 'text.secondary'}>
                {telefono ?? 'Sin teléfono'}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {textoAcceso(cliente)}
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
            {!tieneCuenta && (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<KeyIcon />}
                size="small"
                onClick={() => onDarAcceso(cliente)}
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

export default ClienteCard
