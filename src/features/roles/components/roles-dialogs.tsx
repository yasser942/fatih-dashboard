import { useRoles } from './roles-provider'
import { RolesMutateDrawer } from './roles-mutate-drawer'
import { RolesDeleteDialog } from './roles-delete-dialog'

export function RolesDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useRoles()

    return (
        <>
            <RolesMutateDrawer
                key='role-create'
                open={open === 'create'}
                onOpenChange={() => setOpen('create')}
            />

            {currentRow && (
                <>
                    <RolesMutateDrawer
                        key={`role-update-${currentRow.id}`}
                        open={open === 'update'}
                        onOpenChange={() => {
                            setOpen('update')
                            setTimeout(() => {
                                setCurrentRow(null)
                            }, 500)
                        }}
                        currentRow={currentRow}
                    />

                    <RolesDeleteDialog
                        key='role-delete'
                        open={open === 'delete'}
                        onOpenChange={() => {
                            setOpen('delete')
                            setTimeout(() => {
                                setCurrentRow(null)
                            }, 500)
                        }}
                        currentRow={currentRow}
                    />
                </>
            )}
        </>
    )
}
