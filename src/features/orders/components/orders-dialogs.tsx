import { OrdersMutateDrawer } from './orders-mutate-drawer'
import { OrdersDeleteDialog } from './orders-delete-dialog'
import { OrdersMultiDeleteDialog } from './orders-multi-delete-dialog'

export function OrdersDialogs() {
    return (
        <>
            <OrdersMutateDrawer />
            <OrdersDeleteDialog />
            <OrdersMultiDeleteDialog />
        </>
    )
}
