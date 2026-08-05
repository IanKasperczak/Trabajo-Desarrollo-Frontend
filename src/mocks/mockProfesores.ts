import type { Profesor } from '../models/profesor'
import { mockEspecialidades as es } from './mockEspecialidades'

export const mockProfesores: Profesor[] = [
  {
    id: 1,
    nombre: 'Carlos',
    apellido: 'Gómez',
    dni: '30.123.456',
    email: 'carlos.gomez@powertrainer.com',
    telefono: '+54 11 5555-0101',
    especialidades: [es[0], es[1]],
  },
  {
    id: 2,
    nombre: 'María',
    apellido: 'Fernández',
    dni: '31.234.567',
    email: 'maria.fernandez@powertrainer.com',
    telefono: '+54 11 5555-0102',
    especialidades: [es[0], es[3]],
  },
  {
    id: 3,
    nombre: 'Jorge',
    apellido: 'Rodríguez',
    dni: '32.345.678',
    email: 'jorge.rodriguez@powertrainer.com',
    telefono: '+54 11 5555-0103',
    especialidades: [es[1], es[2]],
  },
  {
    id: 4,
    nombre: 'Lucía',
    apellido: 'Martínez',
    dni: '33.456.789',
    email: 'lucia.martinez@powertrainer.com',
    telefono: '+54 11 5555-0104',
    especialidades: [es[4], es[2]],
  },
  {
    id: 5,
    nombre: 'Diego',
    apellido: 'Pérez',
    dni: '34.567.890',
    email: 'diego.perez@powertrainer.com',
    telefono: '+54 11 5555-0105',
    especialidades: [es[0], es[4]],
  },
  {
    id: 6,
    nombre: 'Sofía',
    apellido: 'López',
    dni: '35.678.901',
    email: 'sofia.lopez@powertrainer.com',
    telefono: '+54 11 5555-0106',
    especialidades: [es[1], es[3]],
  },
]