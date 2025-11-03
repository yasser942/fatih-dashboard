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
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { useMutation, useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client/core'
import { ASSIGN_ROLES_MUTATION } from '../graphql/mutations'
import { USERS_QUERY } from '../graphql/queries'
import { toast } from 'sonner'
import { useUsers } from './users-provider'
import { ShieldCheck, X, Save, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    const [searchQuery, setSearchQuery] = useState('')

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
        setSearchQuery('')
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

    // Filter roles based on search query
    const filteredRoles = roles.filter((role: any) =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Get selected count for display
    const selectedCount = selectedRoles.length

    return (
        <Dialog open={open === 'roles'} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className='sm:max-w-[500px]'>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <ShieldCheck className='h-5 w-5' />
                        إدارة أدوار المستخدم
                    </DialogTitle>
                    <DialogDescription className='text-base'>
                        المستخدم: <strong className='text-foreground'>{currentRow?.name || currentRow?.full_name}</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className='space-y-4'>
                    {/* Search Input */}
                    <div className='relative'>
                        <Input
                            type='search'
                            placeholder='بحث عن دور...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Selected Count Badge */}
                    <div className='flex items-center justify-between'>
                        <Badge variant='secondary' className='text-xs'>
                            {selectedCount} {selectedCount === 1 ? 'دور محدد' : 'أدوار محددة'}
                        </Badge>
                        {selectedCount > 0 && (
                            <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => setSelectedRoles([])}
                                className='h-7 text-xs'
                            >
                                إلغاء الكل
                            </Button>
                        )}
                    </div>

                    {/* Roles List */}
                    <ScrollArea className='h-[300px] rounded-md border p-4'>
                        {filteredRoles.length === 0 ? (
                            <div className='flex flex-col items-center justify-center py-8 text-center'>
                                <ShieldCheck className='mb-2 h-12 w-12 text-muted-foreground/50' />
                                <p className='text-sm font-medium text-muted-foreground'>
                                    {searchQuery ? 'لا توجد نتائج' : 'لا توجد أدوار متاحة'}
                                </p>
                                <p className='text-xs text-muted-foreground'>
                                    {searchQuery && 'جرب مصطلحات بحث مختلفة'}
                                </p>
                            </div>
                        ) : (
                            <div className='space-y-2'>
                                {filteredRoles.map((role: any) => {
                                    const isSelected = selectedRoles.includes(role.id)
                                    return (
                                        <div
                                            key={role.id}
                                            className={cn(
                                                'flex items-center gap-3 rounded-lg border p-3 transition-colors',
                                                isSelected
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-muted-foreground/50 hover:bg-accent'
                                            )}
                                        >
                                            <Checkbox
                                                id={`role-${role.id}`}
                                                checked={isSelected}
                                                onCheckedChange={() => handleToggleRole(role.id)}
                                                className='h-5 w-5'
                                            />
                                            <Label
                                                htmlFor={`role-${role.id}`}
                                                className='flex-1 cursor-pointer text-sm font-medium'
                                            >
                                                {role.name}
                                            </Label>
                                            {isSelected && (
                                                <Badge variant='default' className='h-5 text-xs'>
                                                    محدد
                                                </Badge>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </ScrollArea>
                </div>

                <DialogFooter className='gap-2'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleClose}
                        disabled={loading}
                        className='min-w-[100px]'
                    >
                        <X className='ml-2 h-4 w-4' />
                        إلغاء
                    </Button>
                    <Button
                        type='button'
                        onClick={handleSubmit}
                        disabled={loading}
                        className='min-w-[120px]'
                    >
                        {loading ? (
                            <>
                                <Loader2 className='ml-2 h-4 w-4 animate-spin' />
                                جاري الحفظ...
                            </>
                        ) : (
                            <>
                                <Save className='ml-2 h-4 w-4' />
                                حفظ
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
