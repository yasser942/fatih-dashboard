import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle } from 'lucide-react'
import { type Branch } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const branchesColumns: ColumnDef<Branch>[] = [
    {
        accessorKey: 'name',
        header: 'اسم الفرع',
        cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'location',
        header: 'الموقع',
        cell: ({ row }) => {
            const loc = row.getValue('location') as { id: number; Location_Pcode?: string; country_ar?: string } | null
            return (
                <div className="text-sm">
                    {loc ? `${loc.Location_Pcode ?? ''} ${loc.country_ar ? `- ${loc.country_ar}` : ''}`.trim() : '—'}
                </div>
            )
        },
    },
    {
        accessorKey: 'full_address',
        header: 'العنوان',
        cell: ({ row }) => <div className="truncate max-w-[260px]">{row.getValue('full_address') as string}</div>,
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


