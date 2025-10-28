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
import { usePositions } from './positions-provider'
import {
    createPositionSchema,
    updatePositionSchema,
    type CreatePosition,
    type UpdatePosition,
} from '../data/schema'
import { CREATE_POSITION_MUTATION, UPDATE_POSITION_MUTATION } from '../graphql/mutations'
import { POSITIONS_QUERY } from '../graphql/queries'
import { DEPARTMENTS_QUERY } from '@/features/departments/graphql/queries'

export function PositionsMutateDrawer() {
    const { open, setOpen, currentRow, setCurrentRow, refetch } = usePositions()
    const isUpdate = open === 'update' && currentRow

    const { data: departmentsData } = useQuery(DEPARTMENTS_QUERY)
    const departments = departmentsData?.departments?.data || []

    const form = useForm<CreatePosition | UpdatePosition>({
        resolver: zodResolver(isUpdate ? updatePositionSchema : createPositionSchema),
        defaultValues: {
            title: '',
            description: '',
            department_id: 0,
        },
    })

    // Reset form when currentRow changes (for editing)
    useEffect(() => {
        if (isUpdate && currentRow) {
            form.reset({
                title: currentRow.title,
                description: currentRow.description || '',
                department_id: currentRow.department_id,
            })
        } else if (open === 'create') {
            form.reset({
                title: '',
                description: '',
                department_id: 0,
            })
        }
    }, [currentRow, isUpdate, open, form])

    const [createPosition, { loading: createLoading }] = useMutation(CREATE_POSITION_MUTATION, {
        refetchQueries: [POSITIONS_QUERY],
        onCompleted: () => {
            form.reset()
            setOpen(null)
            setCurrentRow(null)
            refetch?.()
        },
    })

    const [updatePosition, { loading: updateLoading }] = useMutation(UPDATE_POSITION_MUTATION, {
        refetchQueries: [POSITIONS_QUERY],
        onCompleted: () => {
            form.reset()
            setOpen(null)
            setCurrentRow(null)
            refetch?.()
        },
    })

    const onSubmit = async (data: CreatePosition | UpdatePosition) => {
        try {
            if (isUpdate) {
                await updatePosition({
                    variables: {
                        id: currentRow.id,
                        input: data,
                    },
                })
            } else {
                await createPosition({
                    variables: {
                        input: data,
                    },
                })
            }
        } catch (error) {
            console.error('Error saving position:', error)
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
                    <SheetTitle>{isUpdate ? 'تعديل الوظيفة' : 'إضافة وظيفة جديدة'}</SheetTitle>
                    <SheetDescription>
                        {isUpdate ? 'قم بتعديل بيانات الوظيفة' : 'أدخل بيانات الوظيفة الجديدة'}
                    </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>عنوان الوظيفة</FormLabel>
                                    <FormControl>
                                        <Input placeholder="مثال: مدير الموارد البشرية" {...field} />
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
                                        <Textarea placeholder="وصف الوظيفة..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="department_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>القسم</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        value={field.value?.toString()}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="اختر القسم" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {departments.map((department: any) => (
                                                <SelectItem key={department.id} value={department.id.toString()}>
                                                    {department.name}
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




