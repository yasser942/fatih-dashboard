import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@apollo/client/react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
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
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { SelectDropdown } from '@/components/select-dropdown'
import { useTasks } from './tasks-provider'
import {
    createTaskSchema,
    updateTaskSchema,
    taskStatusValues,
    type CreateTask,
    type UpdateTask,
} from '../data/schema'
import { z } from 'zod'
import { CREATE_TASK_MUTATION, UPDATE_TASK_MUTATION } from '../graphql/mutations'
import { GET_TASKS_QUERY } from '../graphql/queries'
import { ORDERS_QUERY } from '@/features/orders/graphql/queries'
import { USERS_QUERY } from '@/features/users/graphql/queries'
import { FLEETS_QUERY } from '@/features/fleets/graphql/queries'
import { TASK_TYPES_QUERY } from '@/features/task-types/graphql/queries'
import { gql } from '@apollo/client/core'
import { Loader2, Package, User, TruckIcon, ClipboardList, Building, Users, Route, CircleCheck, Info } from 'lucide-react'

const BRANCHES_QUERY = gql`
  query Branches {
    branches {
      id
      name
    }
  }
`

const CUSTOMERS_QUERY = gql`
  query Customers($first: Int, $search: String) {
    customers(first: $first, search: $search) {
      data {
        id
        market_name
      }
    }
  }
`

