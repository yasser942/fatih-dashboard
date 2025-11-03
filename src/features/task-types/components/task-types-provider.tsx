import { createContext, useContext, useState } from 'react'
import { type TaskType } from '../data/schema'

type DialogType = 'create' | 'update' | 'delete' | null

interface TaskTypesContextType {
  open: DialogType
  setOpen: (open: DialogType) => void
  currentRow: TaskType | null
  setCurrentRow: (row: TaskType | null) => void
  refetch?: () => void
}

const TaskTypesContext = createContext<TaskTypesContextType | undefined>(undefined)

export function TaskTypesProvider({
  children,
  refetch,
}: {
  children: React.ReactNode
  refetch?: () => void
}) {
  const [open, setOpen] = useState<DialogType>(null)
  const [currentRow, setCurrentRow] = useState<TaskType | null>(null)

  return (
    <TaskTypesContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        refetch,
      }}
    >
      {children}
    </TaskTypesContext.Provider>
  )
}

export function useTaskTypes() {
  const context = useContext(TaskTypesContext)
  if (context === undefined) {
    throw new Error('useTaskTypes must be used within a TaskTypesProvider')
  }
  return context
}






