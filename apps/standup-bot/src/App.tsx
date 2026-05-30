import { useState } from 'react'
import { useLocalStorage } from '@repo/hooks'
import { nanoid } from 'nanoid'
import { StandupConfig, StandupResponse, StandupSummary } from './types/standup'
import { ConfigPanel } from './components/ConfigPanel'
import { SummaryView } from './components/SummaryView'
import { format } from 'date-fns'

const MOCK_CONFIG: StandupConfig = {
  id: 'conf_1',
  name: 'Engineering Standup',
  channel: '#engineering',
  platform: 'slack',
  schedule: {
    days: [1, 2, 3, 4, 5], // Mon-Fri
    time: '09:00',
    timezone: 'America/New_York'
  },
  questions: [
    'What did you work on yesterday?',
    'What are you working on today?',
    'Any blockers?'
  ],
  reminders: {
    enabled: true,
    delayMinutes: 30
  },
  enabled: true
}

const MOCK_RESPONSES: StandupResponse[] = [
  {
    id: 'res_1',
    configId: 'conf_1',
    userId: 'u1',
    userName: 'Alice Chen',
    date: new Date().toISOString().split('T')[0],
    answers: {
      'What did you work on yesterday?': 'Finished the new dashboard API endpoints and wrote tests',
      'What are you working on today?': 'Integrating frontend with the new endpoints',
      'Any blockers?': 'No blockers'
    },
    submittedAt: new Date().toISOString(),
    mood: 'great'
  },
  {
    id: 'res_2',
    configId: 'conf_1',
    userId: 'u2',
    userName: 'Bob Singh',
    date: new Date().toISOString().split('T')[0],
    answers: {
      'What did you work on yesterday?': 'Debugging the auth flow issue',
      'What are you working on today?': 'Still stuck on auth - need help from @alice',
      'Any blockers?': 'Yes - auth service returning 500'
    },
    submittedAt: new Date().toISOString(),
    mood: 'blocked'
  }
]

type Tab = 'today' | 'history' | 'settings'

function App() {
  const [configs, setConfigs] = useLocalStorage<StandupConfig[]>('standup-configs', [MOCK_CONFIG])
  const [selectedConfigId, setSelectedConfigId] = useState(configs[0]?.id || null)
  const [tab, setTab] = useState<Tab>('today')

  const selectedConfig = configs.find(c => c.id === selectedConfigId)

  const updateConfig = (config: StandupConfig) => {
    setConfigs(configs.map(c => c.id === config.id? config : c))
  }

  const deleteConfig = () => {
    if (!selectedConfigId) return
    setConfigs(configs.filter(c => c.id!== selectedConfigId))
    setSelectedConfigId(configs[0]?.id || null)
  }

  const createConfig = () => {
    const newConfig: StandupConfig = {
      id: nanoid(),
      name: 'New Standup',
      channel: '#general',
      platform: 'slack',
      schedule: {
        days: [1, 2, 3, 4, 5],
        time: '09:00',
        timezone: 'America/New_York'
      },
      questions: ['What did you do?', 'What will you do?', 'Any blockers?'],
      reminders: { enabled: true, delayMinutes: 30 },
      enabled: true
    }
    setConfigs([...configs, newConfig])
    setSelectedConfigId(newConfig.id)
    setTab('settings')
  }

  const todaySummary: StandupSummary = {
    date: new Date().toISOString().split('T')[0],
    configId: selectedConfigId || '',
    responses: MOCK_RESPONSES,
    blockers: ['Auth service returning 500 - Bob'],
    aiSummary: 'Team made progress on dashboard API. Bob is blocked on auth service issues and needs help. Alice completed endpoints and moving to integration.'
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="border-b bg-white px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold">Standup Bot</h1>
            <select
              value={selectedConfigId || ''}
              onChange={e => setSelectedConfigId(e.target.value)}
              className="px-3 py-1.5 border rounded text-sm"
            >
              {configs.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-1 bg-gray-100 rounded p-1">
            {(['today', 'history', 'settings'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded text-sm font-medium capitalize ${
                  tab === t? 'bg-white shadow' : 'text-gray-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          {tab === 'today' && <SummaryView summary={todaySummary} />}

          {tab === 'history' && (
            <div className="text-center py-12 text-gray-500">
              <p>History view coming soon</p>
              <p className="text-sm mt-2">Browse past standups by date</p>
            </div>
          )}

          {tab === 'settings' && selectedConfig && (
            <div className="max-w-2xl">
              <ConfigPanel
                config={selectedConfig}
                onUpdate={updateConfig}
                onDelete={deleteConfig}
              />
              <button
                onClick={createConfig}
                className="mt-4 text-sm text-blue-600 hover:text-blue-800"
              >
                + Create another standup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App