export function TasksMutateDrawer() {
    const { open, setOpen, currentRow, setCurrentRow, refetch } = useTasks()
    const isUpdate = open === 'update' && currentRow

    const form = useForm<CreateTask | UpdateTask>({
        resolver: zodResolver(isUpdate ? updateTaskSchema : createTaskSchema, {
            errorMap: (issue, ctx) => {
                // Map common Zod errors to user-friendly Arabic messages
                if (issue.code === z.ZodIssueCode.invalid_type) {
                    if (issue.expected === 'number' && (issue.received === 'undefined' || issue.received === 'nan')) {
                        // Map field-specific messages
                        const fieldMessages: Record<string, string> = {
                            task_type_id: 'يجب اختيار نوع المهمة المطلوبة',
                        }
                        const fieldPath = issue.path[0] as string
                        if (fieldMessages[fieldPath]) {
                            return { message: fieldMessages[fieldPath] }
                        }
                    }
                }
                return { message: ctx.defaultError }
            },
        }),
        defaultValues: {
            order_id: undefined,
            user_id: undefined,
            vehicle_id: undefined,
            from_branch_id: null,
            to_branch_id: null,
            from_customer_id: null,
            to_customer_id: null,
            task_type_id: undefined,
            current_status: 'assigned',
            previous_status: null,
            completed_at: null,
            reason_for_cancellation: null,
            is_auto_created: false,
        },
    })

    // Fetch related data
    const { data: ordersData, loading: ordersLoading } = useQuery(ORDERS_QUERY, {
        variables: { first: 100 },
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
    })

    const { data: usersData, loading: usersLoading } = useQuery(USERS_QUERY, {
        variables: { first: 100 },
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
    })

    const { data: fleetsData, loading: fleetsLoading } = useQuery(FLEETS_QUERY, {
        variables: { first: 100 },
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
    })

    const { data: taskTypesData, loading: taskTypesLoading } = useQuery(TASK_TYPES_QUERY, {
        variables: { first: 100 },
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
    })

    const { data: branchesData, loading: branchesLoading } = useQuery(BRANCHES_QUERY, {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
    })

    const { data: customersData, loading: customersLoading } = useQuery(CUSTOMERS_QUERY, {
        variables: { first: 100 },
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
    })

    // Reset form when currentRow changes (for editing)
    useEffect(() => {
        if (isUpdate && currentRow) {
            form.reset({
                order_id: Number(currentRow.order_id),
                user_id: Number(currentRow.user_id),
                vehicle_id: Number(currentRow.vehicle_id),
                from_branch_id: currentRow.from_branch_id ? Number(currentRow.from_branch_id) : null,
                to_branch_id: currentRow.to_branch_id ? Number(currentRow.to_branch_id) : null,
                from_customer_id: currentRow.from_customer_id ? Number(currentRow.from_customer_id) : null,
                to_customer_id: currentRow.to_customer_id ? Number(currentRow.to_customer_id) : null,
                task_type_id: Number(currentRow.task_type_id),
                current_status: currentRow.current_status,
                previous_status: currentRow.previous_status || null,
                completed_at: currentRow.completed_at || null,
                reason_for_cancellation: currentRow.reason_for_cancellation || null,
                is_auto_created: currentRow.is_auto_created,
            })
        } else if (open === 'create') {
            form.reset({
                order_id: undefined,
                user_id: undefined,
                vehicle_id: undefined,
                from_branch_id: null,
                to_branch_id: null,
                from_customer_id: null,
                to_customer_id: null,
                task_type_id: undefined,
                current_status: 'assigned',
                previous_status: null,
                completed_at: null,
                reason_for_cancellation: null,
                is_auto_created: false,
            })
        }
    }, [currentRow, isUpdate, open, form])

    const [createTask, { loading: createLoading }] = useMutation(CREATE_TASK_MUTATION, {
        refetchQueries: [GET_TASKS_QUERY],
        onCompleted: () => {
            form.reset()
            setOpen(null)
            setCurrentRow(null)
            toast.success('تم إنشاء المهمة بنجاح', {
                description: 'تمت إضافة المهمة الجديدة إلى النظام',
            })
            refetch?.()
        },
        onError: (error: any) => {
            const errorMessage = error.graphQLErrors?.[0]?.message || error.message || 'حدث خطأ غير متوقع'
            const validationErrors = error.graphQLErrors?.[0]?.extensions?.validation

            if (validationErrors) {
                // Handle validation errors from backend
                Object.keys(validationErrors).forEach((field) => {
                    const fieldMap: Record<string, keyof CreateTask> = {
                        order_id: 'order_id',
                        user_id: 'user_id',
                        vehicle_id: 'vehicle_id',
                        task_type_id: 'task_type_id',
                        from_branch_id: 'from_branch_id',
                        to_branch_id: 'to_branch_id',
                        from_customer_id: 'from_customer_id',
                        to_customer_id: 'to_customer_id',
                        current_status: 'current_status',
                        reason_for_cancellation: 'reason_for_cancellation',
                    }
                    const formField = fieldMap[field]
                    if (formField) {
                        form.setError(formField, {
                            message: validationErrors[field][0],
                        })
                    }
                })
                toast.error('يرجى التحقق من البيانات المدخلة', {
                    description: 'بعض الحقول تحتوي على أخطاء. يرجى مراجعة النموذج وإصلاحها'
                })
            } else {
                toast.error('فشل في إنشاء المهمة', {
                    description: errorMessage,
                })
            }
        },
    })

    const [updateTask, { loading: updateLoading }] = useMutation(UPDATE_TASK_MUTATION, {
        refetchQueries: [GET_TASKS_QUERY],
        onCompleted: () => {
            form.reset()
            setOpen(null)
            setCurrentRow(null)
            toast.success('تم تحديث المهمة بنجاح', {
                description: 'تم حفظ التغييرات بنجاح',
            })
            refetch?.()
        },
        onError: (error: any) => {
            const errorMessage = error.graphQLErrors?.[0]?.message || error.message || 'حدث خطأ غير متوقع'
            const validationErrors = error.graphQLErrors?.[0]?.extensions?.validation

            if (validationErrors) {
                // Handle validation errors from backend
                Object.keys(validationErrors).forEach((field) => {
                    const fieldMap: Record<string, keyof UpdateTask> = {
                        order_id: 'order_id',
                        user_id: 'user_id',
                        vehicle_id: 'vehicle_id',
                        task_type_id: 'task_type_id',
                        from_branch_id: 'from_branch_id',
                        to_branch_id: 'to_branch_id',
                        from_customer_id: 'from_customer_id',
                        to_customer_id: 'to_customer_id',
                        current_status: 'current_status',
                        reason_for_cancellation: 'reason_for_cancellation',
                    }
                    const formField = fieldMap[field]
                    if (formField) {
                        form.setError(formField, {
                            message: validationErrors[field][0],
                        })
                    }
                })
                toast.error('يرجى التحقق من البيانات المدخلة', {
                    description: 'بعض الحقول تحتوي على أخطاء. يرجى مراجعة النموذج وإصلاحها'
                })
            } else {
                toast.error('فشل في تحديث المهمة', {
                    description: errorMessage,
                })
            }
        },
    })

    const onSubmit = async (data: CreateTask | UpdateTask) => {
        try {
            // Validate cancellation reason if status is cancelled or failed
            if ((data.current_status === 'cancelled' || data.current_status === 'failed') &&
                (!data.reason_for_cancellation || data.reason_for_cancellation.trim() === '')) {
                const statusText = data.current_status === 'cancelled' ? 'الإلغاء' : 'الفشل'
                form.setError('reason_for_cancellation', {
                    type: 'manual',
                    message: `يجب إدخال سبب ${statusText} عند اختيار حالة "${statusText === 'الإلغاء' ? 'ملغي' : 'فشل'}"`
                })
                toast.error('يرجى التحقق من البيانات', {
                    description: `عند اختيار حالة "${statusText === 'الإلغاء' ? 'ملغي' : 'فشل'}" يجب تزويدنا بشرح مفصل لسبب ${statusText}`
                })
                return
            }

            // Only validate required task_type_id here; other FKs are optional now
            const taskTypeIdNum = typeof data.task_type_id === 'number' ? data.task_type_id : Number(data.task_type_id)
            if (!data.task_type_id || isNaN(taskTypeIdNum) || taskTypeIdNum < 1) {
                form.setError('task_type_id', {
                    type: 'manual',
                    message: 'يجب اختيار نوع المهمة المطلوبة'
                })
                toast.error('بيانات غير مكتملة', {
                    description: 'يرجى اختيار نوع المهمة'
                })
                return
            }

            const input: any = {
                current_status: data.current_status,
                is_auto_created: data.is_auto_created ?? false,
            }

            // Add optional foreign keys if provided
            if (data.order_id !== null && data.order_id !== undefined) {
                input.order_id = data.order_id
            }
            if (data.user_id !== null && data.user_id !== undefined) {
                input.user_id = data.user_id
            }
            if (data.vehicle_id !== null && data.vehicle_id !== undefined) {
                input.vehicle_id = data.vehicle_id
            }

            // Required foreign key
            if (data.task_type_id !== null && data.task_type_id !== undefined) {
                input.task_type_id = data.task_type_id
            }

            // Add optional fields only if they have values
            if (data.from_branch_id !== null && data.from_branch_id !== undefined) {
                input.from_branch_id = data.from_branch_id
            }
            if (data.to_branch_id !== null && data.to_branch_id !== undefined) {
                input.to_branch_id = data.to_branch_id
            }
            if (data.from_customer_id !== null && data.from_customer_id !== undefined) {
                input.from_customer_id = data.from_customer_id
            }
            if (data.to_customer_id !== null && data.to_customer_id !== undefined) {
                input.to_customer_id = data.to_customer_id
            }
            if (data.previous_status) {
                input.previous_status = data.previous_status
            }
            if (data.completed_at) {
                input.completed_at = data.completed_at
            }
            if (data.reason_for_cancellation) {
                input.reason_for_cancellation = data.reason_for_cancellation
            }

            if (isUpdate) {
                await updateTask({
                    variables: {
                        id: currentRow.id,
                        input,
                    },
                })
            } else {
                await createTask({
                    variables: {
                        input,
                    },
                })
            }
        } catch (error) {
            // Error handling is done in onError callbacks
            console.error('Error saving task:', error)
        }
    }

    const handleClose = () => {
        form.reset()
        setOpen(null)
        setCurrentRow(null)
    }

    const isLoading = createLoading || updateLoading

    // Prepare dropdown items
    const orders = ordersData?.orders?.data || []
    const users = usersData?.users?.data || []
    const fleets = fleetsData?.fleets?.data || []
    const taskTypes = taskTypesData?.taskTypes?.data || []
    const branches = branchesData?.branches || []
    const customers = customersData?.customers?.data || []

    const statusOptions = taskStatusValues.map((status) => ({
        label: status === 'pending' ? 'قيد الانتظار' :
            status === 'assigned' ? 'معين' :
                status === 'in_progress' ? 'قيد التنفيذ' :
                    status === 'done' ? 'مكتمل' :
                        status === 'cancelled' ? 'ملغي' :
                            status === 'failed' ? 'فشل' :
                                status === 'reassigned' ? 'إعادة تعيين' : status,
        value: status,
    }))

    const currentStatus = form.watch('current_status')
    const showCancellationReason = currentStatus === 'cancelled' || currentStatus === 'failed'

    return (
        <Sheet open={open === 'create' || open === 'update'} onOpenChange={handleClose}>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-6">
                <SheetHeader className="space-y-3 pb-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                            <ClipboardList className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <SheetTitle className="text-2xl">
                                {isUpdate ? 'تعديل المهمة' : 'إضافة مهمة جديدة'}
                            </SheetTitle>
                            <SheetDescription className="text-base mt-1">
                                {isUpdate
                                    ? 'قم بتعديل بيانات المهمة أدناه'
                                    : 'املأ الحقول أدناه لإضافة مهمة جديدة إلى النظام'}
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Basic Information Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-3">
                                <Info className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-semibold">المعلومات الأساسية</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-1">
                                {/* Order */}
                                <FormField
                                    control={form.control}
                                    name="order_id"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="flex items-center gap-2">
                                                <Package className="h-4 w-4" />
                                                الطلب
                                            </FormLabel>
                                            <FormControl>
                                                <div className="px-1">
                                                    <SelectDropdown
                                                        defaultValue={field.value ? String(field.value) : 'none'}
                                                        onValueChange={(val) => field.onChange(val === 'none' ? null : Number(val))}
                                                        placeholder="اختر الطلب"
                                                        items={[
                                                            { label: 'لا يوجد', value: 'none' },
                                                            ...orders.map((order: any) => ({
                                                                label: `#${order.id} - ${order.qr_code || 'بدون رمز'}`,
                                                                value: String(order.id),
                                                            })),
                                                        ]}
                                                        isPending={ordersLoading}
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormDescription className="text-xs px-1">
                                                الطلب المرتبط بهذه المهمة
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Task Type */}
                                <FormField
                                    control={form.control}
                                    name="task_type_id"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="flex items-center gap-2">
                                                <ClipboardList className="h-4 w-4" />
                                                نوع المهمة
                                                <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="px-1">
                                                    <SelectDropdown
                                                        defaultValue={field.value ? String(field.value) : undefined}
                                                        onValueChange={(val) => field.onChange(Number(val))}
                                                        placeholder="اختر نوع المهمة"
                                                        items={taskTypes.map((taskType: any) => ({
                                                            label: `${taskType.task_ar} (${taskType.task_en})`,
                                                            value: String(taskType.id),
                                                        }))}
                                                        isPending={taskTypesLoading}
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormDescription className="text-xs px-1">
                                                نوع المهمة المطلوبة
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-1">
                                {/* User */}
                                <FormField
                                    control={form.control}
                                    name="user_id"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                المستخدم
                                            </FormLabel>
                                            <FormControl>
                                                <div className="px-1">
                                                    <SelectDropdown
                                                        defaultValue={field.value ? String(field.value) : 'none'}
                                                        onValueChange={(val) => field.onChange(val === 'none' ? null : Number(val))}
                                                        placeholder="اختر المستخدم"
                                                        items={[
                                                            { label: 'لا يوجد', value: 'none' },
                                                            ...users.map((user: any) => ({
                                                                label: `${user.name} (${user.email})`,
                                                                value: String(user.id),
                                                            })),
                                                        ]}
                                                        isPending={usersLoading}
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormDescription className="text-xs px-1">
                                                المستخدم المسؤول عن تنفيذ المهمة
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Vehicle */}
                                <FormField
                                    control={form.control}
                                    name="vehicle_id"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="flex items-center gap-2">
                                                <TruckIcon className="h-4 w-4" />
                                                المركبة
                                            </FormLabel>
                                            <FormControl>
                                                <div className="px-1">
                                                    <SelectDropdown
                                                        defaultValue={field.value ? String(field.value) : 'none'}
                                                        onValueChange={(val) => field.onChange(val === 'none' ? null : Number(val))}
                                                        placeholder="اختر المركبة"
                                                        items={[
                                                            { label: 'لا يوجد', value: 'none' },
                                                            ...fleets.map((fleet: any) => ({
                                                                label: `${fleet.plate_number || 'بدون لوحة'} - ${fleet.fleetType?.type_ar || fleet.fleetType?.type_en || 'غير محدد'}`,
                                                                value: String(fleet.id),
                                                            })),
                                                        ]}
                                                        isPending={fleetsLoading}
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormDescription className="text-xs px-1">
                                                المركبة المستخدمة للمهمة
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Separator className="my-6" />

                        {/* Route Information Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-3 px-1">
                                <Route className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-semibold">معلومات المسار</h3>
                                <span className="text-xs text-muted-foreground">(اختياري)</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-1">
                                {/* From Branch */}
                                <FormField
                                    control={form.control}
                                    name="from_branch_id"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="flex items-center gap-2">
                                                <Building className="h-4 w-4" />
                                                من فرع
                                            </FormLabel>
                                            <FormControl>
                                                <div className="px-1">
                                                    <SelectDropdown
                                                        defaultValue={field.value ? String(field.value) : 'none'}
                                                        onValueChange={(val) => field.onChange(val === 'none' ? null : Number(val))}
                                                        placeholder="اختر فرع المصدر"
                                                        items={[
                                                            { label: 'لا يوجد', value: 'none' },
                                                            ...branches.map((branch: any) => ({
                                                                label: branch.name,
                                                                value: String(branch.id),
                                                            })),
                                                        ]}
                                                        isPending={branchesLoading}
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormDescription className="text-xs px-1">
                                                الفرع الذي تبدأ منه المهمة
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* To Branch */}
                                <FormField
                                    control={form.control}
                                    name="to_branch_id"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="flex items-center gap-2">
                                                <Building className="h-4 w-4" />
                                                إلى فرع
                                            </FormLabel>
                                            <FormControl>
                                                <div className="px-1">
                                                    <SelectDropdown
                                                        defaultValue={field.value ? String(field.value) : 'none'}
                                                        onValueChange={(val) => field.onChange(val === 'none' ? null : Number(val))}
                                                        placeholder="اختر فرع الوجهة"
                                                        items={[
                                                            { label: 'لا يوجد', value: 'none' },
                                                            ...branches.map((branch: any) => ({
                                                                label: branch.name,
                                                                value: String(branch.id),
                                                            })),
                                                        ]}
                                                        isPending={branchesLoading}
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormDescription className="text-xs px-1">
                                                الفرع الذي تنتهي عنده المهمة
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-1">
                                {/* From Customer */}
                                <FormField
                                    control={form.control}
                                    name="from_customer_id"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="flex items-center gap-2">
                                                <Users className="h-4 w-4" />
                                                من عميل
                                            </FormLabel>
                                            <FormControl>
                                                <div className="px-1">
                                                    <SelectDropdown
                                                        defaultValue={field.value ? String(field.value) : 'none'}
                                                        onValueChange={(val) => field.onChange(val === 'none' ? null : Number(val))}
                                                        placeholder="اختر عميل المصدر"
                                                        items={[
                                                            { label: 'لا يوجد', value: 'none' },
                                                            ...customers.map((customer: any) => ({
                                                                label: customer.market_name || `عميل #${customer.id}`,
                                                                value: String(customer.id),
                                                            })),
                                                        ]}
                                                        isPending={customersLoading}
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormDescription className="text-xs px-1">
                                                العميل في نقطة البداية
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* To Customer */}
                                <FormField
                                    control={form.control}
                                    name="to_customer_id"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="flex items-center gap-2">
                                                <Users className="h-4 w-4" />
                                                إلى عميل
                                            </FormLabel>
                                            <FormControl>
                                                <div className="px-1">
                                                    <SelectDropdown
                                                        defaultValue={field.value ? String(field.value) : 'none'}
                                                        onValueChange={(val) => field.onChange(val === 'none' ? null : Number(val))}
                                                        placeholder="اختر عميل الوجهة"
                                                        items={[
                                                            { label: 'لا يوجد', value: 'none' },
                                                            ...customers.map((customer: any) => ({
                                                                label: customer.market_name || `عميل #${customer.id}`,
                                                                value: String(customer.id),
                                                            })),
                                                        ]}
                                                        isPending={customersLoading}
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormDescription className="text-xs px-1">
                                                العميل في نقطة النهاية
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Separator className="my-6" />

                        {/* Status & Options Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-3 px-1">
                                <CircleCheck className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-semibold">الحالة والخيارات</h3>
                            </div>

                            <div className="px-1 space-y-4">
                                {/* Current Status */}
                                <FormField
                                    control={form.control}
                                    name="current_status"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="flex items-center gap-2">
                                                الحالة الحالية
                                                <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="px-1">
                                                    <SelectDropdown
                                                        defaultValue={field.value}
                                                        onValueChange={field.onChange}
                                                        placeholder="اختر الحالة"
                                                        items={statusOptions}
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormDescription className="text-xs px-1">
                                                الحالة الحالية للمهمة
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Reason for Cancellation - Conditional */}
                                {showCancellationReason && (
                                    <FormField
                                        control={form.control}
                                        name="reason_for_cancellation"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="flex items-center gap-2">
                                                    سبب الإلغاء
                                                    <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="px-1">
                                                        <Textarea
                                                            placeholder="أدخل سبب الإلغاء أو الفشل"
                                                            disabled={isLoading}
                                                            className="min-h-[100px]"
                                                            {...field}
                                                            value={field.value || ''}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormDescription className="text-xs px-1">
                                                    يرجى توضيح سبب {currentStatus === 'cancelled' ? 'الإلغاء' : 'الفشل'}
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>

                            {/* Is Auto Created */}
                            <div className="px-1">
                                <FormField
                                    control={form.control}
                                    name="is_auto_created"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm transition-colors hover:bg-muted/50">
                                            <div className="space-y-0.5 flex-1">
                                                <FormLabel className="text-base flex items-center gap-2">
                                                    <ClipboardList className="h-4 w-4" />
                                                    إنشاء تلقائي
                                                </FormLabel>
                                                <FormDescription className="text-sm">
                                                    {field.value
                                                        ? 'تم إنشاء المهمة تلقائياً بواسطة النظام'
                                                        : 'المهمة تم إنشاؤها يدوياً من قبل المستخدم'}
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    disabled={isLoading}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <SheetFooter className="gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={isLoading}
                            >
                                إلغاء
                            </Button>
                            <Button type="submit" disabled={isLoading} className="min-w-[120px]">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        جاري الحفظ...
                                    </>
                                ) : isUpdate ? (
                                    'تحديث'
                                ) : (
                                    'إنشاء'
                                )}
                            </Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}
