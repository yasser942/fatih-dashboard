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
import { useTaskTypes } from './task-types-provider'
import { DELETE_TASK_TYPE } from '../graphql/mutations'
import { TASK_TYPES_QUERY } from '../graphql/queries'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function TaskTypesDeleteDialog() {
    const { open, setOpen, currentRow, setCurrentRow, refetch } = useTaskTypes()

    const [deleteTaskType, { loading }] = useMutation(DELETE_TASK_TYPE, {
        refetchQueries: [TASK_TYPES_QUERY],
        onCompleted: () => {
            setOpen(null)
            setCurrentRow(null)
            toast.success('تم حذف نوع المهمة بنجاح', {
                description: 'تم حذف نوع المهمة من النظام',
            })
            refetch?.()
        },
        onError: (error) => {
            toast.error('فشل في حذف نوع المهمة', {
                description: error.message || 'حدث خطأ أثناء حذف نوع المهمة',
            })
        },
    })

    const handleDelete = async () => {
        if (!currentRow) return

        try {
            await deleteTaskType({
                variables: {
                    id: currentRow.id,
                },
            })
        } catch (error) {
            // Error handling is done in onError callback
            console.error('Error deleting task type:', error)
        }
    }

    return (
        <AlertDialog open={open === 'delete'} onOpenChange={() => setOpen(null)}>
            <AlertDialogContent className="sm:max-w-[425px]">
                <AlertDialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="flex-1">
                            <AlertDialogTitle className="text-xl">تأكيد الحذف</AlertDialogTitle>
                        </div>
                    </div>
                    <AlertDialogDescription className="pt-4 text-base">
                        هل أنت متأكد من حذف نوع المهمة{' '}
                        <span className="font-semibold text-foreground">
                            "{currentRow?.task_ar}"
                        </span>
                        ؟
                        <br />
                        <span className="text-sm text-muted-foreground">
                            هذا الإجراء لا يمكن التراجع عنه.
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 sm:gap-0">
                    <AlertDialogCancel disabled={loading}>إلغاء</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                جاري الحذف...
                            </>
                        ) : (
                            'حذف'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

