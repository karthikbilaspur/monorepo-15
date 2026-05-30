import { useState } from 'react'
import { useLocalStorage } from '@repo/hooks'
import { nanoid } from 'nanoid'
import { SQLEditor } from './components/SQLEditor'
import { ChartRenderer } from './components/ChartRenderer'
import { ReportList } from './components/ReportList'
import { Report, ChartType, QueryResult } from './types/report'

const MOCK_RESULT: QueryResult = {
  columns: ['date', 'users', 'revenue'],
  rows: Array.from({ length: 30 }, (_, i) => [
    new Date(Date.now() - (30 - i) * 86400000).toISOString().split('T')[0],
    Math.floor(100 + Math.random() * 50 + i * 2),
    Math.floor(1000 + Math.random() * 500 + i * 20)
  ]),
  rowCount: 30,
  executionTime: 234
}

function App() {
  const [reports, setReports] = useLocalStorage<Report[]>('reportcraft-reports', [
    {
      id: 'rep_1',
      name: 'Daily Active Users',
      description: 'DAU trend over last 30 days',
      query: 'SELECT date, count(distinct user_id) as users\nFROM events\nWHERE date >= current_date - 30\nGROUP BY date\nORDER BY date',
      chartType: 'line',
      chartConfig: { xAxis: 'date', yAxis: ['users'] },
      cachedResult: MOCK_RESULT,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ])
  const [selectedId, setSelectedId] = useState<string | null>(reports[0]?.id || null)
  const [queryText, setQueryText] = useState('')
  const [result, setResult] = useState<QueryResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const selectedReport = reports.find(r => r.id === selectedId)

  const createReport = () => {
    const newReport: Report = {
      id: nanoid(),
      name: 'Untitled Report',
      query: '',
      chartType: 'table',
      chartConfig: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setReports([newReport,...reports])
    setSelectedId(newReport.id)
    setQueryText('')
    setResult(null)
  }

  const updateReport = (id: string, updates: Partial<Report>) => {
    setReports(reports.map(r =>
      r.id === id? {...r,...updates, updatedAt: new Date().toISOString() } : r
    ))
  }

  const runQuery = async () => {
    if (!selectedReport) return
    setIsRunning(true)
    // TODO: POST to API
    setTimeout(() => {
      const mockResult: QueryResult = {
        columns: ['id', 'name', 'created_at'],
        rows: [
          [1, 'Alice', '2026-01-01'],
          [2, 'Bob', '2026-01-02'],
          [3, 'Charlie', '2026-01-03']
        ],
        rowCount: 3,
        executionTime: 45
      }
      setResult(mockResult)
      updateReport(selectedReport.id, { query: queryText, lastRun: new Date().toISOString(), cachedResult: mockResult })
      setIsRunning(false)
    }, 500)
  }

  const currentResult = result || selectedReport?.cachedResult

  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="border-b px-6 py-3">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">ReportCraft</h1>
          <div className="flex gap-2">
            <button className="px-4 py-2 border rounded text-sm hover:bg-gray-50">
              Export CSV
            </button>
            <button className="px-4 py-2 bg-black text-white rounded text-sm hover:bg-gray-800">
              Schedule
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <ReportList
          reports={reports}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onCreate={createReport}
        />

        <div className="flex-1 flex flex-col">
          {selectedReport? (
            <>
              <div className="border-b p-4">
                <input
                  value={selectedReport.name}
                  onChange={e => updateReport(selectedReport.id, { name: e.target.value })}
                  className="text-2xl font-bold w-full bg-transparent border-none focus:outline-none mb-2"
                  placeholder="Report name"
                />
                <input
                  value={selectedReport.description || ''}
                  onChange={e => updateReport(selectedReport.id, { description: e.target.value })}
                  className="text-sm text-gray-600 w-full bg-transparent border-none focus:outline-none"
                  placeholder="Add description..."
                />
              </div>

              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium">SQL Query</label>
                    <button
                      onClick={runQuery}
                      disabled={isRunning}
                      className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300"
                    >
                      {isRunning? 'Running...' : 'Run (⌘+Enter)'}
                    </button>
                  </div>
                  <SQLEditor
                    value={queryText || selectedReport.query}
                    onChange={setQueryText}
                    onRun={runQuery}
                  />
                  {currentResult && (
                    <div className="mt-2 text-xs text-gray-600">
                      {currentResult.rowCount} rows in {currentResult.executionTime}ms
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="border-b px-4 py-2 flex gap-2">
                    {(['table', 'line', 'bar', 'area', 'pie', 'number'] as ChartType[]).map(type => (
                      <button
                        key={type}
                        onClick={() => updateReport(selectedReport.id, { chartType: type })}
                        className={`px-3 py-1 rounded text-sm capitalize ${
                          selectedReport.chartType === type
                       ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 p-4">
                    {currentResult? (
                      <ChartRenderer
                        type={selectedReport.chartType}
                        data={currentResult}
                        xAxis={selectedReport.chartConfig.xAxis}
                        yAxis={selectedReport.chartConfig.yAxis}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500">
                        Run a query to see results
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a report or create a new one
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App