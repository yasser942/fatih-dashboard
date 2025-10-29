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
import { Checkbox } from '@/components/ui/checkbox'
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
            <SheetContent className='sm:max-w-[600px] overflow-y-auto'>
                <SheetHeader>
                    <SheetTitle>{isUpdate ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}</SheetTitle>
                    <SheetDescription>
                        {isUpdate
                            ? 'قم بتعديل بيانات المستخدم في النموذج أدناه'
                            : 'قم بإضافة مستخدم جديد من خلال ملء النموذج أدناه'}
                    </SheetDescription>
                </SheetHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6">
                        {/* User kind (create: Customer/Employee only; update: derive from existing) */}
                        <div className='space-y-3'>
                            <h3 className='text-sm font-medium'>نوع الحساب</h3>
                            <FormField
                                control={form.control}
                                name='kind'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className='grid grid-cols-3 gap-3'>
                                                <div className='flex items-center space-x-2'>
                                                    <input
                                                        type='radio'
                                                        id='kind-customer'
                                                        name='kind'
                                                        value='Customer'
                                                        checked={selectedKind === 'Customer'}
                                                        onChange={(e) => {
                                                            setSelectedKind('Customer')
                                                            field.onChange('Customer')
                                                        }}
                                                        className='h-4 w-4'
                                                    />
                                                    <Label htmlFor='kind-customer'>عميل</Label>
                                                </div>
                                                <div className='flex items-center space-x-2'>
                                                    <input
                                                        type='radio'
                                                        id='kind-employee'
                                                        name='kind'
                                                        value='Employee'
                                                        checked={selectedKind === 'Employee'}
                                                        onChange={(e) => {
                                                            setSelectedKind('Employee')
                                                            field.onChange('Employee')
                                                        }}
                                                        className='h-4 w-4'
                                                    />
                                                    <Label htmlFor='kind-employee'>موظف</Label>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Basic Information */}
                        <div className='space-y-4'>
                            <h3 className='text-sm font-medium'>المعلومات الأساسية</h3>

                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>الاسم *</FormLabel>
                                        <FormControl>
                                            <Input placeholder='أدخل الاسم' {...field} />
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
                                        <FormLabel>الاسم الكامل</FormLabel>
                                        <FormControl>
                                            <Input placeholder='أدخل الاسم الكامل' {...field} />
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
                                        <FormLabel>البريد الإلكتروني *</FormLabel>
                                        <FormControl>
                                            <Input type='email' placeholder='example@email.com' {...field} />
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
                                        <FormLabel>{isUpdate ? 'كلمة المرور (اختياري للتحديث)' : 'كلمة المرور *'}</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='password'
                                                placeholder={isUpdate ? 'اتركه فارغاً لعدم التغيير' : 'أدخل كلمة المرور'}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='phone'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>رقم الهاتف</FormLabel>
                                        <FormControl>
                                            <Input placeholder='أدخل رقم الهاتف' {...field} />
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
                                                <SelectTrigger>
                                                    <SelectValue placeholder='اختر الحالة' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {userStatusValues.map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {status === 'Active' && 'نشط'}
                                                        {status === 'Inactive' && 'غير نشط'}
                                                        {status === 'Pending' && 'معلق'}
                                                        {status === 'Blocked' && 'محظور'}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Personal Information */}
                        <div className='space-y-4 pt-4 border-t'>
                            <h3 className='text-sm font-medium'>المعلومات الشخصية</h3>

                            <FormField
                                control={form.control}
                                name='birth_date'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>تاريخ الميلاد</FormLabel>
                                        <FormControl>
                                            <Input type='date' {...field} />
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
                                            <Input placeholder='أدخل اسم الأم' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='system_user_name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>اسم المستخدم في النظام</FormLabel>
                                        <FormControl>
                                            <Input placeholder='أدخل اسم المستخدم' {...field} />
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
                                        <FormLabel>الوظيفة</FormLabel>
                                        <FormControl>
                                            <Input placeholder='أدخل الوظيفة' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Financial Information */}
                        <div className='space-y-4 pt-4 border-t'>
                            <h3 className='text-sm font-medium'>المعلومات المالية</h3>

                            <FormField
                                control={form.control}
                                name='iban'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>رقم الآيبان</FormLabel>
                                        <FormControl>
                                            <Input placeholder='IQ00 0000 0000 0000 0000 00' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='is_account'
                                render={({ field }) => (
                                    <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className='space-y-1 leading-none'>
                                            <FormLabel>حساب مستخدم</FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Customer Profile */}
                        {selectedKind === 'Customer' && (
                            <div className='space-y-4 pt-4 border-t'>
                                <h3 className='text-sm font-medium'>معلومات العميل</h3>
                                <FormField
                                    control={form.control}
                                    name='customer_type'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>نوع العميل</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='اختر النوع' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {customerTypeValues.map((t) => (
                                                        <SelectItem key={t} value={t}>{t === 'Individual' ? 'فرد' : 'شركة'}</SelectItem>
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
                                                <Input placeholder='اختياري' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='customer_status'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>حالة العميل</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='اختر الحالة' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {customerStatusValues.map((s) => (
                                                        <SelectItem key={s} value={s}>{s === 'Active' ? 'نشط' : 'غير نشط'}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        {/* Employee Profile */}
                        {selectedKind === 'Employee' && (
                            <div className='space-y-4 pt-4 border-t'>
                                <h3 className='text-sm font-medium'>معلومات الموظف</h3>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    <FormField
                                        control={form.control}
                                        name='branch_id'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>الفرع</FormLabel>
                                                <Select value={field.value?.toString()} onValueChange={(v) => field.onChange(Number(v))}>
                                                    <FormControl>
                                                        <SelectTrigger>
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
                                                <FormLabel>القسم</FormLabel>
                                                <Select value={field.value?.toString()} onValueChange={(v) => field.onChange(Number(v))}>
                                                    <FormControl>
                                                        <SelectTrigger>
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
                                                <FormLabel>الوظيفة</FormLabel>
                                                <Select value={field.value?.toString()} onValueChange={(v) => field.onChange(Number(v))}>
                                                    <FormControl>
                                                        <SelectTrigger>
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
                                                <FormLabel>تاريخ التوظيف</FormLabel>
                                                <FormControl>
                                                    <Input type='date' {...field} />
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
                                                <FormLabel>الراتب</FormLabel>
                                                <FormControl>
                                                    <Input type='number' step='0.01' value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='contract_type'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>نوع العقد</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
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
                                                <FormLabel>حالة الموظف</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
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
                                                        <SelectTrigger>
                                                            <SelectValue placeholder='اختر المشرف (اختياري)' />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {supervisors.map((e: any) => (
                                                            <SelectItem key={e.id} value={String(e.id)}>{e.user?.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Location Information */}
                        <div className='space-y-4 pt-4 border-t'>
                            <h3 className='text-sm font-medium'>معلومات الموقع</h3>

                            <FormField
                                control={form.control}
                                name='full_address'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>العنوان الكامل</FormLabel>
                                        <FormControl>
                                            <Input placeholder='أدخل العنوان الكامل' {...field} />
                                        </FormControl>
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
                                            <FormLabel>خط العرض</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='any'
                                                    placeholder='33.3152'
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
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
                                            <FormLabel>خط الطول</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='any'
                                                    placeholder='44.3661'
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Roles */}
                        <div className='space-y-4 pt-4 border-t'>
                            <h3 className='text-sm font-medium'>الأدوار</h3>
                            {roles.length === 0 ? (
                                <div className='text-muted-foreground text-sm'>لا توجد أدوار متاحة</div>
                            ) : (
                                <div className='grid grid-cols-2 gap-3'>
                                    {roles.map((role: any) => (
                                        <label key={role.id} className='flex items-center gap-2 cursor-pointer'>
                                            <input
                                                type='checkbox'
                                                checked={selectedRoleIds.includes(String(role.id))}
                                                onChange={() =>
                                                    setSelectedRoleIds((prev) =>
                                                        prev.includes(String(role.id))
                                                            ? prev.filter((id) => id !== String(role.id))
                                                            : [...prev, String(role.id)],
                                                    )
                                                }
                                            />
                                            <span className='text-sm'>{role.name}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Permissions */}
                        <div className='space-y-4 pt-4 border-t'>
                            <h3 className='text-sm font-medium'>الصلاحيات</h3>
                            {permissions.length === 0 ? (
                                <div className='text-muted-foreground text-sm'>لا توجد صلاحيات متاحة</div>
                            ) : (
                                <div className='grid grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-2'>
                                    {permissions.map((perm: any) => (
                                        <label key={perm.id} className='flex items-center gap-2 cursor-pointer'>
                                            <input
                                                type='checkbox'
                                                checked={selectedPermissionIds.includes(String(perm.id))}
                                                onChange={() =>
                                                    setSelectedPermissionIds((prev) =>
                                                        prev.includes(String(perm.id))
                                                            ? prev.filter((id) => id !== String(perm.id))
                                                            : [...prev, String(perm.id)],
                                                    )
                                                }
                                            />
                                            <span className='text-sm'>{perm.name}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <SheetFooter className='pt-4'>
                            <Button type='button' variant='outline' onClick={handleClose} disabled={loading}>
                                إلغاء
                            </Button>
                            <Button type='submit' disabled={loading}>
                                {loading ? 'جاري الحفظ...' : isUpdate ? 'تحديث' : 'إضافة'}
                            </Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}

