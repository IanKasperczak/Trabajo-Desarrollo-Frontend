import api from '../api/api'

export const profesorService = {
  getAll: () => api.get('/profesores'),
  getById: (id: number) => api.get(`/profesores/${id}`),
  create: (data: unknown) => api.post('/profesores', data),
  update: (id: number, data: unknown) => api.put(`/profesores/${id}`, data),
  delete: (id: number) => api.delete(`/profesores/${id}`),
}