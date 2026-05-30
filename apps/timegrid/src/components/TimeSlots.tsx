import { format } from 'date-fns'
import { TimeSlot } from '../types/schedule'

type TimeSlotsProps = {
  date: Date | null
  slots: TimeSlot[]
  onSelectSlot: (slot: TimeSlot) => void
}

export function TimeSlots({ date, slots, onSelectSlot }: TimeSlotsProps) {
  if (!date) {
    return (
      <div className="bg-white border rounded-lg p-6 h-full flex items-center justify-center text-gray-500">
        Select a date to see available times
      </div>
    )
  }

  const availableSlots = slots.filter(s => s.available)

  return (
    <div className="bg-white border rounded-lg p-6 h-full overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">
        {format(date, 'EEEE, MMMM d')}
      </h3>

      {availableSlots.length === 0? (
        <p className="text-gray-500 text-sm">No available times</p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {availableSlots.map((slot, i) => (
            <button
              key={i}
              onClick={() => onSelectSlot(slot)}
              className="px-4 py-3 border rounded-lg hover:bg-gray-900 hover:text-white transition-colors text-sm font-medium"
            >
              {format(slot.start, 'h:mm a')}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}