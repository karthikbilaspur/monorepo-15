import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Task, TaskStatus } from '../types/task'
import { TaskCard } from './TaskCard'

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string }> = {
  backlog: { label: 'Backlog', color: 'bg-gray-100' },
  todo: { label: 'To Do', color: 'bg-blue-100' },
  in_progress: { label: 'In Progress', color: 'bg-yellow-100' },
  review: { label: 'Review', color: 'bg-purple-100' },
  done: { label: 'Done', color: 'bg-green-100' }
}

type KanbanColumnProps = {
  status: TaskStatus
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

export function KanbanColumn({ status, tasks, onTaskClick }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: status })
  const config = STATUS_CONFIG[status]

  return (
    <div className="flex flex-col w-80 flex-shrink-0">
      <div className={`${config.color} rounded-t-lg px-4 py-3`}>
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-sm">{config.label}</h3>
          <span className="text-xs bg-white/50 px-2 py-0.5 rounded">{tasks.length}</span>
        </div>
      </div>

      <div ref={setNodeRef} className="flex-1 bg-gray-50 rounded-b-lg p-2 min-h-">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}