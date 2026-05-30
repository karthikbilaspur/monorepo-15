import { useState } from 'react'
import { cn } from '@repo/utils'

export type CSVHeader = string
export type TargetField = {
  key: string
  label: string
  required: boolean
  type: 'string' | 'number' | 'date' | 'email'
}

export type FieldMapping = Record<string, string | null>

type FieldMapperProps = {
  csvHeaders: CSVHeader[]
  targetFields: TargetField[]
  mapping: FieldMapping
  onMappingChange: (mapping: FieldMapping) => void
  errors?: string[]
}

export function FieldMapper({ csvHeaders, targetFields, mapping, onMappingChange, errors = [] }: FieldMapperProps) {
  const [draggedHeader, setDraggedHeader] = useState<string | null>(null)

  const handleDrop = (targetKey: string) => {
    if (!draggedHeader) return
    // Prevent duplicate mapping
    const newMapping = {...mapping }
    Object.keys(newMapping).forEach(k => {
      if (newMapping[k] === draggedHeader) newMapping[k] = null
    })
    newMapping[targetKey] = draggedHeader
    onMappingChange(newMapping)
    setDraggedHeader(null)
  }

  const handleUnmap = (targetKey: string) => {
    onMappingChange({...mapping, [targetKey]: null })
  }

  const mappedHeaders = Object.values(mapping).filter(Boolean)
  const unmappedHeaders = csvHeaders.filter(h =>!mappedHeaders.includes(h))

  return (
    <div>
      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {errors.map((err, i) => <p key={i}>• {err}</p>)}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold mb-3">CSV Columns ({unmappedHeaders.length} unmapped)</h3>
          <div className="border rounded-lg p-4 bg-gray-50 min-h-">
            {unmappedHeaders.length === 0 && (
              <p className="text-sm text-gray-500">All columns mapped</p>
            )}
            {unmappedHeaders.map(header => (
              <div
                key={header}
                draggable
                onDragStart={() => setDraggedHeader(header)}
                onDragEnd={() => setDraggedHeader(null)}
                className={cn(
                  'px-3 py-2 mb-2 bg-white border rounded cursor-move hover:shadow-sm text-sm',
                  draggedHeader === header && 'opacity-50'
                )}
              >
                {header}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Target Fields</h3>
          <div className="space-y-2">
            {targetFields.map(field => {
              const isError = field.required &&!mapping[field.key]
              return (
                <div
                  key={field.key}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDrop(field.key)}
                  className={cn(
                    'border rounded-lg p-3 bg-white transition-colors',
                    draggedHeader && 'border-dashed border-blue-400 bg-blue-50',
                    isError && 'border-red-300'
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </p>
                      <p className="text-xs text-gray-500">{field.type}</p>
                    </div>
                    {mapping[field.key] && (
                      <button
                        onClick={() => handleUnmap(field.key)}
                        className="text-xs text-gray-400 hover:text-red-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  {mapping[field.key]? (
                    <div className="mt-2 px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded">
                      {mapping[field.key]}
                    </div>
                  ) : (
                    <div className="mt-2 text-xs text-gray-400">
                      Drop CSV column here
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}