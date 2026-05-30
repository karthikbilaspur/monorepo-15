import { formatDistanceToNow } from 'date-fns'
import { cn } from '@repo/utils'
import { Thread, Channel } from '../types/inbox'

const CHANNEL_ICONS: Record<Channel, string> = {
  email: '📧',
  slack: '💬',
  sms: '📱',
  whatsapp: '💚',
  ticket: '🎫'
}

type ThreadListProps = {
  threads: Thread[]
  selectedId: string | null
  onSelectThread: (id: string) => void
  onToggleStar: (id: string) => void
  onArchive: (id: string) => void
}

export function ThreadList({ threads, selectedId, onSelectThread, onToggleStar, onArchive }: ThreadListProps) {
  return (
    <div className="border-r h-full overflow-y-auto bg-white">
      {threads.length === 0? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Inbox Zero ✨</p>
          <p className="text-sm mt-2">No messages</p>
        </div>
      ) : (
        threads.map(thread => (
          <div
            key={thread.id}
            onClick={() => onSelectThread(thread.id)}
            className={cn(
              'border-b px-4 py-3 cursor-pointer hover:bg-gray-50',
              selectedId === thread.id && 'bg-blue-50 border-l-4 border-l-blue-500',
              thread.status === 'unread' && 'bg-white'
            )}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); onToggleStar(thread.id) }}
                className="text-lg"
              >
                {thread.isStarred? '⭐' : '☆'}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs">{CHANNEL_ICONS[thread.channel]}</span>
                    <p className={cn(
                      'text-sm truncate',
                      thread.status === 'unread'? 'font-semibold' : 'font-medium'
                    )}>
                      {thread.participants[0]?.name || 'Unknown'}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {formatDistanceToNow(new Date(thread.lastMessageAt), { addSuffix: true })}
                  </span>
                </div>

                <p className={cn(
                  'text-sm truncate',
                  thread.status === 'unread'? 'font-medium text-gray-900' : 'text-gray-700'
                )}>
                  {thread.subject}
                </p>

                <p className="text-xs text-gray-500 truncate mt-1">
                  {thread.aiSummary || thread.preview}
                </p>

                {thread.labels.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {thread.labels.map(label => (
                      <span key={label} className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                        {label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}