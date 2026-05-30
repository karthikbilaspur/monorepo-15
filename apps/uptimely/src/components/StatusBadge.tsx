import { MonitorStatus } from '../types/monitor'
import { cn } from '@repo/utils'

const STATUS_CONFIG: Record<MonitorStatus, { label: string; color: string }> = {
  up: { label: 'Operational', color: 'bg-green-500' },
  degraded: { label: 'Degraded', color: 'bg-yellow-500' },
  down: { label: 'Down', color: 'bg-red-500' },
  paused: { label: 'Paused', color: 'bg-gray-400' }
}

export function StatusBadge({ status }: { status: MonitorStatus }) {
  const config = STATUS_CONFIG[status]
  return (
    <div className="flex items-center gap-2">
      <div className={cn('w-2 h-2 rounded-full', config.color)} />
      <span className="text-sm font-medium">{config.label}</span>
    </div>
  )
}