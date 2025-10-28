import { ColumnDef } from '@tanstack/react-table'
import { type Position } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const positionsColumns: ColumnDef<Position>[] = [
    {
        accessorKey: 'title',
        header: 'عنوان الوظيفة',
        cell: ({ row }) => <div className="font-medium">{row.getValue('title')}</div>,
    },
    {
        accessorKey: 'description',
        header: 'الوصف',
        cell: ({ row }) => {
            const description = row.getValue('description') as string | null
            return (
                <div className="max-w-[300px] truncate text-sm text-muted-foreground">
                    {description || 'لا يوجد'}
                </div>
            )
        },
    },
    {
        accessorKey: 'department',
        header: 'القسم',
        cell: ({ row }) => {
            const department = row.original.department
            return <div className="text-sm">{department?.name || 'لا يوجد'}</div>
        },
    },
    {
        accessorKey: 'created_at',
        header: 'تاريخ الإنشاء',
        cell: ({ row }) => {
            const date = new Date(row.getValue('created_at'))
            return <div className="text-sm text-muted-foreground">{date.toLocaleDateString('en-US')}</div>
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
]




