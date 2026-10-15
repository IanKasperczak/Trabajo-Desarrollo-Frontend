export type AlertSeverity = 'warning' | 'error' | 'info'

export interface AlertItem {
  title: string
  description?: string
  severity: AlertSeverity
}

export interface BarDatum {
  label: string
  value: number
}
