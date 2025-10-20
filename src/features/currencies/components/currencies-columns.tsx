import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, MoreHorizontal } from 'lucide-react'
import { type Currency } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const currenciesColumns: ColumnDef<Currency>[] = [
    {
        accessorKey: 'name',
        header: 'اسم العملة',
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue('name')}</div>
        ),
    },
    {
        accessorKey: 'symbol',
        header: 'الرمز',
        cell: ({ row }) => (
            <div className="text-sm">{row.getValue('symbol')}</div>
        ),
    },
    {
        accessorKey: 'code',
        header: 'الكود',
        cell: ({ row }) => (
            <Badge variant="secondary" className="font-mono">
                {row.getValue('code')}
            </Badge>
        ),
    },
    {
        accessorKey: 'is_active',
        header: 'الحالة',
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


