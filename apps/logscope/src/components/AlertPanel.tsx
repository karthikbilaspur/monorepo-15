import { useState } from 'react'
import { AlertRule } from '../types/log'

type AlertPanelProps = {
  rules: AlertRule[]
  onToggleRule: (id: string) => void
  onCreateRule: (rule: Omit<AlertRule, 'id'>) => void
}

export function AlertPanel({ rules, onToggleRule, onCreateRule }: AlertPanelProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [name, setName] = useState('')
  const [query, setQuery] = useState('level:error')
  const [threshold, setThreshold] = useState(10)

  const handleCreate = () => {
    if (!name.trim()) return
    onCreateRule({
      name,
      query,
      threshold,
      window: 5,
      enabled: true
    })
    setName('')
    setIsCreating(false)
  }

  return (
    <div className="border rounded-lg bg-white p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-sm">Alerts</h3>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          + New Rule
        </button>
      </div>

      {isCreating && (
        <div className="mb-3 p-3 border rounded bg-gray-50 space-y-2">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Rule name"
            className="w-full text-sm border rounded px-2 py-1"
          />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Query (e.g. level:error)"
            className="w-full text-sm border rounded px-2 py-1 font-mono"
          />
          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={threshold}
              onChange={e => setThreshold(Number(e.target.value))}
              className="w-20 text-sm border rounded px-2 py-1"
            />
            <span className="text-xs text-gray-600">events in 5min</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              className="flex-1 text-xs bg-black text-white rounded py-1"
            >
              Create
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className="flex-1 text-xs border rounded py-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {rules.map(rule => (
          <div key={rule.id} className="flex items-center justify-between p-2 border rounded text-sm">
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{rule.name}</p>
              <p className="text-xs text-gray-500 font-mono">{rule.query}</p>
            </div>
            <button
              onClick={() => onToggleRule(rule.id)}
              className={`ml-2 w-10 h-5 rounded-full transition-colors ${
                rule.enabled? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  rule.enabled? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}