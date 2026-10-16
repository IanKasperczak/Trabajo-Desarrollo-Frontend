import type {
  Ejercicio,
  EjercicioFormValues,
  EjercicioInput,
  Rutina,
  RutinaFormValues,
} from '../models/rutina'

// Mismos límites que valida el backend
const DESCANSO_MAX = 32767

let contador = 0
const nuevaKey = () => `nuevo-${Date.now()}-${contador++}`

export const ejercicioVacio = (): EjercicioFormValues => ({
  key: nuevaKey(),
  nombreEjercicio: '',
  series: '',
  repeticiones: '',
  descanso: '60',
})

export const rutinaAFormulario = (rutina: Rutina | null): RutinaFormValues =>
  rutina
    ? {
        nombreRutina: rutina.nombreRutina,
        diaSemana: rutina.diaSemana ?? '',
        dniCliente: rutina.dniCliente,
        dniProfesor: rutina.dniProfesor,
        ejercicios: rutina.ejercicios.map((e) => ({
          key: `guardado-${e.id}`,
          id: e.id,
          nombreEjercicio: e.nombreEjercicio,
          series: String(e.series),
          repeticiones: e.repeticiones,
          descanso: e.descanso === null ? '' : String(e.descanso),
        })),
      }
    : { nombreRutina: '', diaSemana: '', dniCliente: null, dniProfesor: null, ejercicios: [ejercicioVacio()] }

export interface ErroresEjercicio {
  nombreEjercicio?: string
  series?: string
  repeticiones?: string
  descanso?: string
}

const esEnteroPositivo = (valor: string) => /^\d+$/.test(valor.trim()) && Number(valor) > 0

export function erroresEjercicio(e: EjercicioFormValues): ErroresEjercicio {
  const errores: ErroresEjercicio = {}
  if (!e.nombreEjercicio.trim()) errores.nombreEjercicio = 'Obligatorio'
  if (!esEnteroPositivo(e.series)) errores.series = 'Entero mayor a 0'
  if (!e.repeticiones.trim()) errores.repeticiones = 'Obligatorio'
  const descanso = e.descanso.trim()
  if (descanso !== '' && (!/^\d+$/.test(descanso) || Number(descanso) > DESCANSO_MAX)) {
    errores.descanso = 'Segundos (0 o más)'
  }
  return errores
}

export const ejercicioValido = (e: EjercicioFormValues) =>
  Object.keys(erroresEjercicio(e)).length === 0

export const aEjercicioInput = (e: EjercicioFormValues): EjercicioInput => ({
  nombreEjercicio: e.nombreEjercicio.trim(),
  series: Number(e.series),
  repeticiones: e.repeticiones.trim(),
  descanso: e.descanso.trim() === '' ? null : Number(e.descanso),
})

// Campos del ejercicio que cambiaron respecto del guardado (vacío si no cambió nada)
export function cambiosEjercicio(original: Ejercicio, editado: EjercicioInput): Partial<EjercicioInput> {
  const cambios: Partial<EjercicioInput> = {}
  if (original.nombreEjercicio !== editado.nombreEjercicio) cambios.nombreEjercicio = editado.nombreEjercicio
  if (original.series !== editado.series) cambios.series = editado.series
  if (original.repeticiones !== editado.repeticiones) cambios.repeticiones = editado.repeticiones
  if (original.descanso !== editado.descanso) cambios.descanso = editado.descanso
  return cambios
}

export const formatearDescanso = (segundos: number | null) => {
  if (segundos === null) return null
  if (segundos < 60) return `${segundos} s`
  const min = Math.floor(segundos / 60)
  const resto = segundos % 60
  return resto ? `${min} min ${resto} s` : `${min} min`
}
