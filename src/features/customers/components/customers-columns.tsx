import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, User, Building } from 'lucide-react'
import { type Customer } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const customersColumns: ColumnDef<Customer>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <input
                type="checkbox"
                checked={table.getIsAllPageRowsSelected()}
                onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
                className="rounded border-gray-300"
            />
        ),
        cell: ({ row }) => (
            <input
                type="checkbox"
                checked={row.getIsSelected()}
                onChange={(e) => row.toggleSelected(!!e.target.checked)}
                className="rounded border-gray-300"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'customer_type',
        header: 'نوع العميل',
        cell: ({ row }) => {
            const type = row.getValue('customer_type') as string
            const isIndividual = type === 'Individual'
            return (
                <div className="flex items-center">
                    {isIndividual ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <User className="mr-1 h-3 w-3" /> فرد
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            <Building className="mr-1 h-3 w-3" /> شركة
                        </Badge>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: 'market_name',
        header: 'اسم المتجر',
        cell: ({ row }) => {
            const marketName = row.getValue('market_name') as string | null
            return <div className="font-medium">{marketName || '—'}</div>
        },
    },
    {
        accessorKey: 'user',
        header: 'المستخدم',
        cell: ({ row }) => {
            const user = row.getValue('user') as { id: number; name: string; email: string } | null
            return (
                <div className="text-sm">
                    <div className="font-medium">{user?.name || '—'}</div>
                    <div className="text-muted-foreground">{user?.email || ''}</div>
                </div>
            )
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
