import { cn } from '@repo/utils'

type TrendDirection = 'up' | 'down' | 'neutral'

type MetricsCardProps = {
  title: string
  value: string
  subtext?: string
  trend?: {
    direction: TrendDirection
    value: string
    label?: string
  }
  className?: string
}

export function MetricsCard({ title, value, subtext, trend, className }: MetricsCardProps) {
  return (
    <div className={cn(
      'border rounded-lg p-6 bg-white shadow-sm',
      className
    )}>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-3xl font-bold mt-2 text-gray-900">{value}</p>

      {trend && (
        <div className="flex items-center gap-1 mt-2">
          <span className={cn(
            'text-xs font-medium',
            trend.direction === 'up' && 'text-green-600',
            trend.direction === 'down' && 'text-red-600',
            trend.direction === 'neutral' && 'text-gray-500'
          )}>
            {trend.direction === 'up' && '↑'}
            {trend.direction === 'down' && '↓'}
            {trend.value}
          </span>
          {trend.label && (
            <span className="text-xs text-gray-500">{trend.label}</span>
          )}
        </div>
      )}

      {subtext &&!trend && (
        <p className="text-xs text-gray-500 mt-1">{subtext}</p>
      )}
    </div>
  )
}

// Export a simpler version too for basic cases
export function SimpleMetricsCard({ title, value, subtext }: Omit<MetricsCardProps, 'trend'>) {
  return <MetricsCard title={title} value={value} subtext={subtext} />
}