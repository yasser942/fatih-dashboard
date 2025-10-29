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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronsUpDown, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBranches } from './branches-provider'
import { branchStatusValues, createBranchSchema, updateBranchSchema, type CreateBranch, type UpdateBranch } from '../data/schema'
import { CREATE_BRANCH_MUTATION, UPDATE_BRANCH_MUTATION } from '../graphql/mutations'
import { BRANCHES_PAGINATED_QUERY } from '../graphql/queries'
import { LOCATION_MASTERS_QUERY } from '@/features/location-masters/graphql/queries'

export function BranchesMutateDrawer() {
    const { open, setOpen, currentRow, setCurrentRow, refetch } = useBranches()
    const isUpdate = open === 'update' && currentRow
    const [locationOpen, setLocationOpen] = useState(false)

    const form = useForm<CreateBranch | UpdateBranch>({
        resolver: zodResolver(isUpdate ? updateBranchSchema : createBranchSchema),
        defaultValues: {
            name: '',
            status: 'Active',
            location_id: undefined as unknown as number,
            full_address: '',
            latitude: undefined,
            longitude: undefined,
        },
    })

    useEffect(() => {
        if (isUpdate && currentRow) {
            form.reset({
                name: currentRow.name,
                status: currentRow.status,
                location_id: currentRow.location_id,
                full_address: currentRow.full_address ?? undefined,
                latitude: currentRow.latitude ?? undefined,
                longitude: currentRow.longitude ?? undefined,
            })
        } else if (open === 'create') {
            form.reset({ name: '', status: 'Active', location_id: undefined as unknown as number, full_address: '' })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, currentRow])

    const [createBranch, createState] = useMutation(CREATE_BRANCH_MUTATION, {
        refetchQueries: [BRANCHES_PAGINATED_QUERY],
        onCompleted: () => {
            toast.success('تم إنشاء الفرع بنجاح!')
            handleClose()
            refetch?.()
        },
        onError: (error) => {
            toast.error(`فشل في إنشاء الفرع: ${error.message}`)
        },
    })

    const [updateBranch, updateState] = useMutation(UPDATE_BRANCH_MUTATION, {
        refetchQueries: [BRANCHES_PAGINATED_QUERY],
        onCompleted: () => {
            toast.success('تم تحديث الفرع بنجاح!')
            handleClose()
            refetch?.()
        },
        onError: (error) => {
            toast.error(`فشل في تحديث الفرع: ${error.message}`)
        },
    })

    // Fetch locations for the selector
    const { data: locationsData } = useQuery(LOCATION_MASTERS_QUERY, {
        variables: {},
        fetchPolicy: 'cache-first',
    })

    const onSubmit = async (values: any) => {
        const payload = Object.fromEntries(
            Object.entries(values).map(([k, v]) => [k, v === '' ? undefined : v])
        )
        if (isUpdate && currentRow) {
            await updateBranch({ variables: { id: currentRow.id, input: payload } })
        } else {
            await createBranch({ variables: { input: payload } })
        }
    }

    const handleClose = () => {
        form.reset()
        setCurrentRow(null)
        setOpen(null)
    }

    return (
        <Sheet open={open === 'create' || open === 'update'} onOpenChange={handleClose}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{isUpdate ? 'تعديل الفرع' : 'إضافة فرع جديد'}</SheetTitle>
                    <SheetDescription>{isUpdate ? 'قم بتعديل بيانات الفرع' : 'أدخل بيانات الفرع الجديد'}</SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>اسم الفرع</FormLabel>
                                    <FormControl>
                                        <Input placeholder="مثال: فرع القاهرة" {...field} />
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
                                                {branchStatusValues.map((s) => (
                                                    <SelectItem key={s} value={s}>
                                                        {s === 'Active' ? 'نشط' : 'غير نشط'}
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
                            name="location_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>الموقع</FormLabel>
                                    <FormControl>
                                        <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={locationOpen}
                                                    className="w-full justify-between"
                                                >
                                                    {field.value && field.value > 0
                                                        ? (() => {
                                                            const location = (locationsData?.locationMasters ?? []).find(
                                                                (loc: any) => Number(loc.id) === Number(field.value)
                                                            )
                                                            return location
                                                                ? `${location.Location_Pcode} - ${location.country_ar}`
                                                                : 'اختر الموقع...'
                                                        })()
                                                        : 'اختر الموقع...'}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <Command>
                                                    <CommandInput placeholder="البحث في المواقع..." />
                                                    <CommandList>
                                                        <CommandEmpty>لم يتم العثور على مواقع.</CommandEmpty>
                                                        <CommandGroup>
                                                            {(locationsData?.locationMasters ?? []).map((loc: any) => (
                                                                <CommandItem
                                                                    key={loc.id}
                                                                    value={`${loc.Location_Pcode} ${loc.country_ar}`}
                                                                    onSelect={() => {
                                                                        field.onChange(Number(loc.id))
                                                                        setLocationOpen(false)
                                                                        form.clearErrors('location_id')
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            'mr-2 h-4 w-4',
                                                                            field.value === Number(loc.id) && field.value > 0
                                                                                ? 'opacity-100'
                                                                                : 'opacity-0'
                                                                        )}
                                                                    />
                                                                    <MapPin className="mr-2 h-4 w-4" />
                                                                    <div className="flex flex-col">
                                                                        <span className="font-medium">{loc.Location_Pcode}</span>
                                                                        <span className="text-sm text-muted-foreground">
                                                                            {loc.country_ar}
                                                                        </span>
                                                                    </div>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="full_address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>العنوان</FormLabel>
                                    <FormControl>
                                        <Input placeholder="العنوان الكامل" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="latitude"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>خط العرض (Latitude)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.0000001"
                                                placeholder="0.000000"
                                                value={field.value ?? ''}
                                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="longitude"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>خط الطول (Longitude)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.0000001"
                                                placeholder="0.000000"
                                                value={field.value ?? ''}
                                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

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


