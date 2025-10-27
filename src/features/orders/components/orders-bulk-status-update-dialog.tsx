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
import { BULK_UPDATE_ORDERS_STATUS_MUTATION } from '../graphql/mutations'
import { ORDERS_QUERY } from '../graphql/queries'
import { type Order } from '../data/schema'

interface OrdersBulkStatusUpdateDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    table: Table<Order>
    status: string
    statusLabel: string
}

export function OrdersBulkStatusUpdateDialog({
    open,
    onOpenChange,
    table,
    status,
    statusLabel,
}: OrdersBulkStatusUpdateDialogProps) {
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const [bulkUpdateOrdersStatus, { loading }] = useMutation(BULK_UPDATE_ORDERS_STATUS_MUTATION, {
        refetchQueries: [ORDERS_QUERY],
        onCompleted: () => {
            toast.success(`تم تحديث حالة ${selectedRows.length} شحنة إلى "${statusLabel}" بنجاح!`)
            table.resetRowSelection()
            onOpenChange(false)
        },
        onError: (error: any) => {
            console.error('Bulk update orders status error:', error)
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                toast.error(error.graphQLErrors[0].message)
            } else {
                toast.error('فشل في تحديث حالة الشحنات المحددة')
            }
        },
    })

    const handleBulkStatusUpdate = async () => {
        const ids = selectedRows.map((row) => row.original.id.toString())
        await bulkUpdateOrdersStatus({
            variables: {
                ids,
                status
            }
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>تأكيد تحديث الحالة</AlertDialogTitle>
                    <AlertDialogDescription>
                        هل أنت متأكد من أنك تريد تحديث حالة {selectedRows.length} شحنة إلى "{statusLabel}"؟
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
                    <AlertDialogAction onClick={handleBulkStatusUpdate} disabled={loading}>
                        {loading ? 'جاري التحديث...' : `تحديث إلى ${statusLabel}`}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
