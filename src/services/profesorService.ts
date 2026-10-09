import api from '../api/api'
import type { Profesor, ProfesorCreateInput, ProfesorInput } from '../models/profesor'

export const profesorService = {
  getAll: async (): Promise<Profesor[]> => {
    const response = await api.get<Profesor[]>('/profesores')
    return response.data
  },
  getByDni: async (dni: number): Promise<Profesor> => {
    const response = await api.get<Profesor>(`/profesores/${dni}`)
    return response.data
  },
  create: async (data: ProfesorCreateInput): Promise<ProfesorInput> => {
    const response = await api.post<ProfesorInput>('/profesores', data)
    return response.data
  },
  // Le crea la cuenta para entrar a la app; la contraseña inicial es su DNI
  crearCuenta: async (dni: number): Promise<void> => {
    await api.post(`/profesores/${dni}/cuenta`)
  },
  update: async (dni: number, data: Partial<ProfesorInput>): Promise<ProfesorInput> => {
    const response = await api.put<ProfesorInput>(`/profesores/${dni}`, data)
    return response.data
  },
  delete: async (dni: number): Promise<void> => {
    await api.delete(`/profesores/${dni}`)
  },
  assignEspecialidad: async (dni: number, idEspecialidad: number): Promise<void> => {
    await api.post(`/profesores/${dni}/especialidades`, { idEspecialidad })
  },
  removeEspecialidad: async (dni: number, idEspecialidad: number): Promise<void> => {
    await api.delete(`/profesores/${dni}/especialidades/${idEspecialidad}`)
  },
}