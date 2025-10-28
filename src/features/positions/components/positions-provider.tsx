import React, { useState } from 'react'
import { type Position } from '../data/schema'

type PositionsDialogType = 'create' | 'update' | 'delete'

type PositionsContextType = {
    open: PositionsDialogType | null
    setOpen: (str: PositionsDialogType | null) => void
    currentRow: Position | null
    setCurrentRow: React.Dispatch<React.SetStateAction<Position | null>>
    refetch?: () => void
}

const PositionsContext = React.createContext<PositionsContextType | null>(null)

export function PositionsProvider({ children, refetch }: { children: React.ReactNode; refetch?: () => void }) {
    const [open, setOpen] = useState<PositionsDialogType | null>(null)
    const [currentRow, setCurrentRow] = useState<Position | null>(null)

    return (
        <PositionsContext value={{ open, setOpen, currentRow, setCurrentRow, refetch }}>
            {children}
        </PositionsContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePositions = () => {
    const positionsContext = React.useContext(PositionsContext)

    if (!positionsContext) {
        throw new Error('usePositions has to be used within <PositionsContext>')
    }

    return positionsContext
}




