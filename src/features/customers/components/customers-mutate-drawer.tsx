import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@apollo/client/react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCustomers } from './customers-provider'
import { customerTypeValues, customerStatusValues, createCustomerSchema, updateCustomerSchema, createCustomerWithUserSchema, type CreateCustomer, type UpdateCustomer, type CreateCustomerWithUser } from '../data/schema'
import { CREATE_CUSTOMER_MUTATION, UPDATE_CUSTOMER_MUTATION } from '../graphql/mutations'
import { CUSTOMERS_QUERY } from '../graphql/queries'
import { CREATE_USER_WITH_PROFILE } from '@/features/users/graphql/mutations'

export function CustomersMutateDrawer() {
    const { open, setOpen, currentRow, setCurrentRow, refetch } = useCustomers()
    const isUpdate = open === 'update' && currentRow

    const form = useForm<CreateCustomerWithUser | UpdateCustomer>({
        resolver: zodResolver(isUpdate ? updateCustomerSchema : createCustomerWithUserSchema),
        defaultValues: {
            customer_type: 'Individual',
            market_name: '',
            status: 'Active',
            user_name: '',
            user_email: '',
            user_password: '',
            user_status: 'Active',
        },
    })

    useEffect(() => {
        if (isUpdate && currentRow) {
            form.reset({
                customer_type: currentRow.customer_type,
                market_name: currentRow.market_name ?? '',
                status: currentRow.status,
                user_name: currentRow.user?.name || '',
                user_email: currentRow.user?.email || '',
                user_password: '',
                user_status: 'Active',
            })
        } else if (open === 'create') {
            form.reset({ customer_type: 'Individual', market_name: '', status: 'Active', user_name: '', user_email: '', user_password: '', user_status: 'Active' })
            // Clear any existing errors when opening create dialog
            form.clearErrors()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, currentRow])

    const [createUserWithProfile] = useMutation(CREATE_USER_WITH_PROFILE, {
        refetchQueries: [CUSTOMERS_QUERY],
        onCompleted: () => {
            toast.success('تم إنشاء المستخدم والعميل بنجاح!')
            handleClose()
            refetch?.()
        },
        onError: (error: any) => {
            console.error('Create user with customer error:', error)
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                toast.error(error.graphQLErrors[0].message)
            } else {
                toast.error('فشل في إنشاء المستخدم والعميل')
            }
        },
    })


    const onSubmit = async (values: any) => {
        if (isUpdate && currentRow) {
            // For edit: populate user fields from currentRow.user if available
            const userInput = {
                name: currentRow.user?.name || values.user_name,
                full_name: currentRow.user?.name || values.user_name,
                email: currentRow.user?.email || values.user_email,
                password: values.user_password || undefined, // Optional for update
                status: values.user_status,
                is_account: true,
            }
            const customerInput = {
                customer_type: values.customer_type,
                market_name: values.market_name || undefined,
                status: values.status,
            }
            await createUserWithProfile({ variables: { input: { kind: 'Customer', user: userInput, customer: customerInput } } })
            return
        }

        // Create flow: always create new user
        const userInput = {
            name: values.user_name,
            full_name: values.user_name,
            email: values.user_email,
            password: values.user_password,
            status: values.user_status,
            is_account: true,
        }
        const customerInput = {
            customer_type: values.customer_type,
            market_name: values.market_name || undefined,
            status: values.status,
        }
        await createUserWithProfile({ variables: { input: { kind: 'Customer', user: userInput, customer: customerInput } } })
    }

    const handleClose = () => {
        form.reset()
        setCurrentRow(null)
        setOpen(null)
    }

    return (
        <Sheet open={open === 'create' || open === 'update'} onOpenChange={handleClose}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{isUpdate ? 'تعديل العميل' : 'إضافة عميل جديد'}</SheetTitle>
                    <SheetDescription>{isUpdate ? 'قم بتعديل بيانات العميل' : 'أدخل بيانات العميل الجديد'}</SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6">
                        <FormField
                            control={form.control}
                            name="customer_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>نوع العميل</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="اختر نوع العميل" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {customerTypeValues.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type === 'Individual' ? 'فرد' : 'شركة'}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="market_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>اسم المتجر</FormLabel>
                                    <FormControl>
                                        <Input placeholder="اسم المتجر (اختياري)" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-3 pt-2 border-t">
                            <h3 className="text-sm font-medium">معلومات المستخدم</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="user_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>اسم المستخدم</FormLabel>
                                            <FormControl>
                                                <Input placeholder="الاسم" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="user_email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>البريد الإلكتروني</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="example@email.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="user_password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{isUpdate ? 'كلمة المرور (اختياري للتحديث)' : 'كلمة المرور'}</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder={isUpdate ? 'اتركه فارغاً لعدم التغيير' : '••••••'} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="user_status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>حالة المستخدم</FormLabel>
                                            <FormControl>
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="اختر الحالة" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {(['Active', 'Inactive', 'Pending', 'Blocked'] as const).map((status) => (
                                                            <SelectItem key={status} value={status}>
                                                                {status}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>الحالة</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="اختر الحالة" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {customerStatusValues.map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {status === 'Active' ? 'نشط' : 'غير نشط'}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <SheetFooter>
                            <Button type="submit" disabled={createUserWithProfile.loading}>
                                {isUpdate ? 'تحديث' : 'إنشاء'}
                            </Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}
