import { type TargetField, type FieldMapping } from '../components/FieldMapper'

export type ValidationError = {
  row: number
  field: string
  value: string
  message: string
}

export type ValidationResult = {
  isValid: boolean
  errors: ValidationError[]
  validRowCount: number
  totalRowCount: number
}

const validators = {
  email: (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
  number: (val: string) =>!isNaN(Number(val)) && val.trim()!== '',
  date: (val: string) =>!isNaN(Date.parse(val)),
  string: (val: string) => val.trim().length > 0
}

export function validateRows(
  rows: Record<string, string>[],
  mapping: FieldMapping,
  schema: TargetField[]
): ValidationResult {
  const errors: ValidationError[] = []

  rows.forEach((row, idx) => {
    schema.forEach(field => {
      const csvHeader = mapping[field.key]
      if (!csvHeader) {
        if (field.required) {
          errors.push({
            row: idx + 2, // +2 for header + 1-indexed
            field: field.label,
            value: '',
            message: `Required field "${field.label}" not mapped`
          })
        }
        return
      }

      const value = row[csvHeader] || ''

      // Required check
      if (field.required && value.trim() === '') {
        errors.push({
          row: idx + 2,
          field: field.label,
          value,
          message: `Required field "${field.label}" is empty`
        })
        return
      }

      // Type check - only if value exists
      if (value.trim()!== '' &&!validators[field.type](value)) {
        errors.push({
          row: idx + 2,
          field: field.label,
          value,
          message: `Invalid ${field.type}: "${value}"`
        })
      }
    })
  })

  return {
    isValid: errors.length === 0,
    errors,
    validRowCount: rows.length - new Set(errors.map(e => e.row)).size,
    totalRowCount: rows.length
  }
}

export function getMappingErrors(mapping: FieldMapping, schema: TargetField[]): string[] {
  const errors: string[] = []

  // Check required fields
  schema.filter(f => f.required).forEach(field => {
    if (!mapping[field.key]) {
      errors.push(`Required field "${field.label}" must be mapped`)
    }
  })

  // Check duplicate mappings
  const mappedHeaders = Object.values(mapping).filter(Boolean)
  const duplicates = mappedHeaders.filter((h, i) => mappedHeaders.indexOf(h)!== i)
  if (duplicates.length > 0) {
    errors.push(`CSV column "${duplicates[0]}" mapped to multiple fields`)
  }

  return errors
}