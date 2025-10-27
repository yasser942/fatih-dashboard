import { useState } from 'react'
import { Trash2, FileDown, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { type Table } from '@tanstack/react-table'
import { type Order } from '../data/schema'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { OrdersBulkStatusUpdateDialog } from './orders-bulk-status-update-dialog'
import { OrdersBulkDeleteDialog } from './orders-bulk-delete-dialog'

interface DataTableBulkActionsProps {
    table: Table<Order>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [showStatusDialog, setShowStatusDialog] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState<{ status: string; label: string } | null>(null)
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleBulkStatusUpdate = (status: string, label: string) => {
        setSelectedStatus({ status, label })
        setShowStatusDialog(true)
    }

    const handleExportSelected = () => {
        const data = selectedRows.map((row) => row.original)

        // Create CSV content
        const headers = ['QR Code', 'Status', 'Sender', 'Receiver', 'Source Branch', 'Target Branch', 'Shipping Fees', 'COD', 'Created At']
        const csvContent = [
            headers.join(','),
            ...data.map((order) =>
                [
                    order.qr_code,
                    order.status,
                    order.sender?.name || '',
                    order.receiver?.name || '',
                    order.branchSource?.name || '',
                    order.branchTarget?.name || '',
                    order.shipping_fees,
                    order.cash_on_delivery,
                    order.created_at,
                ].join(',')
            ),
        ].join('\n')

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast.success(`تم تصدير ${selectedRows.length} شحنة بنجاح!`)
    }

    return (
        <>
            <BulkActionsToolbar table={table} entityName="شحنة">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            تحديث الحالة
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>تغيير الحالة إلى</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleBulkStatusUpdate('registered', 'مسجل')}>
                            مسجل
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkStatusUpdate('received', 'مستلم')}>
                            مستلم
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkStatusUpdate('transfer', 'قيد النقل')}>
                            قيد النقل
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkStatusUpdate('delivered', 'تم التسليم')}>
                            تم التسليم
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkStatusUpdate('canceled', 'ملغي')}>
                            ملغي
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportSelected}
                    disabled={selectedRows.length === 0}
                    className="h-8"
                >
                    <FileDown className="mr-2 h-4 w-4" />
                    تصدير
                </Button>

                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={selectedRows.length === 0}
                    className="h-8"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    حذف
                </Button>
            </BulkActionsToolbar>

            {/* Status Update Confirmation Dialog */}
            {selectedStatus && (
                <OrdersBulkStatusUpdateDialog
                    open={showStatusDialog}
                    onOpenChange={setShowStatusDialog}
                    table={table}
                    status={selectedStatus.status}
                    statusLabel={selectedStatus.label}
                />
            )}

            {/* Delete Confirmation Dialog */}
            <OrdersBulkDeleteDialog
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
                table={table}
            />
        </>
    )
}