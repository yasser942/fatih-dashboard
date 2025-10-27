import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { type Row } from '@tanstack/react-table'
import { type Order } from '../data/schema'
import { useOrders } from './orders-provider'

interface DataTableRowActionsProps {
    row: Row<Order>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const { setCurrentRow, setOpen } = useOrders()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">فتح القائمة</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => {
                        setCurrentRow(row.original)
                        setOpen('update')
                    }}
                >
                    <Pencil className="mr-2 h-4 w-4" />
                    تعديل
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => {
                        setCurrentRow(row.original)
                        setOpen('delete')
                    }}
                    className="text-red-600"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    حذف
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
