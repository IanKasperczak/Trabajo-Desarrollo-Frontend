import DashboardIcon from '@mui/icons-material/Dashboard'
import PersonIcon from '@mui/icons-material/Person'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import EventIcon from '@mui/icons-material/Event'
import ScheduleIcon from '@mui/icons-material/Schedule'
import CardMembershipIcon from '@mui/icons-material/CardMembership'
import AssignmentIcon from '@mui/icons-material/Assignment'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import CategoryIcon from '@mui/icons-material/Category'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import type { SvgIconComponent } from '@mui/icons-material'
import type { Role } from '../models/role'

export interface NavItem {
  label: string
  path: string
  icon: SvgIconComponent
}

export const roleBase: Record<Role, string> = {
  administrador: '/admin',
  profesor: '/profesor',
  cliente: '/cliente',
}

export const roleNav: Record<Role, NavItem[]> = {
  administrador: [
    { label: 'Dashboard', path: '/', icon: DashboardIcon },
    { label: 'Clientes', path: 'clientes', icon: PersonIcon },
    { label: 'Profesores', path: 'profesores', icon: SupervisorAccountIcon },
    { label: 'Clases', path: 'clases', icon: EventIcon },
    { label: 'Turnos', path: 'turnos', icon: ScheduleIcon },
    { label: 'Membresías', path: 'membresias', icon: CardMembershipIcon },
    { label: 'Rutinas', path: 'rutinas', icon: AssignmentIcon },
    { label: 'Salones', path: 'salones', icon: MeetingRoomIcon },
    { label: 'Especialidades', path: 'especialidades', icon: CategoryIcon },
  ],
  profesor: [
    { label: 'Dashboard', path: '/', icon: DashboardIcon },
    { label: 'Mis Clases', path: 'mis-clases', icon: CalendarMonthIcon },
    { label: 'Mis Turnos', path: 'mis-turnos', icon: ScheduleIcon },
    { label: 'Mis Rutinas', path: 'mis-rutinas', icon: AssignmentIcon },
    { label: 'Mi Perfil', path: 'mi-perfil', icon: AccountCircleIcon },
  ],
  cliente: [
    { label: 'Dashboard', path: '/', icon: DashboardIcon },
    { label: 'Mis Clases', path: 'mis-clases', icon: CalendarMonthIcon },
    { label: 'Reservar Clase', path: 'reservar-clase', icon: EventAvailableIcon },
    { label: 'Mis Rutinas', path: 'mis-rutinas', icon: AssignmentIcon },
    { label: 'Mi Membresía', path: 'mi-membresia', icon: CardMembershipIcon },
    { label: 'Mi Perfil', path: 'mi-perfil', icon: AccountCircleIcon },
  ],
}