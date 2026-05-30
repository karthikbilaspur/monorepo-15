import { StandupConfig } from '../types/standup'
import { useState } from 'react'

type ConfigPanelProps = {
  config: StandupConfig
  onUpdate: (config: StandupConfig) => void
  onDelete: () => void
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function ConfigPanel({ config, onUpdate, onDelete }: ConfigPanelProps) {
  const [questions, setQuestions] = useState(config.questions.join('\n'))

  const toggleDay = (day: number) => {
    const days = config.schedule.days.includes(day)
  ? config.schedule.days.filter(d => d!== day)
      : [...config.schedule.days, day].sort()
    onUpdate({...config, schedule: {...config.schedule, days } })
  }

  const handleQuestionsBlur = () => {
    onUpdate({...config, questions: questions.split('\n').filter(Boolean) })
  }

  return (
    <div className="border rounded-lg bg-white p-6 space-y-6">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-bold">Standup Settings</h2>
        <button onClick={onDelete} className="text-sm text-red-600 hover:text-red-800">
          Delete
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Name</label>
        <input
          value={config.name}
          onChange={e => onUpdate({...config, name: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Channel</label>
        <input
          value={config.channel}
          onChange={e => onUpdate({...config, channel: e.target.value })}
          placeholder="#engineering"
          className="w-full border rounded px-3 py-2 text-sm font-mono"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Schedule</label>
        <div className="flex gap-2 mb-3">
          {DAYS.map((day, i) => (
            <button
              key={day}
              onClick={() => toggleDay(i)}
              className={`flex-1 py-2 rounded text-xs font-medium ${
                config.schedule.days.includes(i)
              ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="time"
            value={config.schedule.time}
            onChange={e => onUpdate({...config, schedule: {...config.schedule, time: e.target.value } })}
            className="flex-1 border rounded px-3 py-2 text-sm"
          />
          <select
            value={config.schedule.timezone}
            onChange={e => onUpdate({...config, schedule: {...config.schedule, timezone: e.target.value } })}
            className="flex-1 border rounded px-3 py-2 text-sm"
          >
            <option>America/New_York</option>
            <option>America/Los_Angeles</option>
            <option>Europe/London</option>
            <option>Asia/Tokyo</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Questions</label>
        <textarea
          value={questions}
          onChange={e => setQuestions(e.target.value)}
          onBlur={handleQuestionsBlur}
          rows={5}
          className="w-full border rounded px-3 py-2 text-sm font-mono"
          placeholder="One per line"
        />
        <p className="text-xs text-gray-500 mt-1">One question per line</p>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={config.reminders.enabled}
            onChange={e => onUpdate({...config, reminders: {...config.reminders, enabled: e.target.checked } })}
          />
          Send reminder if no response
        </label>
        {config.reminders.enabled && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={config.reminders.delayMinutes}
              onChange={e => onUpdate({...config, reminders: {...config.reminders, delayMinutes: Number(e.target.value) } })}
              className="w-16 border rounded px-2 py-1 text-sm"
            />
            <span className="text-xs text-gray-600">min later</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <span className="text-sm font-medium">Enabled</span>
        <button
          onClick={() => onUpdate({...config, enabled:!config.enabled })}
          className={`w-12 h-6 rounded-full transition-colors ${
            config.enabled? 'bg-green-500' : 'bg-gray-300'
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full transition-transform ${
              config.enabled? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>
    </div>
  )
}