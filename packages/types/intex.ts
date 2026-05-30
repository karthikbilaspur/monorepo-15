export type User = {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'admin' | 'member' | 'viewer'
  createdAt: string
}

export type ApiResponse<T> = {
  data: T
  error?: string
  meta?: {
    page: number
    perPage: number
    total: number
  }
}

export type Workspace = {
  id: string
  name: string
  slug: string
  plan: 'free' | 'pro' | 'enterprise'
  ownerId: string
}

export type DateRange = {
  start: Date
  end: Date
}

export type TimeGranularity = 'hour' | 'day' | 'week' | 'month'