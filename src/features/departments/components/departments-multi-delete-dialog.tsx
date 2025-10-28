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
import { BULK_DELETE_DEPARTMENTS_MUTATION } from '../graphql/mutations'
import { DEPARTMENTS_QUERY } from '../graphql/queries'

interface DepartmentsMultiDeleteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedIds: number[]
    onSuccess: () => void
}

export function DepartmentsMultiDeleteDialog({
    open,
    onOpenChange,
    selectedIds,
    onSuccess,
}: DepartmentsMultiDeleteDialogProps) {
    const [bulkDeleteDepartments, { loading }] = useMutation(BULK_DELETE_DEPARTMENTS_MUTATION, {
        refetchQueries: [DEPARTMENTS_QUERY],
        onCompleted: () => {
            onOpenChange(false)
            onSuccess()
        },
    })

    const handleDelete = async () => {
        try {
            await bulkDeleteDepartments({
                variables: {
                    ids: selectedIds,
                },
            })
        } catch (error) {
            console.error('Error bulk deleting departments:', error)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>تأكيد الحذف الجماعي</AlertDialogTitle>
                    <AlertDialogDescription>
                        هل أنت متأكد من حذف {selectedIds?.length || 0} قسم؟ هذا الإجراء لا يمكن التراجع عنه.
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

