import React, { useState } from 'react'
import { type Branch } from '../data/schema'

type BranchesDialogType = 'create' | 'update' | 'delete'

type BranchesContextType = {
    open: BranchesDialogType | null
    setOpen: (str: BranchesDialogType | null) => void
    currentRow: Branch | null
    setCurrentRow: React.Dispatch<React.SetStateAction<Branch | null>>
    refetch?: () => void
}

const BranchesContext = React.createContext<BranchesContextType | null>(null)

export function BranchesProvider({ children, refetch }: { children: React.ReactNode; refetch?: () => void }) {
    const [open, setOpen] = useState<BranchesDialogType | null>(null)
    const [currentRow, setCurrentRow] = useState<Branch | null>(null)

    return (
        <BranchesContext value={{ open, setOpen, currentRow, setCurrentRow, refetch }}>{children}</BranchesContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useBranches = () => {
    const ctx = React.useContext(BranchesContext)
    if (!ctx) {
        throw new Error('useBranches must be used within BranchesProvider')
    }
    return ctx
}


