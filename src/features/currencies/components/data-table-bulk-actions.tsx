import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { Table } from '@tanstack/react-table'
import { CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table/bulk-actions'
import { type Currency } from '../data/schema'
import { UPDATE_CURRENCY_MUTATION } from '../graphql/mutations'
import { useCurrencies } from './currencies-provider'

interface DataTableBulkActionsProps {
    table: Table<Currency>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const [isProcessing, setIsProcessing] = useState(false)
    const { refetch } = useCurrencies()

    const [updateCurrency] = useMutation(UPDATE_CURRENCY_MUTATION)

    const handleBulkStatusChange = async (isActive: boolean) => {
        setIsProcessing(true)
        const statusText = isActive ? 'تنشيط' : 'إلغاء تنشيط'

        try {
            const promises = selectedRows.map((row) =>
                updateCurrency({
                    variables: {
                        id: row.original.id,
                        input: {
                            is_active: isActive,
                        },
                    },
                })
            )

            const results = await Promise.allSettled(promises)

            const successCount = results.filter((r) => r.status === 'fulfilled').length
            const failureCount = results.filter((r) => r.status === 'rejected').length

            if (successCount > 0) {
                toast.success(`تم ${statusText} ${successCount} عملة بنجاح`)
            }

            if (failureCount > 0) {
                toast.error(`فشل ${statusText} ${failureCount} عملة`)
            }

            // Clear selection and refetch
            table.resetRowSelection()
            refetch?.()
        } catch (error) {
            toast.error(`حدث خطأ أثناء ${statusText} العملات`)
            console.error('Bulk status change error:', error)
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <BulkActionsToolbar table={table} entityName='عملة'>
            <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkStatusChange(true)}
                disabled={isProcessing}
                className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
            >
                <CheckCircle className="mr-2 h-4 w-4" />
                تنشيط
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkStatusChange(false)}
                disabled={isProcessing}
                className="h-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
            >
                <XCircle className="mr-2 h-4 w-4" />
                إلغاء التنشيط
            </Button>
        </BulkActionsToolbar>
    )
}


