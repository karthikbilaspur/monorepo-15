import { Note, Folder } from '../../types/note'
import { cn } from '@repo/utils'
import { formatDistanceToNow } from 'date-fns'

type NoteListProps = {
  notes: Note[]
  folders: Folder[]
  selectedId: string | null
  onSelectNote: (id: string) => void
  onCreateNote: () => void
  search: string
  onSearchChange: (search: string) => void
}

export function NoteList({ notes, folders, selectedId, onSelectNote, onCreateNote, search, onSearchChange }: NoteListProps) {
  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="w-80 border-r bg-gray-50 flex flex-col h-full">
      <div className="p-4 border-b bg-white">
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full px-3 py-2 border rounded text-sm mb-3"
        />
        <button
          onClick={onCreateNote}
          className="w-full px-3 py-2 bg-black text-white rounded text-sm font-medium hover:bg-gray-800"
        >
          + New Note
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredNotes.length === 0? (
          <div className="text-center py-12 text-gray-500 text-sm">
            No notes found
          </div>
        ) : (
          filteredNotes.map(note => (
            <div
              key={note.id}
              onClick={() => onSelectNote(note.id)}
              className={cn(
                'px-4 py-3 border-b cursor-pointer hover:bg-white',
                selectedId === note.id && 'bg-white border-l-4 border-l-blue-500'
              )}
            >
              <h3 className="font-medium text-sm truncate mb-1">{note.title || 'Untitled'}</h3>
              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                {note.content.slice(0, 100) || 'No content'}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                </span>
                {note.tags.length > 0 && (
                  <div className="flex gap-1">
                    {note.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}