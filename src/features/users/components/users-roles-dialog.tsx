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
import { ASSIGN_ROLES_MUTATION } from '../graphql/mutations'
import { USERS_QUERY } from '../graphql/queries'
import { toast } from 'sonner'
import { useUsers } from './users-provider'

const ROLES_QUERY = gql`
  query Roles {
    roles {
      id
      name
    }
  }
`

export function UsersRolesDialog() {
    const { open, setOpen, currentRow, setCurrentRow, refetch } = useUsers()
    const [selectedRoles, setSelectedRoles] = useState<number[]>([])

    const { data: rolesData } = useQuery(ROLES_QUERY)

    const [assignRoles, { loading }] = useMutation(ASSIGN_ROLES_MUTATION, {
        refetchQueries: [USERS_QUERY],
        onCompleted: () => {
            toast.success('تم تحديث الأدوار بنجاح!')
            handleClose()
            refetch?.()
        },
        onError: (error) => {
            console.error('Assign roles error:', error)
            toast.error('فشل في تحديث الأدوار')
        },
    })

    useEffect(() => {
        if (open === 'roles' && currentRow) {
            const roleIds = currentRow.roles?.map((role) => role.id) || []
            setSelectedRoles(roleIds)
        }
    }, [open, currentRow])

    const handleClose = () => {
        setOpen(null)
        setCurrentRow(null)
        setSelectedRoles([])
    }

    const handleToggleRole = (roleId: number) => {
        setSelectedRoles((prev) =>
            prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId],
        )
    }

    const handleSubmit = async () => {
        if (!currentRow) return
        await assignRoles({
            variables: {
                id: currentRow.id,
                input: { role_ids: selectedRoles },
            },
        })
    }

    const roles = rolesData?.roles || []

    return (
        <Dialog open={open === 'roles'} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>إدارة أدوار المستخدم</DialogTitle>
                    <DialogDescription>
                        إدارة أدوار المستخدم: <strong>{currentRow?.name || currentRow?.full_name}</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className='space-y-4 py-4'>
                    {roles.length === 0 ? (
                        <div className='text-center text-muted-foreground'>لا توجد أدوار متاحة</div>
                    ) : (
                        <div className='space-y-3'>
                            {roles.map((role: any) => (
                                <div key={role.id} className='flex items-center space-x-2'>
                                    <Checkbox
                                        id={`role-${role.id}`}
                                        checked={selectedRoles.includes(role.id)}
                                        onCheckedChange={() => handleToggleRole(role.id)}
                                    />
                                    <Label htmlFor={`role-${role.id}`} className='text-sm font-normal cursor-pointer'>
                                        {role.name}
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
