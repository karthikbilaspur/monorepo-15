import { useState, useMemo } from 'react'
import { useLocalStorage } from '@repo/hooks'
import { LogViewer } from './components/LogViewer'
import { LogFilters } from './components/LogFilters'
import { AlertPanel } from './components/AlertPanel'
import { LogEntry, LogFilter, AlertRule } from './types/log'

const MOCK_LOGS: LogEntry[] = Array.from({ length: 5000 }, (_, i) => ({
  id: `log_${i}`,
  timestamp: new Date(Date.now() - i * 1000).toISOString(),
  level: ['debug', 'info', 'warn', 'error'][i % 4] as any,
  service: ['api', 'worker', 'web', 'auth'][i % 4],
  message: `Sample log message ${i} - processing request`,
  traceId: `trace_${Math.floor(i / 10)}`,
  metadata: { userId: `user_${i % 100}` }
}))

function App() {
  const [logs] = useState<LogEntry[]>(MOCK_LOGS)
  const [filter, setFilter] = useState<LogFilter>({})
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)
  const [rules, setRules] = useLocalStorage<AlertRule[]>('logoscope-alerts', [
    {
      id: 'r1',
      name: 'Error Spike',
      query: 'level:error',
      threshold: 50,
      window: 5,
      enabled: true
    }
  ])

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (filter.level &&!filter.level.includes(log.level)) return false
      if (filter.service &&!filter.service.includes(log.service)) return false
      if (filter.search) {
        const regex = new RegExp(filter.search, 'i')
        if (!regex.test(log.message) &&!regex.test(log.service)) return false
      }
      if (filter.traceId && log.traceId!== filter.traceId) return false
      return true
    })
  }, [logs, filter])

  const handleToggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id? {...r, enabled:!r.enabled } : r))
  }

  const handleCreateRule = (rule: Omit<AlertRule, 'id'>) => {
    setRules([...rules, {...rule, id: `rule_${Date.now()}` }])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white px-6 py-4">
        <div className="flex justify-between items-center max-w- mx-auto">
          <h1 className="text-2xl font-bold">Logoscope</h1>
          <div className="flex gap-2">
            <button className="px-4 py-2 border rounded text-sm hover:bg-gray-50">
              Live Tail
            </button>
            <button className="px-4 py-2 bg-black text-white rounded text-sm hover:bg-gray-800">
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="max-w- mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-9">
            <LogFilters
              filter={filter}
              onChange={setFilter}
              logCount={filteredLogs.length}
            />
            <LogViewer logs={filteredLogs} onSelectLog={setSelectedLog} />
          </div>

          <div className="col-span-3 space-y-4">
            <AlertPanel
              rules={rules}
              onToggleRule={handleToggleRule}
              onCreateRule={handleCreateRule}
            />

            {selectedLog && (
              <div className="border rounded-lg bg-white p-4">
                <h3 className="font-semibold text-sm mb-3">Log Detail</h3>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-gray-600">Time:</span>
                    <p className="font-mono">{new Date(selectedLog.timestamp).toISOString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Level:</span>
                    <p className="font-mono uppercase">{selectedLog.level}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Service:</span>
                    <p className="font-mono">{selectedLog.service}</p>
                  </div>
                  {selectedLog.traceId && (
                    <div>
                      <span className="text-gray-600">Trace ID:</span>
                      <p className="font-mono break-all">{selectedLog.traceId}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">Message:</span>
                    <p className="font-mono break-words">{selectedLog.message}</p>
                  </div>
                  {selectedLog.metadata && (
                    <div>
                      <span className="text-gray-600">Metadata:</span>
                      <pre className="bg-gray-50 p-2 rounded mt-1 overflow-x-auto">
                        {JSON.stringify(selectedLog.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App