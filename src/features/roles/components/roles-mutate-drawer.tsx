import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@apollo/client/react'
import { toast } from 'sonner'
import { Search, Shield, ShieldCheck, Lock, Tag, CheckSquare, XSquare } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { type Role } from '../data/schema'
import { CREATE_ROLE_MUTATION, UPDATE_ROLE_MUTATION, GIVE_ROLE_PERMISSION_MUTATION, REVOKE_ROLE_PERMISSION_MUTATION } from '../graphql/mutations'
import { PERMISSIONS_QUERY } from '../graphql/queries'
import { useRoles } from './roles-provider'

type RoleMutateDrawerProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: Role
}

const formSchema = z.object({
    name: z.string().min(1, 'Name is required.').max(255, 'Name must be less than 255 characters.'),
    guard_name: z.string().min(1, 'Guard name is required.').max(255, 'Guard name must be less than 255 characters.'),
    permissions: z.array(z.string()).optional().default([]),
})

type RoleForm = z.infer<typeof formSchema>

export function RolesMutateDrawer({
    open,
    onOpenChange,
    currentRow,
}: RoleMutateDrawerProps) {
    const isUpdate = !!currentRow
    const { refetch } = useRoles()
    const [permissionSearch, setPermissionSearch] = useState('')
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})

    const form = useForm<RoleForm>({
        resolver: zodResolver(formSchema),
        defaultValues: currentRow ? {
            name: currentRow.name,
            guard_name: currentRow.guard_name,
            permissions: currentRow.permissions?.map(p => p.name) || [],
        } : {
            name: '',
            guard_name: 'web',
            permissions: [],
        },
    })

    // Fetch permissions for the multi-select
    const { data: permissionsData, loading: permissionsLoading } = useQuery(PERMISSIONS_QUERY)

    const [createRole, { loading: createLoading }] = useMutation(CREATE_ROLE_MUTATION, {
        onCompleted: () => {
            toast.success('Role created successfully!')
            onOpenChange(false)
            form.reset()
            // Refetch the roles list to show the new role
            if (refetch) {
                refetch()
            }
        },
        onError: (error: any) => {
            console.error('Create role error:', error)
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                const firstError = error.graphQLErrors[0]
                if (firstError.extensions?.validation) {
                    const validationErrors = firstError.extensions.validation
                    Object.keys(validationErrors).forEach((field) => {
                        if (field in formSchema.shape) {
                            form.setError(field as keyof RoleForm, {
                                message: validationErrors[field][0],
                            })
                        }
                    })
                } else {
                    toast.error(firstError.message)
                }
            } else {
                toast.error('Failed to create role')
            }
        },
    })

    const [updateRole, { loading: updateLoading }] = useMutation(UPDATE_ROLE_MUTATION, {
        onCompleted: () => {
            console.log('Role update completed, refetching...')
            toast.success('Role updated successfully!')
            // Refetch the roles list to show the updated role
            if (refetch) {
                refetch()
            }
        },
        onError: (error: any) => {
            console.error('Update role error:', error)
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                const firstError = error.graphQLErrors[0]
                if (firstError.extensions?.validation) {
                    const validationErrors = firstError.extensions.validation
                    Object.keys(validationErrors).forEach((field) => {
                        if (field in formSchema.shape) {
                            form.setError(field as keyof RoleForm, {
                                message: validationErrors[field][0],
                            })
                        }
                    })
                } else {
                    toast.error(firstError.message)
                }
            } else {
                toast.error('Failed to update role')
            }
        },
    })

    const [giveRolePermission] = useMutation(GIVE_ROLE_PERMISSION_MUTATION)
    const [revokeRolePermission] = useMutation(REVOKE_ROLE_PERMISSION_MUTATION)

    const onSubmit = async (data: RoleForm) => {
        if (isUpdate && currentRow) {
            // First update the role basic info
            await updateRole({
                variables: {
                    id: currentRow.id,
                    name: data.name,
                    guard_name: data.guard_name,
                },
            })

            // Then handle permissions if they changed
            if (data.permissions) {
                const currentPermissions = currentRow.permissions?.map(p => p.name) || []
                const newPermissions = data.permissions

                // Find permissions to add
                const permissionsToAdd = newPermissions.filter(p => !currentPermissions.includes(p))
                // Find permissions to remove
                const permissionsToRemove = currentPermissions.filter(p => !newPermissions.includes(p))

                // Add new permissions
                for (const permission of permissionsToAdd) {
                    try {
                        await giveRolePermission({
                            variables: {
                                role: data.name,
                                permission: permission,
                            },
                        })
                    } catch (error) {
                        console.error('Error giving permission:', error)
                    }
                }

                // Remove old permissions
                for (const permission of permissionsToRemove) {
                    try {
                        await revokeRolePermission({
                            variables: {
                                role: data.name,
                                permission: permission,
                            },
                        })
                    } catch (error) {
                        console.error('Error revoking permission:', error)
                    }
                }

                // Refetch after permission changes
                if (refetch) {
                    refetch()
                }
            }

            // Close the drawer and reset form after all operations
            onOpenChange(false)
            form.reset()
        } else {
            createRole({
                variables: {
                    name: data.name,
                    guard_name: data.guard_name,
                    permissions: data.permissions,
                },
            })
        }
    }

    const permissions = permissionsData?.permissions || []
    const selectedPermissions = form.watch('permissions') || []

    // Group permissions by guard_name
    const groupedPermissions = permissions.reduce((acc: Record<string, any[]>, permission: any) => {
        if (!acc[permission.guard_name]) {
            acc[permission.guard_name] = []
        }
        acc[permission.guard_name].push(permission)
        return acc
    }, {})

    // Filter permissions based on search
    const filteredGroupedPermissions = Object.entries(groupedPermissions).reduce((acc: Record<string, any[]>, [guardName, guardPermissions]) => {
        const filtered = guardPermissions.filter((p: any) =>
            p.name.toLowerCase().includes(permissionSearch.toLowerCase())
        )
        if (filtered.length > 0) {
            acc[guardName] = filtered
        }
        return acc
    }, {})

    // Helper functions for select all/deselect all
    const handleSelectAllPermissions = () => {
        const allPermissionNames = permissions.map((p: any) => p.name)
        form.setValue('permissions', allPermissionNames)
    }

    const handleDeselectAllPermissions = () => {
        form.setValue('permissions', [])
    }

    const handleSelectGuardPermissions = (guardName: string) => {
        const currentPermissions = form.getValues('permissions') || []
        const guardPermissionNames = groupedPermissions[guardName].map((p: any) => p.name)
        const newPermissions = Array.from(new Set([...currentPermissions, ...guardPermissionNames]))
        form.setValue('permissions', newPermissions)
    }

    const handleDeselectGuardPermissions = (guardName: string) => {
        const currentPermissions = form.getValues('permissions') || []
        const guardPermissionNames = groupedPermissions[guardName].map((p: any) => p.name)
        const newPermissions = currentPermissions.filter((p: string) => !guardPermissionNames.includes(p))
        form.setValue('permissions', newPermissions)
    }

    return (
        <Sheet
            open={open}
            onOpenChange={(v) => {
                onOpenChange(v)
                if (!v) {
                    form.reset()
                }
            }}
        >
            <SheetContent className='flex flex-col'>
                <SheetHeader className='text-start px-6 pt-6'>
                    <SheetTitle>{isUpdate ? 'تحديث' : 'إنشاء'} دور</SheetTitle>
                    <SheetDescription>
                        {isUpdate
                            ? 'قم بتحديث الدور من خلال تقديم المعلومات اللازمة.'
                            : 'أضف دوراً جديداً من خلال تقديم المعلومات اللازمة.'}
                    </SheetDescription>
                </SheetHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-1 flex-col gap-6 px-6'>
                        <div className='flex flex-1 flex-col gap-6'>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex items-center gap-2'>
                                            <Tag className='h-4 w-4' />
                                            الاسم
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder='مثال: مدير، محرر، مستخدم' {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            اسم فريد للدور يسهل التعرف عليه
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='guard_name'
                                render={({ field }) => (
                                    <FormItem>
                                        <TooltipProvider>
                                            <FormLabel className='flex items-center gap-2'>
                                                <Shield className='h-4 w-4' />
                                                اسم الحارس
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button type='button' className='text-muted-foreground hover:text-foreground'>
                                                            <ShieldCheck className='h-4 w-4' />
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent className='max-w-xs'>
                                                        <p>الحارس يحدد نطاق الحماية (مثل: web للويب، api لواجهة برمجة التطبيقات)</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </FormLabel>
                                        </TooltipProvider>
                                        <FormControl>
                                            <Input placeholder='web' {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            القيمة الافتراضية: web
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='permissions'
                                render={({ field }) => (
                                    <FormItem>
                                        <div className='flex items-center justify-between'>
                                            <FormLabel className='flex items-center gap-2'>
                                                <Lock className='h-4 w-4' />
                                                الصلاحيات
                                                {selectedPermissions.length > 0 && (
                                                    <Badge variant='secondary' className='ml-2'>
                                                        {selectedPermissions.length} محدد
                                                    </Badge>
                                                )}
                                            </FormLabel>
                                            <div className='flex gap-1'>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                type='button'
                                                                variant='ghost'
                                                                size='sm'
                                                                className='h-7 px-2'
                                                                onClick={handleSelectAllPermissions}
                                                            >
                                                                <CheckSquare className='h-3.5 w-3.5' />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>تحديد الكل</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                type='button'
                                                                variant='ghost'
                                                                size='sm'
                                                                className='h-7 px-2'
                                                                onClick={handleDeselectAllPermissions}
                                                            >
                                                                <XSquare className='h-3.5 w-3.5' />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>إلغاء تحديد الكل</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </div>
                                        <FormDescription>
                                            اختر الصلاحيات التي يمتلكها هذا الدور
                                        </FormDescription>
                                        <FormControl>
                                            <div className='space-y-3'>
                                                {/* Search Input */}
                                                <div className='relative'>
                                                    <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                                                    <Input
                                                        type='text'
                                                        placeholder='ابحث عن صلاحية...'
                                                        value={permissionSearch}
                                                        onChange={(e) => setPermissionSearch(e.target.value)}
                                                        className='pl-8'
                                                    />
                                                </div>

                                                {/* Permissions List */}
                                                <ScrollArea className='h-80 w-full rounded-md border'>
                                                    {permissionsLoading ? (
                                                        <div className='flex h-40 items-center justify-center text-sm text-muted-foreground'>
                                                            <div className='flex flex-col items-center gap-2'>
                                                                <div className='h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent' />
                                                                <p>جاري تحميل الصلاحيات...</p>
                                                            </div>
                                                        </div>
                                                    ) : Object.keys(filteredGroupedPermissions).length === 0 ? (
                                                        <div className='flex h-40 items-center justify-center text-sm text-muted-foreground'>
                                                            <div className='text-center'>
                                                                <Lock className='mx-auto h-10 w-10 opacity-20' />
                                                                <p className='mt-2'>
                                                                    {permissionSearch ? 'لم يتم العثور على صلاحيات' : 'لا توجد صلاحيات متاحة'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className='space-y-2 p-4'>
                                                            {Object.entries(filteredGroupedPermissions).map(([guardName, guardPermissions]) => {
                                                                const guardSelected = guardPermissions.every((p: any) =>
                                                                    field.value?.includes(p.name)
                                                                )
                                                                const isExpanded = expandedGroups[guardName] ?? true

                                                                return (
                                                                    <Collapsible
                                                                        key={guardName}
                                                                        open={isExpanded}
                                                                        onOpenChange={(open) =>
                                                                            setExpandedGroups(prev => ({ ...prev, [guardName]: open }))
                                                                        }
                                                                    >
                                                                        <div className='rounded-lg border bg-card'>
                                                                            <CollapsibleTrigger asChild>
                                                                                <div className='flex items-center justify-between p-3 cursor-pointer hover:bg-accent/50 rounded-t-lg'>
                                                                                    <div className='flex items-center gap-2'>
                                                                                        <Shield className='h-4 w-4 text-muted-foreground' />
                                                                                        <h4 className='text-sm font-semibold capitalize'>
                                                                                            {guardName}
                                                                                        </h4>
                                                                                        <Badge variant='outline' className='text-xs'>
                                                                                            {guardPermissions.length}
                                                                                        </Badge>
                                                                                    </div>
                                                                                    <div className='flex items-center gap-1'>
                                                                                        <Button
                                                                                            type='button'
                                                                                            variant='ghost'
                                                                                            size='sm'
                                                                                            className='h-6 px-1.5'
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation()
                                                                                                if (guardSelected) {
                                                                                                    handleDeselectGuardPermissions(guardName)
                                                                                                } else {
                                                                                                    handleSelectGuardPermissions(guardName)
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            {guardSelected ? (
                                                                                                <XSquare className='h-3 w-3' />
                                                                                            ) : (
                                                                                                <CheckSquare className='h-3 w-3' />
                                                                                            )}
                                                                                        </Button>
                                                                                    </div>
                                                                                </div>
                                                                            </CollapsibleTrigger>
                                                                            <CollapsibleContent>
                                                                                <Separator />
                                                                                <div className='p-3 pt-2 space-y-2'>
                                                                                    {guardPermissions.map((permission: any) => (
                                                                                        <div
                                                                                            key={permission.id}
                                                                                            className='flex items-center gap-2 rounded-md p-2 hover:bg-accent/50 transition-colors'
                                                                                        >
                                                                                            <Checkbox
                                                                                                id={`permission-${permission.id}`}
                                                                                                checked={field.value?.includes(permission.name) || false}
                                                                                                onCheckedChange={(checked) => {
                                                                                                    const currentPermissions = field.value || []
                                                                                                    if (checked) {
                                                                                                        field.onChange([...currentPermissions, permission.name])
                                                                                                    } else {
                                                                                                        field.onChange(currentPermissions.filter((p: string) => p !== permission.name))
                                                                                                    }
                                                                                                }}
                                                                                            />
                                                                                            <label
                                                                                                htmlFor={`permission-${permission.id}`}
                                                                                                className='flex-1 text-sm font-medium leading-none cursor-pointer select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                                                                                            >
                                                                                                {permission.name}
                                                                                            </label>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </CollapsibleContent>
                                                                        </div>
                                                                    </Collapsible>
                                                                )
                                                            })}
                                                        </div>
                                                    )}
                                                </ScrollArea>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <SheetFooter className='flex flex-col gap-2 sm:flex-row px-6 pb-6'>
                            <SheetClose asChild>
                                <Button type='button' variant='outline'>
                                    إلغاء
                                </Button>
                            </SheetClose>
                            <Button type='submit' disabled={createLoading || updateLoading}>
                                {createLoading || updateLoading ? 'جاري الحفظ...' : isUpdate ? 'تحديث' : 'إنشاء'}
                            </Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}
