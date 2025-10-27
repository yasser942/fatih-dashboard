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
import { Check, ChevronsUpDown, User, Building, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOrders } from './orders-provider'
import {
    orderStatusValues,
    cancellationReasonValues,
    feesTypeValues,
    createOrderSchema,
    updateOrderSchema,
    type CreateOrder,
    type UpdateOrder
} from '../data/schema'
import { CREATE_ORDER_MUTATION, UPDATE_ORDER_MUTATION } from '../graphql/mutations'
import { ORDERS_QUERY } from '../graphql/queries'
import { useOrderFormData, useUsersSearch } from '../hooks/useOrderFormData'

export function OrdersMutateDrawer() {
    const { open, setOpen, currentRow, setCurrentRow, refetch } = useOrders()
    const isUpdate = open === 'update' && currentRow
    const [userOpen, setUserOpen] = useState(false)
    const [senderOpen, setSenderOpen] = useState(false)
    const [receiverOpen, setReceiverOpen] = useState(false)
    const [branchSourceOpen, setBranchSourceOpen] = useState(false)
    const [branchTargetOpen, setBranchTargetOpen] = useState(false)
    const [feesCurrencyOpen, setFeesCurrencyOpen] = useState(false)
    const [codCurrencyOpen, setCodCurrencyOpen] = useState(false)

    const form = useForm<CreateOrder | UpdateOrder>({
        resolver: zodResolver(isUpdate ? updateOrderSchema : createOrderSchema),
        defaultValues: {
            qr_code: '',
            status: 'draft',
            cancellation_reason: undefined,
            branch_source_id: 0,
            branch_target_id: 0,
            sender_id: 0,
            receiver_id: 0,
            fees_type: 'sender',
            shipping_fees: 0,
            fees_currency_id: 0,
            cash_on_delivery: 0,
            cod_currency_id: 0,
        },
    })

    const watchedStatus = form.watch('status')
    const watchedSourceBranch = form.watch('branch_source_id')

    // Clear target branch when source branch changes
    useEffect(() => {
        if (watchedSourceBranch === 0 || !watchedSourceBranch) {
            form.setValue('branch_target_id', 0)
            form.clearErrors('branch_target_id')
        }
    }, [watchedSourceBranch, form])

    useEffect(() => {
        if (isUpdate && currentRow) {
            const formData = {
                qr_code: currentRow.qr_code,
                status: currentRow.status?.toLowerCase() || 'draft',
                cancellation_reason: currentRow.cancellation_reason ?? undefined,
                branch_source_id: currentRow.branch_source_id || 0,
                branch_target_id: currentRow.branch_target_id || 0,
                sender_id: currentRow.sender_id || 0,
                receiver_id: currentRow.receiver_id || 0,
                fees_type: currentRow.fees_type?.toLowerCase() || 'sender',
                shipping_fees: currentRow.shipping_fees || 0,
                fees_currency_id: currentRow.fees_currency_id || 0,
                cash_on_delivery: currentRow.cash_on_delivery || 0,
                cod_currency_id: currentRow.cod_currency_id || 0,
            }
            form.reset(formData)
        } else if (open === 'create') {
            form.reset({
                qr_code: '',
                status: 'draft',
                cancellation_reason: undefined,
                branch_source_id: 0,
                branch_target_id: 0,
                sender_id: 0,
                receiver_id: 0,
                fees_type: 'sender',
                shipping_fees: 0,
                fees_currency_id: 0,
                cash_on_delivery: 0,
                cod_currency_id: 0,
            })
            form.clearErrors()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, currentRow])

    // Clear receiver when sender changes and vice versa
    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name === 'sender_id' && value.sender_id && value.receiver_id &&
                Number(value.sender_id) === Number(value.receiver_id)) {
                form.setValue('receiver_id', 0)
                form.clearErrors('receiver_id')
                setSelectedReceiver(null)
            }
            if (name === 'receiver_id' && value.sender_id && value.receiver_id &&
                Number(value.sender_id) === Number(value.receiver_id)) {
                form.setValue('sender_id', 0)
                form.clearErrors('sender_id')
                setSelectedSender(null)
            }
        })
        return () => subscription.unsubscribe()
    }, [form])

    // Clear search terms when dropdowns close
    useEffect(() => {
        if (!senderOpen) {
            setSenderSearchTerm('')
        }
    }, [senderOpen])

    useEffect(() => {
        if (!receiverOpen) {
            setReceiverSearchTerm('')
        }
    }, [receiverOpen])

    // Reset selected users when form is reset
    useEffect(() => {
        if (!open) {
            setSelectedSender(null)
            setSelectedReceiver(null)
        }
    }, [open])

    const [createOrder, createState] = useMutation(CREATE_ORDER_MUTATION, {
        refetchQueries: [ORDERS_QUERY],
        onCompleted: () => {
            toast.success('تم إنشاء الشحنة بنجاح!')
            handleClose()
            refetch?.()
        },
        onError: (error: any) => {
            console.error('Create order error:', error)
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                toast.error(error.graphQLErrors[0].message)
            } else {
                toast.error('فشل في إنشاء الشحنة')
            }
        },
    })

    const [updateOrder, updateState] = useMutation(UPDATE_ORDER_MUTATION, {
        refetchQueries: [ORDERS_QUERY],
        onCompleted: () => {
            toast.success('تم تحديث الشحنة بنجاح!')
            handleClose()
            refetch?.()
        },
        onError: (error: any) => {
            console.error('Update order error:', error)
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                toast.error(error.graphQLErrors[0].message)
            } else {
                toast.error('فشل في تحديث الشحنة')
            }
        },
    })

    // Use custom hook for optimized data fetching
    const {
        branchesData,
        branchesLoading,
        currenciesData,
        currenciesLoading,
        isLoading,
        hasError
    } = useOrderFormData()

    // State for search terms
    const [senderSearchTerm, setSenderSearchTerm] = useState('')
    const [receiverSearchTerm, setReceiverSearchTerm] = useState('')

    // State to store selected user data for display
    const [selectedSender, setSelectedSender] = useState<any>(null)
    const [selectedReceiver, setSelectedReceiver] = useState<any>(null)

    // Use searchable user queries
    const {
        usersData: senderUsersData,
        usersLoading: senderUsersLoading,
    } = useUsersSearch(senderSearchTerm)

    const {
        usersData: receiverUsersData,
        usersLoading: receiverUsersLoading,
    } = useUsersSearch(receiverSearchTerm)

    const onSubmit = async (values: any) => {

        // Validate required fields for create operations
        if (!isUpdate) {
            if (!values.qr_code || values.qr_code === '') {
                form.setError('qr_code', { type: 'manual', message: 'يجب إدخال رمز QR' })
                return
            }
            if (!values.branch_source_id || values.branch_source_id === 0) {
                form.setError('branch_source_id', { type: 'manual', message: 'يجب اختيار فرع المصدر' })
                return
            }
            if (!values.branch_target_id || values.branch_target_id === 0) {
                form.setError('branch_target_id', { type: 'manual', message: 'يجب اختيار فرع الوجهة' })
                return
            }
            if (!values.sender_id || values.sender_id === 0) {
                form.setError('sender_id', { type: 'manual', message: 'يجب اختيار المرسل' })
                return
            }
            if (!values.receiver_id || values.receiver_id === 0) {
                form.setError('receiver_id', { type: 'manual', message: 'يجب اختيار المستقبل' })
                return
            }
            if (!values.fees_currency_id || values.fees_currency_id === 0) {
                form.setError('fees_currency_id', { type: 'manual', message: 'يجب اختيار عملة الرسوم' })
                return
            }
            if (!values.cod_currency_id || values.cod_currency_id === 0) {
                form.setError('cod_currency_id', { type: 'manual', message: 'يجب اختيار عملة الدفع عند الاستلام' })
                return
            }
        }

        // Validate that source and target branches are different
        if (values.branch_source_id && values.branch_target_id &&
            Number(values.branch_source_id) === Number(values.branch_target_id)) {
            form.setError('branch_target_id', { type: 'manual', message: 'فرع الوجهة يجب أن يكون مختلف عن فرع المصدر' })
            return
        }

        // Validate that sender and receiver are different
        if (values.sender_id && values.receiver_id &&
            Number(values.sender_id) === Number(values.receiver_id)) {
            form.setError('receiver_id', { type: 'manual', message: 'المستقبل يجب أن يكون مختلف عن المرسل' })
            return
        }

        // Validate cancellation reason if status is canceled
        if (values.status === 'canceled' && !values.cancellation_reason) {
            form.setError('cancellation_reason', { type: 'manual', message: 'يجب اختيار سبب الإلغاء' })
            return
        }

        // Create payload with proper type conversion
        const payload: any = {
            qr_code: values.qr_code,
            status: values.status,
            cancellation_reason: values.cancellation_reason || undefined,
            branch_source_id: Number(values.branch_source_id),
            branch_target_id: Number(values.branch_target_id),
            sender_id: Number(values.sender_id),
            receiver_id: Number(values.receiver_id),
            fees_type: values.fees_type,
            shipping_fees: Number(values.shipping_fees),
            fees_currency_id: Number(values.fees_currency_id),
            cash_on_delivery: Number(values.cash_on_delivery),
            cod_currency_id: Number(values.cod_currency_id),
        }

        // Remove undefined values for cleaner payload
        Object.keys(payload).forEach(key => {
            if (payload[key] === undefined || payload[key] === null) {
                delete payload[key]
            }
        })

        if (isUpdate && currentRow) {
            await updateOrder({ variables: { id: currentRow.id, input: payload } })
        } else {
            await createOrder({ variables: { input: payload } })
        }
    }

    const handleClose = () => {
        form.reset()
        setCurrentRow(null)
        setOpen(null)
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'registered': return 'مسجل'
            case 'received': return 'مستلم'
            case 'transfer': return 'في النقل'
            case 'delivered': return 'تم التسليم'
            case 'canceled': return 'ملغي'
            case 'draft': return 'مسودة'
            default: return status
        }
    }

    const getCancellationReasonLabel = (reason: string) => {
        switch (reason) {
            case 'CanceledBySender': return 'ملغي من المرسل'
            case 'CanceledByReceiver': return 'ملغي من المستقبل'
            case 'CanceledDueToNoResponse': return 'ملغي بسبب عدم الاستجابة'
            case 'CanceledDueToFees': return 'ملغي بسبب الرسوم/الدفع عند الاستلام'
            default: return reason
        }
    }

    const getFeesTypeLabel = (type: string) => {
        switch (type) {
            case 'sender': return 'المرسل'
            case 'receiver': return 'المستقبل'
            default: return type
        }
    }

    return (
        <Sheet open={open === 'create' || open === 'update'} onOpenChange={handleClose}>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{isUpdate ? 'تعديل الشحنة' : 'إضافة شحنة جديدة'}</SheetTitle>
                    <SheetDescription>{isUpdate ? 'قم بتعديل بيانات الشحنة' : 'أدخل بيانات الشحنة الجديدة'}</SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6">
                        <FormField
                            control={form.control}
                            name="qr_code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>رمز QR</FormLabel>
                                    <FormControl>
                                        <Input placeholder="أدخل رمز QR" {...field} />
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
                                                {orderStatusValues.map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {getStatusLabel(status)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {watchedStatus === 'canceled' && (
                            <FormField
                                control={form.control}
                                name="cancellation_reason"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>سبب الإلغاء</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="اختر سبب الإلغاء" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {cancellationReasonValues.map((reason) => (
                                                        <SelectItem key={reason} value={reason}>
                                                            {getCancellationReasonLabel(reason)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="branch_source_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>فرع المصدر</FormLabel>
                                    <FormControl>
                                        <Popover open={branchSourceOpen} onOpenChange={setBranchSourceOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={branchSourceOpen}
                                                    className="w-full justify-between"
                                                >
                                                    {field.value && field.value > 0
                                                        ? (() => {
                                                            const branch = (branchesData as any)?.branches?.find((branch: any) => Number(branch.id) === Number(field.value))
                                                            return branch ? branch.name : 'اختر فرع المصدر...'
                                                        })()
                                                        : 'اختر فرع المصدر...'}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <Command>
                                                    <CommandInput placeholder="البحث في الفروع..." />
                                                    <CommandList>
                                                        <CommandEmpty>
                                                            {branchesLoading ? 'جاري تحميل الفروع...' : 'لم يتم العثور على فروع.'}
                                                        </CommandEmpty>
                                                        <CommandGroup>
                                                            {branchesLoading && (
                                                                <div className="p-2 text-center text-sm text-muted-foreground">
                                                                    جاري تحميل الفروع...
                                                                </div>
                                                            )}
                                                            {!branchesLoading && ((branchesData as any)?.branches ?? [])
                                                                .filter((branch: any) => {
                                                                    // Filter out the target branch to prevent same branch selection
                                                                    const targetBranchId = form.getValues('branch_target_id')
                                                                    return Number(branch.id) !== Number(targetBranchId)
                                                                })
                                                                .map((branch: any) => (
                                                                    <CommandItem
                                                                        key={branch.id}
                                                                        value={branch.name}
                                                                        onSelect={() => {
                                                                            field.onChange(Number(branch.id))
                                                                            setBranchSourceOpen(false)
                                                                            form.clearErrors('branch_source_id')
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                'mr-2 h-4 w-4',
                                                                                field.value === Number(branch.id) && (field.value ?? 0) > 0 ? 'opacity-100' : 'opacity-0'
                                                                            )}
                                                                        />
                                                                        <Building className="mr-2 h-4 w-4" />
                                                                        {branch.name}
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
                            name="branch_target_id"
                            render={({ field }) => {
                                const sourceBranchId = form.watch('branch_source_id')
                                const isTargetDisabled = !sourceBranchId || sourceBranchId === 0

                                return (
                                    <FormItem>
                                        <FormLabel>فرع الوجهة</FormLabel>
                                        <FormControl>
                                            <Popover open={branchTargetOpen && !isTargetDisabled} onOpenChange={(open) => {
                                                if (!isTargetDisabled) {
                                                    setBranchTargetOpen(open)
                                                }
                                            }}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={branchTargetOpen}
                                                        className="w-full justify-between"
                                                        disabled={isTargetDisabled}
                                                    >
                                                        {field.value && field.value > 0
                                                            ? (() => {
                                                                const branch = (branchesData as any)?.branches?.find((branch: any) => Number(branch.id) === Number(field.value))
                                                                return branch ? branch.name : 'اختر فرع الوجهة...'
                                                            })()
                                                            : isTargetDisabled ? 'اختر فرع المصدر أولاً...' : 'اختر فرع الوجهة...'}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0">
                                                    <Command>
                                                        <CommandInput placeholder="البحث في الفروع..." />
                                                        <CommandList>
                                                            <CommandEmpty>
                                                                {branchesLoading ? 'جاري تحميل الفروع...' : 'لم يتم العثور على فروع.'}
                                                            </CommandEmpty>
                                                            <CommandGroup>
                                                                {branchesLoading && (
                                                                    <div className="p-2 text-center text-sm text-muted-foreground">
                                                                        جاري تحميل الفروع...
                                                                    </div>
                                                                )}
                                                                {!branchesLoading && ((branchesData as any)?.branches ?? [])
                                                                    .filter((branch: any) => {
                                                                        // Filter out the source branch to prevent same branch selection
                                                                        const sourceBranchId = form.getValues('branch_source_id')
                                                                        return Number(branch.id) !== Number(sourceBranchId)
                                                                    })
                                                                    .map((branch: any) => (
                                                                        <CommandItem
                                                                            key={branch.id}
                                                                            value={branch.name}
                                                                            onSelect={() => {
                                                                                field.onChange(Number(branch.id))
                                                                                setBranchTargetOpen(false)
                                                                                form.clearErrors('branch_target_id')
                                                                            }}
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    'mr-2 h-4 w-4',
                                                                                    field.value === Number(branch.id) && (field.value ?? 0) > 0 ? 'opacity-100' : 'opacity-0'
                                                                                )}
                                                                            />
                                                                            <Building className="mr-2 h-4 w-4" />
                                                                            {branch.name}
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
                                )
                            }}
                        />

                        <FormField
                            control={form.control}
                            name="sender_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>المرسل</FormLabel>
                                    <FormControl>
                                        <Popover open={senderOpen} onOpenChange={setSenderOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={senderOpen}
                                                    className="w-full justify-between"
                                                >
                                                    {field.value && field.value > 0
                                                        ? (selectedSender ? `${selectedSender.name} - ${selectedSender.email}` : 'اختر المرسل...')
                                                        : 'اختر المرسل...'}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <Command>
                                                    <CommandInput
                                                        placeholder="البحث في المستخدمين..."
                                                        value={senderSearchTerm}
                                                        onValueChange={setSenderSearchTerm}
                                                    />
                                                    <CommandList>
                                                        <CommandEmpty>
                                                            {senderUsersLoading ? 'جاري البحث في المستخدمين...' : 'لم يتم العثور على مستخدمين.'}
                                                        </CommandEmpty>
                                                        <CommandGroup>
                                                            {senderUsersLoading && (
                                                                <div className="p-2 text-center text-sm text-muted-foreground">
                                                                    جاري البحث في المستخدمين...
                                                                </div>
                                                            )}
                                                            {!senderUsersLoading && ((senderUsersData as any)?.users ?? [])
                                                                .filter((user: any) => {
                                                                    // Filter out the receiver to prevent same user selection
                                                                    const receiverId = form.getValues('receiver_id')
                                                                    return Number(user.id) !== Number(receiverId)
                                                                })
                                                                .map((user: any) => (
                                                                    <CommandItem
                                                                        key={user.id}
                                                                        value={`${user.name} ${user.email}`}
                                                                        onSelect={() => {
                                                                            field.onChange(Number(user.id))
                                                                            setSelectedSender(user)
                                                                            setSenderOpen(false)
                                                                            form.clearErrors('sender_id')
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
                            name="receiver_id"
                            render={({ field }) => {
                                const senderId = form.watch('sender_id')
                                const isReceiverDisabled = !senderId || senderId === 0

                                return (
                                    <FormItem>
                                        <FormLabel>المستقبل</FormLabel>
                                        <FormControl>
                                            <Popover open={receiverOpen && !isReceiverDisabled} onOpenChange={(open) => {
                                                if (!isReceiverDisabled) {
                                                    setReceiverOpen(open)
                                                }
                                            }}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={receiverOpen}
                                                        className="w-full justify-between"
                                                        disabled={isReceiverDisabled}
                                                    >
                                                        {field.value && field.value > 0
                                                            ? (selectedReceiver ? `${selectedReceiver.name} - ${selectedReceiver.email}` : 'اختر المستقبل...')
                                                            : isReceiverDisabled ? 'اختر المرسل أولاً...' : 'اختر المستقبل...'}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0">
                                                    <Command>
                                                        <CommandInput
                                                            placeholder="البحث في المستخدمين..."
                                                            value={receiverSearchTerm}
                                                            onValueChange={setReceiverSearchTerm}
                                                        />
                                                        <CommandList>
                                                            <CommandEmpty>
                                                                {receiverUsersLoading ? 'جاري البحث في المستخدمين...' : 'لم يتم العثور على مستخدمين.'}
                                                            </CommandEmpty>
                                                            <CommandGroup>
                                                                {receiverUsersLoading && (
                                                                    <div className="p-2 text-center text-sm text-muted-foreground">
                                                                        جاري البحث في المستخدمين...
                                                                    </div>
                                                                )}
                                                                {!receiverUsersLoading && ((receiverUsersData as any)?.users ?? [])
                                                                    .filter((user: any) => {
                                                                        // Filter out the sender to prevent same user selection
                                                                        const senderId = form.getValues('sender_id')
                                                                        return Number(user.id) !== Number(senderId)
                                                                    })
                                                                    .map((user: any) => (
                                                                        <CommandItem
                                                                            key={user.id}
                                                                            value={`${user.name} ${user.email}`}
                                                                            onSelect={() => {
                                                                                field.onChange(Number(user.id))
                                                                                setSelectedReceiver(user)
                                                                                setReceiverOpen(false)
                                                                                form.clearErrors('receiver_id')
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
                                )
                            }}
                        />

                        <FormField
                            control={form.control}
                            name="fees_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>نوع الرسوم</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="اختر نوع الرسوم" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {feesTypeValues.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {getFeesTypeLabel(type)}
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
                            name="shipping_fees"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>رسوم الشحن</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="0.00"
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="fees_currency_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>عملة الرسوم</FormLabel>
                                    <FormControl>
                                        <Popover open={feesCurrencyOpen} onOpenChange={setFeesCurrencyOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={feesCurrencyOpen}
                                                    className="w-full justify-between"
                                                >
                                                    {field.value && field.value > 0
                                                        ? (() => {
                                                            const currency = (currenciesData as any)?.currencies?.find((currency: any) => Number(currency.id) === Number(field.value))
                                                            return currency ? `${currency.name} (${currency.code})` : 'اختر عملة الرسوم...'
                                                        })()
                                                        : 'اختر عملة الرسوم...'}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <Command>
                                                    <CommandInput placeholder="البحث في العملات..." />
                                                    <CommandList>
                                                        <CommandEmpty>لم يتم العثور على عملات.</CommandEmpty>
                                                        <CommandGroup>
                                                            {((currenciesData as any)?.currencies ?? []).map((currency: any) => (
                                                                <CommandItem
                                                                    key={currency.id}
                                                                    onSelect={() => {
                                                                        field.onChange(Number(currency.id))
                                                                        setFeesCurrencyOpen(false)
                                                                        form.clearErrors('fees_currency_id')
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            'mr-2 h-4 w-4',
                                                                            field.value === Number(currency.id) && (field.value ?? 0) > 0 ? 'opacity-100' : 'opacity-0'
                                                                        )}
                                                                    />
                                                                    <Package className="mr-2 h-4 w-4" />
                                                                    <div className="flex flex-col">
                                                                        <span className="font-medium">{currency.name}</span>
                                                                        <span className="text-sm text-muted-foreground">{currency.code}</span>
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
                            name="cash_on_delivery"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>الدفع عند الاستلام</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="0.00"
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="cod_currency_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>عملة الدفع عند الاستلام</FormLabel>
                                    <FormControl>
                                        <Popover open={codCurrencyOpen} onOpenChange={setCodCurrencyOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={codCurrencyOpen}
                                                    className="w-full justify-between"
                                                >
                                                    {field.value && field.value > 0
                                                        ? (() => {
                                                            const currency = (currenciesData as any)?.currencies?.find((currency: any) => Number(currency.id) === Number(field.value))
                                                            return currency ? `${currency.name} (${currency.code})` : 'اختر عملة الدفع عند الاستلام...'
                                                        })()
                                                        : 'اختر عملة الدفع عند الاستلام...'}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <Command>
                                                    <CommandInput placeholder="البحث في العملات..." />
                                                    <CommandList>
                                                        <CommandEmpty>لم يتم العثور على عملات.</CommandEmpty>
                                                        <CommandGroup>
                                                            {((currenciesData as any)?.currencies ?? []).map((currency: any) => (
                                                                <CommandItem
                                                                    key={currency.id}
                                                                    onSelect={() => {
                                                                        field.onChange(Number(currency.id))
                                                                        setCodCurrencyOpen(false)
                                                                        form.clearErrors('cod_currency_id')
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            'mr-2 h-4 w-4',
                                                                            field.value === Number(currency.id) && (field.value ?? 0) > 0 ? 'opacity-100' : 'opacity-0'
                                                                        )}
                                                                    />
                                                                    <Package className="mr-2 h-4 w-4" />
                                                                    <div className="flex flex-col">
                                                                        <span className="font-medium">{currency.name}</span>
                                                                        <span className="text-sm text-muted-foreground">{currency.code}</span>
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
