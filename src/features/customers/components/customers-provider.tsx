import React, { useState } from 'react'
import { type Customer } from '../data/schema'

type CustomersDialogType = 'create' | 'update' | 'delete'

type CustomersContextType = {
    open: CustomersDialogType | null
    setOpen: (str: CustomersDialogType | null) => void
    currentRow: Customer | null
    setCurrentRow: React.Dispatch<React.SetStateAction<Customer | null>>
    refetch?: () => void
}

const CustomersContext = React.createContext<CustomersContextType | null>(null)

export function CustomersProvider({ children, refetch }: { children: React.ReactNode; refetch?: () => void }) {
    const [open, setOpen] = useState<CustomersDialogType | null>(null)
    const [currentRow, setCurrentRow] = useState<Customer | null>(null)

    return (
        <CustomersContext value={{ open, setOpen, currentRow, setCurrentRow, refetch }}>{children}</CustomersContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCustomers = () => {
    const ctx = React.useContext(CustomersContext)
    if (!ctx) {
        throw new Error('useCustomers must be used within CustomersProvider')
    }
    return ctx
}
