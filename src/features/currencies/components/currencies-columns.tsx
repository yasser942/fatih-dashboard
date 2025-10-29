import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { CheckCircle, XCircle } from 'lucide-react'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { type Currency } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const currenciesColumns: ColumnDef<Currency>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="تحديد الكل"
                onClick={(e) => e.stopPropagation()}
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="تحديد الصف"
                onClick={(e) => e.stopPropagation()}
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="اسم العملة" />
        ),
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue('name')}</div>
        ),
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: 'symbol',
        header: 'الرمز',
        cell: ({ row }) => (
            <div className="text-sm">{row.getValue('symbol')}</div>
        ),
        enableSorting: false,
    },
    {
        accessorKey: 'code',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="الكود" />
        ),
        cell: ({ row }) => (
            <Badge variant="secondary" className="font-mono">
                {row.getValue('code')}
            </Badge>
        ),
        enableSorting: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: 'is_active',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="الحالة" />
        ),
        cell: ({ row }) => {
            const isActive = row.getValue('is_active') as boolean
            return (
                <div className="flex items-center">
                    {isActive ? (
                        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            نشط
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">
                            <XCircle className="mr-1 h-3 w-3" />
                            غير نشط
                        </Badge>
                    )}
                </div>
            )
        },
        enableSorting: true,
        filterFn: (row, id, value) => {
            return value.includes(String(row.getValue(id)))
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
]


