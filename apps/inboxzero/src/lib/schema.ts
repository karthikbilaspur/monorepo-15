import { z } from 'zod'
import { FormField } from '../types/form'

export function generateZodSchema(fields: FormField[]) {
  const shape: Record<string, z.ZodTypeAny> = {}

  fields.forEach(field => {
    let schema: z.ZodTypeAny

    switch (field.type) {
      case 'email':
        schema = z.string().email('Invalid email address')
        break
      case 'number':
        schema = z.coerce.number()
        if (field.validation?.min) schema = (schema as z.ZodNumber).min(field.validation.min)
        if (field.validation?.max) schema = (schema as z.ZodNumber).max(field.validation.max)
        break
      case 'date':
        schema = z.string().refine(val =>!isNaN(Date.parse(val)), 'Invalid date')
        break
      default:
        schema = z.string()
        if (field.validation?.pattern) {
          schema = (schema as z.ZodString).regex(new RegExp(field.validation.pattern), 'Invalid format')
        }
    }

    if (!field.required) {
      schema = schema.optional().or(z.literal(''))
    } else if (field.type === 'string' || field.type === 'textarea') {
      schema = (schema as z.ZodString).min(1, `${field.label} is required`)
    }

    shape[field.id] = schema
  })

  return z.object(shape)
}