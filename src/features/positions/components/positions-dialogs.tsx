import { PositionsMutateDrawer } from './positions-mutate-drawer'
import { PositionsDeleteDialog } from './positions-delete-dialog'
import { PositionsMultiDeleteDialog } from './positions-multi-delete-dialog'

export function PositionsDialogs() {
    return (
        <>
            <PositionsMutateDrawer />
            <PositionsDeleteDialog />
            <PositionsMultiDeleteDialog />
        </>
    )
}




