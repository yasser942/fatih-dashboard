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
import { useMutation } from '@apollo/client/react'
import { DELETE_USER_MUTATION } from '../graphql/mutations'
import { USERS_QUERY } from '../graphql/queries'
import { toast } from 'sonner'
import { useUsers } from './users-provider'

export function UsersDeleteDialog() {
  const { open, setOpen, currentRow, setCurrentRow, refetch } = useUsers()

  const [deleteUser, { loading }] = useMutation(DELETE_USER_MUTATION, {
    refetchQueries: [USERS_QUERY],
    onCompleted: () => {
      toast.success('تم حذف المستخدم بنجاح!')
      handleClose()
      refetch?.()
    },
    onError: (error) => {
      console.error('Delete user error:', error)
      toast.error('فشل في حذف المستخدم')
    },
  })

  const handleClose = () => {
    setOpen(null)
    setCurrentRow(null)
  }

  const handleDelete = async () => {
    if (!currentRow) return
    await deleteUser({ variables: { id: currentRow.id } })
  }

  return (
    <AlertDialog open={open === 'delete'} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
          <AlertDialogDescription>
            سيتم حذف المستخدم <strong>{currentRow?.name || currentRow?.full_name}</strong> نهائياً.
            لا يمكن التراجع عن هذا الإجراء.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>إلغاء</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading} className='bg-destructive text-destructive-foreground hover:bg-destructive/90'>
            {loading ? 'جاري الحذف...' : 'حذف'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
