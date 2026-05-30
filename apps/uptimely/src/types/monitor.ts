export type MonitorType = 'http' | 'ping' | 'tcp' | 'dns'
export type MonitorStatus = 'up' | 'down' | 'degraded' | 'paused'

export type Monitor = {
  id: string
  name: string
  type: MonitorType
  url: string
  interval: number // seconds
  timeout: number // seconds
  status: MonitorStatus
  regions: string[]
  createdAt: string
  lastCheckAt?: string
  uptime30d?: number // percentage
}

export type Check = {
  id: string
  monitorId: string
  timestamp: string
  status: 'up' | 'down'
  responseTime: number // ms
  region: string
  statusCode?: number
  error?: string
}

export type Incident = {
  id: string
  monitorId: string
  title: string
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved'
  impact: 'none' | 'minor' | 'major' | 'critical'
  startedAt: string
  resolvedAt?: string
  updates: IncidentUpdate[]
}

export type IncidentUpdate = {
  id: string
  status: Incident['status']
  message: string
  timestamp: string
}