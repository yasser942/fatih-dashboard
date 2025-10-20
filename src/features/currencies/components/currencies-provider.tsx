import React, { useState } from 'react'
import { type Currency } from '../data/schema'

type CurrenciesDialogType = 'create' | 'update' | 'delete'

type CurrenciesContextType = {
    open: CurrenciesDialogType | null
    setOpen: (str: CurrenciesDialogType | null) => void
    currentRow: Currency | null
    setCurrentRow: React.Dispatch<React.SetStateAction<Currency | null>>
    refetch?: () => void
}

const CurrenciesContext = React.createContext<CurrenciesContextType | null>(null)

export function CurrenciesProvider({ children, refetch }: { children: React.ReactNode; refetch?: () => void }) {
    const [open, setOpen] = useState<CurrenciesDialogType | null>(null)
    const [currentRow, setCurrentRow] = useState<Currency | null>(null)

    return (
        <CurrenciesContext value={{ open, setOpen, currentRow, setCurrentRow, refetch }}>
            {children}
        </CurrenciesContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCurrencies = () => {
    const currenciesContext = React.useContext(CurrenciesContext)

    if (!currenciesContext) {
        throw new Error('useCurrencies has to be used within <CurrenciesContext>')
    }

    return currenciesContext
}
