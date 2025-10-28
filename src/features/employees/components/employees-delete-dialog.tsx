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
import { useEmployees } from './employees-provider'
import { DELETE_EMPLOYEE_MUTATION } from '../graphql/mutations'
import { EMPLOYEES_QUERY } from '../graphql/queries'

export function EmployeesDeleteDialog() {
    const { open, setOpen, currentRow, setCurrentRow, refetch } = useEmployees()

    const [deleteEmployee, { loading }] = useMutation(DELETE_EMPLOYEE_MUTATION, {
        refetchQueries: [EMPLOYEES_QUERY],
        onCompleted: () => {
            setOpen(null)
            setCurrentRow(null)
            refetch?.()
        },
    })

    const handleDelete = async () => {
        if (!currentRow) return

        try {
            await deleteEmployee({
                variables: {
                    id: currentRow.id,
                },
            })
        } catch (error) {
            console.error('Error deleting employee:', error)
        }
    }

    return (
        <AlertDialog open={open === 'delete'} onOpenChange={() => setOpen(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                    <AlertDialogDescription>
                        هل أنت متأكد من حذف الموظف "{currentRow?.user?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
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




