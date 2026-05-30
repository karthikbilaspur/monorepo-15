export type StandupConfig = {
  id: string
  name: string
  channel: string // #engineering
  platform: 'slack' | 'discord'
  schedule: {
    days: number[] // 0-6, Sun-Sat
    time: string // "09:00"
    timezone: string
  }
  questions: string[]
  reminders: {
    enabled: boolean
    delayMinutes: number
  }
  enabled: boolean
}

export type StandupResponse = {
  id: string
  configId: string
  userId: string
  userName: string
  userAvatar?: string
  date: string // YYYY-MM-DD
  answers: Record<string, string> // question -> answer
  submittedAt: string
  mood?: 'great' | 'good' | 'okay' | 'blocked'
}

export type StandupSummary = {
  date: string
  configId: string
  responses: StandupResponse[]
  blockers: string[]
  aiSummary?: string
}