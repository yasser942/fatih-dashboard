import { useMutation } from '@apollo/client/react'
import { Button } from '@/components/ui/button'
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
import { DELETE_LOCATION_MASTER_MUTATION } from '../graphql/mutations'
import { LOCATION_MASTERS_QUERY } from '../graphql/queries'
import { useLocationMasters } from './location-masters-provider'

export function LocationMastersDeleteDialog() {
    const { open, setOpen, currentRow, refetch } = useLocationMasters()

    const [deleteLocationMaster, { loading }] = useMutation(DELETE_LOCATION_MASTER_MUTATION, {
        refetchQueries: [LOCATION_MASTERS_QUERY],
        onCompleted: () => {
            setOpen(null)
            refetch?.()
        },
    })

    const handleDelete = () => {
        if (currentRow) {
            deleteLocationMaster({
                variables: {
                    id: currentRow.id.toString(),
                },
            })
        }
    }

    return (
        <AlertDialog open={open === 'delete'} onOpenChange={() => setOpen(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                    <AlertDialogDescription>
                        هل أنت متأكد من حذف هذا الموقع؟ لا يمكن التراجع عن هذا الإجراء.
                        {currentRow && (
                            <div className="mt-2 p-2 bg-muted rounded">
                                <strong>كود الموقع:</strong> {currentRow.Location_Pcode}
                            </div>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={loading}>
                        {loading ? 'جاري الحذف...' : 'حذف'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
