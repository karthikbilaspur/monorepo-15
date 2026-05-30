export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export type LogEntry = {
  id: string
  timestamp: string
  level: LogLevel
  service: string
  message: string
  traceId?: string
  spanId?: string
  metadata?: Record<string, any>
}

export type LogFilter = {
  level?: LogLevel[]
  service?: string[]
  search?: string
  timeRange?: { start: Date; end: Date }
  traceId?: string
}

export type AlertRule = {
  id: string
  name: string
  query: string
  threshold: number
  window: number // minutes
  enabled: boolean
  lastTriggered?: string
}