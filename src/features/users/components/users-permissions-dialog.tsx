import { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useMutation, useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client/core'
import { ASSIGN_PERMISSIONS_MUTATION } from '../graphql/mutations'
import { USERS_QUERY } from '../graphql/queries'
import { toast } from 'sonner'
import { useUsers } from './users-provider'

const PERMISSIONS_QUERY = gql`
  query Permissions {
    permissions {
      id
      name
    }
  }
`

export function UsersPermissionsDialog() {
    const { open, setOpen, currentRow, setCurrentRow, refetch } = useUsers()
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])

    const { data: permissionsData } = useQuery(PERMISSIONS_QUERY)

    const [assignPermissions, { loading }] = useMutation(ASSIGN_PERMISSIONS_MUTATION, {
        refetchQueries: [USERS_QUERY],
        onCompleted: () => {
            toast.success('تم تحديث الصلاحيات بنجاح!')
            handleClose()
            refetch?.()
        },
        onError: (error) => {
            console.error('Assign permissions error:', error)
            toast.error('فشل في تحديث الصلاحيات')
        },
    })

    useEffect(() => {
        if (open === 'permissions' && currentRow) {
            const permissionIds = currentRow.permissions?.map((permission) => permission.id) || []
            setSelectedPermissions(permissionIds)
        }
    }, [open, currentRow])

    const handleClose = () => {
        setOpen(null)
        setCurrentRow(null)
        setSelectedPermissions([])
    }

    const handleTogglePermission = (permissionId: number) => {
        setSelectedPermissions((prev) =>
            prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId],
        )
    }

    const handleSubmit = async () => {
        if (!currentRow) return
        await assignPermissions({
            variables: {
                id: currentRow.id,
                input: { permission_ids: selectedPermissions },
            },
        })
    }

    const permissions = permissionsData?.permissions || []

    return (
        <Dialog open={open === 'permissions'} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className='sm:max-w-[425px] max-h-[80vh] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>إدارة صلاحيات المستخدم</DialogTitle>
                    <DialogDescription>
                        إدارة صلاحيات المستخدم: <strong>{currentRow?.name || currentRow?.full_name}</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className='space-y-4 py-4'>
                    {permissions.length === 0 ? (
                        <div className='text-center text-muted-foreground'>لا توجد صلاحيات متاحة</div>
                    ) : (
                        <div className='space-y-3'>
                            {permissions.map((permission: any) => (
                                <div key={permission.id} className='flex items-center space-x-2'>
                                    <Checkbox
                                        id={`permission-${permission.id}`}
                                        checked={selectedPermissions.includes(permission.id)}
                                        onCheckedChange={() => handleTogglePermission(permission.id)}
                                    />
                                    <Label
                                        htmlFor={`permission-${permission.id}`}
                                        className='text-sm font-normal cursor-pointer'
                                    >
                                        {permission.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button type='button' variant='outline' onClick={handleClose} disabled={loading}>
                        إلغاء
                    </Button>
                    <Button type='button' onClick={handleSubmit} disabled={loading}>
                        {loading ? 'جاري الحفظ...' : 'حفظ'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

