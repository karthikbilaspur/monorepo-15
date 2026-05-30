import { FixedSizeList as List } from 'react-window'
import { format } from 'date-fns'
import { LogEntry, LogLevel } from '../types/log'
import { cn } from '@repo/utils'

const LEVEL_COLORS: Record<LogLevel, string> = {
  debug: 'text-gray-500',
  info: 'text-blue-600',
  warn: 'text-yellow-600',
  error: 'text-red-600',
  fatal: 'text-red-900 font-bold'
}

type LogViewerProps = {
  logs: LogEntry[]
  onSelectLog: (log: LogEntry) => void
}

function LogRow({ index, style, data }: { index: number; style: React.CSSProperties; data: { logs: LogEntry[]; onSelect: (log: LogEntry) => void } }) {
  const log = data.logs[index]

  return (
    <div
      style={style}
      onClick={() => data.onSelect(log)}
      className="flex items-start gap-3 px-4 py-2 border-b hover:bg-gray-50 cursor-pointer font-mono text-xs"
    >
      <span className="text-gray-500 w-20 flex-shrink-0">
        {format(new Date(log.timestamp), 'HH:mm:ss.SSS')}
      </span>
      <span className={cn('w-14 flex-shrink-0 uppercase', LEVEL_COLORS[log.level])}>
        {log.level}
      </span>
      <span className="w-32 flex-shrink-0 text-purple-600 truncate">
        {log.service}
      </span>
      <span className="flex-1 text-gray-900 truncate">
        {log.message}
      </span>
      {log.traceId && (
        <span className="text-gray-400 text-xs">
          {log.traceId.slice(0, 8)}
        </span>
      )}
    </div>
  )
}

export function LogViewer({ logs, onSelectLog }: LogViewerProps) {
  return (
    <div className="border rounded-lg bg-white overflow-hidden">
      <div className="bg-gray-100 border-b px-4 py-2 flex items-center gap-3 font-mono text-xs font-semibold text-gray-600">
        <span className="w-20">Time</span>
        <span className="w-14">Level</span>
        <span className="w-32">Service</span>
        <span className="flex-1">Message</span>
        <span>Trace</span>
      </div>

      <List
        height={600}
        itemCount={logs.length}
        itemSize={36}
        width="100%"
        itemData={{ logs, onSelect: onSelectLog }}
      >
        {LogRow}
      </List>
    </div>
  )
}