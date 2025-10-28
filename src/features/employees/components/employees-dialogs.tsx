import { EmployeesMutateDrawer } from './employees-mutate-drawer'
import { EmployeesDeleteDialog } from './employees-delete-dialog'
import { EmployeesMultiDeleteDialog } from './employees-multi-delete-dialog'

export function EmployeesDialogs() {
    return (
        <>
            <EmployeesMutateDrawer />
            <EmployeesDeleteDialog />
            <EmployeesMultiDeleteDialog />
        </>
    )
}




