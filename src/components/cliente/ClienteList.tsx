import { useState } from 'react'
import { Grid } from '@mui/material'
import type { Cliente } from '../../models/cliente'
import ClienteCard from './ClienteCard'

interface ClienteListProps {
  clientes: Cliente[]
  onDetail: (cliente: Cliente) => void
  onEdit: (cliente: Cliente) => void
  onDelete: (cliente: Cliente) => void
}

function ClienteList({ clientes, onDetail, onEdit, onDelete }: ClienteListProps) {
  const [expandedDni, setExpandedDni] = useState<number | null>(null)

  return (
    <Grid container spacing={2} sx={{ alignItems: 'flex-start' }}>
      {clientes.map((cliente) => (
        <Grid item xs={12} md={6} xl={4} key={cliente.dni}>
          <ClienteCard
            cliente={cliente}
            expanded={expandedDni === cliente.dni}
            onToggle={() =>
              setExpandedDni((prev) => (prev === cliente.dni ? null : cliente.dni))
            }
            onDetail={onDetail}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default ClienteList
