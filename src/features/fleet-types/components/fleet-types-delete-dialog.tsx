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
import { useFleetTypes } from './fleet-types-provider'
import { DELETE_FLEET_TYPE } from '../graphql/mutations'
import { GET_FLEET_TYPES } from '../graphql/queries'

export function FleetTypesDeleteDialog() {
    const { open, setOpen, currentRow, setCurrentRow, refetch } = useFleetTypes()

    const [deleteFleetType, { loading }] = useMutation(DELETE_FLEET_TYPE, {
        refetchQueries: [GET_FLEET_TYPES],
        onCompleted: () => {
            setOpen(null)
            setCurrentRow(null)
            refetch?.()
        },
    })

    const handleDelete = async () => {
        if (!currentRow) return

        try {
            await deleteFleetType({
                variables: {
                    id: currentRow.id,
                },
            })
        } catch (error) {
            console.error('Error deleting fleet type:', error)
        }
    }

    return (
        <AlertDialog open={open === 'delete'} onOpenChange={() => setOpen(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                    <AlertDialogDescription>
                        هل أنت متأكد من حذف نوع الأسطول "{currentRow?.type_ar}"؟ هذا الإجراء لا يمكن التراجع عنه.
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
