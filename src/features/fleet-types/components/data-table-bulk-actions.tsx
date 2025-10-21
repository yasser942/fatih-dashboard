import { Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type FleetType } from '../data/schema'

interface DataTableBulkActionsProps {
    table: Table<FleetType>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
    const selectedRows = table.getFilteredSelectedRowModel().rows

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
                {selectedRows.length} صف محدد
            </span>
            <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                    // TODO: Implement bulk delete
                    console.log('Bulk delete selected rows:', selectedRows.map(row => row.original))
                }}
            >
                <Trash2 className="h-4 w-4 mr-2" />
                حذف المحدد
            </Button>
        </div>
    )
}
