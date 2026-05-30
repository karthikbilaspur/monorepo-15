import { addHours, addDays, nextMonday, setHours, setMinutes } from 'date-fns'

type SnoozePickerProps = {
  onSnooze: (until: Date) => void
  onClose: () => void
}

export function SnoozePicker({ onSnooze, onClose }: SnoozePickerProps) {
  const now = new Date()
  const tomorrow9am = setMinutes(setHours(addDays(now, 1), 9), 0)
  const monday9am = setMinutes(setHours(nextMonday(now), 9), 0)
  const thisEvening = setMinutes(setHours(now, 18), 0)

  const options = [
    { label: 'Later today', sublabel: 'In 3 hours', date: addHours(now, 3) },
    { label: 'This evening', sublabel: formatTime(thisEvening), date: thisEvening },
    { label: 'Tomorrow', sublabel: '9:00 AM', date: tomorrow9am },
    { label: 'Next week', sublabel: 'Monday 9:00 AM', date: monday9am },
  ]

  function formatTime(date: Date) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  return (
    <div className="absolute top-full mt-2 right-0 bg-white border rounded-lg shadow-lg py-2 w-64 z-50">
      <div className="px-3 py-2 border-b">
        <p className="text-sm font-medium">Snooze until...</p>
      </div>
      {options.map(opt => (
        <button
          key={opt.label}
          onClick={() => { onSnooze(opt.date); onClose() }}
          className="w-full px-3 py-2 text-left hover:bg-gray-50 flex justify-between items-center"
        >
          <span className="text-sm">{opt.label}</span>
          <span className="text-xs text-gray-500">{opt.sublabel}</span>
        </button>
      ))}
    </div>
  )
}