import { Dialog, DialogTitle } from '@mui/material'
import type { Cliente, ClienteFormValues } from '../../models/cliente'
import ClienteForm from './ClienteForm'

interface ClienteFormDialogProps {
  open: boolean
  cliente: Cliente | null
  onClose: () => void
  onSubmit: (values: ClienteFormValues) => Promise<void>
}

function ClienteFormDialog({ open, cliente, onClose, onSubmit }: ClienteFormDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          width: { xs: '100%', sm: 520 },
          m: { xs: 1, sm: 2 },
        },
      }}
    >
      <DialogTitle>{cliente ? 'Editar Cliente' : 'Nuevo Cliente'}</DialogTitle>
      <ClienteForm cliente={cliente} onCancel={onClose} onSubmit={onSubmit} />
    </Dialog>
  )
}

export default ClienteFormDialog
