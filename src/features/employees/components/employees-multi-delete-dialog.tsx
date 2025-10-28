import { useMutation } from '@apollo/client/react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { BULK_DELETE_EMPLOYEES_MUTATION } from '../graphql/mutations'
import { EMPLOYEES_QUERY } from '../graphql/queries'

interface EmployeesMultiDeleteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedIds: number[]
    onSuccess: () => void
}

export function EmployeesMultiDeleteDialog({
    open,
    onOpenChange,
    selectedIds,
    onSuccess,
}: EmployeesMultiDeleteDialogProps) {
    const [bulkDeleteEmployees, { loading }] = useMutation(BULK_DELETE_EMPLOYEES_MUTATION, {
        refetchQueries: [EMPLOYEES_QUERY],
        onCompleted: () => {
            onOpenChange(false)
            onSuccess()
        },
    })

    const handleDelete = async () => {
        try {
            await bulkDeleteEmployees({
                variables: {
                    ids: selectedIds,
                },
            })
        } catch (error) {
            console.error('Error bulk deleting employees:', error)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>تأكيد الحذف الجماعي</AlertDialogTitle>
                    <AlertDialogDescription>
                        هل أنت متأكد من حذف {selectedIds?.length || 0} موظف؟ هذا الإجراء لا يمكن التراجع عنه.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {loading ? 'جاري الحذف...' : 'حذف'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

