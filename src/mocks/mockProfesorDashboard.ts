import type { AlertItem, KpiItem } from '../models/dashboard'

export const profesorInfo = {
  nombre: 'Carlos',
  apellido: 'Gómez',
  nivel: 'Crossfit',
}

export const nextClass = {
  clase: 'Crossfit',
  horario: '18:00 - 19:00',
  salon: 'Salón 1',
  alumnos: 24,
}

export const profesorKpis: KpiItem[] = [
  { label: 'Clases de hoy', value: '3' },
  { label: 'Alumnos', value: '74', hint: 'En todas sus clases' },
  { label: 'Horas semanales', value: '12' },
]

export const todayClasses = [
  { hora: '09:00', clase: 'Funcional', salon: 'Salón 2', alumnos: 18 },
  { hora: '11:00', clase: 'Crossfit', salon: 'Salón 1', alumnos: 22 },
  { hora: '18:00', clase: 'Crossfit', salon: 'Salón 1', alumnos: 24 },
]

export const weeklySchedule = [
  { dia: 'Lunes', horario: '09:00 - 10:00', clase: 'Crossfit' },
  { dia: 'Martes', horario: '18:00 - 19:00', clase: 'Funcional' },
  { dia: 'Miércoles', horario: '09:00 - 10:00', clase: 'Crossfit' },
  { dia: 'Jueves', horario: '18:00 - 19:00', clase: 'Crossfit' },
  { dia: 'Viernes', horario: '09:00 - 10:00', clase: 'Crossfit' },
]

export const profesorNotices: AlertItem[] = [
  {
    title: 'Reunión de profesores',
    description: 'Viernes 10:00 en la oficina.',
    severity: 'info',
  },
  {
    title: 'Mantenimiento del Salón 3',
    description: 'Miércoles cerrado por refacciones.',
    severity: 'warning',
  },
]