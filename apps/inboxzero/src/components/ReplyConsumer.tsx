import { useState } from 'react'
import { cn } from '@repo/utils'

type ReplyComposerProps = {
  onSend: (body: string) => void
  onCancel: () => void
}

export function ReplyComposer({ onSend, onCancel }: ReplyComposerProps) {
  const [body, setBody] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleAIReply = async () => {
    setIsGenerating(true)
    // TODO: Call AI endpoint with thread context
    setTimeout(() => {
      setBody('Thanks for reaching out! I\'ll review this and get back to you by EOD.')
      setIsGenerating(false)
    }, 1000)
  }

  const handleSend = () => {
    if (!body.trim()) return
    onSend(body)
    setBody('')
  }

  return (
    <div className="border-t bg-white p-4">
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-3 py-2 border-b flex justify-between items-center">
          <span className="text-sm font-medium">Reply</span>
          <button
            onClick={handleAIReply}
            disabled={isGenerating}
            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isGenerating? 'Generating...' : '✨ AI Reply'}
          </button>
        </div>

        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Type your reply..."
          rows={6}
          className="w-full p-3 text-sm resize-none focus:outline-none"
        />

        <div className="bg-gray-50 px-3 py-2 border-t flex justify-between items-center">
          <div className="flex gap-2">
            <button className="text-gray-500 hover:text-gray-700 text-sm">📎</button>
            <button className="text-gray-500 hover:text-gray-700 text-sm">😊</button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-3 py-1.5 text-sm border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!body.trim()}
              className={cn(
                'px-4 py-1.5 text-sm rounded font-medium',
                body.trim()
               ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              )}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}