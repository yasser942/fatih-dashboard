import { type Row } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useCustomers } from './customers-provider'
import { type Customer } from '../data/schema'

interface DataTableRowActionsProps {
    row: Row<Customer>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const { setCurrentRow, setOpen } = useCustomers()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">فتح القائمة</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem
                    onClick={() => {
                        setCurrentRow(row.original)
                        setOpen('update')
                    }}
                >
                    تعديل
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => {
                        setCurrentRow(row.original)
                        setOpen('delete')
                    }}
                >
                    حذف
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

