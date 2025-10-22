import { useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useFleets } from './fleets-provider'
import { DELETE_FLEET_MUTATION } from '../graphql/mutations'
import { FLEETS_QUERY } from '../graphql/queries'

export function FleetsDeleteDialog() {
    const { open, setOpen, currentRow, setCurrentRow, refetch } = useFleets()
    const isOpen = open === 'delete' && currentRow

    const [deleteFleet, { loading }] = useMutation(DELETE_FLEET_MUTATION, {
        refetchQueries: [FLEETS_QUERY],
        onCompleted: () => {
            toast.success('تم حذف المركبة بنجاح')
            handleClose()
            refetch?.()
        },
        onError: (error) => {
            console.error('Delete fleet error:', error)
            const errorMessage = error.message || 'حدث خطأ أثناء حذف المركبة'
            toast.error(errorMessage)
        },
    })

    const handleDelete = async () => {
        if (currentRow) {
            await deleteFleet({ variables: { id: currentRow.id } })
        }
    }

    const handleClose = () => {
        setCurrentRow(null)
        setOpen(null)
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>حذف المركبة</DialogTitle>
                    <DialogDescription>
                        هل أنت متأكد من حذف المركبة برقم اللوحة "{currentRow?.plate_number}"؟ هذا الإجراء لا يمكن التراجع عنه.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
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
