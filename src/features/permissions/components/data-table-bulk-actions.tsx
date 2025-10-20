import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { PermissionsMultiDeleteDialog } from './permissions-multi-delete-dialog'

interface DataTableBulkActionsProps<TData> {
    table: Table<TData>
}

export function DataTableBulkActions<TData>({
    table,
}: DataTableBulkActionsProps<TData>) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const selectedRows = table.getFilteredSelectedRowModel().rows

    return (
        <>
            <BulkActionsToolbar table={table} entityName='permission'>
                <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={selectedRows.length === 0}
                    className='h-8'
                >
                    <Trash2 className='mr-2 h-4 w-4' />
                    حذف
                </Button>
            </BulkActionsToolbar>

            <PermissionsMultiDeleteDialog
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
                table={table}
            />
        </>
    )
}
