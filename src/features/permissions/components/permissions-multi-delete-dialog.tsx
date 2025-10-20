import { useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
import { type Table } from '@tanstack/react-table'
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

type PermissionMultiDeleteDialogProps<TData> = {
    open: boolean
    onOpenChange: (open: boolean) => void
    table: Table<TData>
}

export function PermissionsMultiDeleteDialog<TData>({
    open,
    onOpenChange,
    table,
}: PermissionMultiDeleteDialogProps<TData>) {
    const { refetch } = usePermissions()
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const permissions = selectedRows.map(row => row.original as Permission)

    const [deletePermission, { loading }] = useMutation(DELETE_PERMISSION_MUTATION, {
        onCompleted: () => {
            toast.success(`${permissions.length} permission${permissions.length !== 1 ? 's' : ''} deleted successfully!`)
            onOpenChange(false)
            table.resetRowSelection()
            // Refetch the permissions list to show the updated data
            if (refetch) {
                refetch()
            }
        },
        onError: (error: any) => {
            console.error('Delete permissions error:', error)
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                toast.error(error.graphQLErrors[0].message)
            } else {
                toast.error('Failed to delete permissions')
            }
        },
    })

    const handleDelete = async () => {
        try {
            // Delete permissions one by one
            for (const permission of permissions) {
                await deletePermission({
                    variables: {
                        id: permission.id,
                    },
                })
            }
        } catch (error) {
            console.error('Error deleting permissions:', error)
        }
    }

    const totalUsers = permissions.reduce((sum, permission) => sum + (permission.users_count || 0), 0)
    const totalRoles = permissions.reduce((sum, permission) => sum + (permission.roles_count || 0), 0)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>حذف {permissions.length} صلاحية</DialogTitle>
                    <DialogDescription>
                        هل أنت متأكد من أنك تريد حذف الصلاحيات المحددة؟ لا يمكن التراجع عن هذا الإجراء.
                    </DialogDescription>
                </DialogHeader>

                <div className='space-y-4'>
                    <div>
                        <h4 className='text-sm font-medium'>الصلاحيات المحددة:</h4>
                        <div className='mt-2 flex flex-wrap gap-2'>
                            {permissions.map((permission) => (
                                <Badge key={permission.id} variant='outline'>
                                    {permission.name}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <Alert>
                        <AlertTriangle className='h-4 w-4' />
                        <AlertDescription>
                            <div className='space-y-2'>
                                <p>هذه الصلاحيات مُعيّنة حالياً لـ:</p>
                                <div className='flex flex-wrap gap-2'>
                                    <Badge variant='destructive'>
                                        {totalUsers} مستخدم
                                    </Badge>
                                    <Badge variant='secondary'>
                                        {totalRoles} دور
                                    </Badge>
                                </div>
                                <p className='text-sm text-muted-foreground'>
                                    حذف هذه الصلاحيات سيزيلها من جميع المستخدمين والأدوار.
                                </p>
                            </div>
                        </AlertDescription>
                    </Alert>
                </div>

                <DialogFooter>
                    <Button variant='outline' onClick={() => onOpenChange(false)}>
                        إلغاء
                    </Button>
                    <Button variant='destructive' onClick={handleDelete} disabled={loading}>
                        {loading ? 'جاري الحذف...' : `حذف ${permissions.length} صلاحية`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
