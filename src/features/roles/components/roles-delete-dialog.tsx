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
import { type Role } from '../data/schema'
import { DELETE_ROLE_MUTATION } from '../graphql/mutations'
import { useRoles } from './roles-provider'

type RoleDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: Role
}

export function RolesDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: RoleDeleteDialogProps) {
    const { refetch } = useRoles()

    const [deleteRole, { loading }] = useMutation(DELETE_ROLE_MUTATION, {
        onCompleted: () => {
            toast.success('Role deleted successfully!')
            onOpenChange(false)
            // Refetch the roles list to show the updated data
            if (refetch) {
                refetch()
            }
        },
        onError: (error: any) => {
            console.error('Delete role error:', error)
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                toast.error(error.graphQLErrors[0].message)
            } else {
                toast.error('Failed to delete role')
            }
        },
    })

    const handleDelete = () => {
        deleteRole({
            variables: {
                id: currentRow.id,
            },
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>حذف الدور</DialogTitle>
                    <DialogDescription>
                        هل أنت متأكد من أنك تريد حذف الدور "{currentRow.name}"؟ لا يمكن التراجع عن هذا الإجراء.
                    </DialogDescription>
                </DialogHeader>

                <Alert>
                    <AlertTriangle className='h-4 w-4' />
                    <AlertDescription>
                        <div className='space-y-2'>
                            <p>هذا الدور مُعيّن حالياً لـ:</p>
                            <div className='flex flex-wrap gap-2'>
                                <Badge variant='destructive'>
                                    {currentRow.users_count} مستخدم
                                </Badge>
                                <Badge variant='secondary'>
                                    {currentRow.permissions?.length || 0} صلاحية
                                </Badge>
                            </div>
                            <p className='text-sm text-muted-foreground'>
                                حذف هذا الدور سيزيله من جميع المستخدمين ويلغي جميع الصلاحيات المرتبطة به.
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
