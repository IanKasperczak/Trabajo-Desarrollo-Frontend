import { Box, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import LockResetIcon from '@mui/icons-material/LockReset'
import BlockIcon from '@mui/icons-material/Block'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import DeleteIcon from '@mui/icons-material/Delete'
import type { ReactElement } from 'react'
import type { Cuenta } from '../../models/usuario'
import { roles } from '../../models/role'

interface CuentaItemProps {
  cuenta: Cuenta
  // Ej. "Profesor: Ana Gómez", si la cuenta está vinculada a alguien
  detalle?: string
  esPropia: boolean
  onToggleActivo: (cuenta: Cuenta) => void
  onResetPassword: (cuenta: Cuenta) => void
  onDelete: (cuenta: Cuenta) => void
}

// Tooltip no puede escuchar eventos de un botón deshabilitado: se envuelve en un span
function Accion({ title, children }: { title: string; children: ReactElement }) {
  return (
    <Tooltip title={title}>
      <span>{children}</span>
    </Tooltip>
  )
}

function CuentaItem({
  cuenta,
  detalle,
  esPropia,
  onToggleActivo,
  onResetPassword,
  onDelete,
}: CuentaItemProps) {
  const rolLabel = roles.find((r) => r.value === cuenta.rol)?.label ?? cuenta.rol
  const esCliente = cuenta.rol === 'cliente'

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: 1.5,
        px: 2,
        py: 1.5,
        opacity: cuenta.activo ? 1 : 0.7,
        '&:not(:last-of-type)': { borderBottom: '1px solid', borderColor: 'divider' },
      }}
    >
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant="body1" sx={{ fontWeight: 600, wordBreak: 'break-all' }}>
          {cuenta.email}
        </Typography>
        {detalle && (
          <Typography variant="body2" color="text.secondary">
            {detalle}
          </Typography>
        )}
        <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap" sx={{ mt: 0.75 }}>
          <Chip label={rolLabel} size="small" color="primary" variant="outlined" />
          {esPropia && <Chip label="Vos" size="small" />}
          {!cuenta.activo && <Chip label="Deshabilitada" size="small" variant="outlined" />}
          {cuenta.activo && cuenta.debeCambiarPassword && (
            <Chip label="Contraseña inicial" size="small" color="warning" variant="outlined" />
          )}
        </Stack>
      </Box>

      {esPropia ? (
        <Typography variant="caption" color="text.secondary" sx={{ maxWidth: { sm: 200 } }}>
          Tu contraseña se cambia desde Configuración.
        </Typography>
      ) : (
        <Stack direction="row" spacing={0.5} sx={{ alignSelf: { xs: 'flex-end', sm: 'center' } }}>
          <Accion title="Resetear contraseña">
            <IconButton
              aria-label={`Resetear contraseña de ${cuenta.email}`}
              onClick={() => onResetPassword(cuenta)}
            >
              <LockResetIcon />
            </IconButton>
          </Accion>
          <Accion title={cuenta.activo ? 'Deshabilitar acceso' : 'Habilitar acceso'}>
            <IconButton
              aria-label={`${cuenta.activo ? 'Deshabilitar' : 'Habilitar'} acceso de ${cuenta.email}`}
              onClick={() => onToggleActivo(cuenta)}
            >
              {cuenta.activo ? <BlockIcon /> : <CheckCircleOutlineIcon color="success" />}
            </IconButton>
          </Accion>
          <Accion
            title={esCliente ? 'Las cuentas de clientes se eliminan desde Clientes' : 'Eliminar cuenta'}
          >
            <IconButton
              aria-label={`Eliminar cuenta de ${cuenta.email}`}
              onClick={() => onDelete(cuenta)}
              disabled={esCliente}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Accion>
        </Stack>
      )}
    </Box>
  )
}

export default CuentaItem
