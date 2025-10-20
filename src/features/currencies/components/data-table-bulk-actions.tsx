import { Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type Currency } from '../data/schema'

interface DataTableBulkActionsProps {
    table: Table<Currency>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
    const selectedRows = table.getFilteredSelectedRowModel().rows

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
                {selectedRows.length} من العناصر المحددة
            </span>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                        <Trash2 className="mr-2 h-4 w-4" />
                        حذف
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={() => {
                            // TODO: Implement bulk delete
                            console.log('Bulk delete selected currencies:', selectedRows.map(row => row.original.id))
                        }}
                        className="text-red-600"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        حذف المحدد
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}


