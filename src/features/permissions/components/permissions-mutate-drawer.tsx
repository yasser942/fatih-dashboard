import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
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
import { type Permission } from '../data/schema'
import { CREATE_PERMISSION_MUTATION, UPDATE_PERMISSION_MUTATION } from '../graphql/mutations'
import { usePermissions } from './permissions-provider'

type PermissionMutateDrawerProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: Permission
}

const formSchema = z.object({
    name: z.string().min(1, 'Name is required.').max(255, 'Name must be less than 255 characters.'),
    guard_name: z.string().min(1, 'Guard name is required.').max(255, 'Guard name must be less than 255 characters.'),
})

type PermissionForm = z.infer<typeof formSchema>

export function PermissionsMutateDrawer({
    open,
    onOpenChange,
    currentRow,
}: PermissionMutateDrawerProps) {
    const isUpdate = !!currentRow
    const { refetch } = usePermissions()

    const form = useForm<PermissionForm>({
        resolver: zodResolver(formSchema),
        defaultValues: currentRow ? {
            name: currentRow.name,
            guard_name: currentRow.guard_name,
        } : {
            name: '',
            guard_name: 'web',
        },
    })

    const [createPermission, { loading: createLoading }] = useMutation(CREATE_PERMISSION_MUTATION, {
        onCompleted: () => {
            toast.success('Permission created successfully!')
            onOpenChange(false)
            form.reset()
            // Refetch the permissions list to show the new permission
            if (refetch) {
                refetch()
            }
        },
        onError: (error: any) => {
            console.error('Create permission error:', error)
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                const firstError = error.graphQLErrors[0]
                if (firstError.extensions?.validation) {
                    const validationErrors = firstError.extensions.validation
                    Object.keys(validationErrors).forEach((field) => {
                        if (field in formSchema.shape) {
                            form.setError(field as keyof PermissionForm, {
                                message: validationErrors[field][0],
                            })
                        }
                    })
                } else {
                    toast.error(firstError.message)
                }
            } else {
                toast.error('Failed to create permission')
            }
        },
    })

    const [updatePermission, { loading: updateLoading }] = useMutation(UPDATE_PERMISSION_MUTATION, {
        onCompleted: () => {
            toast.success('Permission updated successfully!')
            onOpenChange(false)
            form.reset()
            // Refetch the permissions list to show the updated permission
            if (refetch) {
                refetch()
            }
        },
        onError: (error: any) => {
            console.error('Update permission error:', error)
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                const firstError = error.graphQLErrors[0]
                if (firstError.extensions?.validation) {
                    const validationErrors = firstError.extensions.validation
                    Object.keys(validationErrors).forEach((field) => {
                        if (field in formSchema.shape) {
                            form.setError(field as keyof PermissionForm, {
                                message: validationErrors[field][0],
                            })
                        }
                    })
                } else {
                    toast.error(firstError.message)
                }
            } else {
                toast.error('Failed to update permission')
            }
        },
    })

    const onSubmit = (data: PermissionForm) => {
        if (isUpdate && currentRow) {
            updatePermission({
                variables: {
                    id: currentRow.id,
                    name: data.name,
                    guard_name: data.guard_name,
                },
            })
        } else {
            createPermission({
                variables: {
                    name: data.name,
                    guard_name: data.guard_name,
                },
            })
        }
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
                    <SheetTitle>{isUpdate ? 'تحديث' : 'إنشاء'} صلاحية</SheetTitle>
                    <SheetDescription>
                        {isUpdate
                            ? 'قم بتحديث الصلاحية من خلال تقديم المعلومات اللازمة.'
                            : 'أضف صلاحية جديدة من خلال تقديم المعلومات اللازمة.'}
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
                                            <Input placeholder='أدخل اسم الصلاحية' {...field} />
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
