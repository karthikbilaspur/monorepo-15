import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Papa from 'papaparse'
import { Button } from '@repo/ui'
import { FieldMapper, type TargetField, type FieldMapping } from './components/FieldMapper'
import { ErrorPanel } from './components/ErrorPanel'
import { validateRows, getMappingErrors, type ValidationResult } from './lib/validation'

const TARGET_SCHEMA: TargetField[] = [
  { key: 'email', label: 'Email', required: true, type: 'email' },
  { key: 'firstName', label: 'First Name', required: true, type: 'string' },
  { key: 'lastName', label: 'Last Name', required: false, type: 'string' },
  { key: 'company', label: 'Company', required: false, type: 'string' },
  { key: 'revenue', label: 'Revenue', required: false, type: 'number' },
  { key: 'signupDate', label: 'Signup Date', required: false, type: 'date' }
]

type ParsedCSV = {
  headers: string[]
  rows: Record<string, string>[]
}

function App() {
  const [csv, setCsv] = useState<ParsedCSV | null>(null)
  const [mapping, setMapping] = useState<FieldMapping>({})
  const [step, setStep] = useState<'upload' | 'map' | 'preview'>('upload')
  const [validation, setValidation] = useState<ValidationResult | null>(null)
  const [showErrors, setShowErrors] = useState(true)
  const [parseError, setParseError] = useState<string | null>(null)

  const onDrop = useCallback((files: File[]) => {
    const file = files[0]
    setParseError(null)

    // File size check
    const maxSize = Number(import.meta.env.VITE_MAX_FILE_SIZE_MB) * 1024 * 1024
    if (file.size > maxSize) {
      setParseError(`File too large. Max ${import.meta.env.VITE_MAX_FILE_SIZE_MB}MB allowed`)
      return
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors.length > 0) {
          setParseError(`CSV parse error: ${result.errors[0].message}`)
          return
        }
        setCsv({
          headers: result.meta.fields || [],
          rows: result.data as Record<string, string>[]
        })
        setStep('map')
      },
      error: (err) => setParseError(`Failed to parse CSV: ${err.message}`)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1
  })

  const handleValidate = () => {
    if (!csv) return
    const result = validateRows(csv.rows, mapping, TARGET_SCHEMA)
    setValidation(result)
    setShowErrors(true)
    setStep('preview')
  }

  const mappingErrors = getMappingErrors(mapping, TARGET_SCHEMA)
  const canProceed = mappingErrors.length === 0

  const previewData = () => {
    if (!csv) return []
    return csv.rows.slice(0, Number(import.meta.env.VITE_PREVIEW_ROW_COUNT)).map(row => {
      const mapped: Record<string, any> = {}
      Object.entries(mapping).forEach(([targetKey, csvHeader]) => {
        if (csvHeader) mapped[targetKey] = row[csvHeader]
      })
      return mapped
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Datamap</h1>
        <p className="text-gray-600 mb-8">Map CSV columns to your schema</p>

        {parseError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {parseError}
          </div>
        )}

        {step === 'upload' && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer ${
              isDragActive? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
            }`}
          >
            <input {...getInputProps()} />
            <p className="text-lg font-medium">Drop CSV file here</p>
            <p className="text-sm text-gray-500 mt-2">or click to browse • Max {import.meta.env.VITE_MAX_FILE_SIZE_MB}MB</p>
          </div>
        )}

        {step === 'map' && csv && (
          <div className="bg-white border rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">Map Fields</h2>
                <p className="text-sm text-gray-600">{csv.rows.length} rows detected</p>
              </div>
              <Button
                onClick={handleValidate}
                disabled={!canProceed}
                style={{
                  background: canProceed? '#000' : '#ccc',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: 6,
                  cursor: canProceed? 'pointer' : 'not-allowed'
                }}
              >
                Validate & Preview
              </Button>
            </div>
            <FieldMapper
              csvHeaders={csv.headers}
              targetFields={TARGET_SCHEMA}
              mapping={mapping}
              onMappingChange={setMapping}
              errors={mappingErrors}
            />
          </div>
        )}

        {step === 'preview' && validation && (
          <div className="bg-white border rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">Preview</h2>
                <p className="text-sm text-gray-600">
                  {validation.validRowCount} of {validation.totalRowCount} rows valid
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setStep('map')} style={{ border: '1px solid #ddd', padding: '10px 20px', borderRadius: 6 }}>
                  Back
                </Button>
                <Button
                  disabled={!validation.isValid}
                  style={{
                    background: validation.isValid? '#000' : '#ccc',
                    color: '#fff',
                    padding: '10px 20px',
                    borderRadius: 6,
                    cursor: validation.isValid? 'pointer' : 'not-allowed'
                  }}
                >
                  Import Data
                </Button>
              </div>
            </div>

            {validation.errors.length > 0 && showErrors && (
              <ErrorPanel errors={validation.errors} onClose={() => setShowErrors(false)} />
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {TARGET_SCHEMA.filter(f => mapping[f.key]).map(f => (
                      <th key={f.key} className="text-left p-3 font-medium">{f.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData().map((row, i) => (
                    <tr key={i} className="border-b">
                      {TARGET_SCHEMA.filter(f => mapping[f.key]).map(f => (
                        <td key={f.key} className="p-3">{row[f.key] || '-'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App