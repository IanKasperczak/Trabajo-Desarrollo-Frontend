import { Button, Stack, Tooltip, useMediaQuery } from '@mui/material'
import { NavLink, useLocation } from 'react-router-dom'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import PersonIcon from '@mui/icons-material/Person'
import type { SvgIconComponent } from '@mui/icons-material'
import type { Theme } from '@mui/material'
import type { Role } from '../../models/role'
import { roleBase } from '../../utils/navigation'

interface RoleOption {
  role: Role
  label: string
  icon: SvgIconComponent
}

const roleOptions: RoleOption[] = [
  { role: 'administrador', label: 'Administrador', icon: AdminPanelSettingsIcon },
  { role: 'profesor', label: 'Profesor', icon: FitnessCenterIcon },
  { role: 'cliente', label: 'Cliente', icon: PersonIcon },
]

function RoleSwitcher() {
  const location = useLocation()
  const showLabels = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  return (
    <Stack direction="row" spacing={1}>
      {roleOptions.map(({ role, label, icon: Icon }) => {
        const to = roleBase[role]
        const isActive =
          location.pathname === to || location.pathname.startsWith(`${to}/`)

        const button = (
          <Button
            key={role}
            component={NavLink}
            to={to}
            size="small"
            variant={isActive ? 'contained' : 'text'}
            startIcon={<Icon />}
            sx={{
              minWidth: 36,
              px: 1,
              ...(isActive
                ? {}
                : {
                    color: 'rgba(255, 255, 255, 0.85)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
                  }),
            }}
          >
            {showLabels ? label : ''}
          </Button>
        )

        return showLabels ? (
          button
        ) : (
          <Tooltip key={role} title={label}>
            {button}
          </Tooltip>
        )
      })}
    </Stack>
  )
}

export default RoleSwitcher