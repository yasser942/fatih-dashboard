import { Row } from '@tanstack/react-table'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useEmployees } from './employees-provider'
import { type Employee } from '../data/schema'

interface DataTableRowActionsProps {
    row: Row<Employee>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const { setOpen, setCurrentRow } = useEmployees()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                    <span className="sr-only">فتح القائمة</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation()
                        setCurrentRow(row.original)
                        setOpen('update')
                    }}
                >
                    <Edit className="mr-2 h-4 w-4" />
                    تعديل
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation()
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




