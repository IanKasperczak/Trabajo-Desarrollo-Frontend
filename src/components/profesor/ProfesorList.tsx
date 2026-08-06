import { Grid } from '@mui/material'
import type { Profesor } from '../../models/profesor'
import ProfesorCard from './ProfesorCard'

interface ProfesorListProps {
  profesores: Profesor[]
  onEdit: (profesor: Profesor) => void
  onDelete: (profesor: Profesor) => void
}

function ProfesorList({ profesores, onEdit, onDelete }: ProfesorListProps) {
  return (
    <Grid container spacing={2}>
      {profesores.map((profesor) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={profesor.dni}>
          <ProfesorCard
            profesor={profesor}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default ProfesorList