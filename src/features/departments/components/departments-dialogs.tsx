import { DepartmentsMutateDrawer } from './departments-mutate-drawer'
import { DepartmentsDeleteDialog } from './departments-delete-dialog'
import { DepartmentsMultiDeleteDialog } from './departments-multi-delete-dialog'

export function DepartmentsDialogs() {
    return (
        <>
            <DepartmentsMutateDrawer />
            <DepartmentsDeleteDialog />
            <DepartmentsMultiDeleteDialog />
        </>
    )
}




