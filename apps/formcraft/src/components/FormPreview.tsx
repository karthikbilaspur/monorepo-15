import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSchema } from '../types/form'
import { buildZodSchema } from '../lib/form-validator'
import { cn } from '@repo/utils'

type FormPreviewProps = {
  form: FormSchema
  onSubmit: (data: Record<string, any>) => void
}

export function FormPreview({ form, onSubmit }: FormPreviewProps) {
  const schema = buildZodSchema(form.fields)
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  })

  const values = watch()

  const shouldShowField = (fieldId: string): boolean => {
    const field = form.fields.find(f => f.id === fieldId)
    if (!field?.logic?.showIf) return true
    const { fieldId: depId, operator, value } = field.logic.showIf
    const depValue = values[depId]
    if (operator === 'equals') return depValue === value
    if (operator === 'not_equals') return depValue!== value
    if (operator === 'contains') return String(depValue).includes(value)
    return true
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto bg-white border rounded-lg p-8">
      <h1 className="text-3xl font-bold mb-2">{form.title}</h1>
      {form.description && <p className="text-gray-600 mb-8">{form.description}</p>}

      <div className="space-y-6">
        {form.fields.filter(f => shouldShowField(f.id)).map(field => (
          <div key={field.id}>
            <label className="block text-sm font-medium mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {field.type === 'text' && (
              <input
                {...register(field.id)}
                type="text"
                placeholder={field.placeholder}
                className={cn('w-full border rounded px-3 py-2', errors[field.id] && 'border-red-500')}
              />
            )}

            {field.type === 'email' && (
              <input
                {...register(field.id)}
                type="email"
                placeholder={field.placeholder}
                className={cn('w-full border rounded px-3 py-2', errors[field.id] && 'border-red-500')}
              />
            )}

            {field.type === 'number' && (
              <input
                {...register(field.id)}
                type="number"
                placeholder={field.placeholder}
                className={cn('w-full border rounded px-3 py-2', errors[field.id] && 'border-red-500')}
              />
            )}

            {field.type === 'textarea' && (
              <textarea
                {...register(field.id)}
                placeholder={field.placeholder}
                rows={4}
                className={cn('w-full border rounded px-3 py-2', errors[field.id] && 'border-red-500')}
              />
            )}

            {field.type === 'select' && (
              <select
                {...register(field.id)}
                className={cn('w-full border rounded px-3 py-2', errors[field.id] && 'border-red-500')}
              >
                <option value="">Select...</option>
                {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            )}

            {field.type === 'radio' && (
              <div className="space-y-2">
                {field.options?.map(opt => (
                  <label key={opt} className="flex items-center gap-2">
                    <input {...register(field.id)} type="radio" value={opt} />
                    {opt}
                  </label>
                ))}
              </div>
            )}

            {field.type === 'checkbox' && (
              <div className="space-y-2">
                {field.options?.map(opt => (
                  <label key={opt} className="flex items-center gap-2">
                    <input {...register(field.id)} type="checkbox" value={opt} />
                    {opt}
                  </label>
                ))}
              </div>
            )}

            {field.type === 'date' && (
              <input
                {...register(field.id)}
                type="date"
                className={cn('w-full border rounded px-3 py-2', errors[field.id] && 'border-red-500')}
              />
            )}

            {errors[field.id] && (
              <p className="text-sm text-red-600 mt-1">{errors[field.id]?.message as string}</p>
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="w-full mt-8 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800"
      >
        {form.settings.submitText}
      </button>
    </form>
  )
}