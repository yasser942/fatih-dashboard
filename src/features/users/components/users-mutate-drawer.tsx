import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@apollo/client/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
    AvatarIcon,
    EnvelopeClosedIcon,
    LockClosedIcon,
    CalendarIcon,
    MobileIcon,
    PersonIcon,
    IdCardIcon,
    BackpackIcon,
    HomeIcon,
    GlobeIcon,
    CardStackIcon,
    CheckCircledIcon,
    Cross2Icon
} from '@radix-ui/react-icons'
import { useUsers } from './users-provider'
import {
    userStatusValues,
    type CreateUser,
    type UpdateUser,
    createUserWithProfileSchema,
    updateUserWithProfileSchema,
    createUserWithProfileFlatSchema,
    updateUserWithProfileFlatSchema,
    type CreateUserWithProfileFlat,
    type UpdateUserWithProfileFlat,
} from '../data/schema'
import { CREATE_USER_WITH_PROFILE, UPDATE_USER_WITH_PROFILE, ASSIGN_ROLES_MUTATION, ASSIGN_PERMISSIONS_MUTATION } from '../graphql/mutations'
import { USERS_QUERY } from '../graphql/queries'
import { gql } from '@apollo/client/core'
import { BRANCHES_QUERY } from '@/features/branches/graphql/queries'
import { DEPARTMENTS_QUERY } from '@/features/departments/graphql/queries'
import { POSITIONS_QUERY } from '@/features/positions/graphql/queries'
import { EMPLOYEES_QUERY } from '@/features/employees/graphql/queries'
import { customerStatusValues, customerTypeValues } from '@/features/customers/data/schema'
import { employeeContractTypeValues, employeeStatusValues } from '@/features/employees/data/schema'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

const LOCATIONS_QUERY = gql`
  query Locations($search: String) {
    locationMasters(first: 50, search: $search) {
      data {
        id
        country_ar
        governorate_ar
        district_ar
        subdistrict_ar
      }
    }
  }
`

const ROLES_QUERY = gql`
  query Roles {
    roles { id name }
  }
`

const PERMISSIONS_QUERY = gql`
  query Permissions {
    permissions { id name }
  }
`

type FormValues = CreateUserWithProfileFlat

