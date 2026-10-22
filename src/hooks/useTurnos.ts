import { useCallback, useEffect, useState } from 'react'
import type { FiltroTurnos, Turno } from '../models/turno'
import { turnoService } from '../services/turnoService'

interface UseTurnosResult {
  turnos: Turno[]
  loading: boolean
  error: boolean
  reload: () => Promise<void>
}

// Carga los turnos de una fecha o rango y los vuelve a pedir cuando el filtro cambia
export function useTurnos({ fecha, desde, hasta }: FiltroTurnos): UseTurnosResult {
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const cargar = useCallback(async () => {
    return turnoService.getAll({ fecha, desde, hasta })
  }, [fecha, desde, hasta])

  useEffect(() => {
    let cancelado = false
    setLoading(true)
    setError(false)
    cargar()
      .then((datos) => {
        if (!cancelado) setTurnos(datos)
      })
      .catch(() => {
        if (!cancelado) setError(true)
      })
      .finally(() => {
        if (!cancelado) setLoading(false)
      })
    return () => {
      cancelado = true
    }
  }, [cargar])

  // Recarga sin mostrar el esqueleto: la lista no parpadea después de una acción
  const reload = useCallback(async () => {
    try {
      setTurnos(await cargar())
      setError(false)
    } catch {
      setError(true)
    }
  }, [cargar])

  return { turnos, loading, error, reload }
}
