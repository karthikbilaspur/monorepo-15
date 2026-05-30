export type Note = {
  id: string
  title: string
  content: string // markdown
  folderId?: string
  tags: string[]
  createdAt: string
  updatedAt: string
  isArchived: boolean
}

export type Folder = {
  id: string
  name: string
  parentId?: string
}