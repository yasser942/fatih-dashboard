import { useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { type Customer } from '../data/schema'
import { BULK_DELETE_CUSTOMERS_MUTATION } from '../graphql/mutations'
import { useCustomers } from './customers-provider'

type CustomerMultiDeleteDialogProps<TData> = {
    open: boolean
    onOpenChange: (open: boolean) => void
    table: Table<TData>
}

export function CustomersMultiDeleteDialog<TData>({
    open,
    onOpenChange,
    table,
}: CustomerMultiDeleteDialogProps<TData>) {
    const { refetch } = useCustomers()
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const customers = selectedRows.map(row => row.original as Customer)

    const [bulkDeleteCustomers, { loading }] = useMutation(BULK_DELETE_CUSTOMERS_MUTATION, {
        onCompleted: () => {
            toast.success(`${customers.length} عميل تم حذفه بنجاح!`)
            onOpenChange(false)
            table.resetRowSelection()
            // Refetch the customers list to show the updated data
            if (refetch) {
                refetch()
            }
        },
        onError: (error: any) => {
            console.error('Bulk delete customers error:', error)
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                toast.error(error.graphQLErrors[0].message)
            } else {
                toast.error('فشل في حذف العملاء')
            }
        },
    })

    const handleDelete = async () => {
        try {
            // Delete all customers in one operation
            await bulkDeleteCustomers({
                variables: {
                    ids: customers.map(customer => customer.id),
                },
            })
        } catch (error) {
            console.error('Error bulk deleting customers:', error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        حذف العملاء المحددين
                    </DialogTitle>
                    <DialogDescription>
                        هل أنت متأكد من حذف {customers.length} عميل؟ لا يمكن التراجع عن هذا الإجراء.
                    </DialogDescription>
                </DialogHeader>

                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        سيتم حذف {customers.length} عميل نهائياً من النظام. تأكد من عدم وجود بيانات مرتبطة بهؤلاء العملاء.
                    </AlertDescription>
                </Alert>

                <div className="max-h-40 overflow-y-auto">
                    <div className="space-y-2">
                        {customers.map((customer) => (
                            <div key={customer.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                        {customer.customer_type === 'Individual' ? 'فرد' : 'شركة'}
                                    </Badge>
                                    <span className="font-medium">{customer.user.name}</span>
                                    <span className="text-sm text-muted-foreground">- {customer.user.email}</span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {customer.market_name || 'بدون اسم متجر'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        إلغاء
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                        {loading ? 'جاري الحذف...' : `حذف ${customers.length} عميل`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
