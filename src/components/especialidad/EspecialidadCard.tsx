import { Box, Button, Card, Typography } from '@mui/material'
import CategoryIcon from '@mui/icons-material/Category'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import type { Especialidad } from '../../models/especialidad'

interface EspecialidadCardProps {
  especialidad: Especialidad
  onEdit: (especialidad: Especialidad) => void
  onDelete: (especialidad: Especialidad) => void
}

function EspecialidadCard({ especialidad, onEdit, onDelete }: EspecialidadCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ p: 2, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: 'rgba(255, 193, 7, 0.16)',
              color: 'primary.dark',
              flexShrink: 0,
            }}
          >
            <CategoryIcon fontSize="small" />
          </Box>
          <Typography variant="h5" component="h3" noWrap>
            {especialidad.nombre}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          p: 2,
          pt: 0,
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
          onClick={() => onEdit(especialidad)}
        >
          Editar
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          size="small"
          onClick={() => onDelete(especialidad)}
        >
          Eliminar
        </Button>
      </Box>
    </Card>
  )
}

export default EspecialidadCard