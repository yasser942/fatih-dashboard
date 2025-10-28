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
import { usePositions } from './positions-provider'
import { DELETE_POSITION_MUTATION } from '../graphql/mutations'
import { POSITIONS_QUERY } from '../graphql/queries'

export function PositionsDeleteDialog() {
    const { open, setOpen, currentRow, setCurrentRow, refetch } = usePositions()

    const [deletePosition, { loading }] = useMutation(DELETE_POSITION_MUTATION, {
        refetchQueries: [POSITIONS_QUERY],
        onCompleted: () => {
            setOpen(null)
            setCurrentRow(null)
            refetch?.()
        },
    })

    const handleDelete = async () => {
        if (!currentRow) return

        try {
            await deletePosition({
                variables: {
                    id: currentRow.id,
                },
            })
        } catch (error) {
            console.error('Error deleting position:', error)
        }
    }

    return (
        <AlertDialog open={open === 'delete'} onOpenChange={() => setOpen(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                    <AlertDialogDescription>
                        هل أنت متأكد من حذف الوظيفة "{currentRow?.title}"؟ هذا الإجراء لا يمكن التراجع عنه.
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




