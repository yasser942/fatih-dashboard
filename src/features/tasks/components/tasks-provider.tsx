import { createContext, useContext, useState } from 'react'
import { type Task } from '../data/schema'

type DialogType = 'create' | 'update' | 'delete' | null

interface TasksContextType {
  open: DialogType
  setOpen: (open: DialogType) => void
  currentRow: Task | null
  setCurrentRow: (row: Task | null) => void
  refetch?: () => void
}

const TasksContext = createContext<TasksContextType | undefined>(undefined)

export function TasksProvider({
  children,
  refetch,
}: {
  children: React.ReactNode
  refetch?: () => void
}) {
  const [open, setOpen] = useState<DialogType>(null)
  const [currentRow, setCurrentRow] = useState<Task | null>(null)

  return (
    <TasksContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        refetch,
      }}
    >
      {children}
    </TasksContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TasksContext)
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider')
  }
  return context
}
