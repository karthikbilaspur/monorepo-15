import { useState } from 'react'
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useLocalStorage } from '@repo/hooks'
import { nanoid } from 'nanoid'
import { KanbanColumn } from './components/KanbanColumn'
import { TaskModal } from './components/TaskModal'
import { Task, TaskStatus, ViewMode } from './types/task'

const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Design new landing page',
    description: 'Create mockups for hero section',
    status: 'in_progress',
    priority: 'high',
    assignee: 'sarah@co.com',
    labels: ['design', 'marketing'],
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    estimate: 8,
    logged: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 't2',
    title: 'Fix login bug',
    status: 'todo',
    priority: 'urgent',
    labels: ['bug', 'backend'],
    estimate: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 't3',
    title: 'Update documentation',
    status: 'done',
    priority: 'low',
    labels: ['docs'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const STATUSES: TaskStatus[] = ['backlog', 'todo', 'in_progress', 'review', 'done']

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('taskflow-tasks', MOCK_TASKS)
  const [viewMode, setViewMode] = useState<ViewMode>('kanban')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as TaskStatus

    setTasks(tasks.map(t =>
      t.id === taskId? {...t, status: newStatus, updatedAt: new Date().toISOString() } : t
    ))
  }

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (selectedTask) {
      setTasks(tasks.map(t =>
        t.id === selectedTask.id? {...t,...taskData, updatedAt: new Date().toISOString() } : t
      ))
    } else {
      const newTask: Task = {
        id: nanoid(),
        title: taskData.title || 'Untitled',
        status: taskData.status || 'todo',
        priority: taskData.priority || 'medium',
        labels: taskData.labels || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      ...taskData
      }
      setTasks([newTask,...tasks])
    }
    setSelectedTask(null)
    setIsCreating(false)
  }

  const handleDeleteTask = () => {
    if (!selectedTask) return
    setTasks(tasks.filter(t => t.id!== selectedTask.id))
    setSelectedTask(null)
  }

  const tasksByStatus = STATUSES.reduce((acc, status) => {
    acc[status] = tasks.filter(t => t.status === status)
    return acc
  }, {} as Record<TaskStatus, Task[]>)

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="border-b bg-white px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">TaskFlow Pro</h1>
            <p className="text-sm text-gray-600 mt-1">
              {tasks.filter(t => t.status!== 'done').length} active tasks
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex gap-1 bg-gray-100 rounded p-1">
              {(['kanban', 'list', 'gantt'] as ViewMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1.5 rounded text-sm font-medium capitalize ${
                    viewMode === mode? 'bg-white shadow' : 'text-gray-600'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <button
              onClick={() => { setSelectedTask(null); setIsCreating(true) }}
              className="px-4 py-2 bg-black text-white rounded text-sm font-medium hover:bg-gray-800"
            >
              + New Task
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        {viewMode === 'kanban' && (
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="flex gap-4 h-full">
              {STATUSES.map(status => (
                <KanbanColumn
                  key={status}
                  status={status}
                  tasks={tasksByStatus[status]}
                  onTaskClick={setSelectedTask}
                />
              ))}
            </div>
          </DndContext>
        )}

        {viewMode === 'list' && (
          <div className="bg-white rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-3 font-medium">Task</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Priority</th>
                  <th className="text-left p-3 font-medium">Assignee</th>
                  <th className="text-left p-3 font-medium">Due</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedTask(task)}>
                    <td className="p-3">{task.title}</td>
                    <td className="p-3 capitalize">{task.status.replace('_', ' ')}</td>
                    <td className="p-3 capitalize">{task.priority}</td>
                    <td className="p-3">{task.assignee || '-'}</td>
                    <td className="p-3">{task.dueDate? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {(selectedTask || isCreating) && (
        <TaskModal
          task={selectedTask}
          onSave={handleSaveTask}
          onClose={() => { setSelectedTask(null); setIsCreating(false) }}
          onDelete={selectedTask? handleDeleteTask : undefined}
        />
      )}
    </div>
  )
}

export default App