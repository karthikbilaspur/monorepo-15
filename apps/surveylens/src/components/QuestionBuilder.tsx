import { Question, QuestionType } from '../types/survey'
import { cn } from '@repo/utils'

const QUESTION_TYPES: { type: QuestionType; label: string; icon: string }[] = [
  { type: 'short_text', label: 'Short Text', icon: 'T' },
  { type: 'long_text', label: 'Long Text', icon: '¶' },
  { type: 'multiple_choice', label: 'Multiple Choice', icon: '○' },
  { type: 'checkboxes', label: 'Checkboxes', icon: '☑' },
  { type: 'rating', label: 'Rating', icon: '★' },
  { type: 'nps', label: 'NPS', icon: '📊' },
  { type: 'email', label: 'Email', icon: '@' },
  { type: 'number', label: 'Number', icon: '#' },
  { type: 'date', label: 'Date', icon: '📅' }
]

type QuestionBuilderProps = {
  question: Question
  onUpdate: (updates: Partial<Question>) => void
  onDelete: () => void
}

export function QuestionBuilder({ question, onUpdate, onDelete }: QuestionBuilderProps) {
  return (
    <div className="border rounded-lg bg-white p-5 mb-4">
      <div className="flex justify-between items-start mb-4">
        <select
          value={question.type}
          onChange={e => onUpdate({ type: e.target.value as QuestionType })}
          className="px-3 py-1.5 border rounded text-sm font-medium"
        >
          {QUESTION_TYPES.map(t => (
            <option key={t.type} value={t.type}>{t.label}</option>
          ))}
        </select>
        <button onClick={onDelete} className="text-red-600 hover:text-red-800 text-sm">
          Delete
        </button>
      </div>

      <input
        value={question.title}
        onChange={e => onUpdate({ title: e.target.value })}
        placeholder="Question title"
        className="w-full text-lg font-medium mb-2 border-none focus:outline-none"
      />

      <input
        value={question.description || ''}
        onChange={e => onUpdate({ description: e.target.value })}
        placeholder="Description (optional)"
        className="w-full text-sm text-gray-600 mb-4 border-none focus:outline-none"
      />

      {['multiple_choice', 'checkboxes'].includes(question.type) && (
        <div className="space-y-2 mb-4">
          <label className="text-xs font-medium text-gray-700">Options</label>
          {question.options?.map((opt, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={opt}
                onChange={e => {
                  const newOpts = [...(question.options || [])]
                  newOpts[i] = e.target.value
                  onUpdate({ options: newOpts })
                }}
                className="flex-1 border rounded px-3 py-1.5 text-sm"
              />
              <button
                onClick={() => onUpdate({ options: question.options?.filter((_, idx) => idx!== i) })}
                className="text-red-600 hover:text-red-800 text-sm px-2"
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={() => onUpdate({ options: [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`] })}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + Add option
          </button>
        </div>
      )}

      {question.type === 'rating' && (
        <div className="mb-4">
          <label className="text-xs font-medium text-gray-700 block mb-2">Max Rating</label>
          <input
            type="number"
            value={question.settings?.max || 5}
            onChange={e => onUpdate({ settings: {...question.settings, max: Number(e.target.value) } })}
            className="w-20 border rounded px-3 py-1.5 text-sm"
            min={3}
            max={10}
          />
        </div>
      )}

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={question.required}
          onChange={e => onUpdate({ required: e.target.checked })}
        />
        Required
      </label>
    </div>
  )
}