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
import VisibilityIcon from '@mui/icons-material/Visibility'
import type { Cliente } from '../../models/cliente'
import { colorEstado, formatearFecha } from '../../utils/membresia'
import { easeOut } from '../../styles/theme'

interface ClienteCardProps {
  cliente: Cliente
  expanded: boolean
  onToggle: () => void
  onDetail: (cliente: Cliente) => void
  onEdit: (cliente: Cliente) => void
  onDelete: (cliente: Cliente) => void
}

function getInitials(nombre: string, apellido: string): string {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
}

function textoAcceso({ activo, debeCambiarPassword }: Cliente): string {
  if (!activo) return 'Su acceso a la app está deshabilitado.'
  if (debeCambiarPassword) return 'Puede entrar con su email. Todavía no eligió su propia contraseña.'
  return 'Puede entrar a la app con su email.'
}

function ClienteCard({ cliente, expanded, onToggle, onDetail, onEdit, onDelete }: ClienteCardProps) {
  const { dni, nombre, apellido, email, telefono, activo, debeCambiarPassword, membresia } = cliente
  const puedeEntrar = activo

  return (
    <Card
      variant="outlined"
      sx={{
        bgcolor: 'background.paper',
        opacity: puedeEntrar ? 1 : 0.85,
        transition: `box-shadow 200ms ${easeOut}, border-color 200ms ease`,
        '@media (hover: hover) and (pointer: fine)': {
          '&:hover': { boxShadow: 'var(--sombra-tarjeta-hover)', borderColor: 'var(--borde-hover)' },
        },
      }}
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
          sx={{ px: 2, py: 1.75, '& .MuiAccordionSummary-content': { minWidth: 0, my: 0 } }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
              <Avatar sx={{ bgcolor: 'primary.main', color: 'text.primary', fontWeight: 700, flexShrink: 0 }}>
                {getInitials(nombre, apellido)}
              </Avatar>
              {/* span: el Accordion ya envuelve el resumen en un <h3> */}
              <Typography variant="h5" component="span" noWrap>
                {nombre} {apellido}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <Typography variant="body2" color="text.secondary" noWrap data-tabular>
                DNI: {dni}
              </Typography>
              {!puedeEntrar && <Chip label="Sin acceso" size="small" variant="outlined" />}
              {puedeEntrar && debeCambiarPassword && (
                <Chip label="Contraseña inicial" size="small" color="warning" variant="outlined" />
              )}
            </Stack>
            {membresia !== undefined && (
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <Chip
                  label={membresia ? membresia.estado : 'Sin membresía'}
                  size="small"
                  color={membresia ? colorEstado[membresia.estado] : 'default'}
                  variant={membresia ? 'filled' : 'outlined'}
                />
                {membresia && (
                  <Typography variant="caption" color="text.secondary" noWrap>
                    Vence {formatearFecha(membresia.fechaVencimiento)}
                  </Typography>
                )}
              </Stack>
            )}
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
              variant="outlined"
              startIcon={<VisibilityIcon />}
              size="small"
              onClick={() => onDetail(cliente)}
            >
              Ver detalle
            </Button>
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
