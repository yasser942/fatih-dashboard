import React, { useState } from 'react'
import { type FleetType } from '../data/schema'

type FleetTypesDialogType = 'create' | 'update' | 'delete'

type FleetTypesContextType = {
    open: FleetTypesDialogType | null
    setOpen: (str: FleetTypesDialogType | null) => void
    currentRow: FleetType | null
    setCurrentRow: React.Dispatch<React.SetStateAction<FleetType | null>>
    refetch?: () => void
}

const FleetTypesContext = React.createContext<FleetTypesContextType | null>(null)

export function FleetTypesProvider({ children, refetch }: { children: React.ReactNode; refetch?: () => void }) {
    const [open, setOpen] = useState<FleetTypesDialogType | null>(null)
    const [currentRow, setCurrentRow] = useState<FleetType | null>(null)

    return (
        <FleetTypesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow, refetch }}>
            {children}
        </FleetTypesContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFleetTypes = () => {
    const fleetTypesContext = React.useContext(FleetTypesContext)

    if (!fleetTypesContext) {
        throw new Error('useFleetTypes has to be used within <FleetTypesContext>')
    }

    return fleetTypesContext
}
