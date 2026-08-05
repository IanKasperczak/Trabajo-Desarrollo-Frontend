import { createBrowserRouter, Navigate } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import AdminDashboard from '../pages/Dashboard/AdminDashboard'
import ProfesorDashboard from '../pages/Dashboard/ProfesorDashboard'
import ClienteDashboard from '../pages/Dashboard/ClienteDashboard'
import Clientes from '../pages/Clientes'
import Profesores from '../pages/Profesores'
import Especialidades from '../pages/Especialidades'
import Salones from '../pages/Salones'
import Clases from '../pages/Clases'
import Turnos from '../pages/Turnos'
import Membresias from '../pages/Membresias'
import Rutinas from '../pages/Rutinas'
import ProfesorMisClases from '../pages/Profesor/MisClases'
import ProfesorMisTurnos from '../pages/Profesor/MisTurnos'
import ProfesorMisRutinas from '../pages/Profesor/MisRutinas'
import ProfesorMiPerfil from '../pages/Profesor/MiPerfil'
import ClienteMisClases from '../pages/Cliente/MisClases'
import ClienteReservarClase from '../pages/Cliente/ReservarClase'
import ClienteMisRutinas from '../pages/Cliente/MisRutinas'
import ClienteMiMembresia from '../pages/Cliente/MiMembresia'
import ClienteMiPerfil from '../pages/Cliente/MiPerfil'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/admin" replace /> },
  {
    path: '/admin',
    element: <MainLayout role="administrador" />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'clientes', element: <Clientes /> },
      { path: 'profesores', element: <Profesores /> },
      { path: 'clases', element: <Clases /> },
      { path: 'turnos', element: <Turnos /> },
      { path: 'membresias', element: <Membresias /> },
      { path: 'rutinas', element: <Rutinas /> },
      { path: 'salones', element: <Salones /> },
      { path: 'especialidades', element: <Especialidades /> },
    ],
  },
  {
    path: '/profesor',
    element: <MainLayout role="profesor" />,
    children: [
      { index: true, element: <ProfesorDashboard /> },
      { path: 'mis-clases', element: <ProfesorMisClases /> },
      { path: 'mis-turnos', element: <ProfesorMisTurnos /> },
      { path: 'mis-rutinas', element: <ProfesorMisRutinas /> },
      { path: 'mi-perfil', element: <ProfesorMiPerfil /> },
    ],
  },
  {
    path: '/cliente',
    element: <MainLayout role="cliente" />,
    children: [
      { index: true, element: <ClienteDashboard /> },
      { path: 'mis-clases', element: <ClienteMisClases /> },
      { path: 'reservar-clase', element: <ClienteReservarClase /> },
      { path: 'mis-rutinas', element: <ClienteMisRutinas /> },
      { path: 'mi-membresia', element: <ClienteMiMembresia /> },
      { path: 'mi-perfil', element: <ClienteMiPerfil /> },
    ],
  },
])