import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import {
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    FileText,
    User,
    Building
} from 'lucide-react'
import { type Order } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

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
        header: 'رمز QR',
        cell: ({ row }) => {
            const qrCode = row.getValue('qr_code') as string
            return (
                <div className="font-mono text-sm">
                    {qrCode}
                </div>
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
                switch (normalizedStatus) {
                    case 'registered':
                        return (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200">
                                <FileText className="mr-1 h-3 w-3" /> مسجل
                            </Badge>
                        )
                    case 'received':
                        return (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 hover:bg-green-200">
                                <Package className="mr-1 h-3 w-3" /> مستلم
                            </Badge>
                        )
                    case 'transfer':
                        return (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200">
                                <Truck className="mr-1 h-3 w-3" /> في النقل
                            </Badge>
                        )
                    case 'delivered':
                        return (
                            <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200">
                                <CheckCircle className="mr-1 h-3 w-3" /> تم التسليم
                            </Badge>
                        )
                    case 'canceled':
                        return (
                            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 hover:bg-red-200">
                                <XCircle className="mr-1 h-3 w-3" /> ملغي
                            </Badge>
                        )
                    case 'draft':
                        return (
                            <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200">
                                <Clock className="mr-1 h-3 w-3" /> مسودة
                            </Badge>
                        )
                    default:
                        return (
                            <Badge variant="outline">
                                {status}
                            </Badge>
                        )
                }
            }
            return getStatusBadge(status)
        },
    },
    {
        accessorKey: 'sender',
        header: 'المرسل',
        cell: ({ row }) => {
            const sender = row.original.sender
            return (
                <div className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    <div>
                        <div className="font-medium">{sender?.name}</div>
                        <div className="text-sm text-muted-foreground">{sender?.email}</div>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: 'receiver',
        header: 'المستقبل',
        cell: ({ row }) => {
            const receiver = row.original.receiver
            return (
                <div className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    <div>
                        <div className="font-medium">{receiver?.name}</div>
                        <div className="text-sm text-muted-foreground">{receiver?.email}</div>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: 'branchSource',
        header: 'فرع المصدر',
        cell: ({ row }) => {
            const branch = row.original.branchSource
            return (
                <div className="flex items-center">
                    <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{branch?.name}</span>
                </div>
            )
        },
    },
    {
        accessorKey: 'branchTarget',
        header: 'فرع الوجهة',
        cell: ({ row }) => {
            const branch = row.original.branchTarget
            return (
                <div className="flex items-center">
                    <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{branch?.name}</span>
                </div>
            )
        },
    },
    {
        accessorKey: 'shipping_fees',
        header: 'رسوم الشحن',
        cell: ({ row }) => {
            const fees = row.getValue('shipping_fees') as number
            const currency = row.original.feesCurrency
            return (
                <div className="text-right">
                    <span className="font-medium">{fees.toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground ml-1">{currency?.code}</span>
                </div>
            )
        },
    },
    {
        accessorKey: 'cash_on_delivery',
        header: 'الدفع عند الاستلام',
        cell: ({ row }) => {
            const cod = row.getValue('cash_on_delivery') as number
            const currency = row.original.codCurrency
            return (
                <div className="text-right">
                    <span className="font-medium">{cod.toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground ml-1">{currency?.code}</span>
                </div>
            )
        },
    },
    {
        accessorKey: 'created_at',
        header: 'تاريخ الإنشاء',
        cell: ({ row }) => {
            const date = row.getValue('created_at') as string
            return (
                <div className="text-sm">
                    {date ? new Date(date).toLocaleDateString('en-US') : '-'}
                </div>
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
