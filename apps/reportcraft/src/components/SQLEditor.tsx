import { useEffect, useRef } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap, placeholder } from '@codemirror/view'
import { sql } from '@codemirror/lang-sql'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language'

type SQLEditorProps = {
  value: string
  onChange: (value: string) => void
  onRun: () => void
}

export function SQLEditor({ value, onChange, onRun }: SQLEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)

  useEffect(() => {
    if (!editorRef.current) return

    const state = EditorState.create({
      doc: value,
      extensions: [
        history(),
        keymap.of([
       ...defaultKeymap,
       ...historyKeymap,
          { key: 'Cmd-Enter', run: () => { onRun(); return true } },
          { key: 'Ctrl-Enter', run: () => { onRun(); return true } }
        ]),
        sql(),
        syntaxHighlighting(defaultHighlightStyle),
        placeholder('SELECT * FROM users WHERE created_at > now() - interval \'7 days\''),
        EditorView.lineWrapping,
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            onChange(update.state.doc.toString())
          }
        }),
        EditorView.theme({
          '&': { height: '300px', fontSize: '13px' },
          '.cm-content': { padding: '12px', fontFamily: 'ui-monospace, monospace' },
          '.cm-focused': { outline: 'none' }
        })
      ]
    })

    const view = new EditorView({
      state,
      parent: editorRef.current
    })

    viewRef.current = view

    return () => view.destroy()
  }, [])

  useEffect(() => {
    if (viewRef.current && value!== viewRef.current.state.doc.toString()) {
      viewRef.current.dispatch({
        changes: { from: 0, to: viewRef.current.state.doc.length, insert: value }
      })
    }
  }, [value])

  return <div ref={editorRef} className="border rounded" />
}