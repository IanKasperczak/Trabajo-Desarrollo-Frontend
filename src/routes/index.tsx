import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import Dashboard from '../pages/Dashboard'
import Profesores from '../pages/Profesores'
import Especialidades from '../pages/Especialidades'
import Clientes from '../pages/Clientes'
import Salones from '../pages/Salones'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'profesores', element: <Profesores /> },
      { path: 'especialidades', element: <Especialidades /> },
      { path: 'clientes', element: <Clientes /> },
      { path: 'salones', element: <Salones /> },
    ],
  },
])