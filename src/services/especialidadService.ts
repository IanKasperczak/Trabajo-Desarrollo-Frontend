import api from '../api/api'

export const especialidadService = {
  getAll: () => api.get('/especialidades'),
  getById: (id: number) => api.get(`/especialidades/${id}`),
  create: (data: unknown) => api.post('/especialidades', data),
  update: (id: number, data: unknown) => api.put(`/especialidades/${id}`, data),
  delete: (id: number) => api.delete(`/especialidades/${id}`),
}