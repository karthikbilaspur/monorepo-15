import { addMinutes, setHours, setMinutes, startOfDay, isSameDay, isBefore, isAfter } from 'date-fns'
import { toZonedTime, fromZonedTime } from 'date-fns-tz'
import { EventType, Booking, TimeSlot } from '../types/schedule'

export function generateAvailableSlots(
  eventType: EventType,
  date: Date,
  existingBookings: Booking[],
  timezone: string
): TimeSlot[] {
  const dayOfWeek = date.getDay()
  const rule = eventType.availabilityRules.find(r => r.dayOfWeek === dayOfWeek)
  if (!rule) return []

  const override = eventType.dateOverrides.find(o => isSameDay(new Date(o.date), date))
  if (override &&!override.available) return []

  const [startHour, startMin] = rule.startTime.split(':').map(Number)
  const [endHour, endMin] = rule.endTime.split(':').map(Number)

  const dayStart = startOfDay(date)
  const slotStart = setMinutes(setHours(dayStart, startHour), startMin)
  const slotEnd = setMinutes(setHours(dayStart, endHour), endMin)

  const slots: TimeSlot[] = []
  let current = slotStart
  const now = new Date()

  while (isBefore(current, slotEnd)) {
    const slotEndTime = addMinutes(current, eventType.duration)
    if (isAfter(slotEndTime, slotEnd)) break

    const isBooked = existingBookings.some(b => {
      const bookingStart = new Date(b.startTime)
      const bookingEnd = new Date(b.endTime)
      return (
        (isAfter(current, bookingStart) && isBefore(current, bookingEnd)) ||
        (isAfter(slotEndTime, bookingStart) && isBefore(slotEndTime, bookingEnd)) ||
        (isBefore(current, bookingStart) && isAfter(slotEndTime, bookingEnd))
      )
    })

    const isPast = isBefore(slotEndTime, now)

    slots.push({
      start: current,
      end: slotEndTime,
      available:!isBooked &&!isPast
    })

    current = addMinutes(current, eventType.duration + eventType.bufferAfter)
  }

  return slots
}

export function getNextAvailableDates(
  eventType: EventType,
  existingBookings: Booking[],
  days: number = 30
): Date[] {
  const dates: Date[] = []
  const today = startOfDay(new Date())

  for (let i = 0; i < days; i++) {
    const date = addMinutes(today, i * 1440)
    const slots = generateAvailableSlots(eventType, date, existingBookings, eventType.availabilityRules[0]?.timezone || 'UTC')
    if (slots.some(s => s.available)) {
      dates.push(date)
    }
  }
  return dates
}