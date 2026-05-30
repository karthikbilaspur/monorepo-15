import { useState } from 'react'
import { useLocalStorage } from '@repo/hooks'
import { nanoid } from 'nanoid'
import { Monitor, Incident } from './types/monitor'
import { MonitorCard } from './components/MonitorCard'
import { IncidentBanner } from './components/IncidentBanner'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const MOCK_MONITORS: Monitor[] = [
  {
    id: 'mon_1',
    name: 'API Production',
    type: 'http',
    url: 'https://api.example.com/health',
    interval: 60,
    timeout: 30,
    status: 'up',
    regions: ['us-east-1', 'eu-west-1'],
    createdAt: new Date().toISOString(),
    lastCheckAt: new Date().toISOString(),
    uptime30d: 99.98
  },
  {
    id: 'mon_2',
    name: 'Website',
    type: 'http',
    url: 'https://example.com',
    interval: 60,
    timeout: 30,
    status: 'up',
    regions: ['us-east-1'],
    createdAt: new Date().toISOString(),
    lastCheckAt: new Date().toISOString(),
    uptime30d: 100
  },
  {
    id: 'mon_3',
    name: 'Database',
    type: 'tcp',
    url: 'db.example.com:5432',
    interval: 30,
    timeout: 10,
    status: 'degraded',
    regions: ['us-east-1'],
    createdAt: new Date().toISOString(),
    lastCheckAt: new Date().toISOString(),
    uptime30d: 99.5
  }
]

const MOCK_INCIDENT: Incident = {
  id: 'inc_1',
  monitorId: 'mon_3',
  title: 'Elevated Database Latency',
  status: 'monitoring',
  impact: 'minor',
  startedAt: new Date(Date.now() - 3600000).toISOString(),
  updates: [
    {
      id: 'upd_1',
      status: 'monitoring',
      message: 'We are monitoring database performance. Response times have improved.',
      timestamp: new Date().toISOString()
    }
  ]
}

const MOCK_RESPONSE_TIMES = Array.from({ length: 24 }, (_, i) => ({
  time: `${23 - i}h ago`,
  ms: 150 + Math.random() * 100 + (i > 20? 200 : 0)
}))

function App() {
  const [monitors] = useState<Monitor[]>(MOCK_MONITORS)
  const [incidents] = useState<Incident[]>([MOCK_INCIDENT])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const selectedMonitor = monitors.find(m => m.id === selectedId)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold">Uptimely</h1>
            <p className="text-sm text-gray-600 mt-1">
              {monitors.filter(m => m.status === 'up').length} of {monitors.length} monitors operational
            </p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-black text-white rounded text-sm font-medium hover:bg-gray-800"
          >
            + New Monitor
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {incidents.filter(i => i.status!== 'resolved').map(incident => (
          <IncidentBanner key={incident.id} incident={incident} />
        ))}

        {!selectedMonitor? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monitors.map(monitor => (
              <MonitorCard
                key={monitor.id}
                monitor={monitor}
                onSelect={() => setSelectedId(monitor.id)}
              />
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedId(null)}
              className="text-sm text-blue-600 hover:text-blue-800 mb-4"
            >
              ← Back to all monitors
            </button>

            <div className="bg-white border rounded-lg p-6 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedMonitor.name}</h2>
                  <p className="text-gray-600 font-mono text-sm">{selectedMonitor.url}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{selectedMonitor.uptime30d}%</p>
                  <p className="text-sm text-gray-600">30-day uptime</p>
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MOCK_RESPONSE_TIMES}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="time" fontSize={11} />
                    <YAxis fontSize={11} label={{ value: 'ms', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="ms" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App