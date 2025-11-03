import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
    User,
    Truck,
    Building,
    Package,
    CheckCircle2,
    XCircle,
    Clock,
    ArrowRight,
    ArrowUpDown,
    Calendar,
    FileText,
} from 'lucide-react'
import { type Task, type TaskStatus } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

const getStatusBadge = (status: TaskStatus) => {
    const statusConfig: Record<TaskStatus, { icon: React.ElementType; label: string; className: string }> = {
        'assigned': {
            icon: FileText,
            label: 'معين',
            className: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400',
        },
        'in_progress': {
            icon: Clock,
            label: 'قيد التنفيذ',
            className: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
        },
        'done': {
            icon: CheckCircle2,
            label: 'منجز',
            className: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:border-green-800 dark:bg-green-950 dark:text-green-400',
        },
        'cancelled': {
            icon: XCircle,
            label: 'ملغي',
            className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-400',
        },
        'failed': {
            icon: XCircle,
            label: 'فشل',
            className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-400',
        },
        'reassigned': {
            icon: ArrowRight,
            label: 'أعيد تعيينه',
            className: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-400',
        },
    }

    const config = statusConfig[status]
    if (!config) {
        return <Badge variant="outline">{status}</Badge>
    }

    const Icon = config.icon
    return (
        <Badge variant="outline" className={config.className}>
            <Icon className="mr-1.5 h-3.5 w-3.5" />
            {config.label}
        </Badge>
    )
}

export const tasksColumns: ColumnDef<Task>[] = [
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
        accessorKey: 'id',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="hover:bg-transparent p-0 font-semibold"
                >
                    المعرف
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return <div className="font-medium">{row.getValue('id')}</div>
        },
    },
    {
        accessorKey: 'order.qr_code',
        header: 'رمز الطلب',
        cell: ({ row }) => {
            const order = row.original.order
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="font-mono text-sm font-medium bg-muted px-2 py-1 rounded cursor-default max-w-[150px] truncate">
                                {order?.qr_code || '-'}
                            </div>
                        </TooltipTrigger>
                        {order?.qr_code && (
                            <TooltipContent>
                                <p className="font-mono">{order.qr_code}</p>
                            </TooltipContent>
                        )}
                    </Tooltip>
                </TooltipProvider>
            )
        },
    },
    {
        accessorKey: 'taskType',
        header: 'نوع المهمة',
        cell: ({ row }) => {
            const taskType = row.original.taskType
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{taskType?.task_ar || '-'}</span>
                    {taskType?.task_en && (
                        <span className="text-xs text-muted-foreground">{taskType.task_en}</span>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: 'user',
        header: 'المستخدم',
        cell: ({ row }) => {
            const user = row.original.user
            return (
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.name || '-'}</span>
                </div>
            )
        },
    },
    {
        accessorKey: 'vehicle',
        header: 'المركبة',
        cell: ({ row }) => {
            const vehicle = row.original.vehicle
            return (
                <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span>{vehicle?.plate_number || '-'}</span>
                </div>
            )
        },
    },
    {
        accessorKey: 'current_status',
        header: 'الحالة',
        cell: ({ row }) => {
            const status = row.getValue('current_status') as TaskStatus
            return getStatusBadge(status)
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: 'fromBranch',
        header: 'من فرع',
        cell: ({ row }) => {
            const branch = row.original.fromBranch
            if (!branch) return <span className="text-muted-foreground">-</span>
            return (
                <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{branch.name}</span>
                </div>
            )
        },
    },
    {
        accessorKey: 'toBranch',
        header: 'إلى فرع',
        cell: ({ row }) => {
            const branch = row.original.toBranch
            if (!branch) return <span className="text-muted-foreground">-</span>
            return (
                <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{branch.name}</span>
                </div>
            )
        },
    },
    {
        accessorKey: 'completed_at',
        header: 'تاريخ الإنجاز',
        cell: ({ row }) => {
            const date = row.getValue('completed_at') as string | null | undefined
            if (!date) return <span className="text-muted-foreground">-</span>
            const dateObj = new Date(date)
            return (
                <div className="flex flex-col">
                    <span className="text-sm font-medium">
                        {format(dateObj, 'dd MMM yyyy', { locale: ar })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {format(dateObj, 'HH:mm')}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: 'created_at',
        header: 'تاريخ الإنشاء',
        cell: ({ row }) => {
            const date = row.getValue('created_at') as string | undefined
            if (!date) return <span className="text-muted-foreground">-</span>
            const dateObj = new Date(date)
            return (
                <div className="flex flex-col">
                    <span className="text-sm font-medium">
                        {format(dateObj, 'dd MMM yyyy', { locale: ar })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {format(dateObj, 'HH:mm')}
                    </span>
                </div>
            )
        },
    },
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => <DataTableRowActions row={row} />,
        enableSorting: false,
    },
]
