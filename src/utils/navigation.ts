import DashboardIcon from '@mui/icons-material/Dashboard'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import CategoryIcon from '@mui/icons-material/Category'
import PersonIcon from '@mui/icons-material/Person'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import type { SvgIconComponent } from '@mui/icons-material'

export interface NavItem {
  label: string
  path: string
  icon: SvgIconComponent
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: DashboardIcon },
  { label: 'Profesores', path: '/profesores', icon: SupervisorAccountIcon },
  { label: 'Especialidades', path: '/especialidades', icon: CategoryIcon },
  { label: 'Clientes', path: '/clientes', icon: PersonIcon },
  { label: 'Salones', path: '/salones', icon: MeetingRoomIcon },
]