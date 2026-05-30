import { FieldType } from '../types/form'

const FIELD_TYPES: { type: FieldType; label: string; icon: string }[] = [
  { type: 'text', label: 'Short Text', icon: 'T' },
  { type: 'email', label: 'Email', icon: '@' },
  { type: 'number', label: 'Number', icon: '#' },
  { type: 'textarea', label: 'Long Text', icon: '¶' },
  { type: 'select', label: 'Dropdown', icon: '▼' },
  { type: 'checkbox', label: 'Checkboxes', icon: '☑' },
  { type: 'radio', label: 'Multiple Choice', icon: '◉' },
  { type: 'date', label: 'Date', icon: '📅' }
]

type FieldPaletteProps = {
  onAddField: (type: FieldType) => void
}

export function FieldPalette({ onAddField }: FieldPaletteProps) {
  return (
    <div className="border rounded-lg bg-white p-4">
      <h3 className="font-semibold mb-3 text-sm text-gray-700">Add Field</h3>
      <div className="space-y-2">
        {FIELD_TYPES.map(field => (
          <button
            key={field.type}
            onClick={() => onAddField(field.type)}
            className="w-full flex items-center gap-3 px-3 py-2 border rounded hover:bg-gray-50 text-sm text-left"
          >
            <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-xs font-mono">
              {field.icon}
            </span>
            {field.label}
          </button>
        ))}
      </div>
    </div>
  )
}