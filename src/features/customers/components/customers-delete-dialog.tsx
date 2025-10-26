import { useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useCustomers } from './customers-provider'
import { DELETE_CUSTOMER_MUTATION } from '../graphql/mutations'
import { CUSTOMERS_QUERY } from '../graphql/queries'

export function CustomersDeleteDialog() {
    const { open, setOpen, currentRow, setCurrentRow, refetch } = useCustomers()
    const isOpen = open === 'delete' && !!currentRow

    const [deleteCustomer, { loading }] = useMutation(DELETE_CUSTOMER_MUTATION, {
        refetchQueries: [CUSTOMERS_QUERY],
        onCompleted: () => {
            toast.success('تم حذف العميل بنجاح!')
            handleClose()
            refetch?.()
        },
        onError: (error: any) => {
            console.error('Delete customer error:', error)
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                toast.error(error.graphQLErrors[0].message)
            } else {
                toast.error('فشل في حذف العميل')
            }
        },
    })

    const handleClose = () => {
        setCurrentRow(null)
        setOpen(null)
    }

    const handleDelete = async () => {
        if (currentRow) {
            await deleteCustomer({ variables: { id: currentRow.id } })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>حذف العميل</DialogTitle>
                    <DialogDescription>
                        هل أنت متأكد من حذف هذا العميل؟ لا يمكن التراجع عن هذا الإجراء.
                    </DialogDescription>
                </DialogHeader>
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        سيتم حذف العميل نهائياً من النظام. تأكد من عدم وجود بيانات مرتبطة بهذا العميل.
                    </AlertDescription>
                </Alert>
                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={loading}>
                        إلغاء
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                        {loading ? 'جاري الحذف...' : 'حذف'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
