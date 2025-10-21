import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle } from 'lucide-react'
import { type FleetType } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const fleetTypesColumns: ColumnDef<FleetType>[] = [
    {
        accessorKey: 'type_en',
        header: 'النوع بالإنجليزية',
        cell: ({ row }) => <div className="font-medium">{row.getValue('type_en')}</div>,
    },
    {
        accessorKey: 'type_ar',
        header: 'النوع بالعربية',
        cell: ({ row }) => <div className="font-medium">{row.getValue('type_ar')}</div>,
    },
    {
        accessorKey: 'capacity',
        header: 'السعة',
        cell: ({ row }) => {
            const capacity = row.getValue('capacity') as number
            return <div className="text-sm">{capacity.toFixed(2)}</div>
        },
    },
    {
        accessorKey: 'status',
        header: 'الحالة',
        cell: ({ row }) => {
            const val = row.getValue('status') as string
            const isActive = val === 'Active'
            return (
                <div className="flex items-center">
                    {isActive ? (
                        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                            <CheckCircle className="mr-1 h-3 w-3" /> نشط
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">
                            <XCircle className="mr-1 h-3 w-3" /> غير نشط
                        </Badge>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: 'created_at',
        header: 'تاريخ الإنشاء',
        cell: ({ row }) => {
            const date = new Date(row.getValue('created_at') as string)
            return <div className="text-sm text-muted-foreground">{date.toLocaleDateString('en-US')}</div>
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
]
