import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@apollo/client/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronsUpDown, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCustomers } from './customers-provider'
import { customerTypeValues, customerStatusValues, createCustomerSchema, updateCustomerSchema, type CreateCustomer, type UpdateCustomer } from '../data/schema'
import { CREATE_CUSTOMER_MUTATION, UPDATE_CUSTOMER_MUTATION } from '../graphql/mutations'
import { CUSTOMERS_QUERY } from '../graphql/queries'
import { gql } from '@apollo/client/core'

const USERS_QUERY = gql`
  query Users($excludeAssigned: Boolean) {
    users(excludeAssigned: $excludeAssigned) {
      id
      name
      email
    }
  }
`

export function CustomersMutateDrawer() {
    const { open, setOpen, currentRow, setCurrentRow, refetch } = useCustomers()
    const isUpdate = open === 'update' && currentRow
    const [userOpen, setUserOpen] = useState(false)

    const form = useForm<CreateCustomer | UpdateCustomer>({
        resolver: zodResolver(isUpdate ? updateCustomerSchema : createCustomerSchema),
        defaultValues: {
            customer_type: 'Individual',
            market_name: '',
            user_id: 0,
            status: 'Active',
        },
    })

    useEffect(() => {
        if (isUpdate && currentRow) {
            form.reset({
                customer_type: currentRow.customer_type,
                market_name: currentRow.market_name ?? '',
                user_id: currentRow.user_id,
                status: currentRow.status,
            })
        } else if (open === 'create') {
            form.reset({ customer_type: 'Individual', market_name: '', user_id: 0, status: 'Active' })
            // Clear any existing errors when opening create dialog
            form.clearErrors()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, currentRow])

    const [createCustomer, createState] = useMutation(CREATE_CUSTOMER_MUTATION, {
        refetchQueries: [CUSTOMERS_QUERY, USERS_QUERY],
        onCompleted: () => {
            toast.success('تم إنشاء العميل بنجاح!')
            handleClose()
            refetch?.()
        },
        onError: (error: any) => {
            console.error('Create customer error:', error)
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                toast.error(error.graphQLErrors[0].message)
            } else {
                toast.error('فشل في إنشاء العميل')
            }
        },
    })

    const [updateCustomer, updateState] = useMutation(UPDATE_CUSTOMER_MUTATION, {
        refetchQueries: [CUSTOMERS_QUERY, USERS_QUERY],
        onCompleted: () => {
            toast.success('تم تحديث العميل بنجاح!')
            handleClose()
            refetch?.()
        },
        onError: (error: any) => {
            console.error('Update customer error:', error)
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                toast.error(error.graphQLErrors[0].message)
            } else {
                toast.error('فشل في تحديث العميل')
            }
        },
    })

    // Fetch users for the selector (exclude users already assigned to customers, except when editing)
    const { data: usersData } = useQuery(USERS_QUERY, {
        variables: { excludeAssigned: !isUpdate },
        fetchPolicy: 'cache-first',
    })


    const onSubmit = async (values: any) => {
        // Validate that user_id is selected for create operations
        if (!isUpdate && (!values.user_id || values.user_id === 0)) {
            form.setError('user_id', {
                type: 'manual',
                message: 'يجب اختيار مستخدم'
            })
            return
        }

        const payload = Object.fromEntries(
            Object.entries(values).map(([k, v]) => {
                // Convert user_id to number if it exists
                if (k === 'user_id' && v) {
                    return [k, Number(v)]
                }
                // Don't send user_id if it's 0 (not selected)
                if (k === 'user_id' && v === 0) {
                    return [k, undefined]
                }
                return [k, v === '' ? undefined : v]
            })
        )

        if (isUpdate && currentRow) {
            await updateCustomer({ variables: { id: currentRow.id, input: payload } })
        } else {
            await createCustomer({ variables: { input: payload } })
        }
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

                        <FormField
                            control={form.control}
                            name="user_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>المستخدم</FormLabel>
                                    <FormControl>
                                        <Popover open={userOpen} onOpenChange={setUserOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={userOpen}
                                                    className="w-full justify-between"
                                                >
                                                    {field.value && field.value > 0
                                                        ? (() => {
                                                            const user = (usersData as any)?.users?.find((user: any) => Number(user.id) === Number(field.value))
                                                            return user ? `${user.name} - ${user.email}` : 'اختر المستخدم...'
                                                        })()
                                                        : 'اختر المستخدم...'}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <Command>
                                                    <CommandInput placeholder="البحث في المستخدمين..." />
                                                    <CommandList>
                                                        <CommandEmpty>لم يتم العثور على مستخدمين.</CommandEmpty>
                                                        <CommandGroup>
                                                            {((usersData as any)?.users ?? []).map((user: any) => (
                                                                <CommandItem
                                                                    key={user.id}
                                                                    value={`${user.name} ${user.email}`}
                                                                    onSelect={() => {
                                                                        field.onChange(Number(user.id))
                                                                        setUserOpen(false)
                                                                        // Clear any validation errors for user_id
                                                                        form.clearErrors('user_id')
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            'mr-2 h-4 w-4',
                                                                            field.value === Number(user.id) && (field.value ?? 0) > 0 ? 'opacity-100' : 'opacity-0'
                                                                        )}
                                                                    />
                                                                    <User className="mr-2 h-4 w-4" />
                                                                    <div className="flex flex-col">
                                                                        <span className="font-medium">{user.name}</span>
                                                                        <span className="text-sm text-muted-foreground">{user.email}</span>
                                                                    </div>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                            <Button type="submit" disabled={createState.loading || updateState.loading}>
                                {isUpdate ? 'تحديث' : 'إنشاء'}
                            </Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}