export function UsersMutateDrawer() {
    const { open, setOpen, currentRow, setCurrentRow, refetch } = useUsers()
    const isUpdate = open === 'update' && currentRow
    const [selectedKind, setSelectedKind] = useState<'Customer' | 'Employee'>('Customer')
    const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([])
    const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([])

    const form = useForm<FormValues>({
        resolver: zodResolver(isUpdate ? updateUserWithProfileFlatSchema : createUserWithProfileFlatSchema),
        defaultValues: {
            name: '',
            full_name: '',
            email: '',
            password: '',
            birth_date: '',
            mother_name: '',
            system_user_name: '',
            iban: '',
            phone: '',
            Job: '',
            location_id: undefined,
            full_address: '',
            latitude: undefined,
            longitude: undefined,
            status: 'Active',
            is_account: false,
            kind: 'Customer',
            // customer defaults
            customer_type: 'Individual',
            customer_market_name: '',
            customer_status: 'Active',
            // employee defaults
            branch_id: undefined,
            department_id: undefined,
            position_id: undefined,
            hired_date: '',
            salary: undefined,
            contract_type: 'full_time',
            employee_status: 'active',
            supervisor_id: undefined,
        },
    })

    useEffect(() => {
        if (isUpdate && currentRow) {
            form.reset({
                name: currentRow.name,
                full_name: currentRow.full_name ?? '',
                email: currentRow.email,
                password: '', // Don't populate password on update
                birth_date: currentRow.birth_date ?? '',
                mother_name: currentRow.mother_name ?? '',
                system_user_name: currentRow.system_user_name ?? '',
                iban: currentRow.iban ?? '',
                phone: currentRow.phone ?? '',
                Job: currentRow.Job ?? '',
                location_id: currentRow.location_id ?? undefined,
                full_address: currentRow.full_address ?? '',
                latitude: currentRow.latitude ?? undefined,
                longitude: currentRow.longitude ?? undefined,
                status: currentRow.status,
                is_account: currentRow.is_account,
                kind: currentRow.employee ? 'Employee' : currentRow.customer ? 'Customer' : 'User',
                // customer
                customer_type: currentRow.customer?.customer_type || 'Individual',
                customer_market_name: currentRow.customer?.market_name || '',
                customer_status: (currentRow.customer?.status as any) || 'Active',
                // employee
                branch_id: currentRow.employee?.branch?.id,
                department_id: currentRow.employee?.department?.id,
                position_id: currentRow.employee?.position?.id,
                hired_date: currentRow.employee?.hired_date || '',
                salary: (currentRow.employee?.salary as any) ?? undefined,
                contract_type: (currentRow.employee?.contract_type as any) || 'full_time',
                employee_status: (currentRow.employee?.status as any) || 'active',
                supervisor_id: currentRow.employee?.supervisor?.id,
            })

            // Set the selected kind based on the user's profile
            const kind = currentRow.employee ? 'Employee' : 'Customer'
            setSelectedKind(kind)

            // Prefill roles and permissions for edit
            setSelectedRoleIds(currentRow.roles?.map((r: any) => String(r.id)) || [])
            setSelectedPermissionIds(currentRow.permissions?.map((p: any) => String(p.id)) || [])
        } else if (open === 'create') {
            form.reset({
                name: '',
                full_name: '',
                email: '',
                password: '',
                birth_date: '',
                mother_name: '',
                system_user_name: '',
                iban: '',
                phone: '',
                Job: '',
                location_id: undefined,
                full_address: '',
                latitude: undefined,
                longitude: undefined,
                status: 'Active',
                is_account: false,
                kind: 'Customer',
                customer_type: 'Individual',
                customer_market_name: '',
                customer_status: 'Active',
                branch_id: undefined,
                department_id: undefined,
                position_id: undefined,
                hired_date: '',
                salary: undefined,
                contract_type: 'full_time',
                employee_status: 'active',
                supervisor_id: undefined,
            })
            setSelectedKind('Customer')
            setSelectedRoleIds([])
            setSelectedPermissionIds([])
            form.clearErrors()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, currentRow])

    // Option data for employee form
    const { data: branchesData } = useQuery(BRANCHES_QUERY)
    const { data: departmentsData } = useQuery(DEPARTMENTS_QUERY)
    const { data: positionsData } = useQuery(POSITIONS_QUERY)
    const { data: supervisorsData } = useQuery(EMPLOYEES_QUERY, { variables: { first: 100 } })
    const { data: rolesData } = useQuery(ROLES_QUERY)
    const { data: permissionsData } = useQuery(PERMISSIONS_QUERY)
    const branches = branchesData?.branches || []
    const departments = departmentsData?.departments?.data || []
    const positions = positionsData?.positions?.data || []
    const supervisors = supervisorsData?.employees?.data || []
    const roles = rolesData?.roles || []
    const permissions = permissionsData?.permissions || []

    const [createUser, createState] = useMutation(CREATE_USER_WITH_PROFILE, {
        refetchQueries: [USERS_QUERY],
        onError: (error: any) => {
            console.error('Create user error:', error)
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                toast.error(error.graphQLErrors[0].message)
            } else {
                toast.error(error?.networkError?.message || error?.message || 'فشل في إنشاء المستخدم')
            }
        },
    })

    const [updateUser, updateState] = useMutation(UPDATE_USER_WITH_PROFILE, {
        refetchQueries: [USERS_QUERY],
        onError: (error: any) => {
            console.error('Update user error:', error)
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                toast.error(error.graphQLErrors[0].message)
            } else {
                toast.error(error?.networkError?.message || error?.message || 'فشل في تحديث المستخدم')
            }
        },
    })

    const [assignRoles] = useMutation(ASSIGN_ROLES_MUTATION, { refetchQueries: [USERS_QUERY] })
    const [assignPermissions] = useMutation(ASSIGN_PERMISSIONS_MUTATION, { refetchQueries: [USERS_QUERY] })

    const onSubmit = async (values: FormValues) => {
        const userPayload: any = {
            name: values.name,
            full_name: values.full_name || undefined,
            email: values.email,
            password: isUpdate && !values.password ? undefined : values.password,
            birth_date: values.birth_date || undefined,
            mother_name: values.mother_name || undefined,
            system_user_name: values.system_user_name || undefined,
            iban: values.iban || undefined,
            phone: values.phone || undefined,
            Job: values.Job || undefined,
            location_id: values.location_id ? Number(values.location_id) : undefined,
            full_address: values.full_address || undefined,
            latitude: values.latitude ?? undefined,
            longitude: values.longitude ?? undefined,
            status: values.status,
            is_account: values.is_account,
        }

        const input: any = { kind: values.kind, user: userPayload }
        if (values.kind === 'Customer') {
            input.customer = {
                customer_type: values.customer_type,
                market_name: values.customer_market_name || undefined,
                status: values.customer_status,
            }
        }
        if (values.kind === 'Employee') {
            // Ensure hired_date conforms to GraphQL DateTime (YYYY-MM-DD HH:mm:ss)
            const hiredDate = values.hired_date
                ? (values.hired_date.length === 10
                    ? `${values.hired_date} 00:00:00`
                    : values.hired_date)
                : undefined

            input.employee = {
                branch_id: values.branch_id,
                department_id: values.department_id,
                position_id: values.position_id,
                hired_date: hiredDate,
                salary: values.salary,
                // GraphQL enum tokens expected: FULL_TIME, PART_TIME, INTERN, CONTRACT
                contract_type: values.contract_type ? values.contract_type.toUpperCase() : undefined,
                // GraphQL enum tokens expected: ACTIVE, INACTIVE, ON_LEAVE, TERMINATED
                status: values.employee_status ? values.employee_status.toUpperCase() : undefined,
                supervisor_id: values.supervisor_id || undefined,
            }
        }

        let userId = currentRow?.id
        if (isUpdate && currentRow) {
            const res = await updateUser({ variables: { id: currentRow.id, input } })
            userId = res?.data?.updateUserWithProfile?.id ?? userId
        } else {
            const res = await createUser({ variables: { input } })
            userId = res?.data?.createUserWithProfile?.id
        }

        if (userId) {
            // Always send arrays to support clearing all assignments
            await assignRoles({ variables: { id: userId, input: { role_ids: selectedRoleIds.map((id) => Number(id)) } } })
            await assignPermissions({ variables: { id: userId, input: { permission_ids: selectedPermissionIds.map((id) => Number(id)) } } })
        }

        toast.success(isUpdate ? 'تم تحديث المستخدم بنجاح!' : 'تم إنشاء المستخدم بنجاح!')
        handleClose()
        refetch?.()
    }

    const handleClose = () => {
        setOpen(null)
        setCurrentRow(null)
        setSelectedRoleIds([])
        setSelectedPermissionIds([])
        form.reset()
    }

    const loading = createState.loading || updateState.loading

    return (
        <Sheet open={open === 'create' || open === 'update'} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <SheetContent className='sm:max-w-[700px] overflow-y-auto'>
                <SheetHeader className="space-y-3 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <AvatarIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <SheetTitle className="text-xl">{isUpdate ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}</SheetTitle>
                            <SheetDescription className="text-sm">
                                {isUpdate
                                    ? 'قم بتعديل بيانات المستخدم في النموذج أدناه'
                                    : 'قم بإضافة مستخدم جديد من خلال ملء النموذج أدناه'}
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
                        {/* User kind selector with enhanced design */}
                        <div className='space-y-3 rounded-lg border bg-muted/30 p-4'>
                            <div className="flex items-center gap-2">
                                <PersonIcon className="h-4 w-4 text-muted-foreground" />
                                <h3 className='text-sm font-semibold'>نوع الحساب</h3>
                            </div>
                            <FormField
                                control={form.control}
                                name='kind'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className='grid grid-cols-2 gap-3'>
                                                <button
                                                    type='button'
                                                    onClick={() => {
                                                        setSelectedKind('Customer')
                                                        field.onChange('Customer')
                                                    }}
                                                    className={`relative flex items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all ${selectedKind === 'Customer'
                                                        ? 'border-primary bg-primary/5 text-primary shadow-sm'
                                                        : 'border-border bg-background hover:border-muted-foreground/50'
                                                        }`}
                                                >
                                                    {selectedKind === 'Customer' && (
                                                        <CheckCircledIcon className="absolute top-2 right-2 h-4 w-4" />
                                                    )}
                                                    <PersonIcon className="h-5 w-5" />
                                                    <span className="font-medium">عميل</span>
                                                </button>
                                                <button
                                                    type='button'
                                                    onClick={() => {
                                                        setSelectedKind('Employee')
                                                        field.onChange('Employee')
                                                    }}
                                                    className={`relative flex items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all ${selectedKind === 'Employee'
                                                        ? 'border-primary bg-primary/5 text-primary shadow-sm'
                                                        : 'border-border bg-background hover:border-muted-foreground/50'
                                                        }`}
                                                >
                                                    {selectedKind === 'Employee' && (
                                                        <CheckCircledIcon className="absolute top-2 right-2 h-4 w-4" />
                                                    )}
                                                    <BackpackIcon className="h-5 w-5" />
                                                    <span className="font-medium">موظف</span>
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Separator />

                        {/* Tabbed Content */}
                        <Tabs defaultValue="basic" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="basic" className="text-xs sm:text-sm">
                                    <AvatarIcon className="h-4 w-4 ml-1" />
                                    أساسي
                                </TabsTrigger>
                                <TabsTrigger value="details" className="text-xs sm:text-sm">
                                    <IdCardIcon className="h-4 w-4 ml-1" />
                                    التفاصيل
                                </TabsTrigger>
                                <TabsTrigger value="permissions" className="text-xs sm:text-sm">
                                    <LockClosedIcon className="h-4 w-4 ml-1" />
                                    الصلاحيات
                                </TabsTrigger>
                            </TabsList>

                            {/* Basic Information Tab */}
                            <TabsContent value="basic" className="space-y-5 mt-6">
                                <div className="grid gap-4">
                                    <FormField
                                        control={form.control}
                                        name='name'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <PersonIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                                    الاسم *
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder='أدخل الاسم' {...field} className="transition-all focus:ring-2" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name='full_name'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <PersonIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                                    الاسم الكامل
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder='أدخل الاسم الكامل' {...field} className="transition-all focus:ring-2" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name='email'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <EnvelopeClosedIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                                    البريد الإلكتروني *
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type='email' placeholder='example@email.com' {...field} className="transition-all focus:ring-2" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name='password'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <LockClosedIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                                    {isUpdate ? 'كلمة المرور (اختياري للتحديث)' : 'كلمة المرور *'}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='password'
                                                        placeholder={isUpdate ? 'اتركه فارغاً لعدم التغيير' : 'أدخل كلمة المرور'}
                                                        {...field}
                                                        className="transition-all focus:ring-2"
                                                    />
                                                </FormControl>
                                                {!isUpdate && <FormDescription className="text-xs">يجب أن تكون 6 أحرف على الأقل</FormDescription>}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name='phone'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <MobileIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                                        رقم الهاتف
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='07X XXXX XXXX' {...field} className="transition-all focus:ring-2" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name='status'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>الحالة *</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="transition-all focus:ring-2">
                                                                <SelectValue placeholder='اختر الحالة' />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {userStatusValues.map((status) => (
                                                                <SelectItem key={status} value={status}>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={`h-2 w-2 rounded-full ${status === 'Active' ? 'bg-green-500' :
                                                                            status === 'Inactive' ? 'bg-gray-500' :
                                                                                status === 'Pending' ? 'bg-yellow-500' :
                                                                                    'bg-red-500'
                                                                            }`} />
                                                                        <span>
                                                                            {status === 'Active' && 'نشط'}
                                                                            {status === 'Inactive' && 'غير نشط'}
                                                                            {status === 'Pending' && 'معلق'}
                                                                            {status === 'Blocked' && 'محظور'}
                                                                        </span>
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Details Tab */}
                            <TabsContent value="details" className="space-y-6 mt-6">
                                {/* Personal Information */}
                                <div className='space-y-4'>
                                    <div className="flex items-center gap-2 pb-2">
                                        <PersonIcon className="h-4 w-4 text-primary" />
                                        <h4 className='text-sm font-semibold'>المعلومات الشخصية</h4>
                                    </div>

                                    <div className="grid gap-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name='birth_date'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2">
                                                            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                                            تاريخ الميلاد
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input type='date' {...field} className="transition-all focus:ring-2" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name='mother_name'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>اسم الأم</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder='أدخل اسم الأم' {...field} className="transition-all focus:ring-2" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name='system_user_name'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <IdCardIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                                        اسم المستخدم في النظام
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='أدخل اسم المستخدم' {...field} className="transition-all focus:ring-2" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name='Job'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <BackpackIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                                        الوظيفة
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='أدخل الوظيفة' {...field} className="transition-all focus:ring-2" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <Separator />

                                {/* Financial Information */}
                                <div className='space-y-4'>
                                    <div className="flex items-center gap-2 pb-2">
                                        <CardStackIcon className="h-4 w-4 text-primary" />
                                        <h4 className='text-sm font-semibold'>المعلومات المالية</h4>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name='iban'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <CardStackIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                                    رقم الآيبان
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder='IQ00 0000 0000 0000 0000 00' {...field} className="transition-all focus:ring-2 font-mono" />
                                                </FormControl>
                                                <FormDescription className="text-xs">رقم الحساب البنكي الدولي</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name='is_account'
                                        render={({ field }) => (
                                            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/30'>
                                                <div className='space-y-0.5'>
                                                    <FormLabel className="text-base">حساب مستخدم</FormLabel>
                                                    <FormDescription className="text-xs">هل هذا حساب نشط في النظام؟</FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Separator />

                                {/* Customer Profile */}
                                {selectedKind === 'Customer' && (
                                    <>
                                        <div className='space-y-4'>
                                            <div className="flex items-center gap-2 pb-2">
                                                <PersonIcon className="h-4 w-4 text-primary" />
                                                <h4 className='text-sm font-semibold'>معلومات العميل</h4>
                                            </div>
                                            <div className="grid gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name='customer_type'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>نوع العميل *</FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="transition-all focus:ring-2">
                                                                        <SelectValue placeholder='اختر النوع' />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {customerTypeValues.map((t) => (
                                                                        <SelectItem key={t} value={t}>
                                                                            {t === 'Individual' ? '👤 فرد' : '🏢 شركة'}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name='customer_market_name'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>اسم المتجر</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder='اختياري' {...field} className="transition-all focus:ring-2" />
                                                            </FormControl>
                                                            <FormDescription className="text-xs">اسم المحل التجاري إن وجد</FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name='customer_status'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>حالة العميل *</FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="transition-all focus:ring-2">
                                                                        <SelectValue placeholder='اختر الحالة' />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {customerStatusValues.map((s) => (
                                                                        <SelectItem key={s} value={s}>
                                                                            <div className="flex items-center gap-2">
                                                                                <div className={`h-2 w-2 rounded-full ${s === 'Active' ? 'bg-green-500' : 'bg-gray-500'}`} />
                                                                                {s === 'Active' ? 'نشط' : 'غير نشط'}
                                                                            </div>
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <Separator />
                                    </>
                                )}

                                {/* Employee Profile */}
                                {selectedKind === 'Employee' && (
                                    <div className='space-y-4'>
                                        <div className="flex items-center gap-2 pb-2">
                                            <BackpackIcon className="h-4 w-4 text-primary" />
                                            <h4 className='text-sm font-semibold'>معلومات الموظف</h4>
                                        </div>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                            <FormField
                                                control={form.control}
                                                name='branch_id'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>الفرع *</FormLabel>
                                                        <Select value={field.value?.toString()} onValueChange={(v) => field.onChange(Number(v))}>
                                                            <FormControl>
                                                                <SelectTrigger className="transition-all focus:ring-2">
                                                                    <SelectValue placeholder='اختر الفرع' />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {branches.map((b: any) => (
                                                                    <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name='department_id'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>القسم *</FormLabel>
                                                        <Select value={field.value?.toString()} onValueChange={(v) => field.onChange(Number(v))}>
                                                            <FormControl>
                                                                <SelectTrigger className="transition-all focus:ring-2">
                                                                    <SelectValue placeholder='اختر القسم' />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {departments.map((d: any) => (
                                                                    <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name='position_id'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>الوظيفة *</FormLabel>
                                                        <Select value={field.value?.toString()} onValueChange={(v) => field.onChange(Number(v))}>
                                                            <FormControl>
                                                                <SelectTrigger className="transition-all focus:ring-2">
                                                                    <SelectValue placeholder='اختر الوظيفة' />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {positions.map((p: any) => (
                                                                    <SelectItem key={p.id} value={String(p.id)}>{p.title}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name='hired_date'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2">
                                                            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                                            تاريخ التوظيف *
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input type='date' {...field} className="transition-all focus:ring-2" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name='salary'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2">
                                                            <CardStackIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                                            الراتب *
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input type='number' step='0.01' value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} className="transition-all focus:ring-2" />
                                                        </FormControl>
                                                        <FormDescription className="text-xs">الراتب الشهري</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name='contract_type'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>نوع العقد *</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="transition-all focus:ring-2">
                                                                    <SelectValue placeholder='اختر نوع العقد' />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {employeeContractTypeValues.map((ct) => (
                                                                    <SelectItem key={ct} value={ct}>{ct}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name='employee_status'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>حالة الموظف *</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="transition-all focus:ring-2">
                                                                    <SelectValue placeholder='اختر الحالة' />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {employeeStatusValues.map((s) => (
                                                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name='supervisor_id'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>المشرف</FormLabel>
                                                        <Select value={field.value?.toString()} onValueChange={(v) => field.onChange(Number(v))}>
                                                            <FormControl>
                                                                <SelectTrigger className="transition-all focus:ring-2">
                                                                    <SelectValue placeholder='اختر المشرف (اختياري)' />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {supervisors.map((e: any) => (
                                                                    <SelectItem key={e.id} value={String(e.id)}>{e.user?.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormDescription className="text-xs">المشرف المباشر على الموظف</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Location Information */}
                                <div className='space-y-4'>
                                    <div className="flex items-center gap-2 pb-2">
                                        <HomeIcon className="h-4 w-4 text-primary" />
                                        <h4 className='text-sm font-semibold'>معلومات الموقع</h4>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name='full_address'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <HomeIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                                    العنوان الكامل
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder='أدخل العنوان الكامل' {...field} className="transition-all focus:ring-2" />
                                                </FormControl>
                                                <FormDescription className="text-xs">العنوان التفصيلي للمستخدم</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className='grid grid-cols-2 gap-4'>
                                        <FormField
                                            control={form.control}
                                            name='latitude'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <GlobeIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                                        خط العرض
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type='number'
                                                            step='any'
                                                            placeholder='33.3152'
                                                            {...field}
                                                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                                            className="transition-all focus:ring-2"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name='longitude'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <GlobeIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                                        خط الطول
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type='number'
                                                            step='any'
                                                            placeholder='44.3661'
                                                            {...field}
                                                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                                            className="transition-all focus:ring-2"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Permissions Tab */}
                            <TabsContent value="permissions" className="space-y-6 mt-6">
                                {/* Roles Section */}
                                <div className='space-y-4'>
                                    <div className="flex items-center justify-between pb-2">
                                        <div className="flex items-center gap-2">
                                            <LockClosedIcon className="h-4 w-4 text-primary" />
                                            <h4 className='text-sm font-semibold'>الأدوار</h4>
                                        </div>
                                        <Badge variant="outline" className="font-mono">
                                            {selectedRoleIds.length} محدد
                                        </Badge>
                                    </div>
                                    {roles.length === 0 ? (
                                        <div className='rounded-lg border border-dashed bg-muted/30 p-8 text-center'>
                                            <LockClosedIcon className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                                            <p className='text-muted-foreground text-sm'>لا توجد أدوار متاحة</p>
                                        </div>
                                    ) : (
                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                                            {roles.map((role: any) => (
                                                <label
                                                    key={role.id}
                                                    className={`flex items-center gap-3 cursor-pointer rounded-lg border-2 p-3 transition-all hover:bg-muted/50 ${selectedRoleIds.includes(String(role.id))
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-border'
                                                        }`}
                                                >
                                                    <Checkbox
                                                        checked={selectedRoleIds.includes(String(role.id))}
                                                        onCheckedChange={() =>
                                                            setSelectedRoleIds((prev) =>
                                                                prev.includes(String(role.id))
                                                                    ? prev.filter((id) => id !== String(role.id))
                                                                    : [...prev, String(role.id)],
                                                            )
                                                        }
                                                    />
                                                    <span className='text-sm font-medium'>{role.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                {/* Permissions Section */}
                                <div className='space-y-4'>
                                    <div className="flex items-center justify-between pb-2">
                                        <div className="flex items-center gap-2">
                                            <LockClosedIcon className="h-4 w-4 text-primary" />
                                            <h4 className='text-sm font-semibold'>الصلاحيات الخاصة</h4>
                                        </div>
                                        <Badge variant="outline" className="font-mono">
                                            {selectedPermissionIds.length} محدد
                                        </Badge>
                                    </div>
                                    {permissions.length === 0 ? (
                                        <div className='rounded-lg border border-dashed bg-muted/30 p-8 text-center'>
                                            <LockClosedIcon className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                                            <p className='text-muted-foreground text-sm'>لا توجد صلاحيات متاحة</p>
                                        </div>
                                    ) : (
                                        <div className='space-y-3'>
                                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto p-1'>
                                                {permissions.map((perm: any) => (
                                                    <label
                                                        key={perm.id}
                                                        className={`flex items-center gap-3 cursor-pointer rounded-lg border-2 p-3 transition-all hover:bg-muted/50 ${selectedPermissionIds.includes(String(perm.id))
                                                            ? 'border-primary bg-primary/5'
                                                            : 'border-border'
                                                            }`}
                                                    >
                                                        <Checkbox
                                                            checked={selectedPermissionIds.includes(String(perm.id))}
                                                            onCheckedChange={() =>
                                                                setSelectedPermissionIds((prev) =>
                                                                    prev.includes(String(perm.id))
                                                                        ? prev.filter((id) => id !== String(perm.id))
                                                                        : [...prev, String(perm.id)],
                                                                )
                                                            }
                                                        />
                                                        <span className='text-xs font-medium'>{perm.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>

                        <SheetFooter className='pt-6 gap-3 border-t mt-6'>
                            <Button type='button' variant='outline' onClick={handleClose} disabled={loading} className="flex-1 gap-2">
                                <Cross2Icon className="h-4 w-4" />
                                إلغاء
                            </Button>
                            <Button type='submit' disabled={loading} className="flex-1 gap-2">
                                {loading ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        جاري الحفظ...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircledIcon className="h-4 w-4" />
                                        {isUpdate ? 'تحديث المستخدم' : 'إضافة المستخدم'}
                                    </>
                                )}
                            </Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}

