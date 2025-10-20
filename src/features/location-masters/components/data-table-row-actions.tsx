import { type Row } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash } from 'lucide-react'
import { useLocationMasters } from './location-masters-provider'
import { type LocationMaster } from '../data/schema'

interface DataTableRowActionsProps {
    row: Row<LocationMaster>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const { setOpen, setCurrentRow } = useLocationMasters()

    const handleEdit = () => {
        setCurrentRow(row.original)
        setOpen('update')
    }

    const handleDelete = () => {
        setCurrentRow(row.original)
        setOpen('delete')
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                        e.stopPropagation()
                    }}
                >
                    <span className="sr-only">فتح القائمة</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation()
                    handleEdit()
                }}>
                    <Pencil className="mr-2 h-4 w-4" />
                    تعديل
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation()
                    handleDelete()
                }}>
                    <Trash className="mr-2 h-4 w-4" />
                    حذف
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
