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
import { ASSIGN_PERMISSIONS_MUTATION } from '../graphql/mutations'
import { USERS_QUERY } from '../graphql/queries'
import { toast } from 'sonner'
import { useUsers } from './users-provider'
import { ShieldCheck, X, Save, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    const [searchQuery, setSearchQuery] = useState('')

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
        setSearchQuery('')
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
    
    // Filter permissions based on search query
    const filteredPermissions = permissions.filter((permission: any) =>
        permission.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Get selected count for display
    const selectedCount = selectedPermissions.length

    return (
        <Dialog open={open === 'permissions'} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className='sm:max-w-[500px]'>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <ShieldCheck className='h-5 w-5' />
                        إدارة صلاحيات المستخدم
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
                            placeholder='بحث عن صلاحية...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Selected Count Badge */}
                    <div className='flex items-center justify-between'>
                        <Badge variant='secondary' className='text-xs'>
                            {selectedCount} {selectedCount === 1 ? 'صلاحية محددة' : 'صلاحيات محددة'}
                        </Badge>
                        {selectedCount > 0 && (
                            <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => setSelectedPermissions([])}
                                className='h-7 text-xs'
                            >
                                إلغاء الكل
                            </Button>
                        )}
                    </div>

                    {/* Permissions List */}
                    <ScrollArea className='h-[300px] rounded-md border p-4'>
                        {filteredPermissions.length === 0 ? (
                            <div className='flex flex-col items-center justify-center py-8 text-center'>
                                <ShieldCheck className='mb-2 h-12 w-12 text-muted-foreground/50' />
                                <p className='text-sm font-medium text-muted-foreground'>
                                    {searchQuery ? 'لا توجد نتائج' : 'لا توجد صلاحيات متاحة'}
                                </p>
                                <p className='text-xs text-muted-foreground'>
                                    {searchQuery && 'جرب مصطلحات بحث مختلفة'}
                                </p>
                            </div>
                        ) : (
                            <div className='space-y-2'>
                                {filteredPermissions.map((permission: any) => {
                                    const isSelected = selectedPermissions.includes(permission.id)
                                    return (
                                        <div
                                            key={permission.id}
                                            className={cn(
                                                'flex items-center gap-3 rounded-lg border p-3 transition-colors',
                                                isSelected
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-muted-foreground/50 hover:bg-accent'
                                            )}
                                        >
                                            <Checkbox
                                                id={`permission-${permission.id}`}
                                                checked={isSelected}
                                                onCheckedChange={() => handleTogglePermission(permission.id)}
                                                className='h-5 w-5'
                                            />
                                            <Label
                                                htmlFor={`permission-${permission.id}`}
                                                className='flex-1 cursor-pointer text-sm font-medium'
                                            >
                                                {permission.name}
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

