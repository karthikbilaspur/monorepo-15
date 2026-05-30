export type ChartType = 'line' | 'bar' | 'area' | 'number' | 'pie' | 'table'

export type DataSource = 'sql' | 'api' | 'prometheus'

export type MetricQuery = {
  id: string
  name: string
  source: DataSource
  query: string // SQL or PromQL or API endpoint
  refreshInterval: number // seconds
}

export type Widget = {
  id: string
  type: ChartType
  title: string
  queryId: string
  layout: { x: number; y: number; w: number; h: number }
  viz: {
    unit?: string
    decimals?: number
    colors?: string[]
    showLegend?: boolean
  }
}

export type Dashboard = {
  id: string
  name: string
  description?: string
  widgets: Widget[]
  queries: MetricQuery[]
  createdAt: string
  updatedAt: string
}

export type MetricDataPoint = {
  timestamp: string
  value: number
  label?: string
}