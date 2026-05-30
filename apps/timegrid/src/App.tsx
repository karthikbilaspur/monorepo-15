import { useState, useMemo } from 'react'
import { useLocalStorage } from '@repo/hooks'
import { nanoid } from 'nanoid'
import { format } from 'date-fns'
import { EventType, Booking, TimeSlot } from './types/schedule'
import { BookingCalendar } from './components/BookingCalendar'
import { TimeSlots } from './components/TimeSlots'
import { generateAvailableSlots } from './lib/availability'

const MOCK_EVENT_TYPES: EventType[] = [
  {
    id: 'evt_1',
    slug: '30min',
    name: '30 Minute Meeting',
    description: 'Book a 30-minute call with me',
    duration: 30,
    location: 'Zoom',
    color: '#3b82f6',
    availabilityRules: [
      { id: 'r1', dayOfWeek: 1, startTime: '09:00', endTime: '17:00', timezone: 'America/Los_Angeles' },
      { id: 'r2', dayOfWeek: 2, startTime: '09:00', endTime: '17:00', timezone: 'America/Los_Angeles' },
      { id: 'r3', dayOfWeek: 3, startTime: '09:00', endTime: '17:00', timezone: 'America/Los_Angeles' },
      { id: 'r4', dayOfWeek: 4, startTime: '09:00', endTime: '17:00', timezone: 'America/Los_Angeles' },
      { id: 'r5', dayOfWeek: 5, startTime: '09:00', endTime: '17:00', timezone: 'America/Los_Angeles' }
    ],
    dateOverrides: [],
    bufferBefore: 0,
    bufferAfter: 0,
    requiresConfirmation: false
  }
]

function App() {
  const [eventTypes] = useState<EventType[]>(MOCK_EVENT_TYPES)
  const [bookings, setBookings] = useLocalStorage<Booking[]>('timegrid-bookings', [])
  const [selectedEventType] = useState(eventTypes[0])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showConfirm, setShowConfirm] = useState<TimeSlot | null>(null)
  const [attendeeName, setAttendeeName] = useState('')
  const [attendeeEmail, setAttendeeEmail] = useState('')

  const availableSlots = useMemo(() => {
    if (!selectedDate) return []
    return generateAvailableSlots(selectedEventType, selectedDate, bookings, 'America/Los_Angeles')
  }, [selectedDate, selectedEventType, bookings])

  const handleBookSlot = () => {
    if (!showConfirm ||!attendeeName ||!attendeeEmail) return

    const booking: Booking = {
      id: nanoid(),
      eventTypeId: selectedEventType.id,
      startTime: showConfirm.start.toISOString(),
      endTime: showConfirm.end.toISOString(),
      attendeeName,
      attendeeEmail,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    }

    setBookings([booking,...bookings])
    setShowConfirm(null)
    setAttendeeName('')
    setAttendeeEmail('')
    alert(`Booked! ${format(showConfirm.start, 'MMM d, h:mm a')}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">TimeGrid</h1>
          <p className="text-sm text-gray-600 mt-1">Schedule a meeting</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-2">{selectedEventType.name}</h2>
          <p className="text-gray-600 mb-4">{selectedEventType.description}</p>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>🕐 {selectedEventType.duration} min</span>
            <span>📍 {selectedEventType.location}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BookingCalendar
            eventType={selectedEventType}
            bookings={bookings}
            onSelectDate={setSelectedDate}
          />
          <TimeSlots
            date={selectedDate}
            slots={availableSlots}
            onSelectSlot={setShowConfirm}
          />
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Confirm Booking</h2>

            <div className="mb-6 p-4 bg-gray-50 rounded">
              <p className="font-medium">{selectedEventType.name}</p>
              <p className="text-sm text-gray-600 mt-1">
                {format(showConfirm.start, 'EEEE, MMMM d, yyyy')}
              </p>
              <p className="text-sm text-gray-600">
                {format(showConfirm.start, 'h:mm a')} - {format(showConfirm.end, 'h:mm a')}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  value={attendeeName}
                  onChange={e => setAttendeeName(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={attendeeEmail}
                  onChange={e => setAttendeeEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(null)}
                className="flex-1 py-3 border rounded font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBookSlot}
                disabled={!attendeeName ||!attendeeEmail}
                className="flex-1 py-3 bg-black text-white rounded font-medium hover:bg-gray-800 disabled:bg-gray-300"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App