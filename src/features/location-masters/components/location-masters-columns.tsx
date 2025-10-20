import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react'
import { type LocationMaster } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<LocationMaster>[] = [
    {
        accessorKey: 'Location_Pcode',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    كود الموقع
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: 'location_type',
        header: 'نوع الموقع',
        cell: ({ row }) => {
            const type = row.getValue('location_type') as string
            const typeLabels = {
                Community: 'مجتمع',
                Camp: 'مخيم',
                Neighbourhood: 'حي',
            }
            return <span>{typeLabels[type as keyof typeof typeLabels] || type}</span>
        },
    },
    {
        accessorKey: 'country_ar',
        header: 'البلد',
    },
    {
        accessorKey: 'governorate_ar',
        header: 'المحافظة',
    },
    {
        accessorKey: 'district_ar',
        header: 'المنطقة',
    },
    {
        accessorKey: 'village_town_ar',
        header: 'القرية/المدينة',
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
            return date.toLocaleDateString('en-US')
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
]
