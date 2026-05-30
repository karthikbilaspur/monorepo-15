import { useState } from 'react'
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { nanoid } from 'nanoid'
import { Button } from '@repo/ui'
import { useLocalStorage } from '@repo/hooks'
import { FieldPalette } from './components/FieldPalette'
import { FormCanvas } from './components/FormCanvas'
import { FormPreview } from './components/FormPreview'
import { SubmissionsTable } from './components/SubmissionsTable'
import { FormField, FormSchema, FieldType, FormSubmission } from './types/form'
import { cn } from '@repo/utils'

type Tab = 'builder' | 'preview' | 'submissions'

function App() {
  const [form, setForm] = useLocalStorage<FormSchema>('formcraft-draft', {
    id: 'form_' + nanoid(6),
    title: 'Untitled Form',
    description: '',
    fields: [],
    settings: {
      submitText: 'Submit',
      successMessage: 'Thanks for submitting!',
    },
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('builder')
  const [submissions, setSubmissions] = useLocalStorage<FormSubmission[]>('formcraft-submissions', [])
  const [showSuccess, setShowSuccess] = useState(false)

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: nanoid(),
      type,
      label: `New ${type} field`,
      required: false,
      placeholder: type === 'email'? 'email@example.com' : 'Enter text...',
      options: ['select', 'radio', 'checkbox'].includes(type)? ['Option 1', 'Option 2'] : undefined
    }
    setForm({...form, fields: [...form.fields, newField], updatedAt: new Date().toISOString() })
    setSelectedFieldId(newField.id)
  }

  const deleteField = (id: string) => {
    setForm({...form, fields: form.fields.filter(f => f.id!== id), updatedAt: new Date().toISOString() })
    if (selectedFieldId === id) setSelectedFieldId(null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id!== over.id) {
      const oldIndex = form.fields.findIndex(f => f.id === active.id)
      const newIndex = form.fields.findIndex(f => f.id === over.id)
      setForm({...form, fields: arrayMove(form.fields, oldIndex, newIndex), updatedAt: new Date().toISOString() })
    }
  }

  const handleSubmit = (data: Record<string, any>) => {
    const submission: FormSubmission = {
      id: nanoid(),
      formId: form.id,
      data,
      submittedAt: new Date().toISOString(),
      meta: {}
    }
    setSubmissions([submission,...submissions])
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const publishForm = () => {
    setForm({...form, status: 'published', updatedAt: new Date().toISOString() })
    navigator.clipboard.writeText(`${import.meta.env.VITE_FORM_PUBLIC_URL}/${form.id}`)
    alert('Form published! Link copied to clipboard')
  }

  const selectedField = form.fields.find(f => f.id === selectedFieldId)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <input
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value, updatedAt: new Date().toISOString() })}
            className="text-2xl font-bold bg-transparent border-none focus:outline-none"
          />
          <div className="flex gap-2 items-center">
            <div className="flex gap-1 bg-gray-100 rounded p-1">
              {(['builder', 'preview', 'submissions'] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    'px-3 py-1 rounded text-sm font-medium capitalize',
                    tab === t? 'bg-white shadow' : 'text-gray-600'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <Button
              onClick={publishForm}
              style={{ background: '#000', color: '#fff', padding: '8px 16px', borderRadius: 6 }}
            >
              {form.status === 'published'? 'Copy Link' : 'Publish'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center">
            {form.settings.successMessage}
          </div>
        )}

        {tab === 'builder' && (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3">
              <FieldPalette onAddField={addField} />
            </div>

            <div className="col-span-6">
              <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={form.fields} strategy={verticalListSortingStrategy}>
                  <FormCanvas
                    fields={form.fields}
                    selectedId={selectedFieldId}
                    onSelectField={setSelectedFieldId}
                    onDeleteField={deleteField}
                  />
                </SortableContext>
              </DndContext>
            </div>

            <div className="col-span-3">
              <div className="border rounded-lg bg-white p-4 sticky top-6">
                <h3 className="font-semibold mb-3 text-sm text-gray-700">Field Settings</h3>
                {selectedField? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium mb-1">Label</label>
                      <input
                        value={selectedField.label}
                        onChange={e => {
                          const updated = form.fields.map(f =>
                            f.id === selectedField.id? {...f, label: e.target.value } : f
                          )
                          setForm({...form, fields: updated })
                        }}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Placeholder</label>
                      <input
                        value={selectedField.placeholder || ''}
                        onChange={e => {
                          const updated = form.fields.map(f =>
                            f.id === selectedField.id? {...f, placeholder: e.target.value } : f
                          )
                          setForm({...form, fields: updated })
                        }}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedField.required}
                        onChange={e => {
                          const updated = form.fields.map(f =>
                            f.id === selectedField.id? {...f, required: e.target.checked } : f
                          )
                          setForm({...form, fields: updated })
                        }}
                      />
                      Required
                    </label>
                    {['select', 'radio', 'checkbox'].includes(selectedField.type) && (
                      <div>
                        <label className="block text-xs font-medium mb-1">Options</label>
                        {selectedField.options?.map((opt, i) => (
                          <input
                            key={i}
                            value={opt}
                            onChange={e => {
                              const newOpts = [...(selectedField.options || [])]
                              newOpts[i] = e.target.value
                              const updated = form.fields.map(f =>
                                f.id === selectedField.id? {...f, options: newOpts } : f
                              )
                              setForm({...form, fields: updated })
                            }}
                            className="w-full border rounded px-2 py-1 text-sm mb-2"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Select a field to edit</p>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === 'preview' && <FormPreview form={form} onSubmit={handleSubmit} />}

        {tab === 'submissions' && <SubmissionsTable form={form} submissions={submissions} />}
      </div>
    </div>
  )
}

export default App