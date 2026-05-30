import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FormField } from '../types/form'
import { cn } from '@repo/utils'

type FormCanvasProps = {
  fields: FormField[]
  selectedId: string | null
  onSelectField: (id: string) => void
  onDeleteField: (id: string) => void
}

function SortableField({ field, isSelected, onSelect, onDelete }: {
  field: FormField
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={cn(
        'border rounded-lg p-4 bg-white cursor-pointer hover:border-blue-400',
        isSelected && 'border-blue-500 ring-2 ring-blue-200'
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <div {...attributes} {...listeners} className="cursor-grab text-gray-400">
          ⋮⋮
        </div>
        <button onClick={(e) => { e.stopPropagation(); onDelete() }} className="text-gray-400 hover:text-red-600 text-sm">
          Delete
        </button>
      </div>
      <label className="block text-sm font-medium mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {field.type === 'text' && <input type="text" placeholder={field.placeholder} disabled className="w-full border rounded px-3 py-2 text-sm bg-gray-50" />}
      {field.type === 'email' && <input type="email" placeholder={field.placeholder} disabled className="w-full border rounded px-3 py-2 text-sm bg-gray-50" />}
      {field.type === 'number' && <input type="number" placeholder={field.placeholder} disabled className="w-full border rounded px-3 py-2 text-sm bg-gray-50" />}
      {field.type === 'textarea' && <textarea placeholder={field.placeholder} disabled className="w-full border rounded px-3 py-2 text-sm bg-gray-50" rows={3} />}
      {field.type === 'select' && (
        <select disabled className="w-full border rounded px-3 py-2 text-sm bg-gray-50">
          <option>Select...</option>
          {field.options?.map(opt => <option key={opt}>{opt}</option>)}
        </select>
      )}
      {field.type === 'date' && <input type="date" disabled className="w-full border rounded px-3 py-2 text-sm bg-gray-50" />}
    </div>
  )
}

export function FormCanvas({ fields, selectedId, onSelectField, onDeleteField }: FormCanvasProps) {
  return (
    <div className="bg-gray-100 rounded-lg p-6 min-h-">
      {fields.length === 0? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Your form is empty</p>
          <p className="text-sm mt-2">Add fields from the left panel</p>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map(field => (
            <SortableField
              key={field.id}
              field={field}
              isSelected={selectedId === field.id}
              onSelect={() => onSelectField(field.id)}
              onDelete={() => onDeleteField(field.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}