import api from '../api/api'
import type { Cuenta, CuentaApi, CuentaUpdate, NuevoAdminInput } from '../models/usuario'
import { rolDesdeApi } from '../utils/roles'

const toCuenta = (cuenta: CuentaApi): Cuenta => ({ ...cuenta, rol: rolDesdeApi[cuenta.rol] })

// Gestión de cuentas (solo admin)
export const usuarioService = {
  getAll: async (): Promise<Cuenta[]> => {
    const response = await api.get<CuentaApi[]>('/usuarios')
    return response.data.map(toCuenta)
  },
  createAdmin: async (data: NuevoAdminInput): Promise<Cuenta> => {
    const response = await api.post<CuentaApi>('/usuarios', { ...data, rol: 'admin' })
    return toCuenta(response.data)
  },
  update: async (id: number, data: CuentaUpdate): Promise<Cuenta> => {
    const response = await api.put<CuentaApi>(`/usuarios/${id}`, data)
    return toCuenta(response.data)
  },
  // Solo cuentas de administradores y profesores: las de clientes se borran desde Clientes
  delete: async (id: number): Promise<void> => {
    await api.delete(`/usuarios/${id}`)
  },
}
