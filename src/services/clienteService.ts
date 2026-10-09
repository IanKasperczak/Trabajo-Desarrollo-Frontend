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
  // Con crearCuenta también le crea la cuenta para entrar a la app (contraseña inicial: su DNI)
  create: async (data: ClienteInput): Promise<Cliente> => {
    const response = await api.post<Cliente>('/clientes', data)
    return response.data
  },
  // Le crea la cuenta a un cliente que no tiene; la contraseña inicial es su DNI
  crearCuenta: async (dni: number): Promise<void> => {
    await api.post(`/clientes/${dni}/cuenta`)
  },
  update: async (dni: number, data: ClienteUpdate): Promise<Cliente> => {
    const response = await api.put<Cliente>(`/clientes/${dni}`, data)
    return response.data
  },
  // Borra el cliente y su cuenta, si tiene
  delete: async (dni: number): Promise<void> => {
    await api.delete(`/clientes/${dni}`)
  },
}
