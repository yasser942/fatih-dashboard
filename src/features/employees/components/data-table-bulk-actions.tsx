import { Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { type Employee } from '../data/schema'
import { EmployeesMultiDeleteDialog } from './employees-multi-delete-dialog'

interface DataTableBulkActionsProps {
    table: Table<Employee>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const handleDeleteSuccess = () => {
        table.resetRowSelection()
    }

    const selectedIds = selectedRows.map((row) => row.original.id)

    return (
        <>
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{selectedRows.length} من العناصر المحددة</span>
                <Button variant="outline" size="sm" className="h-8" onClick={() => setShowDeleteDialog(true)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    حذف
                </Button>
            </div>
            <EmployeesMultiDeleteDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                selectedIds={selectedIds}
                onSuccess={handleDeleteSuccess}
            />
        </>
    )
}

