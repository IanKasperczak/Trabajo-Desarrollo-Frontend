import api from '../api/api'

export const salonService = {
  getAll: () => api.get('/salones'),
  getById: (id: number) => api.get(`/salones/${id}`),
  create: (data: unknown) => api.post('/salones', data),
  update: (id: number, data: unknown) => api.put(`/salones/${id}`, data),
  delete: (id: number) => api.delete(`/salones/${id}`),
}