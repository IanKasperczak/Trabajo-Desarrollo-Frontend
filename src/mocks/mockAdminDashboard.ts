import type { AlertItem, BarDatum, GroupedBarDatum, KpiItem } from '../models/dashboard'

export const adminKpis: KpiItem[] = [
  { label: 'Clientes activos', value: '312', hint: '+12 esta semana' },
  { label: 'Turnos de hoy', value: '58', hint: '38 confirmados' },
  { label: 'Membresías por vencer', value: '24', hint: 'En los próximos 7 días' },
  { label: 'Ausencias de hoy', value: '9', hint: '15% del total' },
]

export const newClients: BarDatum[] = [
  { label: '1', value: 3 },
  { label: '2', value: 5 },
  { label: '3', value: 4 },
  { label: '4', value: 7 },
  { label: '5', value: 6 },
  { label: '6', value: 8 },
  { label: '7', value: 5 },
  { label: '8', value: 9 },
  { label: '9', value: 7 },
  { label: '10', value: 11 },
  { label: '11', value: 9 },
  { label: '12', value: 12 },
  { label: '13', value: 10 },
  { label: '14', value: 14 },
]

export const attendance: GroupedBarDatum[] = [
  {
    label: 'Lun',
    values: [
      { name: 'Reservados', value: 48, color: '#FFC107' },
      { name: 'Asistieron', value: 41, color: '#212121' },
    ],
  },
  {
    label: 'Mar',
    values: [
      { name: 'Reservados', value: 52, color: '#FFC107' },
      { name: 'Asistieron', value: 44, color: '#212121' },
    ],
  },
  {
    label: 'Mié',
    values: [
      { name: 'Reservados', value: 46, color: '#FFC107' },
      { name: 'Asistieron', value: 39, color: '#212121' },
    ],
  },
  {
    label: 'Jue',
    values: [
      { name: 'Reservados', value: 55, color: '#FFC107' },
      { name: 'Asistieron', value: 47, color: '#212121' },
    ],
  },
  {
    label: 'Vie',
    values: [
      { name: 'Reservados', value: 49, color: '#FFC107' },
      { name: 'Asistieron', value: 42, color: '#212121' },
    ],
  },
  {
    label: 'Sáb',
    values: [
      { name: 'Reservados', value: 61, color: '#FFC107' },
      { name: 'Asistieron', value: 53, color: '#212121' },
    ],
  },
  {
    label: 'Dom',
    values: [
      { name: 'Reservados', value: 30, color: '#FFC107' },
      { name: 'Asistieron', value: 25, color: '#212121' },
    ],
  },
]

export const popularClasses: BarDatum[] = [
  { label: 'Crossfit AM', value: 38 },
  { label: 'Musculación', value: 31 },
  { label: 'Cardio HIIT', value: 27 },
  { label: 'Funcional', value: 22 },
  { label: 'Boxeo', value: 18 },
]

export const topProfessors: BarDatum[] = [
  { label: 'Carlos Gómez', value: 92 },
  { label: 'María Fernández', value: 84 },
  { label: 'Jorge Rodríguez', value: 76 },
  { label: 'Lucía Martínez', value: 68 },
  { label: 'Diego Pérez', value: 55 },
]

export const adminAlerts: AlertItem[] = [
  {
    title: 'Membresías próximas a vencer',
    description: '12 membresías vencen esta semana.',
    severity: 'warning',
  },
  {
    title: 'Clases sin profesor',
    description: 'Crossfit 18:00 no tiene profesor asignado.',
    severity: 'error',
  },
  {
    title: 'Conflictos de horarios',
    description: 'Conflicto en Salón 2, jueves 17:00.',
    severity: 'warning',
  },
]