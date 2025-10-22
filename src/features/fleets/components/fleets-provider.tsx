import { createContext, useContext, useState, type ReactNode } from 'react'
import { type Fleet } from '../data/schema'

type DrawerState = 'create' | 'update' | 'delete' | null

interface FleetsContextType {
    open: DrawerState
    setOpen: (open: DrawerState) => void
    currentRow: Fleet | null
    setCurrentRow: (row: Fleet | null) => void
    refetch?: () => void
}

const FleetsContext = createContext<FleetsContextType | undefined>(undefined)

interface FleetsProviderProps {
    children: ReactNode
    refetch?: () => void
}

export function FleetsProvider({ children, refetch }: FleetsProviderProps) {
    const [open, setOpen] = useState<DrawerState>(null)
    const [currentRow, setCurrentRow] = useState<Fleet | null>(null)

    return (
        <FleetsContext.Provider
            value={{
                open,
                setOpen,
                currentRow,
                setCurrentRow,
                refetch,
            }}
        >
            {children}
        </FleetsContext.Provider>
    )
}

export function useFleets() {
    const context = useContext(FleetsContext)
    if (context === undefined) {
        throw new Error('useFleets must be used within a FleetsProvider')
    }
    return context
}
