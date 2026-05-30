import { cn } from '@repo/utils'

type UptimeBarProps = {
  checks: { date: string; status: 'up' | 'down' | 'degraded' }[]
}

export function UptimeBar({ checks }: UptimeBarProps) {
  return (
    <div className="flex gap-0.5 h-8">
      {checks.map((check, i) => (
        <div
          key={i}
          className={cn(
            'flex-1 rounded-sm',
            check.status === 'up' && 'bg-green-500',
            check.status === 'degraded' && 'bg-yellow-500',
            check.status === 'down' && 'bg-red-500'
          )}
          title={`${check.date}: ${check.status}`}
        />
      ))}
    </div>
  )
}