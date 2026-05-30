export type AvailabilityRule = {
  id: string
  dayOfWeek: number // 0-6, Sunday=0
  startTime: string // "09:00"
  endTime: string // "17:00"
  timezone: string
}

export type DateOverride = {
  date: string // "2026-05-30"
  available: boolean
  slots?: { start: string; end: string }[]
}

export type EventType = {
  id: string
  slug: string
  name: string
  description?: string
  duration: number // minutes
  location?: string
  color: string
  availabilityRules: AvailabilityRule[]
  dateOverrides: DateOverride[]
  bufferBefore: number // minutes
  bufferAfter: number
  maxBookingsPerDay?: number
  requiresConfirmation: boolean
}

export type Booking = {
  id: string
  eventTypeId: string
  startTime: string // ISO
  endTime: string // ISO
  attendeeName: string
  attendeeEmail: string
  notes?: string
  status: 'confirmed' | 'cancelled' | 'pending'
  createdAt: string
}

export type TimeSlot = {
  start: Date
  end: Date
  available: boolean
}