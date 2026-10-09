import { useState } from 'react'
import { Grid } from '@mui/material'
import type { Cliente } from '../../models/cliente'
import ClienteCard from './ClienteCard'

interface ClienteListProps {
  clientes: Cliente[]
  onEdit: (cliente: Cliente) => void
  onDelete: (cliente: Cliente) => void
  onDarAcceso: (cliente: Cliente) => void
}

function ClienteList({ clientes, onEdit, onDelete, onDarAcceso }: ClienteListProps) {
  const [expandedDni, setExpandedDni] = useState<number | null>(null)

  return (
    <Grid container spacing={2}>
      {clientes.map((cliente) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={cliente.dni}>
          <ClienteCard
            cliente={cliente}
            expanded={expandedDni === cliente.dni}
            onToggle={() =>
              setExpandedDni((prev) => (prev === cliente.dni ? null : cliente.dni))
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

export default ClienteList
