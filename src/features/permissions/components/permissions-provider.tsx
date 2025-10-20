import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Permission } from '../data/schema'

type PermissionsDialogType = 'create' | 'update' | 'delete'

type PermissionsContextType = {
    open: PermissionsDialogType | null
    setOpen: (str: PermissionsDialogType | null) => void
    currentRow: Permission | null
    setCurrentRow: React.Dispatch<React.SetStateAction<Permission | null>>
    refetch?: () => void
}

const PermissionsContext = React.createContext<PermissionsContextType | null>(null)

export function PermissionsProvider({ children, refetch }: { children: React.ReactNode; refetch?: () => void }) {
    const [open, setOpen] = useDialogState<PermissionsDialogType>(null)
    const [currentRow, setCurrentRow] = useState<Permission | null>(null)

    return (
        <PermissionsContext value={{ open, setOpen, currentRow, setCurrentRow, refetch }}>
            {children}
        </PermissionsContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePermissions = () => {
    const permissionsContext = React.useContext(PermissionsContext)

    if (!permissionsContext) {
        throw new Error('usePermissions has to be used within <PermissionsContext>')
    }

    return permissionsContext
}
