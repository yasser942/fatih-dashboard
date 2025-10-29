import React, { createContext, useContext, useState } from 'react'
import type { User } from '../data/schema'

type UsersContextType = {
  open: 'create' | 'update' | 'delete' | 'roles' | 'permissions' | null
  setOpen: (open: 'create' | 'update' | 'delete' | 'roles' | 'permissions' | null) => void
  currentRow: User | null
  setCurrentRow: (row: User | null) => void
  refetch?: () => void
}

const UsersContext = createContext<UsersContextType | undefined>(undefined)

export function UsersProvider({
  children,
  refetch,
}: {
  children: React.ReactNode
  refetch?: () => void
}) {
  const [open, setOpen] = useState<'create' | 'update' | 'delete' | 'roles' | 'permissions' | null>(
    null,
  )
  const [currentRow, setCurrentRow] = useState<User | null>(null)

  return (
    <UsersContext.Provider value={{ open, setOpen, currentRow, setCurrentRow, refetch }}>
      {children}
    </UsersContext.Provider>
  )
}

export function useUsers() {
  const context = useContext(UsersContext)
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider')
  }
  return context
}
