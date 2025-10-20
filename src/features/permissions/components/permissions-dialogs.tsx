import { usePermissions } from './permissions-provider'
import { PermissionsMutateDrawer } from './permissions-mutate-drawer'
import { PermissionsDeleteDialog } from './permissions-delete-dialog'

export function PermissionsDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = usePermissions()

    return (
        <>
            <PermissionsMutateDrawer
                key='permission-create'
                open={open === 'create'}
                onOpenChange={() => setOpen('create')}
            />

            {currentRow && (
                <>
                    <PermissionsMutateDrawer
                        key={`permission-update-${currentRow.id}`}
                        open={open === 'update'}
                        onOpenChange={() => {
                            setOpen('update')
                            setTimeout(() => {
                                setCurrentRow(null)
                            }, 500)
                        }}
                        currentRow={currentRow}
                    />

                    <PermissionsDeleteDialog
                        key='permission-delete'
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
