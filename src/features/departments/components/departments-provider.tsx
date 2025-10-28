import React, { useState } from 'react'
import { type Department } from '../data/schema'

type DepartmentsDialogType = 'create' | 'update' | 'delete'

type DepartmentsContextType = {
    open: DepartmentsDialogType | null
    setOpen: (str: DepartmentsDialogType | null) => void
    currentRow: Department | null
    setCurrentRow: React.Dispatch<React.SetStateAction<Department | null>>
    refetch?: () => void
}

const DepartmentsContext = React.createContext<DepartmentsContextType | null>(null)

export function DepartmentsProvider({ children, refetch }: { children: React.ReactNode; refetch?: () => void }) {
    const [open, setOpen] = useState<DepartmentsDialogType | null>(null)
    const [currentRow, setCurrentRow] = useState<Department | null>(null)

    return (
        <DepartmentsContext value={{ open, setOpen, currentRow, setCurrentRow, refetch }}>
            {children}
        </DepartmentsContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDepartments = () => {
    const departmentsContext = React.useContext(DepartmentsContext)

    if (!departmentsContext) {
        throw new Error('useDepartments has to be used within <DepartmentsContext>')
    }

    return departmentsContext
}




