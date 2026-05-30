import { Monitor } from '../types/monitor'
import { StatusBadge } from './StatusBadge'
import { UptimeBar } from './UptimeBar'
import { formatDistanceToNow } from 'date-fns'

type MonitorCardProps = {
  monitor: Monitor
  onSelect: () => void
}

// Mock 90 days of data
const generateMockUptime = () => {
  return Array.from({ length: 90 }, (_, i) => ({
    date: new Date(Date.now() - (90 - i) * 86400000).toISOString(),
    status: Math.random() > 0.02? 'up' : 'down' as const
  }))
}

export function MonitorCard({ monitor, onSelect }: MonitorCardProps) {
  const uptimeData = generateMockUptime()

  return (
    <div
      onClick={onSelect}
      className="border rounded-lg bg-white p-5 hover:shadow-md cursor-pointer transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg mb-1">{monitor.name}</h3>
          <p className="text-sm text-gray-600 font-mono">{monitor.url}</p>
        </div>
        <StatusBadge status={monitor.status} />
      </div>

      <UptimeBar checks={uptimeData} />

      <div className="flex justify-between items-center mt-4 text-sm">
        <div>
          <span className="text-gray-600">Uptime: </span>
          <span className="font-semibold">{monitor.uptime30d || 99.98}%</span>
          <span className="text-gray-500 ml-1">(30d)</span>
        </div>
        {monitor.lastCheckAt && (
          <span className="text-gray-500">
            Checked {formatDistanceToNow(new Date(monitor.lastCheckAt), { addSuffix: true })}
          </span>
        )}
      </div>
    </div>
  )
}