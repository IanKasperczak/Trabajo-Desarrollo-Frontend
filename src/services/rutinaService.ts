import api from '../api/api'
import type { Ejercicio, EjercicioInput, Rutina, RutinaInput, RutinaUpdate } from '../models/rutina'


type RutinaApi = Omit<Rutina, 'ejercicios'> & { ejercicios?: Ejercicio[] }

const toRutina = (r: RutinaApi): Rutina => ({
  ...r,
  // El backend no garantiza el orden: se muestran en el orden en que se cargaron
  ejercicios: [...(r.ejercicios ?? [])].sort((a, b) => a.id - b.id),
})

// El backend ya filtra según quién pregunta: admin ve todas, profesor las suyas, cliente las propias
export const rutinaService = {
  getAll: async (): Promise<Rutina[]> => {
    const response = await api.get<RutinaApi[]>('/rutinas')
    return response.data.map(toRutina)
  },
  getById: async (id: number): Promise<Rutina> => {
    const response = await api.get<RutinaApi>(`/rutinas/${id}`)
    return toRutina(response.data)
  },
  create: async (data: RutinaInput): Promise<Rutina> => {
    const response = await api.post<RutinaApi>('/rutinas', data)
    return toRutina(response.data)
  },
  update: async (id: number, data: RutinaUpdate): Promise<Rutina> => {
    const response = await api.put<RutinaApi>(`/rutinas/${id}`, data)
    return toRutina(response.data)
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/rutinas/${id}`)
  },
  addEjercicio: async (idRutina: number, data: EjercicioInput): Promise<void> => {
    await api.post(`/rutinas/${idRutina}/ejercicios`, data)
  },
  updateEjercicio: async (
    idRutina: number,
    idEjercicio: number,
    data: Partial<EjercicioInput>,
  ): Promise<void> => {
    await api.put(`/rutinas/${idRutina}/ejercicios/${idEjercicio}`, data)
  },
  deleteEjercicio: async (idRutina: number, idEjercicio: number): Promise<void> => {
    await api.delete(`/rutinas/${idRutina}/ejercicios/${idEjercicio}`)
  },
}
