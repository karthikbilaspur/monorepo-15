import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns'
import { EventType, Booking } from '../types/schedule'
import { getNextAvailableDates } from '../lib/availability'
import { cn } from '@repo/utils'

type BookingCalendarProps = {
  eventType: EventType
  bookings: Booking[]
  onSelectDate: (date: Date) => void
}

export function BookingCalendar({ eventType, bookings, onSelectDate }: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const availableDates = getNextAvailableDates(eventType, bookings, 60)

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    onSelectDate(date)
  }

  const isAvailable = (date: Date) => {
    return availableDates.some(d => isSameDay(d, date))
  }

  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="px-3 py-1 border rounded hover:bg-gray-50"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-1 border rounded hover:bg-gray-50 text-sm"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="px-3 py-1 border rounded hover:bg-gray-50"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map(day => {
          const available = isAvailable(day)
          const selected = selectedDate && isSameDay(day, selectedDate)
          const today = isToday(day)

          return (
            <button
              key={day.toISOString()}
              onClick={() => available && handleDateClick(day)}
              disabled={!available}
              className={cn(
                'aspect-square rounded-lg text-sm font-medium transition-colors',
                selected && 'bg-black text-white',
               !selected && available && 'bg-blue-50 text-blue-700 hover:bg-blue-100',
               !selected &&!available && 'bg-gray-50 text-gray-400 cursor-not-allowed',
                today &&!selected && 'ring-2 ring-blue-500'
              )}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )
}