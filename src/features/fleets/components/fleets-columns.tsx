import { type ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { type Fleet, fleetStatusValues } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

const getStatusTranslation = (status: string) => {
    const translations: Record<string, string> = {
        Available: 'متاح',
        InService: 'في الخدمة',
        UnderMaintenance: 'تحت الصيانة',
        OutOfService: 'خارج الخدمة',
    }
    return translations[status] || status
}

export const fleetsColumns: ColumnDef<Fleet>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="تحديد الكل"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="تحديد الصف"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'plate_number',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="h-8 px-2 lg:px-3"
                >
                    رقم اللوحة
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="font-medium">{row.getValue('plate_number')}</div>,
    },
    {
        accessorKey: 'fleetType',
        header: 'نوع المركبة',
        cell: ({ row }) => {
            const fleetType = row.original.fleetType
            return <div>{fleetType?.type_ar || fleetType?.type_en || 'غير محدد'}</div>
        },
    },
    {
        accessorKey: 'user',
        header: 'المستخدم',
        cell: ({ row }) => {
            const user = row.original.user
            return <div>{user?.name || 'غير مخصص'}</div>
        },
    },
    {
        accessorKey: 'status',
        header: 'الحالة',
        cell: ({ row }) => {
            const status = row.getValue('status') as string
            return <div>{getStatusTranslation(status)}</div>
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
]
