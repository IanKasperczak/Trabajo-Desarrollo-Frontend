import { Grid } from '@mui/material'
import type { Especialidad } from '../../models/especialidad'
import EspecialidadCard from './EspecialidadCard'

interface EspecialidadListProps {
  especialidades: Especialidad[]
  onEdit: (especialidad: Especialidad) => void
  onDelete: (especialidad: Especialidad) => void
}

function EspecialidadList({
  especialidades,
  onEdit,
  onDelete,
}: EspecialidadListProps) {
  return (
    <Grid container spacing={2}>
      {especialidades.map((especialidad) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={especialidad.id}>
          <EspecialidadCard
            especialidad={especialidad}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default EspecialidadList