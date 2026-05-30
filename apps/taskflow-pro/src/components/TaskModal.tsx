import { useState } from 'react'
import { Task, TaskStatus, TaskPriority } from '../types/task'
import { format } from 'date-fns'

type TaskModalProps = {
  task: Task | null
  onSave: (task: Partial<Task>) => void
  onClose: () => void
  onDelete?: () => void
}

const STATUSES: TaskStatus[] = ['backlog', 'todo', 'in_progress', 'review', 'done']
const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high', 'urgent']

export function TaskModal({ task, onSave, onClose, onDelete }: TaskModalProps) {
  const [form, setForm] = useState<Partial<Task>>(task || {
    title: '',
    status: 'todo',
    priority: 'medium',
    labels: []
  })

  const handleSave = () => {
    if (!form.title?.trim()) return
    onSave(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h- overflow-y-auto">
        <div className="p-6">
          <input
            value={form.title || ''}
            onChange={e => setForm({...form, title: e.target.value })}
            placeholder="Task title"
            className="text-2xl font-bold w-full bg-transparent border-none focus:outline-none mb-4"
            autoFocus
          />

          <textarea
            value={form.description || ''}
            onChange={e => setForm({...form, description: e.target.value })}
            placeholder="Add description..."
            rows={4}
            className="w-full border rounded p-3 text-sm mb-4"
          />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => setForm({...form, status: e.target.value as TaskStatus })}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                {STATUSES.map(s => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Priority</label>
              <select
                value={form.priority}
                onChange={e => setForm({...form, priority: e.target.value as TaskPriority })}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                {PRIORITIES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Assignee</label>
              <input
                value={form.assignee || ''}
                onChange={e => setForm({...form, assignee: e.target.value })}
                placeholder="Email"
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Due Date</label>
              <input
                type="date"
                value={form.dueDate || ''}
                onChange={e => setForm({...form, dueDate: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Estimate (hours)</label>
              <input
                type="number"
                value={form.estimate || ''}
                onChange={e => setForm({...form, estimate: Number(e.target.value) })}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Labels</label>
              <input
                value={form.labels?.join(', ') || ''}
                onChange={e => setForm({...form, labels: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                placeholder="bug, frontend"
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div>
              {task && onDelete && (
                <button
                  onClick={onDelete}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Delete Task
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-black text-white rounded text-sm hover:bg-gray-800"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}