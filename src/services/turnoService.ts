import api from '../api/api'
import type {
  EstadoInscripcion,
  FiltroTurnos,
  Inscripcion,
  TipoClase,
  TipoClaseInput,
  Turno,
  TurnoInput,
} from '../models/turno'

export const tipoClaseService = {
  getAll: async (): Promise<TipoClase[]> => {
    const response = await api.get<TipoClase[]>('/turnos/tipos-clase')
    return response.data
  },
  create: async (data: TipoClaseInput): Promise<TipoClase> => {
    const response = await api.post<TipoClase>('/turnos/tipos-clase', data)
    return response.data
  },
  update: async (id: number, data: Partial<TipoClaseInput>): Promise<TipoClase> => {
    const response = await api.put<TipoClase>(`/turnos/tipos-clase/${id}`, data)
    return response.data
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/turnos/tipos-clase/${id}`)
  },
}

// El backend ya filtra según quién pregunta: el profesor ve los turnos que dicta y el cliente
// recibe solo su propia inscripción en cada turno
export const turnoService = {
  getAll: async (filtro: FiltroTurnos = {}): Promise<Turno[]> => {
    const response = await api.get<Turno[]>('/turnos', { params: filtro })
    return response.data
  },
  // Turnos sin fecha que se repiten todos los días (solo admin)
  getPlantillas: async (): Promise<Turno[]> => {
    const response = await api.get<Turno[]>('/turnos/plantillas')
    return response.data
  },
  create: async (data: TurnoInput): Promise<Turno> => {
    const response = await api.post<Turno>('/turnos', data)
    return response.data
  },
  update: async (id: number, data: Partial<TurnoInput>): Promise<Turno> => {
    const response = await api.put<Turno>(`/turnos/${id}`, data)
    return response.data
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/turnos/${id}`)
  },
  getInscripciones: async (id: number): Promise<Inscripcion[]> => {
    const response = await api.get<Inscripcion[]>(`/turnos/${id}/inscripciones`)
    return response.data
  },
  // Cliente
  inscribirse: async (id: number): Promise<Inscripcion> => {
    const response = await api.post<Inscripcion>(`/turnos/${id}/inscripciones`)
    return response.data
  },
  cancelarInscripcion: async (id: number): Promise<void> => {
    await api.delete(`/turnos/${id}/inscripciones`)
  },
  // Admin y profesor: marca si el cliente asistió
  registrarAsistencia: async (
    id: number,
    dniCliente: number,
    estado: Extract<EstadoInscripcion, 'activa' | 'asistio' | 'ausente'>,
  ): Promise<Inscripcion> => {
    const response = await api.put<Inscripcion>(`/turnos/${id}/inscripciones/${dniCliente}`, {
      estado,
    })
    return response.data
  },
}
