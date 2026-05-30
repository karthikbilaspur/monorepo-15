import { useState } from 'react'
import { cn } from '@repo/utils'

export type Label = {
  id: string
  name: string
  color: string
}

type LabelManagerProps = {
  labels: Label[]
  selectedLabels: string[]
  onToggleLabel: (labelId: string) => void
  onCreateLabel: (name: string, color: string) => void
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899']

export function LabelManager({ labels, selectedLabels, onToggleLabel, onCreateLabel }: LabelManagerProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(COLORS[0])

  const handleCreate = () => {
    if (!newName.trim()) return
    onCreateLabel(newName, newColor)
    setNewName('')
    setIsCreating(false)
  }

  return (
    <div className="border rounded-lg bg-white p-3">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-sm">Labels</h3>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          + New
        </button>
      </div>

      {isCreating && (
        <div className="mb-3 p-2 border rounded bg-gray-50">
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Label name"
            className="w-full text-sm border rounded px-2 py-1 mb-2"
            autoFocus
          />
          <div className="flex gap-1 mb-2">
            {COLORS.map(color => (
              <button
                key={color}
                onClick={() => setNewColor(color)}
                className={cn(
                  'w-6 h-6 rounded',
                  newColor === color && 'ring-2 ring-offset-1 ring-gray-400'
                )}
                style={{ backgroundColor: color }}
              />
            ))}
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

      <div className="space-y-1">
        {labels.map(label => (
          <button
            key={label.id}
            onClick={() => onToggleLabel(label.id)}
            className={cn(
              'w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-gray-50',
              selectedLabels.includes(label.id) && 'bg-gray-100'
            )}
          >
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: label.color }}
            />
            <span className="flex-1 text-left">{label.name}</span>
            {selectedLabels.includes(label.id) && <span className="text-xs">✓</span>}
          </button>
        ))}
      </div>
    </div>
  )
}