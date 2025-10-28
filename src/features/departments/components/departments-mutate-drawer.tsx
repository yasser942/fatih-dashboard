import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@apollo/client/react'
import { useEffect } from 'react'
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
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useDepartments } from './departments-provider'
import { createDepartmentSchema, updateDepartmentSchema, type CreateDepartment, type UpdateDepartment } from '../data/schema'
import { CREATE_DEPARTMENT_MUTATION, UPDATE_DEPARTMENT_MUTATION } from '../graphql/mutations'
import { DEPARTMENTS_QUERY } from '../graphql/queries'
import { gql } from '@apollo/client/core'

const EMPLOYEES_QUERY = gql`
  query Employees {
    employees(first: 1000) {
      data {
        id
        user {
          id
          name
          email
        }
      }
    }
  }
`

export function DepartmentsMutateDrawer() {
    const { open, setOpen, currentRow, setCurrentRow, refetch } = useDepartments()
    const isUpdate = open === 'update' && currentRow

    const { data: employeesData } = useQuery(EMPLOYEES_QUERY)
    const employees = employeesData?.employees?.data || []

    const form = useForm<CreateDepartment | UpdateDepartment>({
        resolver: zodResolver(isUpdate ? updateDepartmentSchema : createDepartmentSchema),
        defaultValues: {
            name: '',
            description: '',
            manager_id: undefined,
        },
    })

    // Reset form when currentRow changes (for editing)
    useEffect(() => {
        if (isUpdate && currentRow) {
            form.reset({
                name: currentRow.name,
                description: currentRow.description || '',
                manager_id: currentRow.manager_id || undefined,
            })
        } else if (open === 'create') {
            form.reset({
                name: '',
                description: '',
                manager_id: undefined,
            })
        }
    }, [currentRow, isUpdate, open, form])

    const [createDepartment, { loading: createLoading }] = useMutation(CREATE_DEPARTMENT_MUTATION, {
        refetchQueries: [DEPARTMENTS_QUERY],
        onCompleted: () => {
            form.reset()
            setOpen(null)
            setCurrentRow(null)
            refetch?.()
        },
    })

    const [updateDepartment, { loading: updateLoading }] = useMutation(UPDATE_DEPARTMENT_MUTATION, {
        refetchQueries: [DEPARTMENTS_QUERY],
        onCompleted: () => {
            form.reset()
            setOpen(null)
            setCurrentRow(null)
            refetch?.()
        },
    })

    const onSubmit = async (data: CreateDepartment | UpdateDepartment) => {
        try {
            if (isUpdate) {
                await updateDepartment({
                    variables: {
                        id: currentRow.id,
                        input: data,
                    },
                })
            } else {
                await createDepartment({
                    variables: {
                        input: data,
                    },
                })
            }
        } catch (error) {
            console.error('Error saving department:', error)
        }
    }

    const handleClose = () => {
        form.reset()
        setOpen(null)
        setCurrentRow(null)
    }

    return (
        <Sheet open={open === 'create' || open === 'update'} onOpenChange={handleClose}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{isUpdate ? 'تعديل القسم' : 'إضافة قسم جديد'}</SheetTitle>
                    <SheetDescription>
                        {isUpdate ? 'قم بتعديل بيانات القسم' : 'أدخل بيانات القسم الجديد'}
                    </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>اسم القسم</FormLabel>
                                    <FormControl>
                                        <Input placeholder="مثال: قسم الموارد البشرية" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>الوصف</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="وصف القسم..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="manager_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>المدير</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(value ? Number(value) : undefined)}
                                        value={field.value?.toString()}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="اختر مدير القسم" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {employees.map((employee: any) => (
                                                <SelectItem key={employee.id} value={employee.id.toString()}>
                                                    {employee.user.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <SheetFooter>
                            <Button type="submit" disabled={createLoading || updateLoading}>
                                {createLoading || updateLoading
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




