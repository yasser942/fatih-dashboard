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
import { AlertTriangle, Trash2 } from 'lucide-react'

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
      const errorMessage = error.message || 'فشل في حذف المستخدم'
      toast.error(errorMessage)
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
      <AlertDialogContent className='sm:max-w-[500px]'>
        <AlertDialogHeader className='flex-row items-center gap-3'>
          <div className='flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10'>
            <AlertTriangle className='h-6 w-6 text-destructive' />
          </div>
          <div>
            <AlertDialogTitle className='text-2xl'>هل أنت متأكد تماماً؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف المستخدم <strong>{currentRow?.name || currentRow?.full_name}</strong> نهائياً.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <div className='rounded-md bg-orange-100 p-4 text-sm text-orange-700 dark:bg-orange-900 dark:text-orange-200'>
          <p>
            لا يمكن التراجع عن هذا الإجراء. سيتم حذف جميع البيانات المتعلقة بهذا المستخدم بشكل دائم.
          </p>
        </div>
        <AlertDialogFooter className='gap-2 sm:gap-0'>
          <AlertDialogCancel disabled={loading} className='m-0'>
            إلغاء
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            disabled={loading} 
            className='m-0 bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive'
          >
            {loading ? (
              <span className='flex items-center gap-2'>
                <span className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                جاري الحذف...
              </span>
            ) : (
              <span className='flex items-center gap-2'>
                <Trash2 className='h-4 w-4' />
                حذف المستخدم
              </span>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
