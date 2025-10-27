import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
import { type Table } from '@tanstack/react-table'
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
import { BULK_DELETE_ORDERS_MUTATION } from '../graphql/mutations'
import { ORDERS_QUERY } from '../graphql/queries'
import { type Order } from '../data/schema'

interface OrdersBulkDeleteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    table: Table<Order>
}

export function OrdersBulkDeleteDialog({
    open,
    onOpenChange,
    table,
}: OrdersBulkDeleteDialogProps) {
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const [bulkDeleteOrders, { loading }] = useMutation(BULK_DELETE_ORDERS_MUTATION, {
        refetchQueries: [ORDERS_QUERY],
        onCompleted: () => {
            toast.success(`تم حذف ${selectedRows.length} شحنة بنجاح!`)
            table.resetRowSelection()
            onOpenChange(false)
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

    const handleBulkDelete = async () => {
        const ids = selectedRows.map((row) => row.original.id.toString())
        await bulkDeleteOrders({ variables: { ids } })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>تأكيد الحذف الجماعي</AlertDialogTitle>
                    <AlertDialogDescription>
                        هل أنت متأكد من أنك تريد حذف {selectedRows.length} شحنة؟ هذا الإجراء لا يمكن التراجع عنه.
                        <br />
                        <br />
                        <strong>الشحنات المحددة:</strong>
                        <div className="mt-2 space-y-1">
                            {selectedRows.slice(0, 5).map((row) => (
                                <div key={row.original.id} className="text-sm">
                                    • {row.original.qr_code} - {row.original.status}
                                </div>
                            ))}
                            {selectedRows.length > 5 && (
                                <div className="text-sm text-muted-foreground">
                                    • و {selectedRows.length - 5} شحنة آخر...
                                </div>
                            )}
                        </div>
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
