import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@apollo/client/react'
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
    FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useTaskTypes } from './task-types-provider'
import { createTaskTypeSchema, updateTaskTypeSchema, type CreateTaskType, type UpdateTaskType } from '../data/schema'
import { CREATE_TASK_TYPE, UPDATE_TASK_TYPE } from '../graphql/mutations'
import { TASK_TYPES_QUERY } from '../graphql/queries'
import { Globe, Languages, Power, CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function TaskTypesMutateDrawer() {
    const { open, setOpen, currentRow, setCurrentRow, refetch } = useTaskTypes()
    const isUpdate = open === 'update' && currentRow

    const form = useForm<CreateTaskType | UpdateTaskType>({
        resolver: zodResolver(isUpdate ? updateTaskTypeSchema : createTaskTypeSchema),
        defaultValues: {
            task_en: '',
            task_ar: '',
            status: 'Active',
        },
    })

    // Reset form when currentRow changes (for editing)
    useEffect(() => {
        if (isUpdate && currentRow) {
            form.reset({
                task_en: currentRow.task_en,
                task_ar: currentRow.task_ar,
                status: currentRow.status,
            })
        } else if (open === 'create') {
            form.reset({
                task_en: '',
                task_ar: '',
                status: 'Active',
            })
        }
    }, [currentRow, isUpdate, open, form])

    const [createTaskType, { loading: createLoading }] = useMutation(CREATE_TASK_TYPE, {
        refetchQueries: [TASK_TYPES_QUERY],
        onCompleted: () => {
            form.reset()
            setOpen(null)
            setCurrentRow(null)
            toast.success('تم إنشاء نوع المهمة بنجاح', {
                description: 'تمت إضافة نوع المهمة الجديد إلى النظام',
            })
            refetch?.()
        },
        onError: (error) => {
            toast.error('فشل في إنشاء نوع المهمة', {
                description: error.message || 'حدث خطأ أثناء إنشاء نوع المهمة',
            })
        },
    })

    const [updateTaskType, { loading: updateLoading }] = useMutation(UPDATE_TASK_TYPE, {
        refetchQueries: [TASK_TYPES_QUERY],
        onCompleted: () => {
            form.reset()
            setOpen(null)
            setCurrentRow(null)
            toast.success('تم تحديث نوع المهمة بنجاح', {
                description: 'تم حفظ التغييرات بنجاح',
            })
            refetch?.()
        },
        onError: (error) => {
            toast.error('فشل في تحديث نوع المهمة', {
                description: error.message || 'حدث خطأ أثناء تحديث نوع المهمة',
            })
        },
    })

    const onSubmit = async (data: CreateTaskType | UpdateTaskType) => {
        try {
            if (isUpdate) {
                await updateTaskType({
                    variables: {
                        id: currentRow.id,
                        task_en: data.task_en,
                        task_ar: data.task_ar,
                        status: data.status,
                    },
                })
            } else {
                await createTaskType({
                    variables: data,
                })
            }
        } catch (error) {
            // Error handling is done in onError callbacks
            console.error('Error saving task type:', error)
        }
    }

    const handleClose = () => {
        form.reset()
        setOpen(null)
        setCurrentRow(null)
    }

    const isLoading = createLoading || updateLoading

    return (
        <Sheet open={open === 'create' || open === 'update'} onOpenChange={handleClose}>
            <SheetContent className="w-full sm:max-w-lg p-6">
                <SheetHeader className="space-y-3 pb-6">
                    <SheetTitle className="text-2xl">
                        {isUpdate ? 'تعديل نوع المهمة' : 'إضافة نوع مهمة جديد'}
                    </SheetTitle>
                    <SheetDescription className="text-base">
                        {isUpdate
                            ? 'قم بتعديل بيانات نوع المهمة أدناه'
                            : 'املأ الحقول أدناه لإضافة نوع مهمة جديد إلى النظام'}
                    </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="task_en"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2 text-base">
                                        <Globe className="h-4 w-4" />
                                        النوع بالإنجليزية
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="أدخل النوع بالإنجليزية"
                                            className="h-11"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        أدخل اسم نوع المهمة باللغة الإنجليزية
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="task_ar"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2 text-base">
                                        <Languages className="h-4 w-4" />
                                        النوع بالعربية
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="أدخل النوع بالعربية"
                                            className="h-11"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        أدخل اسم نوع المهمة باللغة العربية
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-5 shadow-sm transition-colors hover:bg-muted/50">
                                    <div className="space-y-0.5">
                                        <FormLabel className="flex items-center gap-2 text-base">
                                            <Power className="h-4 w-4" />
                                            الحالة
                                        </FormLabel>
                                        <FormDescription className="text-sm">
                                            {field.value === 'Active'
                                                ? 'نوع المهمة نشط ومتاح للاستخدام'
                                                : 'نوع المهمة غير نشط وغير متاح للاستخدام'}
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            {field.value === 'Active' && (
                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            )}
                                            <Switch
                                                checked={field.value === 'Active'}
                                                onCheckedChange={(checked) =>
                                                    field.onChange(checked ? 'Active' : 'Inactive')
                                                }
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
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

