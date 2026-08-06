import api from '../api/api'
import type { Profesor, ProfesorInput } from '../models/profesor'

export const profesorService = {
  getAll: async (): Promise<Profesor[]> => {
    const response = await api.get<Profesor[]>('/profesores')
    return response.data
  },
  getByDni: async (dni: number): Promise<Profesor> => {
    const response = await api.get<Profesor>(`/profesores/${dni}`)
    return response.data
  },
  create: async (data: ProfesorInput): Promise<ProfesorInput> => {
    const response = await api.post<ProfesorInput>('/profesores', data)
    return response.data
  },
  update: async (dni: number, data: Partial<ProfesorInput>): Promise<ProfesorInput> => {
    const response = await api.put<ProfesorInput>(`/profesores/${dni}`, data)
    return response.data
  },
  delete: async (dni: number): Promise<void> => {
    await api.delete(`/profesores/${dni}`)
  },
}