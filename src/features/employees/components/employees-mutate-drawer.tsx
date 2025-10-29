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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEmployees } from './employees-provider'
import {
    createEmployeeSchema,
    updateEmployeeSchema,
    createEmployeeWithUserSchema,
    updateEmployeeWithUserSchema,
    type CreateEmployee,
    type UpdateEmployee,
    type CreateEmployeeWithUser,
    type UpdateEmployeeWithUser,
} from '../data/schema'
// Removed legacy employee mutations in favor of unified user-with-profile mutations
import { EMPLOYEES_QUERY } from '../graphql/queries'
import { CREATE_USER_WITH_PROFILE, UPDATE_USER_WITH_PROFILE } from '@/features/users/graphql/mutations'
import { BRANCHES_QUERY } from '@/features/branches/graphql/queries'
import { DEPARTMENTS_QUERY } from '@/features/departments/graphql/queries'
import { POSITIONS_QUERY } from '@/features/positions/graphql/queries'

export function EmployeesMutateDrawer() {
    const { open, setOpen, currentRow, setCurrentRow, refetch } = useEmployees()
    const isUpdate = open === 'update' && currentRow

    const { data: branchesData } = useQuery(BRANCHES_QUERY)
    const { data: departmentsData } = useQuery(DEPARTMENTS_QUERY)
    const { data: positionsData } = useQuery(POSITIONS_QUERY)
    const { data: supervisorsData } = useQuery(EMPLOYEES_QUERY, {
        variables: { first: 1000 },
    })

    const branches = branchesData?.branches || []
    // Removed users query
    const departments = departmentsData?.departments?.data || []
    const positions = positionsData?.positions?.data || []
    const supervisors = supervisorsData?.employees?.data || []

    const form = useForm<CreateEmployeeWithUser | UpdateEmployeeWithUser>({
        resolver: zodResolver(isUpdate ? updateEmployeeWithUserSchema : createEmployeeWithUserSchema),
        defaultValues: {
            branch_id: 0,
            department_id: 0,
            position_id: 0,
            hired_date: '',
            salary: 0,
            contract_type: 'full_time',
            status: 'active',
            supervisor_id: undefined,
            user_name: '',
            user_email: '',
            user_password: '',
            user_status: 'Active',
        },
    })

    useEffect(() => {
        if (isUpdate && currentRow) {
            // Format the hired_date to YYYY-MM-DD format
            const formatDate = (dateStr: string | undefined) => {
                if (!dateStr) return ''
                const date = new Date(dateStr)
                if (isNaN(date.getTime())) return ''
                return date.toISOString().split('T')[0]
            }

            // Helper function to convert PascalCase enum to snake_case
            const toSnakeCase = (str: string | undefined): string => {
                if (!str) return ''
                return str
                    .replace(/([A-Z])/g, '_$1')
                    .toLowerCase()
                    .replace(/^_/, '')
            }

            const formData: any = {
                branch_id: currentRow.branch_id ?? 0,
                department_id: currentRow.department_id ?? 0,
                position_id: currentRow.position_id ?? 0,
                hired_date: formatDate(currentRow.hired_date),
                salary: currentRow.salary ?? 0,
                contract_type: toSnakeCase(currentRow.contract_type) || 'full_time',
                status: toSnakeCase(currentRow.status) || 'active',
                supervisor_id: currentRow.supervisor_id ?? undefined,
                user_name: currentRow.user?.name ?? '',
                user_email: currentRow.user?.email ?? '',
                user_password: '',
                user_status: 'Active',
            }

            form.reset(formData)
        } else if (open === 'create') {
            form.reset({
                branch_id: 0,
                department_id: 0,
                position_id: 0,
                hired_date: '',
                salary: 0,
                contract_type: 'full_time',
                status: 'active',
                supervisor_id: undefined,
                user_name: '',
                user_email: '',
                user_password: '',
                user_status: 'Active',
            })
        }
    }, [currentRow, isUpdate, open, form])

    const [createUserWithProfile, { loading: creating }] = useMutation(CREATE_USER_WITH_PROFILE, {
        refetchQueries: [EMPLOYEES_QUERY],
        onCompleted: () => {
            form.reset()
            setOpen(null)
            setCurrentRow(null)
            refetch?.()
        },
        onError: (error: any) => {
            console.error('Create employee (unified) error:', error)
            const msg = error?.graphQLErrors?.[0]?.message || 'فشل إنشاء الموظف'
            toast.error(msg)
        },
    })

    const [updateUserWithProfile, { loading: updating }] = useMutation(UPDATE_USER_WITH_PROFILE, {
        refetchQueries: [EMPLOYEES_QUERY],
        onCompleted: () => {
            form.reset()
            setOpen(null)
            setCurrentRow(null)
            refetch?.()
        },
        onError: (error: any) => {
            console.error('Update employee (unified) error:', error)
            const msg = error?.graphQLErrors?.[0]?.message || 'فشل تحديث الموظف'
            toast.error(msg)
        },
    })

    const onSubmit = async (data: any) => {
        try {
            // Map UI enums to GraphQL tokens
            const contractToken = (data.contract_type || '').toUpperCase()
            const statusToken = (data.status || '').toUpperCase()

            if (isUpdate && currentRow) {
                const userInput = {
                    name: data.user_name || currentRow.user?.name,
                    full_name: data.user_name || currentRow.user?.name,
                    email: data.user_email || currentRow.user?.email,
                    password: data.user_password || undefined,
                    status: data.user_status,
                    is_account: true,
                }
                const employeeInput = {
                    branch_id: Number(data.branch_id),
                    department_id: Number(data.department_id),
                    position_id: Number(data.position_id),
                    hired_date: data.hired_date ? `${data.hired_date} 00:00:00` : undefined,
                    salary: Number(data.salary),
                    contract_type: contractToken,
                    status: statusToken,
                    supervisor_id: data.supervisor_id ? Number(data.supervisor_id) : undefined,
                }
                await updateUserWithProfile({
                    variables: {
                        id: currentRow.user?.id ?? currentRow.user_id,
                        input: {
                            kind: 'Employee',
                            user: userInput,
                            employee: employeeInput,
                        },
                    },
                })
            } else {
                const userInput = {
                    name: data.user_name,
                    full_name: data.user_name,
                    email: data.user_email,
                    password: data.user_password,
                    status: data.user_status,
                    is_account: true,
                }
                const employeeInput = {
                    branch_id: Number(data.branch_id),
                    department_id: Number(data.department_id),
                    position_id: Number(data.position_id),
                    hired_date: `${data.hired_date} 00:00:00`,
                    salary: Number(data.salary),
                    contract_type: contractToken,
                    status: statusToken,
                    supervisor_id: data.supervisor_id ? Number(data.supervisor_id) : undefined,
                }
                await createUserWithProfile({
                    variables: {
                        input: { kind: 'Employee', user: userInput, employee: employeeInput },
                    },
                })
            }
        } catch (error) {
            console.error('Error saving employee:', error)
        }
    }

    const handleClose = () => {
        form.reset()
        setOpen(null)
        setCurrentRow(null)
    }

    return (
        <Sheet open={open === 'create' || open === 'update'} onOpenChange={handleClose}>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{isUpdate ? 'تعديل الموظف' : 'إضافة موظف جديد'}</SheetTitle>
                    <SheetDescription>
                        {isUpdate ? 'قم بتعديل بيانات الموظف' : 'أدخل بيانات الموظف الجديد'}
                    </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6">
                        <FormField
                            control={form.control}
                            name="branch_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>الفرع</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        value={field.value && field.value !== 0 ? field.value.toString() : ''}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="اختر الفرع" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {branches.map((branch: any) => (
                                                <SelectItem key={branch.id} value={branch.id.toString()}>
                                                    {branch.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="اختر الحالة" />
                                                        </SelectTrigger>
                                                    </FormControl>
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
                            name="department_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>القسم</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        value={field.value && field.value !== 0 ? field.value.toString() : ''}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="اختر القسم" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {departments.map((dept: any) => (
                                                <SelectItem key={dept.id} value={dept.id.toString()}>
                                                    {dept.name}
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
                            name="position_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>الوظيفة</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        value={field.value && field.value !== 0 ? field.value.toString() : ''}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="اختر الوظيفة" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {positions.map((position: any) => (
                                                <SelectItem key={position.id} value={position.id.toString()}>
                                                    {position.title}
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
                            name="hired_date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>تاريخ التوظيف</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="salary"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>الراتب</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contract_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>نوع العقد</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="اختر نوع العقد" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="full_time">دوام كامل</SelectItem>
                                            <SelectItem value="part_time">دوام جزئي</SelectItem>
                                            <SelectItem value="intern">متدرب</SelectItem>
                                            <SelectItem value="contract">عقد</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="اختر الحالة" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="active">نشط</SelectItem>
                                            <SelectItem value="inactive">غير نشط</SelectItem>
                                            <SelectItem value="on_leave">في إجازة</SelectItem>
                                            <SelectItem value="terminated">منهي</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="supervisor_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>المشرف</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(value ? Number(value) : undefined)}
                                        value={field.value && field.value !== 0 ? field.value.toString() : ''}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="اختر المشرف (اختياري)" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {supervisors.map((supervisor: any) => (
                                                <SelectItem key={supervisor.id} value={supervisor.id.toString()}>
                                                    {supervisor.user?.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <SheetFooter>
                            <Button type="submit" disabled={creating || updating}>
                                {creating || updating
                                    ? 'جاري الحفظ...'
                                    : isUpdate
                                        ? 'تحديث'
                                        : 'إنشاء'}
                            </Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}

