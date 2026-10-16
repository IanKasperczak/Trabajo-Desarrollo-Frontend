import api from '../api/api'
import type { Membresia, MembresiaInput, MembresiaUpdate } from '../models/membresia'

// El admin ve todas las membresías y cada cliente solo las suyas (lo filtra el backend)
export const membresiaService = {
  getAll: async (): Promise<Membresia[]> => {
    const response = await api.get<Membresia[]>('/membresias')
    return response.data
  },
  create: async (data: MembresiaInput): Promise<Membresia> => {
    const response = await api.post<Membresia>('/membresias', data)
    return response.data
  },
  update: async (id: number, data: MembresiaUpdate): Promise<Membresia> => {
    const response = await api.put<Membresia>(`/membresias/${id}`, data)
    return response.data
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/membresias/${id}`)
  },
}
