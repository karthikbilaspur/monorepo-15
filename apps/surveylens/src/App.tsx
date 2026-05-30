import { useState } from 'react'
import { useLocalStorage } from '@repo/hooks'
import { nanoid } from 'nanoid'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { QuestionBuilder } from './components/QuestionBuilder'
import { SurveyRenderer } from './components/SurveyRenderer'
import { ResponseAnalytics } from './components/ResponseAnalytics'
import { Survey, Question, Response } from './types/survey'
import { cn } from '@repo/utils'

type Tab = 'builder' | 'preview' | 'responses'

function App() {
  const [surveys, setSurveys] = useLocalStorage<Survey[]>('surveylens-surveys', [
    {
      id: 'surv_1',
      title: 'Customer Feedback',
      description: 'Help us improve',
      questions: [
        {
          id: 'q1',
          type: 'nps',
          title: 'How likely are you to recommend us?',
          required: true
        },
        {
          id: 'q2',
          type: 'long_text',
          title: 'What can we do better?',
          required: false
        }
      ],
      settings: {
        submitText: 'Submit',
        successTitle: 'Thank you!',
        successMessage: 'Your feedback helps us improve.',
        showProgressBar: true,
        allowMultipleSubmissions: false
      },
      status: 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ])
  const [responses, setResponses] = useLocalStorage<Response[]>('surveylens-responses', [])
  const [selectedId, setSelectedId] = useState<string>(surveys[0]?.id)
  const [tab, setTab] = useState<Tab>('builder')

  const survey = surveys.find(s => s.id === selectedId)
  const surveyResponses = responses.filter(r => r.surveyId === selectedId)

  const addQuestion = () => {
    if (!survey) return
    const newQ: Question = {
      id: nanoid(),
      type: 'short_text',
      title: 'New Question',
      required: false
    }
    updateSurvey({...survey, questions: [...survey.questions, newQ] })
  }

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    if (!survey) return
    updateSurvey({
     ...survey,
      questions: survey.questions.map(q => q.id === questionId? {...q,...updates } : q)
    })
  }

  const deleteQuestion = (questionId: string) => {
    if (!survey) return
    updateSurvey({
     ...survey,
      questions: survey.questions.filter(q => q.id!== questionId)
    })
  }

  const updateSurvey = (updated: Survey) => {
    setSurveys(surveys.map(s => s.id === updated.id? updated : s))
  }

  const handleSubmitResponse = (answers: Record<string, any>) => {
    if (!survey) return
    const response: Response = {
      id: nanoid(),
      surveyId: survey.id,
      answers,
      submittedAt: new Date().toISOString(),
      completionTime: 45,
      meta: {}
    }
    setResponses([...responses, response])
    alert('Thank you for your response!')
  }

  if (!survey) {
    return <div className="p-8">No survey selected</div>
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="border-b bg-white px-6 py-3">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <input
            value={survey.title}
            onChange={e => updateSurvey({...survey, title: e.target.value })}
            className="text-xl font-bold bg-transparent border-none focus:outline-none"
          />
          <div className="flex gap-1 bg-gray-100 rounded p-1">
            {(['builder', 'preview', 'responses'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'px-3 py-1.5 rounded text-sm font-medium capitalize',
                  tab === t? 'bg-white shadow' : 'text-gray-600'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {tab === 'builder' && (
          <div className="max-w-4xl mx-auto p-6 overflow-y-auto h-full">
            <div className="mb-6">
              <input
                value={survey.description || ''}
                onChange={e => updateSurvey({...survey, description: e.target.value })}
                placeholder="Survey description"
                className="w-full text-gray-600 border-none focus:outline-none"
              />
            </div>

            {survey.questions.map(question => (
              <QuestionBuilder
                key={question.id}
                question={question}
                onUpdate={updates => updateQuestion(question.id, updates)}
                onDelete={() => deleteQuestion(question.id)}
              />
            ))}

            <button
              onClick={addQuestion}
              className="w-full py-3 border-2 border-dashed rounded-lg text-gray-600 hover:border-blue-600 hover:text-blue-600 font-medium"
            >
              + Add Question
            </button>
          </div>
        )}

        {tab === 'preview' && (
          <SurveyRenderer survey={survey} onSubmit={handleSubmitResponse} />
        )}

        {tab === 'responses' && (
          <div className="max-w-6xl mx-auto p-6 overflow-y-auto h-full">
            <ResponseAnalytics survey={survey} responses={surveyResponses} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App