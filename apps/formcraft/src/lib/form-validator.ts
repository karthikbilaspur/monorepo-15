import { z } from 'zod'
import { FormField } from '../types/form'

export function buildZodSchema(fields: FormField[]) {
  const shape: Record<string, z.ZodTypeAny> = {}

  fields.forEach(field => {
    let schema: z.ZodTypeAny

    switch (field.type) {
      case 'email':
        schema = z.string().email('Invalid email')
        break
      case 'number':
        schema = z.coerce.number()
        if (field.validation?.min!== undefined) schema = (schema as z.ZodNumber).min(field.validation.min)
        if (field.validation?.max!== undefined) schema = (schema as z.ZodNumber).max(field.validation.max)
        break
      case 'date':
        schema = z.string().refine(val =>!isNaN(Date.parse(val)), 'Invalid date')
        break
      case 'checkbox':
        schema = z.array(z.string())
        if (field.required) schema = (schema as z.ZodArray<any>).min(1, 'Select at least one')
        break
      default:
        schema = z.string()
        if (field.validation?.min) schema = (schema as z.ZodString).min(field.validation.min)
        if (field.validation?.max) schema = (schema as z.ZodString).max(field.validation.max)
        if (field.validation?.pattern) schema = (schema as z.ZodString).regex(new RegExp(field.validation.pattern))
    }

    if (!field.required && field.type!== 'checkbox') {
      schema = schema.optional().or(z.literal(''))
    }

    shape[field.id] = schema
  })

  return z.object(shape)
}