import { CustomersMutateDrawer } from './customers-mutate-drawer'
import { CustomersDeleteDialog } from './customers-delete-dialog'

export function CustomersDialogs() {
    return (
        <>
            <CustomersMutateDrawer />
            <CustomersDeleteDialog />
        </>
    )
}
