import api from '../api/api'
import type { Cliente, ClienteInput, ClienteUpdate } from '../models/cliente'

export const clienteService = {
  // Datos del cliente que inició sesión (el resto de los endpoints son para admin y profesor)
  getMiPerfil: async (): Promise<Cliente> => {
    const response = await api.get<Cliente>('/clientes/me')
    return response.data
  },
  // El cliente solo puede cambiar su teléfono; vacío lo borra
  updateMiPerfil: async (telefono: string): Promise<Cliente> => {
    const response = await api.put<Cliente>('/clientes/me', { telefono })
    return response.data
  },
  getAll: async (): Promise<Cliente[]> => {
    const response = await api.get<Cliente[]>('/clientes')
    return response.data
  },
  getByDni: async (dni: number): Promise<Cliente> => {
    const response = await api.get<Cliente>(`/clientes/${dni}`)
    return response.data
  },
  // Crea también su cuenta para entrar a la app (contraseña inicial: su DNI)
  create: async (data: ClienteInput): Promise<Cliente> => {
    const response = await api.post<Cliente>('/clientes', data)
    return response.data
  },
  update: async (dni: number, data: ClienteUpdate): Promise<Cliente> => {
    const response = await api.put<Cliente>(`/clientes/${dni}`, data)
    return response.data
  },
  // Borra el cliente y su cuenta
  delete: async (dni: number): Promise<void> => {
    await api.delete(`/clientes/${dni}`)
  },
}
