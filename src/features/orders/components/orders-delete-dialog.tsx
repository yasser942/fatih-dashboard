import { useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { useOrders } from './orders-provider'
import { DELETE_ORDER_MUTATION } from '../graphql/mutations'
import { ORDERS_QUERY } from '../graphql/queries'

export function OrdersDeleteDialog() {
    const { open, setOpen, currentRow, setCurrentRow, refetch } = useOrders()

    const [deleteOrder, { loading }] = useMutation(DELETE_ORDER_MUTATION, {
        refetchQueries: [ORDERS_QUERY],
        onCompleted: () => {
            toast.success('تم حذف الشحنة بنجاح!')
            handleClose()
            refetch?.()
        },
        onError: (error: any) => {
            console.error('Delete order error:', error)
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                toast.error(error.graphQLErrors[0].message)
            } else {
                toast.error('فشل في حذف الشحنة')
            }
        },
    })

    const handleClose = () => {
        setCurrentRow(null)
        setOpen(null)
    }

    const handleDelete = async () => {
        if (currentRow) {
            await deleteOrder({ variables: { id: currentRow.id } })
        }
    }

    return (
        <AlertDialog open={open === 'delete'} onOpenChange={handleClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                    <AlertDialogDescription>
                        هل أنت متأكد من أنك تريد حذف هذا الشحنة؟ هذا الإجراء لا يمكن التراجع عنه.
                        {currentRow && (
                            <div className="mt-2 p-2 bg-muted rounded">
                                <strong>رمز QR:</strong> {currentRow.qr_code}
                            </div>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={loading}>
                        {loading ? 'جاري الحذف...' : 'حذف'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
