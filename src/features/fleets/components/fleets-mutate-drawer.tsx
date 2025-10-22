import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@apollo/client/react'
import { useEffect, useState } from 'react'
import { gql } from '@apollo/client/core'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useFleets } from './fleets-provider'
import { fleetStatusValues, createFleetSchema, updateFleetSchema, type CreateFleet, type UpdateFleet } from '../data/schema'
import { CREATE_FLEET_MUTATION, UPDATE_FLEET_MUTATION } from '../graphql/mutations'
import { FLEETS_QUERY } from '../graphql/queries'

// We need to fetch fleet types and users for the selectors
const FLEET_TYPES_QUERY = gql`
  query FleetTypes {
    fleetTypes {
      id
      type_en
      type_ar
      capacity
      status
    }
  }
`

const USERS_QUERY = gql`
  query Users {
    users {
      data {
        id
        name
        email
      }
    }
  }
`

export function FleetsMutateDrawer() {
    const { open, setOpen, currentRow, setCurrentRow, refetch } = useFleets()
    const isUpdate = open === 'update' && currentRow
    const [error, setError] = useState<string | null>(null)

    const form = useForm<CreateFleet | UpdateFleet>({
        resolver: zodResolver(isUpdate ? updateFleetSchema : createFleetSchema),
        defaultValues: {
            fleet_type_id: 0,
            user_id: undefined,
            plate_number: '',
            status: 'Available',
        },
    })

    useEffect(() => {
        if (isUpdate && currentRow) {
            form.reset({
                fleet_type_id: currentRow.fleet_type_id,
                user_id: currentRow.user_id ?? undefined,
                plate_number: currentRow.plate_number,
                status: currentRow.status,
            })
        } else if (open === 'create') {
            form.reset({
                fleet_type_id: 0,
                user_id: undefined,
                plate_number: '',
                status: 'Available',
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, currentRow])

    const [createFleet, createState] = useMutation(CREATE_FLEET_MUTATION, {
        refetchQueries: [FLEETS_QUERY],
        onCompleted: () => {
            toast.success('تم إنشاء المركبة بنجاح')
            handleClose()
            refetch?.()
        },
        onError: (error) => {
            console.error('Create fleet error:', error)
            const errorMessage = error.message || 'حدث خطأ أثناء إنشاء المركبة'
            setError(errorMessage)
            toast.error(errorMessage)
        },
    })

    const [updateFleet, updateState] = useMutation(UPDATE_FLEET_MUTATION, {
        refetchQueries: [FLEETS_QUERY],
        onCompleted: () => {
            toast.success('تم تحديث المركبة بنجاح')
            handleClose()
            refetch?.()
        },
        onError: (error) => {
            console.error('Update fleet error:', error)
            const errorMessage = error.message || 'حدث خطأ أثناء تحديث المركبة'
            setError(errorMessage)
            toast.error(errorMessage)
        },
    })

    // Fetch fleet types and users for the selectors
    const { data: fleetTypesData } = useQuery(FLEET_TYPES_QUERY, {
        variables: {},
        fetchPolicy: 'cache-first',
    })

    const { data: usersData } = useQuery(USERS_QUERY, {
        variables: {},
        fetchPolicy: 'cache-first',
    })

    const onSubmit = async (values: any) => {
        setError(null) // Clear any previous errors
        try {
            const payload = Object.fromEntries(
                Object.entries(values).map(([k, v]) => [k, v === '' ? undefined : v])
            )
            if (isUpdate && currentRow) {
                await updateFleet({ variables: { id: currentRow.id, input: payload } })
            } else {
                await createFleet({ variables: { input: payload } })
            }
        } catch (error) {
            console.error('Form submission error:', error)
            const errorMessage = 'حدث خطأ أثناء حفظ البيانات'
            setError(errorMessage)
            toast.error(errorMessage)
        }
    }

    const handleClose = () => {
        form.reset()
        setCurrentRow(null)
        setOpen(null)
        setError(null)
    }

    const getStatusTranslation = (status: string) => {
        const translations: Record<string, string> = {
            Available: 'متاح',
            InService: 'في الخدمة',
            UnderMaintenance: 'تحت الصيانة',
            OutOfService: 'خارج الخدمة',
        }
        return translations[status] || status
    }

    return (
        <Sheet open={open === 'create' || open === 'update'} onOpenChange={handleClose}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{isUpdate ? 'تعديل المركبة' : 'إضافة مركبة جديدة'}</SheetTitle>
                    <SheetDescription>{isUpdate ? 'قم بتعديل بيانات المركبة' : 'أدخل بيانات المركبة الجديدة'}</SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                                {error}
                            </div>
                        )}
                        <FormField
                            control={form.control}
                            name="fleet_type_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>نوع المركبة</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value ? String(field.value) : ''}
                                            onValueChange={(val) => field.onChange(Number(val))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="اختر نوع المركبة" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(fleetTypesData?.fleetTypes ?? []).map((fleetType: any) => (
                                                    <SelectItem key={fleetType.id} value={String(fleetType.id)}>
                                                        {fleetType.type_ar || fleetType.type_en}
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
                            name="user_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>المستخدم (اختياري)</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value ? String(field.value) : 'unassigned'}
                                            onValueChange={(val) => field.onChange(val === 'unassigned' ? null : Number(val))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="اختر المستخدم" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="unassigned">غير مخصص</SelectItem>
                                                {(usersData?.users?.data || []).map((user: any) => (
                                                    <SelectItem key={user.id} value={String(user.id)}>
                                                        {user.name}
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
                            name="plate_number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>رقم اللوحة</FormLabel>
                                    <FormControl>
                                        <Input placeholder="مثال: ABC-123" {...field} />
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
                                                {fleetStatusValues.map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {getStatusTranslation(status)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
