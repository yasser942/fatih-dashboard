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
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useFleetTypes } from './fleet-types-provider'
import { createFleetTypeSchema, updateFleetTypeSchema, type CreateFleetType, type UpdateFleetType } from '../data/schema'
import { CREATE_FLEET_TYPE, UPDATE_FLEET_TYPE } from '../graphql/mutations'
import { GET_FLEET_TYPES } from '../graphql/queries'

export function FleetTypesMutateDrawer() {
    const { open, setOpen, currentRow, setCurrentRow, refetch } = useFleetTypes()
    const isUpdate = open === 'update' && currentRow

    const form = useForm<CreateFleetType | UpdateFleetType>({
        resolver: zodResolver(isUpdate ? updateFleetTypeSchema : createFleetTypeSchema),
        defaultValues: {
            type_en: '',
            type_ar: '',
            capacity: 0,
            status: 'Active',
        },
    })

    // Reset form when currentRow changes (for editing)
    useEffect(() => {
        if (isUpdate && currentRow) {
            form.reset({
                type_en: currentRow.type_en,
                type_ar: currentRow.type_ar,
                capacity: currentRow.capacity,
                status: currentRow.status,
            })
        } else if (open === 'create') {
            form.reset({
                type_en: '',
                type_ar: '',
                capacity: 0,
                status: 'Active',
            })
        }
    }, [currentRow, isUpdate, open, form])

    const [createFleetType, { loading: createLoading }] = useMutation(CREATE_FLEET_TYPE, {
        refetchQueries: [GET_FLEET_TYPES],
        onCompleted: () => {
            form.reset()
            setOpen(null)
            setCurrentRow(null)
            refetch?.()
        },
    })

    const [updateFleetType, { loading: updateLoading }] = useMutation(UPDATE_FLEET_TYPE, {
        refetchQueries: [GET_FLEET_TYPES],
        onCompleted: () => {
            form.reset()
            setOpen(null)
            setCurrentRow(null)
            refetch?.()
        },
    })

    const onSubmit = async (data: CreateFleetType | UpdateFleetType) => {
        try {
            if (isUpdate) {
                await updateFleetType({
                    variables: {
                        id: currentRow.id,
                        type_en: data.type_en,
                        type_ar: data.type_ar,
                        capacity: data.capacity,
                        status: data.status,
                    },
                })
            } else {
                await createFleetType({
                    variables: data,
                })
            }
        } catch (error) {
            console.error('Error saving fleet type:', error)
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
                    <SheetTitle>
                        {isUpdate ? 'تعديل نوع الأسطول' : 'إضافة نوع أسطول جديد'}
                    </SheetTitle>
                    <SheetDescription>
                        {isUpdate ? 'قم بتعديل بيانات نوع الأسطول' : 'أدخل بيانات نوع الأسطول الجديد'}
                    </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6">
                        <FormField
                            control={form.control}
                            name="type_en"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>النوع بالإنجليزية</FormLabel>
                                    <FormControl>
                                        <Input placeholder="أدخل النوع بالإنجليزية" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="type_ar"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>النوع بالعربية</FormLabel>
                                    <FormControl>
                                        <Input placeholder="أدخل النوع بالعربية" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="capacity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>السعة</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="أدخل السعة"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">الحالة</FormLabel>
                                        <div className="text-sm text-muted-foreground">
                                            تفعيل أو إلغاء تفعيل هذا النوع
                                        </div>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value === 'Active'}
                                            onCheckedChange={(checked) => field.onChange(checked ? 'Active' : 'Inactive')}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <SheetFooter>
                            <Button type="submit" disabled={createLoading || updateLoading}>
                                {createLoading || updateLoading ? 'جاري الحفظ...' : (isUpdate ? 'تحديث' : 'إنشاء')}
                            </Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}
