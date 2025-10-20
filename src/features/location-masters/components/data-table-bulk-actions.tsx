import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface DataTableBulkActionsProps<TData> {
    table: Table<TData>
}

export function DataTableBulkActions<TData>({ table }: DataTableBulkActionsProps<TData>) {
    const selectedRows = table.getFilteredSelectedRowModel().rows

    if (selectedRows.length === 0) {
        return null
    }

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => {
                    // Handle bulk delete
                    console.log('Bulk delete selected rows:', selectedRows)
                }}
            >
                <Trash2 className="mr-2 h-4 w-4" />
                حذف المحدد ({selectedRows.length})
            </Button>
        </div>
    )
}


