import { type ValidationError } from '../lib/validation'

type ErrorPanelProps = {
  errors: ValidationError[]
  onClose: () => void
}

export function ErrorPanel({ errors, onClose }: ErrorPanelProps) {
  if (errors.length === 0) return null

  const groupedByRow = errors.reduce((acc, err) => {
    if (!acc[err.row]) acc[err.row] = []
    acc[err.row].push(err)
    return acc
  }, {} as Record<number, ValidationError[]>)

  return (
    <div className="border border-red-300 bg-red-50 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-red-900">Validation Errors</h3>
          <p className="text-sm text-red-700">{errors.length} errors found</p>
        </div>
        <button onClick={onClose} className="text-red-600 hover:text-red-800">
          ✕
        </button>
      </div>

      <div className="max-h-64 overflow-y-auto space-y-3">
        {Object.entries(groupedByRow).slice(0, 10).map(([row, rowErrors]) => (
          <div key={row} className="bg-white rounded p-3 text-sm">
            <p className="font-medium text-gray-900 mb-1">Row {row}</p>
            {rowErrors.map((err, i) => (
              <p key={i} className="text-red-700">
                <span className="font-medium">{err.field}:</span> {err.message}
                {err.value && <span className="text-gray-500"> (got: "{err.value}")</span>}
              </p>
            ))}
          </div>
        ))}
        {Object.keys(groupedByRow).length > 10 && (
          <p className="text-sm text-red-700 text-center">
           ...and {Object.keys(groupedByRow).length - 10} more rows with errors
          </p>
        )}
      </div>
    </div>
  )
}