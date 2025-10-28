import { ColumnDef } from '@tanstack/react-table'
import { type Department } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const departmentsColumns: ColumnDef<Department>[] = [
    {
        accessorKey: 'name',
        header: 'اسم القسم',
        cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
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
        accessorKey: 'manager',
        header: 'المدير',
        cell: ({ row }) => {
            const manager = row.original.manager
            return (
                <div className="text-sm">
                    {manager?.user?.name || 'لا يوجد'}
                </div>
            )
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




