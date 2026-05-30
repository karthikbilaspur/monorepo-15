export type ChartType = 'table' | 'line' | 'bar' | 'area' | 'pie' | 'number'

export type QueryResult = {
  columns: string[]
  rows: any[][]
  rowCount: number
  executionTime: number // ms
}

export type Report = {
  id: string
  name: string
  description?: string
  query: string
  chartType: ChartType
  chartConfig: {
    xAxis?: string
    yAxis?: string[]
    groupBy?: string
  }
  lastRun?: string
  cachedResult?: QueryResult
  schedule?: {
    cron: string
    emails: string[]
    enabled: boolean
  }
  createdAt: string
  updatedAt: string
}