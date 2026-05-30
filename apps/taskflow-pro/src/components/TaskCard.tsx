import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Task, TaskPriority } from '../types/task'
import { cn } from '@repo/utils'
import { format } from 'date-fns'

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: 'border-l-gray-400',
  medium: 'border-l-blue-400',
  high: 'border-l-orange-400',
  urgent: 'border-l-red-500'
}

type TaskCardProps = {
  task: Task
  onClick: () => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        'bg-white border-l-4 rounded p-3 cursor-pointer hover:shadow-md transition-shadow',
        PRIORITY_COLORS[task.priority],
        isDragging && 'opacity-50'
      )}
    >
      <h4 className="font-medium text-sm mb-2 line-clamp-2">{task.title}</h4>

      <div className="flex flex-wrap gap-1 mb-2">
        {task.labels.map(label => (
          <span key={label} className="text-xs px-2 py-0.5 bg-gray-100 rounded">
            {label}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center text-xs text-gray-600">
        <div className="flex items-center gap-2">
          {task.assignee && (
            <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
              {task.assignee[0].toUpperCase()}
            </div>
          )}
          {task.estimate && (
            <span>{task.logged || 0}/{task.estimate}h</span>
          )}
        </div>
        {task.dueDate && (
          <span className={cn(
            new Date(task.dueDate) < new Date() && 'text-red-600 font-medium'
          )}>
            {format(new Date(task.dueDate), 'MMM d')}
          </span>
        )}
      </div>
    </div>
  )
}