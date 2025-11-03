import { useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { TasksImportDialog } from './tasks-import-dialog'
import { TasksMutateDrawer } from './tasks-mutate-drawer'
import { useTasks } from './tasks-provider'
import { DELETE_TASK_MUTATION } from '../graphql/mutations'
import { GET_TASKS_QUERY } from '../graphql/queries'

export function TasksDialogs() {
  const { open, setOpen, currentRow, setCurrentRow, refetch } = useTasks()

  const [deleteTask, { loading: deleteLoading }] = useMutation(DELETE_TASK_MUTATION, {
    refetchQueries: [GET_TASKS_QUERY],
    onCompleted: () => {
      setOpen(null)
      setCurrentRow(null)
      toast.success('تم حذف المهمة بنجاح', {
        description: 'تم حذف المهمة من النظام',
      })
      refetch?.()
    },
    onError: (error) => {
      toast.error('فشل في حذف المهمة', {
        description: error.message || 'حدث خطأ أثناء حذف المهمة',
      })
    },
  })

  const handleDelete = async () => {
    if (currentRow) {
      try {
        await deleteTask({
          variables: {
            id: currentRow.id,
          },
        })
      } catch (error) {
        // Error handling is done in onError callback
        console.error('Error deleting task:', error)
      }
    }
  }

  return (
    <>
      <TasksMutateDrawer />

      <TasksImportDialog
        key='tasks-import'
        open={open === 'import'}
        onOpenChange={(open) => setOpen(open ? 'import' : null)}
      />

      {currentRow && (
        <ConfirmDialog
          key='task-delete'
          destructive
          open={open === 'delete'}
          onOpenChange={(open) => {
            setOpen(open ? 'delete' : null)
            if (!open) {
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }
          }}
          handleConfirm={handleDelete}
          className='max-w-md'
          title={`حذف المهمة رقم ${currentRow.id}؟`}
          desc={
            <>
              أنت على وشك حذف مهمة برقم{' '}
              <strong>{currentRow.id}</strong>. <br />
              لا يمكن التراجع عن هذا الإجراء.
            </>
          }
          confirmText='حذف'
          loading={deleteLoading}
        />
      )}
    </>
  )
}
