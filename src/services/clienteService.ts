import api from '../api/api'

export const clienteService = {
  getAll: () => api.get('/clientes'),
  getById: (id: number) => api.get(`/clientes/${id}`),
  create: (data: unknown) => api.post('/clientes', data),
  update: (id: number, data: unknown) => api.put(`/clientes/${id}`, data),
  delete: (id: number) => api.delete(`/clientes/${id}`),
}