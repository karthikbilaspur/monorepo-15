import { useEffect, useRef } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap, placeholder } from '@codemirror/view'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search'
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language'
import * as Y from 'yjs'
import { yCollab } from 'y-codemirror.next'
import { WebsocketProvider } from 'y-websocket'

type MarkdownEditorProps = {
  value: string
  onChange: (value: string) => void
  noteId: string
  enableCollab?: boolean
}

export function MarkdownEditor({ value, onChange, noteId, enableCollab = false }: MarkdownEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)

  useEffect(() => {
    if (!editorRef.current) return

    const ydoc = new Y.Doc()
    const ytext = ydoc.getText('codemirror')
    ytext.insert(0, value)

    let provider: WebsocketProvider | null = null
    if (enableCollab && import.meta.env.VITE_WS_URL) {
      provider = new WebsocketProvider(import.meta.env.VITE_WS_URL, noteId, ydoc)
    }

    const extensions = [
      history(),
      keymap.of([...defaultKeymap,...historyKeymap,...searchKeymap]),
      markdown({ base: markdownLanguage }),
      syntaxHighlighting(defaultHighlightStyle),
      highlightSelectionMatches(),
      placeholder('Start writing...'),
      EditorView.lineWrapping,
      EditorView.updateListener.of(update => {
        if (update.docChanged) {
          onChange(update.state.doc.toString())
        }
      }),
      EditorView.theme({
        '&': { height: '100%', fontSize: '14px' },
        '.cm-content': { padding: '16px', fontFamily: 'ui-monospace, monospace' },
        '.cm-focused': { outline: 'none' },
        '.cm-line': { padding: '0 2px' }
      })
    ]

    if (provider) {
      extensions.push(yCollab(ytext, provider.awareness))
    }

    const state = EditorState.create({
      doc: ytext.toString(),
      extensions
    })

    const view = new EditorView({
      state,
      parent: editorRef.current
    })

    viewRef.current = view

    return () => {
      view.destroy()
      provider?.destroy()
      ydoc.destroy()
    }
  }, [noteId])

  return <div ref={editorRef} className="h-full" />
}