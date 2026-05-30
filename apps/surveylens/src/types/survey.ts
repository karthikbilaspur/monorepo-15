export type QuestionType =
  | 'short_text'
  | 'long_text'
  | 'multiple_choice'
  | 'checkboxes'
  | 'rating'
  | 'nps'
  | 'email'
  | 'number'
  | 'date'
  | 'statement'

export type LogicRule = {
  id: string
  ifQuestionId: string
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'
  value: string | number
  thenGoTo: string // questionId or 'end'
}

export type Question = {
  id: string
  type: QuestionType
  title: string
  description?: string
  required: boolean
  options?: string[]
  settings?: {
    min?: number
    max?: number
    placeholder?: string
  }
  logic?: LogicRule[]
}

export type Survey = {
  id: string
  title: string
  description?: string
  questions: Question[]
  settings: {
    submitText: string
    successTitle: string
    successMessage: string
    showProgressBar: boolean
    allowMultipleSubmissions: boolean
  }
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}

export type Response = {
  id: string
  surveyId: string
  answers: Record<string, any>
  submittedAt: string
  completionTime: number // seconds
  meta: {
    userAgent?: string
    referrer?: string
  }
}