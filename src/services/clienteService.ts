import api from '../api/api'
import type { Cliente, ClienteInput, ClienteUpdate } from '../models/cliente'

export const clienteService = {
  getAll: async (): Promise<Cliente[]> => {
    const response = await api.get<Cliente[]>('/clientes')
    return response.data
  },
  getByDni: async (dni: number): Promise<Cliente> => {
    const response = await api.get<Cliente>(`/clientes/${dni}`)
    return response.data
  },
  // Crea el cliente y su cuenta para entrar a la app
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
