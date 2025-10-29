import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { Row } from '@tanstack/react-table'
import { MoreHorizontal, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCurrencies } from './currencies-provider'
import { type Currency } from '../data/schema'
import { UPDATE_CURRENCY_MUTATION } from '../graphql/mutations'

interface DataTableRowActionsProps {
    row: Row<Currency>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const { setOpen, setCurrentRow, refetch } = useCurrencies()
    const [isUpdating, setIsUpdating] = useState(false)

    const [updateCurrency] = useMutation(UPDATE_CURRENCY_MUTATION)

    const handleToggleStatus = async (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsUpdating(true)

        const newStatus = !row.original.is_active
        const statusText = newStatus ? 'تنشيط' : 'إلغاء تنشيط'

        try {
            await updateCurrency({
                variables: {
                    id: row.original.id,
                    input: {
                        is_active: newStatus,
                    },
                },
            })

            toast.success(`تم ${statusText} العملة بنجاح`)
            refetch?.()
        } catch (error) {
            toast.error(`فشل ${statusText} العملة`)
            console.error('Toggle status error:', error)
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={(e) => e.stopPropagation()}
                    disabled={isUpdating}
                >
                    <span className="sr-only">فتح القائمة</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation()
                        setCurrentRow(row.original)
                        setOpen('update')
                    }}
                    disabled={isUpdating}
                >
                    <Edit className="mr-2 h-4 w-4" />
                    تعديل
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={handleToggleStatus}
                    disabled={isUpdating}
                    className={row.original.is_active ? 'text-orange-600' : 'text-green-600'}
                >
                    {row.original.is_active ? (
                        <>
                            <XCircle className="mr-2 h-4 w-4" />
                            إلغاء التنشيط
                        </>
                    ) : (
                        <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            تنشيط
                        </>
                    )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation()
                        setCurrentRow(row.original)
                        setOpen('delete')
                    }}
                    disabled={isUpdating}
                    className="text-red-600"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    حذف
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


