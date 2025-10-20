import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { type User } from '../data/schema'
import { SYNC_ROLES_MUTATION } from '../graphql/mutations'
import { ROLES_QUERY } from '../graphql/queries'

type UserRolesDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentUser: User
}

export function UserRolesDialog({
    open,
    onOpenChange,
    currentUser,
}: UserRolesDialogProps) {
    const [selectedRoles, setSelectedRoles] = useState<string[]>(
        currentUser.roles?.map(role => role.name) || []
    )

    // Fetch all available roles
    const { data: rolesData, loading: rolesLoading } = useQuery(ROLES_QUERY)

    const [syncRoles, { loading }] = useMutation(SYNC_ROLES_MUTATION, {
        onCompleted: () => {
            toast.success('User roles updated successfully!')
            onOpenChange(false)
        },
        onError: (error: any) => {
            console.error('Sync roles error:', error)
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                toast.error(error.graphQLErrors[0].message)
            } else {
                toast.error('Failed to update user roles')
            }
        },
    })

    const handleSave = () => {
        syncRoles({
            variables: {
                user_id: currentUser.id,
                roles: selectedRoles,
            },
        })
    }

    const handleRoleToggle = (roleName: string, checked: boolean) => {
        if (checked) {
            setSelectedRoles(prev => [...prev, roleName])
        } else {
            setSelectedRoles(prev => prev.filter(name => name !== roleName))
        }
    }

    const roles = rolesData?.roles || []

    // Group roles by guard_name
    const groupedRoles = roles.reduce((acc: Record<string, any[]>, role: any) => {
        if (!acc[role.guard_name]) {
            acc[role.guard_name] = []
        }
        acc[role.guard_name].push(role)
        return acc
    }, {})

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-2xl'>
                <DialogHeader>
                    <DialogTitle>Manage Roles for {currentUser.name || currentUser.email}</DialogTitle>
                    <DialogDescription>
                        Assign or remove roles for this user. Changes will take effect immediately.
                    </DialogDescription>
                </DialogHeader>

                <div className='space-y-4'>
                    <div className='flex items-center gap-2'>
                        <span className='text-sm font-medium'>Selected Roles:</span>
                        {selectedRoles.length > 0 ? (
                            <div className='flex flex-wrap gap-1'>
                                {selectedRoles.map((roleName) => (
                                    <Badge key={roleName} variant='secondary' className='text-xs'>
                                        {roleName}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <span className='text-sm text-muted-foreground'>No roles selected</span>
                        )}
                    </div>

                    <ScrollArea className='h-64 w-full rounded-md border p-4'>
                        {rolesLoading ? (
                            <div className='text-center text-sm text-muted-foreground'>
                                Loading roles...
                            </div>
                        ) : Object.keys(groupedRoles).length === 0 ? (
                            <div className='text-center text-sm text-muted-foreground'>
                                No roles available
                            </div>
                        ) : (
                            <div className='space-y-4'>
                                {Object.entries(groupedRoles).map(([guardName, guardRoles]) => (
                                    <div key={guardName}>
                                        <h4 className='text-sm font-medium capitalize'>{guardName} Guard</h4>
                                        <div className='mt-2 space-y-2'>
                                            {guardRoles.map((role) => (
                                                <div key={role.id} className='flex items-center space-x-2'>
                                                    <Checkbox
                                                        id={`role-${role.id}`}
                                                        checked={selectedRoles.includes(role.name)}
                                                        onCheckedChange={(checked) => handleRoleToggle(role.name, !!checked)}
                                                    />
                                                    <label
                                                        htmlFor={`role-${role.id}`}
                                                        className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                                                    >
                                                        {role.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        <Separator className='mt-4' />
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>

                <DialogFooter>
                    <Button variant='outline' onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
