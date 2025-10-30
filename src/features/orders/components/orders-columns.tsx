import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    FileText,
    User,
    Building,
    Calendar,
    ArrowUpDown
} from 'lucide-react'
import { type Order } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import { Button } from '@/components/ui/button'

export const ordersColumns: ColumnDef<Order>[] = [
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
        accessorKey: 'qr_code',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="hover:bg-transparent p-0 font-semibold"
                >
                    رمز QR
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const qrCode = row.getValue('qr_code') as string
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="font-mono text-sm font-medium bg-muted px-2 py-1 rounded cursor-default max-w-[150px] truncate">
                                {qrCode}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="font-mono">{qrCode}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        },
    },
    {
        accessorKey: 'status',
        header: 'الحالة',
        cell: ({ row }) => {
            const status = row.getValue('status') as string
            const getStatusBadge = (status: string) => {
                const normalizedStatus = status?.toLowerCase()
                
                const statusConfig = {
                    'registered': { 
                        icon: FileText, 
                        label: 'مسجل', 
                        className: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
                        tooltip: 'تم تسجيل الشحنة في النظام'
                    },
                    'received': { 
                        icon: Package, 
                        label: 'مستلم', 
                        className: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
                        tooltip: 'تم استلام الشحنة من المرسل'
                    },
                    'transfer': { 
                        icon: Truck, 
                        label: 'في النقل', 
                        className: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
                        tooltip: 'الشحنة في طريقها للوجهة'
                    },
                    'delivered': { 
                        icon: CheckCircle, 
                        label: 'تم التسليم', 
                        className: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
                        tooltip: 'تم تسليم الشحنة للمستلم'
                    },
                    'canceled': { 
                        icon: XCircle, 
                        label: 'ملغي', 
                        className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
                        tooltip: 'تم إلغاء الشحنة'
                    },
                    'draft': { 
                        icon: Clock, 
                        label: 'مسودة', 
                        className: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100',
                        tooltip: 'الشحنة قيد الإنشاء'
                    }
                }

                const config = statusConfig[normalizedStatus as keyof typeof statusConfig]
                if (!config) {
                    return <Badge variant="outline">{status}</Badge>
                }

                const Icon = config.icon
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Badge variant="outline" className={`${config.className} cursor-help`}>
                                    <Icon className="mr-1 h-3 w-3" /> {config.label}
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{config.tooltip}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )
            }
            return getStatusBadge(status)
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: 'sender',
        header: 'المرسل',
        cell: ({ row }) => {
            const sender = row.original.sender
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 cursor-help min-w-[180px]">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                    <User className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex flex-col max-w-[140px]">
                                    <div className="font-medium truncate text-sm">{sender?.name || 'غير محدد'}</div>
                                    <div className="text-xs text-muted-foreground truncate">{sender?.email || 'لا يوجد بريد'}</div>
                                </div>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                            <div className="space-y-1">
                                <p className="font-semibold">{sender?.name}</p>
                                <p className="text-xs text-muted-foreground">{sender?.email}</p>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        },
    },
    {
        accessorKey: 'receiver',
        header: 'المستقبل',
        cell: ({ row }) => {
            const receiver = row.original.receiver
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 cursor-help min-w-[180px]">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
                                    <User className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="flex flex-col max-w-[140px]">
                                    <div className="font-medium truncate text-sm">{receiver?.name || 'غير محدد'}</div>
                                    <div className="text-xs text-muted-foreground truncate">{receiver?.email || 'لا يوجد بريد'}</div>
                                </div>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                            <div className="space-y-1">
                                <p className="font-semibold">{receiver?.name}</p>
                                <p className="text-xs text-muted-foreground">{receiver?.email}</p>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        },
    },
    {
        accessorKey: 'branchSource',
        header: 'فرع المصدر',
        cell: ({ row }) => {
            const branch = row.original.branchSource
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 cursor-help">
                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-50">
                                    <Building className="h-4 w-4 text-green-600" />
                                </div>
                                <span className="font-medium text-sm max-w-[120px] truncate">{branch?.name || 'غير محدد'}</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>فرع المصدر: {branch?.name}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        },
    },
    {
        accessorKey: 'branchTarget',
        header: 'فرع الوجهة',
        cell: ({ row }) => {
            const branch = row.original.branchTarget
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 cursor-help">
                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-50">
                                    <Building className="h-4 w-4 text-orange-600" />
                                </div>
                                <span className="font-medium text-sm max-w-[120px] truncate">{branch?.name || 'غير محدد'}</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>فرع الوجهة: {branch?.name}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        },
    },
    {
        accessorKey: 'shipping_fees',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="hover:bg-transparent p-0 font-semibold"
                >
                    رسوم الشحن
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const fees = row.getValue('shipping_fees') as number
            const currency = row.original.feesCurrency
            const feesType = row.original.fees_type
            
            const normalizedType = typeof feesType === 'string' ? feesType.toLowerCase() : feesType
            const feesTypeLabel = normalizedType === 'sender' ? 'المرسل' : 'المستقبل'
            
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex flex-col items-end gap-1 cursor-help">
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold text-sm">{fees.toFixed(2)}</span>
                                    <span className="text-xs font-medium text-primary">{currency?.code}</span>
                                </div>
                                <span className="text-[10px] text-muted-foreground">يدفعها {feesTypeLabel}</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>رسوم الشحن: {fees.toFixed(2)} {currency?.code}</p>
                            <p className="text-xs">يدفعها: {feesTypeLabel}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        },
    },
    {
        accessorKey: 'cash_on_delivery',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="hover:bg-transparent p-0 font-semibold"
                >
                    الدفع عند الاستلام
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const cod = row.getValue('cash_on_delivery') as number
            const currency = row.original.codCurrency
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center justify-end gap-1 cursor-help">
                                <span className="font-semibold text-sm">{cod.toFixed(2)}</span>
                                <span className="text-xs font-medium text-primary">{currency?.code}</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>الدفع عند الاستلام: {cod.toFixed(2)} {currency?.code}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        },
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="hover:bg-transparent p-0 font-semibold"
                >
                    تاريخ الإنشاء
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = row.getValue('created_at') as string
            if (!date) return <span className="text-muted-foreground text-sm">-</span>
            
            const dateObj = new Date(date)
            const formattedDate = dateObj.toLocaleDateString('ar-EG', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            })
            const formattedTime = dateObj.toLocaleTimeString('ar-EG', { 
                hour: '2-digit', 
                minute: '2-digit' 
            })
            
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex flex-col gap-1 cursor-help">
                                <div className="flex items-center gap-1 text-sm">
                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                    <span className="font-medium">{formattedDate}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">{formattedTime}</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>تاريخ الإنشاء: {formattedDate}</p>
                            <p className="text-xs">الوقت: {formattedTime}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
        enableSorting: false,
        enableHiding: false,
    },
]
