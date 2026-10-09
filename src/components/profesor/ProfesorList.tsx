import { useState } from 'react'
import { Grid } from '@mui/material'
import type { Profesor } from '../../models/profesor'
import ProfesorCard from './ProfesorCard'

interface ProfesorListProps {
  profesores: Profesor[]
  onEdit: (profesor: Profesor) => void
  onDelete: (profesor: Profesor) => void
  onDarAcceso: (profesor: Profesor) => void
}

function ProfesorList({ profesores, onEdit, onDelete, onDarAcceso }: ProfesorListProps) {
  const [expandedDni, setExpandedDni] = useState<number | null>(null)

  return (
    <Grid container spacing={2}>
      {profesores.map((profesor) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={profesor.dni}>
          <ProfesorCard
            profesor={profesor}
            expanded={expandedDni === profesor.dni}
            onToggle={() =>
              setExpandedDni((prev) =>
                prev === profesor.dni ? null : profesor.dni,
              )
            }
            onEdit={onEdit}
            onDelete={onDelete}
            onDarAcceso={onDarAcceso}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default ProfesorList