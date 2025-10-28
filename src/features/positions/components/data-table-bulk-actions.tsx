import { Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { type Position } from '../data/schema'
import { PositionsMultiDeleteDialog } from './positions-multi-delete-dialog'

interface DataTableBulkActionsProps {
    table: Table<Position>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const handleDeleteSuccess = () => {
        table.resetRowSelection()
    }

    return (
        <>
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{selectedRows.length} من العناصر المحددة</span>
                <Button variant="outline" size="sm" className="h-8" onClick={() => setShowDeleteDialog(true)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    حذف
                </Button>
            </div>
            <PositionsMultiDeleteDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                selectedIds={selectedRows.map((row) => row.original.id)}
                onSuccess={handleDeleteSuccess}
            />
        </>
    )
}




