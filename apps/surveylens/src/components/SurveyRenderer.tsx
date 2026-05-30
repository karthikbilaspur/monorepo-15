import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Survey, Question } from '../types/survey'
import { cn } from '@repo/utils'

type SurveyRendererProps = {
  survey: Survey
  onSubmit: (answers: Record<string, any>) => void
}

export function SurveyRenderer({ survey, onSubmit }: SurveyRendererProps) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const { register, handleSubmit, formState: { errors } } = useForm()

  const question = survey.questions[currentIdx]
  const progress = ((currentIdx + 1) / survey.questions.length) * 100
  const isLast = currentIdx === survey.questions.length - 1

  const handleNext = (data: any) => {
    const newAnswers = {...answers, [question.id]: data[question.id] }
    setAnswers(newAnswers)

    if (isLast) {
      onSubmit(newAnswers)
    } else {
      // Check logic jumps
      const rule = question.logic?.find(r => {
        const val = data[question.id]
        if (r.operator === 'equals') return val === r.value
        if (r.operator === 'not_equals') return val!== r.value
        if (r.operator === 'contains') return String(val).includes(String(r.value))
        if (r.operator === 'greater_than') return Number(val) > Number(r.value)
        if (r.operator === 'less_than') return Number(val) < Number(r.value)
        return false
      })

      if (rule?.thenGoTo === 'end') {
        onSubmit(newAnswers)
      } else if (rule?.thenGoTo) {
        const nextIdx = survey.questions.findIndex(q => q.id === rule.thenGoTo)
        setCurrentIdx(nextIdx!== -1? nextIdx : currentIdx + 1)
      } else {
        setCurrentIdx(currentIdx + 1)
      }
    }
  }

  const handleBack = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1)
  }

  if (!question) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {survey.settings.showProgressBar && (
          <div className="mb-8">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Question {currentIdx + 1} of {survey.questions.length}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(handleNext)} className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-2">{question.title}</h2>
          {question.description && (
            <p className="text-gray-600 mb-6">{question.description}</p>
          )}

          <div className="mb-8">
            {question.type === 'short_text' && (
              <input
                {...register(question.id, { required: question.required })}
                type="text"
                placeholder={question.settings?.placeholder || 'Type your answer...'}
                className="w-full border-b-2 border-gray-300 focus:border-blue-600 outline-none text-xl py-3"
                autoFocus
              />
            )}

            {question.type === 'long_text' && (
              <textarea
                {...register(question.id, { required: question.required })}
                placeholder={question.settings?.placeholder || 'Type your answer...'}
                rows={4}
                className="w-full border-2 border-gray-300 focus:border-blue-600 outline-none rounded-lg p-4 text-lg"
                autoFocus
              />
            )}

            {question.type === 'email' && (
              <input
                {...register(question.id, { required: question.required, pattern: /^\S+@\S+$/i })}
                type="email"
                placeholder="name@example.com"
                className="w-full border-b-2 border-gray-300 focus:border-blue-600 outline-none text-xl py-3"
                autoFocus
              />
            )}

            {question.type === 'number' && (
              <input
                {...register(question.id, { required: question.required, valueAsNumber: true })}
                type="number"
                placeholder="0"
                className="w-full border-b-2 border-gray-300 focus:border-blue-600 outline-none text-xl py-3"
                autoFocus
              />
            )}

            {question.type === 'multiple_choice' && (
              <div className="space-y-3">
                {question.options?.map(opt => (
                  <label
                    key={opt}
                    className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <input
                      {...register(question.id, { required: question.required })}
                      type="radio"
                      value={opt}
                      className="w-5 h-5"
                    />
                    <span className="ml-3 text-lg">{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === 'checkboxes' && (
              <div className="space-y-3">
                {question.options?.map(opt => (
                  <label
                    key={opt}
                    className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <input
                      {...register(question.id)}
                      type="checkbox"
                      value={opt}
                      className="w-5 h-5"
                    />
                    <span className="ml-3 text-lg">{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === 'rating' && (
              <div className="flex gap-2">
                {Array.from({ length: question.settings?.max || 5 }, (_, i) => i + 1).map(num => (
                  <label key={num}>
                    <input
                      {...register(question.id, { required: question.required })}
                      type="radio"
                      value={num}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-12 border-2 rounded-lg flex items-center justify-center text-lg font-bold cursor-pointer peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 hover:border-blue-400">
                      {num}
                    </div>
                  </label>
                ))}
              </div>
            )}

            {question.type === 'nps' && (
              <div>
                <div className="flex gap-1 mb-2">
                  {Array.from({ length: 11 }, (_, i) => i).map(num => (
                    <label key={num} className="flex-1">
                      <input
                        {...register(question.id, { required: question.required })}
                        type="radio"
                        value={num}
                        className="sr-only peer"
                      />
                      <div className="h-12 border-2 rounded flex items-center justify-center text-sm font-bold cursor-pointer peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 hover:border-blue-400">
                        {num}
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Not likely</span>
                  <span>Extremely likely</span>
                </div>
              </div>
            )}

            {errors[question.id] && (
              <p className="text-red-600 text-sm mt-2">This field is required</p>
            )}
          </div>

          <div className="flex gap-3">
            {currentIdx > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 border-2 rounded-lg font-medium hover:bg-gray-50"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              {isLast? survey.settings.submitText : 'Next →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}