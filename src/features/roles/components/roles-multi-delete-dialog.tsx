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
import { type Role } from '../data/schema'
import { DELETE_ROLE_MUTATION } from '../graphql/mutations'
import { useRoles } from './roles-provider'

type RoleMultiDeleteDialogProps<TData> = {
    open: boolean
    onOpenChange: (open: boolean) => void
    table: Table<TData>
}

export function RolesMultiDeleteDialog<TData>({
    open,
    onOpenChange,
    table,
}: RoleMultiDeleteDialogProps<TData>) {
    const { refetch } = useRoles()
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const roles = selectedRows.map(row => row.original as Role)

    const [deleteRole, { loading }] = useMutation(DELETE_ROLE_MUTATION, {
        onCompleted: () => {
            toast.success(`${roles.length} role${roles.length !== 1 ? 's' : ''} deleted successfully!`)
            onOpenChange(false)
            table.resetRowSelection()
            // Refetch the roles list to show the updated data
            if (refetch) {
                refetch()
            }
        },
        onError: (error: any) => {
            console.error('Delete roles error:', error)
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                toast.error(error.graphQLErrors[0].message)
            } else {
                toast.error('Failed to delete roles')
            }
        },
    })

    const handleDelete = async () => {
        try {
            // Delete roles one by one
            for (const role of roles) {
                await deleteRole({
                    variables: {
                        id: role.id,
                    },
                })
            }
        } catch (error) {
            console.error('Error deleting roles:', error)
        }
    }

    const totalUsers = roles.reduce((sum, role) => sum + (role.users_count || 0), 0)
    const totalPermissions = roles.reduce((sum, role) => sum + (role.permissions?.length || 0), 0)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>حذف {roles.length} دور</DialogTitle>
                    <DialogDescription>
                        هل أنت متأكد من أنك تريد حذف الأدوار المحددة؟ لا يمكن التراجع عن هذا الإجراء.
                    </DialogDescription>
                </DialogHeader>

                <div className='space-y-4'>
                    <div>
                        <h4 className='text-sm font-medium'>الأدوار المحددة:</h4>
                        <div className='mt-2 flex flex-wrap gap-2'>
                            {roles.map((role) => (
                                <Badge key={role.id} variant='outline'>
                                    {role.name}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <Alert>
                        <AlertTriangle className='h-4 w-4' />
                        <AlertDescription>
                            <div className='space-y-2'>
                                <p>هذه الأدوار مُعيّنة حالياً لـ:</p>
                                <div className='flex flex-wrap gap-2'>
                                    <Badge variant='destructive'>
                                        {totalUsers} مستخدم
                                    </Badge>
                                    <Badge variant='secondary'>
                                        {totalPermissions} صلاحية
                                    </Badge>
                                </div>
                                <p className='text-sm text-muted-foreground'>
                                    حذف هذه الأدوار سيزيلها من جميع المستخدمين ويلغي جميع الصلاحيات المرتبطة بها.
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
                        {loading ? 'جاري الحذف...' : `حذف ${roles.length} دور`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
