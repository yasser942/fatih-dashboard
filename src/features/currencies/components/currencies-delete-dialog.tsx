import { useMutation } from '@apollo/client/react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useCurrencies } from './currencies-provider'
import { DELETE_CURRENCY_MUTATION } from '../graphql/mutations'
import { CURRENCIES_QUERY } from '../graphql/queries'

export function CurrenciesDeleteDialog() {
    const { open, setOpen, currentRow, setCurrentRow, refetch } = useCurrencies()

    const [deleteCurrency, { loading }] = useMutation(DELETE_CURRENCY_MUTATION, {
        refetchQueries: [CURRENCIES_QUERY],
        onCompleted: () => {
            setOpen(null)
            setCurrentRow(null)
            refetch?.()
        },
    })

    const handleDelete = async () => {
        if (!currentRow) return

        try {
            await deleteCurrency({
                variables: {
                    id: currentRow.id,
                },
            })
        } catch (error) {
            console.error('Error deleting currency:', error)
        }
    }

    return (
        <AlertDialog open={open === 'delete'} onOpenChange={() => setOpen(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                    <AlertDialogDescription>
                        هل أنت متأكد من حذف العملة "{currentRow?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {loading ? 'جاري الحذف...' : 'حذف'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
