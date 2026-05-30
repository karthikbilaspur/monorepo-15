import { useState, useMemo } from 'react'
import { useLocalStorage, useDebounce } from '@repo/hooks'
import { ThreadList } from './components/ThreadList'
import { ThreadView } from './components/ThreadView'
import { LabelManager, type Label } from './components/LabelManager'
import { Thread, ThreadStatus } from './types/inbox'
import { nanoid } from 'nanoid'

const MOCK_THREADS: Thread[] = [
  {
    id: 't1',
    channel: 'email',
    subject: 'Q4 Budget Review',
    participants: [{ name: 'Sarah Chen', email: 'sarah@company.com' }],
    preview: 'Can we sync on the Q4 numbers? I have some concerns...',
    status: 'unread',
    isStarred: true,
    labels: ['important'],
    messageCount: 3,
    lastMessageAt: '2026-05-28T10:30:00Z',
    aiSummary: 'Sarah wants to discuss Q4 budget concerns. Needs meeting this week.',
    messages: [
      {
        id: 'm1',
        threadId: 't1',
        from: { name: 'Sarah Chen', email: 'sarah@company.com' },
        body: 'Hey, can we sync on the Q4 numbers? I have some concerns about the marketing spend vs our targets. Are you free tomorrow at 2pm?',
        timestamp: '2026-05-28T10:30:00Z'
      }
    ]
  },
  {
    id: 't2',
    channel: 'slack',
    subject: 'Design review: new landing page',
    participants: [{ name: 'Mike Ross' }],
    preview: 'Pushed the latest figma updates. LMK what you think',
    status: 'read',
    isStarred: false,
    labels: ['design'],
    messageCount: 5,
    lastMessageAt: '2026-05-28T09:15:00Z',
    aiSummary: 'Mike shared new landing page designs for review.',
    messages: [
      {
        id: 'm2',
        threadId: 't2',
        from: { name: 'Mike Ross' },
        body: 'Pushed the latest figma updates. LMK what you think about the hero section',
        timestamp: '2026-05-28T09:15:00Z'
      }
    ]
  }
]

const DEFAULT_LABELS: Label[] = [
  { id: 'l1', name: 'Important', color: '#ef4444' },
  { id: 'l2', name: 'Design', color: '#8b5cf6' },
  { id: 'l3', name: 'Finance', color: '#22c55e' }
]

type FilterTab = 'all' | 'unread' | 'starred' | 'snoozed' | 'done'

function App() {
  const [threads, setThreads] = useState<Thread[]>(MOCK_THREADS)
  const [labels, setLabels] = useLocalStorage<Label[]>('inbox-labels', DEFAULT_LABELS)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filter, setFilter] = useLocalStorage<FilterTab>('inbox-filter', 'all')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  const filteredThreads = useMemo(() => {
    return threads.filter(t => {
      // Filter tab
      if (filter === 'all' && (t.status === 'done' || t.status === 'snoozed')) return false
      if (filter === 'unread' && t.status!== 'unread') return false
      if (filter === 'starred' &&!t.isStarred) return false
      if (filter === 'snoozed' && t.status!== 'snoozed') return false
      if (filter === 'done' && t.status!== 'done') return false

      // Search
      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase()
        return (
          t.subject.toLowerCase().includes(query) ||
          t.preview.toLowerCase().includes(query) ||
          t.participants.some(p => p.name.toLowerCase().includes(query))
        )
      }

      return true
    })
  }, [threads, filter, debouncedSearch])

  const selectedThread = threads.find(t => t.id === selectedId) || null

  const handleSelectThread = (id: string) => {
    setSelectedId(id)
    setThreads(threads.map(t => t.id === id? {...t, status: 'read' as ThreadStatus } : t))
  }

  const handleToggleStar = (id: string) => {
    setThreads(threads.map(t => t.id === id? {...t, isStarred:!t.isStarred } : t))
  }

  const handleArchive = (id: string) => {
    setThreads(threads.map(t => t.id === id? {...t, status: 'done' as ThreadStatus } : t))
    setSelectedId(null)
  }

  const handleSnooze = (until: Date) => {
    if (!selectedId) return
    setThreads(threads.map(t =>
      t.id === selectedId
     ? {...t, status: 'snoozed' as ThreadStatus, snoozedUntil: until.toISOString() }
        : t
    ))
    setSelectedId(null)
  }

  const handleReply = (body: string) => {
    if (!selectedId) return
    const newMsg = {
      id: nanoid(),
      threadId: selectedId,
      from: { name: 'You' },
      body,
      timestamp: new Date().toISOString()
    }
    setThreads(threads.map(t =>
      t.id === selectedId
     ? {
         ...t,
          messages: [...(t.messages || []), newMsg],
          lastMessageAt: newMsg.timestamp,
          preview: body.slice(0, 100)
        }
        : t
    ))
  }

  const handleCreateLabel = (name: string, color: string) => {
    setLabels([...labels, { id: nanoid(), name, color }])
  }

  const tabs: { key: FilterTab; label: string; count?: number }[] = [
    { key: 'all', label: 'Inbox', count: threads.filter(t => t.status!== 'done' && t.status!== 'snoozed').length },
    { key: 'unread', label: 'Unread', count: threads.filter(t => t.status === 'unread').length },
    { key: 'starred', label: 'Starred' },
    { key: 'snoozed', label: 'Snoozed' },
    { key: 'done', label: 'Done' }
  ]

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="border-b bg-white px-6 py-3">
        <div className="flex items-center justify-between max-w- mx-auto gap-4">
          <h1 className="text-xl font-bold">InboxZero</h1>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 max-w-md px-3 py-1.5 border rounded text-sm"
          />
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-3 py-1.5 rounded text-sm font-medium ${
                  filter === tab.key
                 ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
                {tab.count!== undefined && tab.count > 0 && (
                  <span className="ml-1 text-xs opacity-70">({tab.count})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden max-w- mx-auto w-full">
        <div className="w- flex-shrink-0 flex flex-col gap-4 p-4">
          <LabelManager
            labels={labels}
            selectedLabels={[]}
            onToggleLabel={() => {}}
            onCreateLabel={handleCreateLabel}
          />
          <div className="flex-1">
            <ThreadList
              threads={filteredThreads}
              selectedId={selectedId}
              onSelectThread={handleSelectThread}
              onToggleStar={handleToggleStar}
              onArchive={handleArchive}
            />
          </div>
        </div>
        <div className="flex-1">
          <ThreadView
            thread={selectedThread}
            onArchive={() => selectedId && handleArchive(selectedId)}
            onSnooze={handleSnooze}
            onReply={handleReply}
          />
        </div>
      </div>
    </div>
  )
}

export default App