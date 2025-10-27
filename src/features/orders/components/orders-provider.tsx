import { createContext, useContext, useState, type ReactNode } from 'react'
import { type Order } from '../data/schema'

type OrderContextType = {
    open: 'create' | 'update' | 'delete' | 'bulk-delete' | null
    setOpen: (open: 'create' | 'update' | 'delete' | 'bulk-delete' | null) => void
    currentRow: Order | null
    setCurrentRow: (row: Order | null) => void
    refetch?: () => void
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function useOrders() {
    const context = useContext(OrderContext)
    if (context === undefined) {
        throw new Error('useOrders must be used within an OrdersProvider')
    }
    return context
}

type OrdersProviderProps = {
    children: ReactNode
    refetch?: () => void
}

export function OrdersProvider({ children, refetch }: OrdersProviderProps) {
    const [open, setOpen] = useState<'create' | 'update' | 'delete' | 'bulk-delete' | null>(null)
    const [currentRow, setCurrentRow] = useState<Order | null>(null)

    return (
        <OrderContext.Provider value={{ open, setOpen, currentRow, setCurrentRow, refetch }}>
            {children}
        </OrderContext.Provider>
    )
}
