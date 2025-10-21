import { FleetTypesMutateDrawer } from './fleet-types-mutate-drawer'
import { FleetTypesDeleteDialog } from './fleet-types-delete-dialog'

export function FleetTypesDialogs() {
    return (
        <>
            <FleetTypesMutateDrawer />
            <FleetTypesDeleteDialog />
        </>
    )
}
