export type Channel = 'email' | 'slack' | 'sms' | 'whatsapp' | 'ticket'

export type ThreadStatus = 'unread' | 'read' | 'snoozed' | 'done'

export type Message = {
  id: string
  threadId: string
  from: { name: string; email?: string; avatar?: string }
  body: string
  html?: string
  timestamp: string
  attachments?: { name: string; url: string; size: number }[]
}

export type Thread = {
  id: string
  channel: Channel
  subject: string
  participants: { name: string; email?: string; avatar?: string }[]
  preview: string
  status: ThreadStatus
  isStarred: boolean
  labels: string[]
  messageCount: number
  lastMessageAt: string
  snoozedUntil?: string
  aiSummary?: string
  messages?: Message[]
}