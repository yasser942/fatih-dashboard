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
import { useBranches } from './branches-provider'
import { DELETE_BRANCH_MUTATION } from '../graphql/mutations'
import { BRANCHES_QUERY } from '../graphql/queries'

export function BranchesDeleteDialog() {
    const { open, setOpen, currentRow, setCurrentRow, refetch } = useBranches()

    const [deleteBranch, { loading }] = useMutation(DELETE_BRANCH_MUTATION, {
        refetchQueries: [BRANCHES_QUERY],
        onCompleted: () => {
            setOpen(null)
            setCurrentRow(null)
            refetch?.()
        },
    })

    const handleDelete = async () => {
        if (!currentRow) return
        try {
            await deleteBranch({ variables: { id: currentRow.id } })
        } catch (e) {
            console.error('Error deleting branch:', e)
        }
    }

    return (
        <AlertDialog open={open === 'delete'} onOpenChange={() => setOpen(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                    <AlertDialogDescription>
                        هل أنت متأكد من حذف الفرع "{currentRow?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={loading} className="bg-red-600 hover:bg-red-700">
                        {loading ? 'جاري الحذف...' : 'حذف'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}


