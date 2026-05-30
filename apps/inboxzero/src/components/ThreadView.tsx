import { useState } from 'react'
import { format } from 'date-fns'
import { Thread } from '../types/inbox'
import { ReplyComposer } from './ReplyComposer'
import { SnoozePicker } from './SnoozePicker'

type ThreadViewProps = {
  thread: Thread | null
  onArchive: () => void
  onSnooze: (until: Date) => void
  onReply: (body: string) => void
}

export function ThreadView({ thread, onArchive, onSnooze, onReply }: ThreadViewProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [showSnooze, setShowSnooze] = useState(false)

  if (!thread) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a thread to read
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b px-6 py-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="text-xl font-semibold">{thread.subject}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {thread.participants.map(p => p.name).join(', ')}
            </p>
          </div>
          <div className="flex gap-2 relative">
            <button
              onClick={() => setShowSnooze(!showSnooze)}
              className="px-3 py-1.5 border rounded text-sm hover:bg-gray-50"
            >
              Snooze
            </button>
            {showSnooze && (
              <SnoozePicker
                onSnooze={onSnooze}
                onClose={() => setShowSnooze(false)}
              />
            )}
            <button
              onClick={onArchive}
              className="px-3 py-1.5 border rounded text-sm hover:bg-gray-50"
            >
              Archive
            </button>
          </div>
        </div>

        {thread.aiSummary && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
            <p className="font-medium text-blue-900 mb-1">✨ AI Summary</p>
            <p className="text-blue-800">{thread.aiSummary}</p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {thread.messages?.map(msg => (
          <div key={msg.id} className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium">
                {msg.from.name[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{msg.from.name}</p>
                <p className="text-xs text-gray-500">{format(new Date(msg.timestamp), 'MMM d, h:mm a')}</p>
              </div>
            </div>
            <div className="ml-11 prose prose-sm max-w-none">
              {msg.html? (
                <div dangerouslySetInnerHTML={{ __html: msg.html }} />
              ) : (
                <p className="whitespace-pre-wrap">{msg.body}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {isReplying? (
        <ReplyComposer
          onSend={(body) => { onReply(body); setIsReplying(false) }}
          onCancel={() => setIsReplying(false)}
        />
      ) : (
        <div className="border-t p-4">
          <button
            onClick={() => setIsReplying(true)}
            className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm font-medium"
          >
            Reply
          </button>
        </div>
      )}
    </div>
  )
}