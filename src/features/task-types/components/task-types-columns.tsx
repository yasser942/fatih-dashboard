import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, Globe, Languages } from 'lucide-react'
import { type TaskType } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

export const taskTypesColumns: ColumnDef<TaskType>[] = [
    {
        accessorKey: 'task_en',
        header: 'النوع بالإنجليزية',
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{row.getValue('task_en')}</span>
            </div>
        ),
    },
    {
        accessorKey: 'task_ar',
        header: 'النوع بالعربية',
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Languages className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{row.getValue('task_ar')}</span>
            </div>
        ),
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
                        <Badge
                            variant="outline"
                            className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-800 dark:bg-green-950 dark:text-green-400"
                        >
                            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                            نشط
                        </Badge>
                    ) : (
                        <Badge
                            variant="outline"
                            className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
                        >
                            <XCircle className="mr-1.5 h-3.5 w-3.5" />
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
            const date = new Date(row.getValue('created_at') as string)
            return (
                <div className="flex flex-col">
                    <span className="text-sm font-medium">
                        {format(date, 'dd MMM yyyy', { locale: ar })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {format(date, 'HH:mm')}
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

