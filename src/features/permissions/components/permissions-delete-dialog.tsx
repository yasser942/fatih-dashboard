import { useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { type Permission } from '../data/schema'
import { DELETE_PERMISSION_MUTATION } from '../graphql/mutations'
import { usePermissions } from './permissions-provider'

type PermissionDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: Permission
}

export function PermissionsDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: PermissionDeleteDialogProps) {
    const { refetch } = usePermissions()

    const [deletePermission, { loading }] = useMutation(DELETE_PERMISSION_MUTATION, {
        onCompleted: () => {
            toast.success('Permission deleted successfully!')
            onOpenChange(false)
            // Refetch the permissions list to show the updated data
            if (refetch) {
                refetch()
            }
        },
        onError: (error: any) => {
            console.error('Delete permission error:', error)
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                toast.error(error.graphQLErrors[0].message)
            } else {
                toast.error('Failed to delete permission')
            }
        },
    })

    const handleDelete = () => {
        deletePermission({
            variables: {
                id: currentRow.id,
            },
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>حذف الصلاحية</DialogTitle>
                    <DialogDescription>
                        هل أنت متأكد من أنك تريد حذف الصلاحية "{currentRow.name}"؟ لا يمكن التراجع عن هذا الإجراء.
                    </DialogDescription>
                </DialogHeader>

                <Alert>
                    <AlertTriangle className='h-4 w-4' />
                    <AlertDescription>
                        <div className='space-y-2'>
                            <p>هذه الصلاحية مُعيّنة حالياً لـ:</p>
                            <div className='flex flex-wrap gap-2'>
                                <Badge variant='destructive'>
                                    {currentRow.users_count} مستخدم
                                </Badge>
                                <Badge variant='secondary'>
                                    {currentRow.roles_count} دور
                                </Badge>
                            </div>
                            <p className='text-sm text-muted-foreground'>
                                حذف هذه الصلاحية سيزيلها من جميع المستخدمين والأدوار.
                            </p>
                        </div>
                    </AlertDescription>
                </Alert>

                <DialogFooter>
                    <Button variant='outline' onClick={() => onOpenChange(false)}>
                        إلغاء
                    </Button>
                    <Button variant='destructive' onClick={handleDelete} disabled={loading}>
                        {loading ? 'جاري الحذف...' : 'حذف'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
