export type AlertSeverity = 'warning' | 'error' | 'info'

export interface AlertItem {
  title: string
  description?: string
  severity: AlertSeverity
}

export interface KpiItem {
  label: string
  value: string
  hint?: string
}

export interface BarDatum {
  label: string
  value: number
}

export interface GroupedBarSeries {
  name: string
  value: number
  color: string
}

export interface GroupedBarDatum {
  label: string
  values: GroupedBarSeries[]
}