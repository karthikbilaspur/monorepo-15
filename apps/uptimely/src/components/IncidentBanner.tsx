import { Incident } from '../types/monitor'
import { cn } from '@repo/utils'

const IMPACT_COLORS = {
  none: 'bg-blue-50 border-blue-200 text-blue-900',
  minor: 'bg-yellow-50 border-yellow-200 text-yellow-900',
  major: 'bg-orange-50 border-orange-200 text-orange-900',
  critical: 'bg-red-50 border-red-200 text-red-900'
}

export function IncidentBanner({ incident }: { incident: Incident }) {
  return (
    <div className={cn('border rounded-lg p-4 mb-4', IMPACT_COLORS[incident.impact])}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold">{incident.title}</h3>
          <p className="text-sm mt-1 capitalize">{incident.status.replace('_', ' ')}</p>
        </div>
        <span className="text-xs px-2 py-1 bg-white rounded font-medium uppercase">
          {incident.impact}
        </span>
      </div>
      {incident.updates[0] && (
        <p className="text-sm mt-2">{incident.updates[0].message}</p>
      )}
    </div>
  )
}