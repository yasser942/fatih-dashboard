import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { type Employee } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const employeesColumns: ColumnDef<Employee>[] = [
    {
        accessorKey: 'user',
        header: 'الموظف',
        cell: ({ row }) => {
            const user = row.original.user
            return (
                <div>
                    <div className="font-medium">{user?.name || 'غير معروف'}</div>
                    <div className="text-xs text-muted-foreground">{user?.email}</div>
                </div>
            )
        },
    },
    {
        accessorKey: 'position',
        header: 'الوظيفة',
        cell: ({ row }) => {
            const position = row.original.position
            return <div className="text-sm">{position?.title || 'لا يوجد'}</div>
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
        accessorKey: 'branch',
        header: 'الفرع',
        cell: ({ row }) => {
            const branch = row.original.branch
            return <div className="text-sm">{branch?.name || 'لا يوجد'}</div>
        },
    },
    {
        accessorKey: 'status',
        header: 'الحالة',
        cell: ({ row }) => {
            const status = row.getValue('status') as string
            const statusLabels: Record<string, string> = {
                active: 'نشط',
                inactive: 'غير نشط',
                on_leave: 'في إجازة',
                terminated: 'منهي',
            }
            const statusColors: Record<string, string> = {
                active: 'bg-green-100 text-green-800',
                inactive: 'bg-gray-100 text-gray-800',
                on_leave: 'bg-yellow-100 text-yellow-800',
                terminated: 'bg-red-100 text-red-800',
            }
            return (
                <Badge className={statusColors[status] || ''} variant="secondary">
                    {statusLabels[status] || status}
                </Badge>
            )
        },
    },
    {
        accessorKey: 'contract_type',
        header: 'نوع العقد',
        cell: ({ row }) => {
            const contractType = row.getValue('contract_type') as string
            const contractLabels: Record<string, string> = {
                full_time: 'دوام كامل',
                part_time: 'دوام جزئي',
                intern: 'متدرب',
                contract: 'عقد',
            }
            return <div className="text-sm">{contractLabels[contractType] || contractType}</div>
        },
    },
    {
        accessorKey: 'hired_date',
        header: 'تاريخ التوظيف',
        cell: ({ row }) => {
            const date = new Date(row.getValue('hired_date'))
            return <div className="text-sm text-muted-foreground">{date.toLocaleDateString('en-US')}</div>
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
]




