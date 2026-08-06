import api from '../api/api'
import type { Especialidad, EspecialidadInput } from '../models/especialidad'

export const especialidadService = {
  getAll: async (): Promise<Especialidad[]> => {
    const response = await api.get<Especialidad[]>('/especialidades')
    return response.data
  },
  getById: async (id: number): Promise<Especialidad> => {
    const response = await api.get<Especialidad>(`/especialidades/${id}`)
    return response.data
  },
  create: async (data: EspecialidadInput): Promise<Especialidad> => {
    const response = await api.post<Especialidad>('/especialidades', data)
    return response.data
  },
  update: async (id: number, data: Partial<EspecialidadInput>): Promise<Especialidad> => {
    const response = await api.put<Especialidad>(`/especialidades/${id}`, data)
    return response.data
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/especialidades/${id}`)
  },
}