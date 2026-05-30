import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { Survey, Response, Question } from '../types/survey'

type ResponseAnalyticsProps = {
  survey: Survey
  responses: Response[]
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#eab308']

export function ResponseAnalytics({ survey, responses }: ResponseAnalyticsProps) {
  const getQuestionStats = (question: Question) => {
    const answers = responses.map(r => r.answers[question.id]).filter(Boolean)

    if (['multiple_choice', 'checkboxes'].includes(question.type)) {
      const counts: Record<string, number> = {}
      answers.flat().forEach((ans: string) => {
        counts[ans] = (counts[ans] || 0) + 1
      })
      return Object.entries(counts).map(([name, value]) => ({ name, value }))
    }

    if (['rating', 'nps', 'number'].includes(question.type)) {
      const nums = answers.map(Number).filter(n =>!isNaN(n))
      const avg = nums.reduce((a, b) => a + b, 0) / nums.length
      return { average: avg.toFixed(1), count: nums.length }
    }

    return { responses: answers.length }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Overview</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-3xl font-bold">{responses.length}</p>
            <p className="text-sm text-gray-600">Total Responses</p>
          </div>
          <div>
            <p className="text-3xl font-bold">
              {responses.length? Math.round(responses.reduce((sum, r) => sum + r.completionTime, 0) / responses.length) : 0}s
            </p>
            <p className="text-sm text-gray-600">Avg. Completion</p>
          </div>
          <div>
            <p className="text-3xl font-bold">100%</p>
            <p className="text-sm text-gray-600">Completion Rate</p>
          </div>
        </div>
      </div>

      {survey.questions.filter(q => ['multiple_choice', 'checkboxes', 'rating', 'nps'].includes(q.type)).map(question => {
        const stats = getQuestionStats(question)

        return (
          <div key={question.id} className="bg-white border rounded-lg p-6">
            <h3 className="font-semibold mb-4">{question.title}</h3>

            {Array.isArray(stats)? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8">
                <p className="text-4xl font-bold mb-2">{stats.average}</p>
                <p className="text-sm text-gray-600">Average ({stats.count} responses)</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}