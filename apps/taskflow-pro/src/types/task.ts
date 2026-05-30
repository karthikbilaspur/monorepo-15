export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export type Task = {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assignee?: string
  labels: string[]
  dueDate?: string
  startDate?: string
  estimate?: number // hours
  logged?: number // hours
  dependencies?: string[] // task IDs
  createdAt: string
  updatedAt: string
}

export type Sprint = {
  id: string
  name: string
  startDate: string
  endDate: string
  goal?: string
  taskIds: string[]
}

export type ViewMode = 'kanban' | 'list' | 'gantt'