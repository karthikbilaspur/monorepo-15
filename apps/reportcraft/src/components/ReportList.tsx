import { Report } from '../types/report'
import { cn } from '@repo/utils'
import { formatDistanceToNow } from 'date-fns'

type ReportListProps = {
  reports: Report[]
  selectedId: string | null
  onSelect: (id: string) => void
  onCreate: () => void
}

export function ReportList({ reports, selectedId, onSelect, onCreate }: ReportListProps) {
  return (
    <div className="w-80 border-r bg-gray-50 flex flex-col h-full">
      <div className="p-4 border-b bg-white">
        <button
          onClick={onCreate}
          className="w-full px-3 py-2 bg-black text-white rounded text-sm font-medium hover:bg-gray-800"
        >
          + New Report
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {reports.length === 0? (
          <div className="text-center py-12 text-gray-500 text-sm">
            No reports yet
          </div>
        ) : (
          reports.map(report => (
            <div
              key={report.id}
              onClick={() => onSelect(report.id)}
              className={cn(
                'px-4 py-3 border-b cursor-pointer hover:bg-white',
                selectedId === report.id && 'bg-white border-l-4 border-l-blue-500'
              )}
            >
              <h3 className="font-medium text-sm mb-1 truncate">{report.name}</h3>
              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                {report.description || report.query.slice(0, 60) + '...'}
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span className="capitalize">{report.chartType}</span>
                {report.lastRun && (
                  <span>{formatDistanceToNow(new Date(report.lastRun), { addSuffix: true })}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}