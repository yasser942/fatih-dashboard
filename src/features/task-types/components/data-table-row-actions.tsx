import { Row } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type TaskType } from '../data/schema'
import { useTaskTypes } from './task-types-provider'

interface DataTableRowActionsProps {
    row: Row<TaskType>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const taskType = row.original
    const { setCurrentRow, setOpen } = useTaskTypes()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={(e) => e.stopPropagation()}
                >
                    <span className="sr-only">فتح القائمة</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation()
                        setCurrentRow(taskType)
                        setOpen('update')
                    }}
                >
                    تعديل
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation()
                        setCurrentRow(taskType)
                        setOpen('delete')
                    }}
                    className="text-red-600"
                >
                    حذف
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

