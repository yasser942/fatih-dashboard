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
import { BULK_DELETE_POSITIONS_MUTATION } from '../graphql/mutations'
import { POSITIONS_QUERY } from '../graphql/queries'

interface PositionsMultiDeleteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedIds: number[]
    onSuccess: () => void
}

export function PositionsMultiDeleteDialog({
    open,
    onOpenChange,
    selectedIds,
    onSuccess,
}: PositionsMultiDeleteDialogProps) {
    const [bulkDeletePositions, { loading }] = useMutation(BULK_DELETE_POSITIONS_MUTATION, {
        refetchQueries: [POSITIONS_QUERY],
        onCompleted: () => {
            onOpenChange(false)
            onSuccess()
        },
    })

    const handleDelete = async () => {
        try {
            await bulkDeletePositions({
                variables: {
                    ids: selectedIds,
                },
            })
        } catch (error) {
            console.error('Error bulk deleting positions:', error)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>تأكيد الحذف الجماعي</AlertDialogTitle>
                    <AlertDialogDescription>
                        هل أنت متأكد من حذف {selectedIds?.length || 0} وظيفة؟ هذا الإجراء لا يمكن التراجع عنه.
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

