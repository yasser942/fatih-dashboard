import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { type Table } from '@tanstack/react-table'
import { toast } from 'sonner'
import { Trash2, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { type Branch } from '../data/schema'
import { BULK_DELETE_BRANCHES_MUTATION, BULK_UPDATE_BRANCHES_STATUS_MUTATION } from '../graphql/mutations'
import { BRANCHES_PAGINATED_QUERY } from '../graphql/queries'
import { useBranches } from './branches-provider'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'

interface DataTableBulkActionsProps {
    table: Table<Branch>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState<{ status: 'Active' | 'Inactive'; label: string } | null>(null)
    const { refetch } = useBranches()

    const selectedRows = table.getFilteredSelectedRowModel().rows
    const selectedIds = selectedRows.map((row) => row.original.id)

    const [bulkDelete, { loading: deleteLoading }] = useMutation(BULK_DELETE_BRANCHES_MUTATION, {
        refetchQueries: [BRANCHES_PAGINATED_QUERY],
        onCompleted: (data) => {
            toast.success(`تم حذف ${data.bulkDeleteBranches} فرع بنجاح`)
            table.resetRowSelection()
            refetch?.()
            setShowDeleteDialog(false)
        },
        onError: (error) => {
            toast.error(`فشل في حذف الفروع: ${error.message}`)
        },
    })

    const [bulkUpdateStatus, { loading: updateLoading }] = useMutation(BULK_UPDATE_BRANCHES_STATUS_MUTATION, {
        refetchQueries: [BRANCHES_PAGINATED_QUERY],
        onCompleted: (data) => {
            toast.success(`تم تحديث حالة ${data.bulkUpdateBranchesStatus} فرع بنجاح`)
            table.resetRowSelection()
            refetch?.()
        },
        onError: (error) => {
            toast.error(`فشل في تحديث حالة الفروع: ${error.message}`)
        },
    })

    const handleBulkDelete = async () => {
        await bulkDelete({ variables: { ids: selectedIds } })
    }

    const handleBulkStatusUpdate = (status: 'Active' | 'Inactive', label: string) => {
        setSelectedStatus({ status, label })
    }

    const confirmStatusUpdate = async () => {
        if (!selectedStatus) return
        await bulkUpdateStatus({ variables: { ids: selectedIds, status: selectedStatus.status } })
        setSelectedStatus(null)
    }

    return (
        <>
            <BulkActionsToolbar table={table} entityName="فرع">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8" disabled={updateLoading || deleteLoading}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            تحديث الحالة
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>تغيير الحالة إلى</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleBulkStatusUpdate('Active', 'نشط')}>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                            نشط
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkStatusUpdate('Inactive', 'غير نشط')}>
                            <XCircle className="mr-2 h-4 w-4 text-red-600" />
                            غير نشط
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDeleteDialog(true)}
                    disabled={selectedRows.length === 0 || deleteLoading}
                    className="h-8"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    حذف
                </Button>
            </BulkActionsToolbar>

            {/* Status Update Confirmation Dialog */}
            <AlertDialog open={!!selectedStatus} onOpenChange={() => setSelectedStatus(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>تأكيد تحديث الحالة</AlertDialogTitle>
                        <AlertDialogDescription>
                            هل أنت متأكد من تحديث حالة {selectedRows.length} {selectedRows.length === 1 ? 'فرع' : 'فروع'} إلى "{selectedStatus?.label}"؟
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmStatusUpdate}
                            disabled={updateLoading}
                        >
                            {updateLoading ? 'جاري التحديث...' : 'تحديث'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>تأكيد الحذف الجماعي</AlertDialogTitle>
                        <AlertDialogDescription>
                            هل أنت متأكد من حذف {selectedRows.length} {selectedRows.length === 1 ? 'فرع' : 'فروع'}؟ هذا
                            الإجراء لا يمكن التراجع عنه.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleBulkDelete}
                            disabled={deleteLoading}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleteLoading ? 'جاري الحذف...' : 'حذف'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

