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
import { useCurrencies } from './currencies-provider'
import { createCurrencySchema, updateCurrencySchema, type CreateCurrency, type UpdateCurrency } from '../data/schema'
import { CREATE_CURRENCY_MUTATION, UPDATE_CURRENCY_MUTATION } from '../graphql/mutations'
import { CURRENCIES_QUERY } from '../graphql/queries'

export function CurrenciesMutateDrawer() {
    const { open, setOpen, currentRow, setCurrentRow, refetch } = useCurrencies()
    const isUpdate = open === 'update' && currentRow

    const form = useForm<CreateCurrency | UpdateCurrency>({
        resolver: zodResolver(isUpdate ? updateCurrencySchema : createCurrencySchema),
        defaultValues: {
            name: '',
            symbol: '',
            code: '',
            is_active: true,
        },
    })

    // Reset form when currentRow changes (for editing)
    useEffect(() => {
        if (isUpdate && currentRow) {
            form.reset({
                name: currentRow.name,
                symbol: currentRow.symbol,
                code: currentRow.code,
                is_active: currentRow.is_active,
            })
        } else if (open === 'create') {
            form.reset({
                name: '',
                symbol: '',
                code: '',
                is_active: true,
            })
        }
    }, [currentRow, isUpdate, open, form])

    const [createCurrency, { loading: createLoading }] = useMutation(CREATE_CURRENCY_MUTATION, {
        refetchQueries: [CURRENCIES_QUERY],
        onCompleted: () => {
            form.reset()
            setOpen(null)
            setCurrentRow(null)
            refetch?.()
        },
    })

    const [updateCurrency, { loading: updateLoading }] = useMutation(UPDATE_CURRENCY_MUTATION, {
        refetchQueries: [CURRENCIES_QUERY],
        onCompleted: () => {
            form.reset()
            setOpen(null)
            setCurrentRow(null)
            refetch?.()
        },
    })

    const onSubmit = async (data: CreateCurrency | UpdateCurrency) => {
        try {
            if (isUpdate) {
                await updateCurrency({
                    variables: {
                        id: currentRow.id,
                        input: data,
                    },
                })
            } else {
                await createCurrency({
                    variables: {
                        input: data,
                    },
                })
            }
        } catch (error) {
            console.error('Error saving currency:', error)
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
                        {isUpdate ? 'تعديل العملة' : 'إضافة عملة جديدة'}
                    </SheetTitle>
                    <SheetDescription>
                        {isUpdate ? 'قم بتعديل بيانات العملة' : 'أدخل بيانات العملة الجديدة'}
                    </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>اسم العملة</FormLabel>
                                    <FormControl>
                                        <Input placeholder="مثال: الدولار الأمريكي" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="symbol"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>رمز العملة</FormLabel>
                                    <FormControl>
                                        <Input placeholder="مثال: $" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>كود العملة</FormLabel>
                                    <FormControl>
                                        <Input placeholder="مثال: USD" maxLength={3} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="is_active"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">الحالة</FormLabel>
                                        <div className="text-sm text-muted-foreground">
                                            تفعيل أو إلغاء تفعيل هذه العملة
                                        </div>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
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
