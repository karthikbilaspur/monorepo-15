import { StandupSummary } from '../types/standup'
import { StandupCard } from './StandupCard'
import { format } from 'date-fns'

export function SummaryView({ summary }: { summary: StandupSummary }) {
  const participationRate = summary.responses.length
  const blockedCount = summary.responses.filter(r => r.mood === 'blocked').length

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white border rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">
              Standup for {format(new Date(summary.date), 'EEEE, MMMM d')}
            </h2>
            <p className="text-sm text-gray-600">{participationRate} participants</p>
          </div>
          {blockedCount > 0 && (
            <div className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm font-medium">
              {blockedCount} blocked
            </div>
          )}
        </div>

        {summary.aiSummary && (
          <div className="bg-blue-50 border-blue-200 rounded p-4 mb-4">
            <p className="text-sm font-medium text-blue-900 mb-2">✨ AI Summary</p>
            <p className="text-sm text-blue-800">{summary.aiSummary}</p>
          </div>
        )}

        {summary.blockers.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded p-4">
            <p className="text-sm font-medium text-orange-900 mb-2">🚫 Blockers</p>
            <ul className="text-sm text-orange-800 space-y-1">
              {summary.blockers.map((blocker, i) => (
                <li key={i}>• {blocker}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {summary.responses.map(response => (
          <StandupCard key={response.id} response={response} />
        ))}
      </div>
    </div>
  )
}