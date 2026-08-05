import { Grid } from '@mui/material'
import type { Profesor } from '../../models/profesor'
import ProfesorCard from './ProfesorCard'

interface ProfesorListProps {
  profesores: Profesor[]
}

function ProfesorList({ profesores }: ProfesorListProps) {
  return (
    <Grid container spacing={2}>
      {profesores.map((profesor) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={profesor.id}>
          <ProfesorCard profesor={profesor} />
        </Grid>
      ))}
    </Grid>
  )
}

export default ProfesorList