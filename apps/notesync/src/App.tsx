import { useState, useMemo } from 'react'
import { useLocalStorage } from '@repo/hooks'
import { nanoid } from 'nanoid'
import { NoteList } from './components/NoteList'
import { MarkdownEditor } from './components/MarkdownEditor'
import { MarkdownPreview } from './components/MarkdownPreview'
import { Note, Folder } from './types/note'
import { cn } from '@repo/utils'

type ViewMode = 'editor' | 'preview' | 'split'

function App() {
  const [notes, setNotes] = useLocalStorage<Note[]>('notesync-notes', [
    {
      id: 'note_1',
      title: 'Welcome to NoteSync',
      content: '# Welcome\n\nThis is a **markdown** note with real-time sync.\n\n- Create notes\n- Organize with tags\n- Preview markdown\n\n```js\nconsole.log("Hello")\n```',
      tags: ['welcome'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isArchived: false
    }
  ])
  const [folders] = useState<Folder[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(notes[0]?.id || null)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('split')

  const selectedNote = useMemo(
    () => notes.find(n => n.id === selectedId) || null,
    [notes, selectedId]
  )

  const createNote = () => {
    const newNote: Note = {
      id: nanoid(),
      title: 'Untitled',
      content: '',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isArchived: false
    }
    setNotes([newNote,...notes])
    setSelectedId(newNote.id)
  }

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(n =>
      n.id === id
    ? {...n,...updates, updatedAt: new Date().toISOString() }
        : n
    ))
  }

  const handleTitleChange = (title: string) => {
    if (!selectedNote) return
    updateNote(selectedNote.id, { title })
  }

  const handleContentChange = (content: string) => {
    if (!selectedNote) return
    updateNote(selectedNote.id, { content })
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="border-b px-6 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">NoteSync</h1>
        <div className="flex gap-1 bg-gray-100 rounded p-1">
          {(['editor', 'preview', 'split'] as ViewMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                'px-3 py-1 rounded text-sm font-medium capitalize',
                viewMode === mode? 'bg-white shadow' : 'text-gray-600'
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <NoteList
          notes={notes}
          folders={folders}
          selectedId={selectedId}
          onSelectNote={setSelectedId}
          onCreateNote={createNote}
          search={search}
          onSearchChange={setSearch}
        />

        <div className="flex-1 flex flex-col">
          {selectedNote? (
            <>
              <div className="border-b px-6 py-3">
                <input
                  value={selectedNote.title}
                  onChange={e => handleTitleChange(e.target.value)}
                  placeholder="Note title"
                  className="text-2xl font-bold w-full bg-transparent border-none focus:outline-none"
                />
              </div>

              <div className="flex-1 flex overflow-hidden">
                {(viewMode === 'editor' || viewMode === 'split') && (
                  <div className={cn('overflow-hidden', viewMode === 'split'? 'w-1/2 border-r' : 'flex-1')}>
                    <MarkdownEditor
                      value={selectedNote.content}
                      onChange={handleContentChange}
                      noteId={selectedNote.id}
                      enableCollab={import.meta.env.VITE_ENABLE_COLLABORATION === 'true'}
                    />
                  </div>
                )}

                {(viewMode === 'preview' || viewMode === 'split') && (
                  <div className={cn('overflow-hidden bg-gray-50', viewMode === 'split'? 'w-1/2' : 'flex-1')}>
                    <MarkdownPreview content={selectedNote.content} />
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a note or create a new one
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App