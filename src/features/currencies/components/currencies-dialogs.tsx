import { CurrenciesMutateDrawer } from './currencies-mutate-drawer'
import { CurrenciesDeleteDialog } from './currencies-delete-dialog'

export function CurrenciesDialogs() {
    return (
        <>
            <CurrenciesMutateDrawer />
            <CurrenciesDeleteDialog />
        </>
    )
}

