export type FieldType = 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date'

export type FieldLogic = {
  showIf?: {
    fieldId: string
    operator: 'equals' | 'not_equals' | 'contains'
    value: string
  }
}

export type FormField = {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
  logic?: FieldLogic
}

export type FormSchema = {
  id: string
  title: string
  description?: string
  fields: FormField[]
  settings: {
    submitText: string
    successMessage: string
    webhookUrl?: string
    redirectUrl?: string
  }
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}

export type FormSubmission = {
  id: string
  formId: string
  data: Record<string, any>
  submittedAt: string
  meta: {
    ip?: string
    userAgent?: string
  }
}