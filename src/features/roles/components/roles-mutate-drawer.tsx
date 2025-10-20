import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@apollo/client/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
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
                                        <FormLabel>الاسم</FormLabel>
                                        <FormControl>
                                            <Input placeholder='أدخل اسم الدور' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='guard_name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>اسم الحارس</FormLabel>
                                        <FormControl>
                                            <Input placeholder='أدخل اسم الحارس' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='permissions'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            الصلاحيات
                                            {selectedPermissions.length > 0 && (
                                                <Badge variant='secondary' className='ml-2'>
                                                    {selectedPermissions.length} محدد
                                                </Badge>
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <ScrollArea className='h-64 w-full rounded-md border p-4'>
                                                {permissionsLoading ? (
                                                    <div className='text-center text-sm text-muted-foreground'>
                                                        جاري تحميل الصلاحيات...
                                                    </div>
                                                ) : Object.keys(groupedPermissions).length === 0 ? (
                                                    <div className='text-center text-sm text-muted-foreground'>
                                                        لا توجد صلاحيات متاحة
                                                    </div>
                                                ) : (
                                                    <div className='space-y-4'>
                                                        {Object.entries(groupedPermissions).map(([guardName, guardPermissions]) => (
                                                            <div key={guardName}>
                                                                <h4 className='text-sm font-medium capitalize'>{guardName} حارس</h4>
                                                                <div className='mt-2 space-y-2'>
                                                                    {guardPermissions.map((permission) => (
                                                                        <div key={permission.id} className='flex items-center space-x-2'>
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
                                                                                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                                                                            >
                                                                                {permission.name}
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
