import React, { useState } from 'react'
import { type Employee } from '../data/schema'

type EmployeesDialogType = 'create' | 'update' | 'delete'

type EmployeesContextType = {
    open: EmployeesDialogType | null
    setOpen: (str: EmployeesDialogType | null) => void
    currentRow: Employee | null
    setCurrentRow: React.Dispatch<React.SetStateAction<Employee | null>>
    refetch?: () => void
}

const EmployeesContext = React.createContext<EmployeesContextType | null>(null)

export function EmployeesProvider({ children, refetch }: { children: React.ReactNode; refetch?: () => void }) {
    const [open, setOpen] = useState<EmployeesDialogType | null>(null)
    const [currentRow, setCurrentRow] = useState<Employee | null>(null)

    return (
        <EmployeesContext value={{ open, setOpen, currentRow, setCurrentRow, refetch }}>
            {children}
        </EmployeesContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useEmployees = () => {
    const employeesContext = React.useContext(EmployeesContext)

    if (!employeesContext) {
        throw new Error('useEmployees has to be used within <EmployeesContext>')
    }

    return employeesContext
}




