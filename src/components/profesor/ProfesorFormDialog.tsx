import { Dialog, DialogTitle } from '@mui/material'
import type { Especialidad } from '../../models/especialidad'
import type { Profesor, ProfesorFormValues } from '../../models/profesor'
import ProfesorForm from './ProfesorForm'

interface ProfesorFormDialogProps {
  open: boolean
  profesor: Profesor | null
  especialidades: Especialidad[]
  onClose: () => void
  onSubmit: (values: ProfesorFormValues) => Promise<void>
}

function ProfesorFormDialog({
  open,
  profesor,
  especialidades,
  onClose,
  onSubmit,
}: ProfesorFormDialogProps) {
  const isEditing = profesor !== null

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
      <DialogTitle>{isEditing ? 'Editar Profesor' : 'Nuevo Profesor'}</DialogTitle>
      <ProfesorForm
        profesor={profesor}
        especialidades={especialidades}
        onCancel={onClose}
        onSubmit={onSubmit}
      />
    </Dialog>
  )
}

export default ProfesorFormDialog