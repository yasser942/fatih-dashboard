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
import { useDepartments } from './departments-provider'
import { DELETE_DEPARTMENT_MUTATION } from '../graphql/mutations'
import { DEPARTMENTS_QUERY } from '../graphql/queries'

export function DepartmentsDeleteDialog() {
    const { open, setOpen, currentRow, setCurrentRow, refetch } = useDepartments()

    const [deleteDepartment, { loading }] = useMutation(DELETE_DEPARTMENT_MUTATION, {
        refetchQueries: [DEPARTMENTS_QUERY],
        onCompleted: () => {
            setOpen(null)
            setCurrentRow(null)
            refetch?.()
        },
    })

    const handleDelete = async () => {
        if (!currentRow) return

        try {
            await deleteDepartment({
                variables: {
                    id: currentRow.id,
                },
            })
        } catch (error) {
            console.error('Error deleting department:', error)
        }
    }

    return (
        <AlertDialog open={open === 'delete'} onOpenChange={() => setOpen(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                    <AlertDialogDescription>
                        هل أنت متأكد من حذف القسم "{currentRow?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
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




