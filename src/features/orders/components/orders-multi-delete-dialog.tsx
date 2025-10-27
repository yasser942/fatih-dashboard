import { useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { useOrders } from './orders-provider'
import { BULK_DELETE_ORDERS_MUTATION } from '../graphql/mutations'
import { ORDERS_QUERY } from '../graphql/queries'

export function OrdersMultiDeleteDialog() {
    const { open, setOpen, refetch } = useOrders()

    const [bulkDeleteOrders, { loading }] = useMutation(BULK_DELETE_ORDERS_MUTATION, {
        refetchQueries: [ORDERS_QUERY],
        onCompleted: () => {
            toast.success('تم حذف الشحنات المحددة بنجاح!')
            handleClose()
            refetch?.()
        },
        onError: (error: any) => {
            console.error('Bulk delete orders error:', error)
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                toast.error(error.graphQLErrors[0].message)
            } else {
                toast.error('فشل في حذف الشحنات المحددة')
            }
        },
    })

    const handleClose = () => {
        setOpen(null)
    }

    const handleBulkDelete = async () => {
        // This will be called from the bulk actions component with the selected IDs
        // For now, we'll just close the dialog
        handleClose()
    }

    return (
        <AlertDialog open={open === 'bulk-delete'} onOpenChange={handleClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>تأكيد الحذف الجماعي</AlertDialogTitle>
                    <AlertDialogDescription>
                        هل أنت متأكد من أنك تريد حذف الشحنات المحددة؟ هذا الإجراء لا يمكن التراجع عنه.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBulkDelete} disabled={loading}>
                        {loading ? 'جاري الحذف...' : 'حذف المحدد'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
