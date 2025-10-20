import React, { useState } from 'react'
import { type LocationMaster } from '../data/schema'

type LocationMastersDialogType = 'create' | 'update' | 'delete'

type LocationMastersContextType = {
    open: LocationMastersDialogType | null
    setOpen: (str: LocationMastersDialogType | null) => void
    currentRow: LocationMaster | null
    setCurrentRow: React.Dispatch<React.SetStateAction<LocationMaster | null>>
    refetch?: () => void
}

const LocationMastersContext = React.createContext<LocationMastersContextType | null>(null)

export function LocationMastersProvider({ children, refetch }: { children: React.ReactNode; refetch?: () => void }) {
    const [open, setOpen] = useState<LocationMastersDialogType | null>(null)
    const [currentRow, setCurrentRow] = useState<LocationMaster | null>(null)

    return (
        <LocationMastersContext.Provider
            value={{
                open,
                setOpen,
                currentRow,
                setCurrentRow,
                refetch,
            }}
        >
            {children}
        </LocationMastersContext.Provider>
    )
}

export function useLocationMasters() {
    const context = React.useContext(LocationMastersContext)
    if (!context) {
        throw new Error('useLocationMasters must be used within a LocationMastersProvider')
    }
    return context
}


