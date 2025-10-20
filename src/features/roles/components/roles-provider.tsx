import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Role } from '../data/schema'

type RolesDialogType = 'create' | 'update' | 'delete' | 'permissions'

type RolesContextType = {
    open: RolesDialogType | null
    setOpen: (str: RolesDialogType | null) => void
    currentRow: Role | null
    setCurrentRow: React.Dispatch<React.SetStateAction<Role | null>>
    refetch?: () => void
}

const RolesContext = React.createContext<RolesContextType | null>(null)

export function RolesProvider({ children, refetch }: { children: React.ReactNode; refetch?: () => void }) {
    const [open, setOpen] = useDialogState<RolesDialogType>(null)
    const [currentRow, setCurrentRow] = useState<Role | null>(null)

    return (
        <RolesContext value={{ open, setOpen, currentRow, setCurrentRow, refetch }}>
            {children}
        </RolesContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRoles = () => {
    const rolesContext = React.useContext(RolesContext)

    if (!rolesContext) {
        throw new Error('useRoles has to be used within <RolesContext>')
    }

    return rolesContext
}
