import api from '../api/api'
import type { AccesoCliente } from '../models/acceso'

export const accesoService = {
  // Control de ingreso: estado de la membresía de un cliente a partir de su DNI (solo admin)
  verificar: async (dni: number): Promise<AccesoCliente> => {
    const response = await api.get<AccesoCliente>(`/acceso/${dni}`)
    return response.data
  },
}