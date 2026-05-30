import { StandupResponse } from '../types/standup'
import { format } from 'date-fns'

const MOOD_EMOJI = {
  great: '😄',
  good: '🙂',
  okay: '😐',
  blocked: '🚫'
}

export function StandupCard({ response }: { response: StandupResponse }) {
  return (
    <div className="border rounded-lg bg-white p-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium">
          {response.userName[0]}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <p className="font-semibold">{response.userName}</p>
            <div className="flex items-center gap-2">
              {response.mood && <span className="text-lg">{MOOD_EMOJI[response.mood]}</span>}
              <span className="text-xs text-gray-500">
                {format(new Date(response.submittedAt), 'h:mm a')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 ml-13">
        {Object.entries(response.answers).map(([question, answer]) => (
          <div key={question}>
            <p className="text-xs font-medium text-gray-600 mb-1">{question}</p>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">{answer || '-'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}