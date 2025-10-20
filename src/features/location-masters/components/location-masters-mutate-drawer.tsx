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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { useLocationMasters } from './location-masters-provider'
import { CREATE_LOCATION_MASTER_MUTATION, UPDATE_LOCATION_MASTER_MUTATION } from '../graphql/mutations'
import { LOCATION_MASTERS_QUERY } from '../graphql/queries'
import { createLocationMasterSchema, updateLocationMasterSchema, type CreateLocationMaster, type UpdateLocationMaster } from '../data/schema'

export function LocationMastersMutateDrawer() {
    const { open, setOpen, currentRow, setCurrentRow, refetch } = useLocationMasters()
    const isUpdate = open === 'update' && currentRow
    const [isCountryOpen, setIsCountryOpen] = useState(true)
    const [isGovernorateOpen, setIsGovernorateOpen] = useState(true)
    const [isDistrictOpen, setIsDistrictOpen] = useState(true)
    const [isSubdistrictOpen, setIsSubdistrictOpen] = useState(true)
    const [isVillageOpen, setIsVillageOpen] = useState(true)
    const [isNeighborhoodOpen, setIsNeighborhoodOpen] = useState(false)
    const [isLocationDetailsOpen, setIsLocationDetailsOpen] = useState(true)
    const [isCoordinatesOpen, setIsCoordinatesOpen] = useState(false)

    const form = useForm<CreateLocationMaster | UpdateLocationMaster>({
        resolver: zodResolver(isUpdate ? updateLocationMasterSchema : createLocationMasterSchema),
        defaultValues: {
            country_en: '',
            country_ar: '',
            country0Pcode: '',
            governorate_en: '',
            governorate_ar: '',
            governorate1Pcode: '',
            district_en: '',
            district_ar: '',
            districtPcode: '',
            subdistrict_en: '',
            subdistrict_ar: '',
            subdistrictPcode: '',
            village_town_en: '',
            village_town_ar: '',
            village_townPcode: '',
            neighborhood_community_en: '',
            neighborhood_community_ar: '',
            Location_Pcode: '',
            location_type: 'Community',
            Latitude_y: undefined,
            Longitude_x: undefined,
            is_active: true,
        },
    })

    // Reset form when currentRow changes (for editing)
    useEffect(() => {
        if (isUpdate && currentRow) {
            form.reset({
                country_en: currentRow.country_en,
                country_ar: currentRow.country_ar,
                country0Pcode: currentRow.country0Pcode,
                governorate_en: currentRow.governorate_en,
                governorate_ar: currentRow.governorate_ar,
                governorate1Pcode: currentRow.governorate1Pcode,
                district_en: currentRow.district_en,
                district_ar: currentRow.district_ar,
                districtPcode: currentRow.districtPcode,
                subdistrict_en: currentRow.subdistrict_en,
                subdistrict_ar: currentRow.subdistrict_ar,
                subdistrictPcode: currentRow.subdistrictPcode,
                village_town_en: currentRow.village_town_en,
                village_town_ar: currentRow.village_town_ar,
                village_townPcode: currentRow.village_townPcode,
                neighborhood_community_en: currentRow.neighborhood_community_en || '',
                neighborhood_community_ar: currentRow.neighborhood_community_ar || '',
                Location_Pcode: currentRow.Location_Pcode,
                location_type: currentRow.location_type,
                Latitude_y: currentRow.Latitude_y || undefined,
                Longitude_x: currentRow.Longitude_x || undefined,
                is_active: currentRow.is_active,
            })
        } else if (open === 'create') {
            form.reset({
                country_en: '',
                country_ar: '',
                country0Pcode: '',
                governorate_en: '',
                governorate_ar: '',
                governorate1Pcode: '',
                district_en: '',
                district_ar: '',
                districtPcode: '',
                subdistrict_en: '',
                subdistrict_ar: '',
                subdistrictPcode: '',
                village_town_en: '',
                village_town_ar: '',
                village_townPcode: '',
                neighborhood_community_en: '',
                neighborhood_community_ar: '',
                Location_Pcode: '',
                location_type: 'Community',
                Latitude_y: undefined,
                Longitude_x: undefined,
                is_active: true,
            })
        }
    }, [currentRow, isUpdate, open])

    const [createLocationMaster, { loading: createLoading }] = useMutation(CREATE_LOCATION_MASTER_MUTATION, {
        refetchQueries: [LOCATION_MASTERS_QUERY],
        onCompleted: (data) => {
            console.log('✅ Create mutation completed successfully:', data)
            form.reset()
            setOpen(null)
            setCurrentRow(null)
            refetch?.()
        },
        onError: (error) => {
            console.error('❌ Create mutation failed:', error)
            console.error('Error message:', error.message)
            console.error('Network error:', error.networkError)
            console.error('GraphQL errors:', error.graphQLErrors)
        },
    })

    const [updateLocationMaster, { loading: updateLoading }] = useMutation(UPDATE_LOCATION_MASTER_MUTATION, {
        refetchQueries: [LOCATION_MASTERS_QUERY],
        onCompleted: (data) => {
            console.log('✅ Update mutation completed successfully:', data)
            form.reset()
            setOpen(null)
            setCurrentRow(null)
            refetch?.()
        },
        onError: (error) => {
            console.error('❌ Update mutation failed:', error)
            console.error('Error message:', error.message)
            console.error('Network error:', error.networkError)
            console.error('GraphQL errors:', error.graphQLErrors)
        },
    })

    const onSubmit = (data: CreateLocationMaster | UpdateLocationMaster) => {
        console.log('=== FORM SUBMISSION DEBUG ===')
        console.log('isUpdate:', isUpdate)
        console.log('currentRow:', currentRow)
        console.log('currentRow.id:', currentRow?.id)
        console.log('Form data:', data)
        console.log('location_type value:', data.location_type)
        console.log('is_active value:', data.is_active)
        console.log('Location_Pcode value:', data.Location_Pcode)
        console.log('district_ar value:', data.district_ar)
        console.log('village_town_ar value:', data.village_town_ar)
        console.log('================================')

        if (isUpdate && currentRow) {
            console.log('Calling updateLocationMaster with:', {
                id: currentRow.id.toString(),
                input: data as UpdateLocationMaster,
            })

            // Clean up the data - remove empty strings, null values, and convert to undefined
            const cleanedData = Object.fromEntries(
                Object.entries(data)
                    .filter(([key, value]) => {
                        // Keep only non-empty values
                        return value !== '' && value !== null && value !== undefined
                    })
                    .map(([key, value]) => [key, value])
            )

            console.log('Cleaned data:', cleanedData)

            updateLocationMaster({
                variables: {
                    id: currentRow.id.toString(),
                    input: cleanedData as UpdateLocationMaster,
                },
            })
        } else {
            console.log('Calling createLocationMaster with:', {
                input: data as CreateLocationMaster,
            })
            createLocationMaster({
                variables: {
                    input: data as CreateLocationMaster,
                },
            })
        }
    }

    const handleClose = () => {
        setOpen(null)
        setCurrentRow(null)
        form.reset()
    }

    return (
        <Sheet open={open === 'create' || open === 'update'} onOpenChange={handleClose}>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>
                        {isUpdate ? 'تعديل الموقع' : 'إضافة موقع جديد'}
                    </SheetTitle>
                    <SheetDescription>
                        {isUpdate ? 'قم بتعديل بيانات الموقع' : 'أدخل بيانات الموقع الجديد'}
                    </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
                        {/* Country Section */}
                        <Collapsible open={isCountryOpen} onOpenChange={setIsCountryOpen}>
                            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 text-left">
                                <span className="font-medium">بيانات البلد</span>
                                {isCountryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-4 p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="country_en"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>اسم البلد بالإنجليزية</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="مثال: Egypt" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="country_ar"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>اسم البلد بالعربية</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="مثال: مصر" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="country0Pcode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>كود البلد</FormLabel>
                                            <FormControl>
                                                <Input placeholder="مثال: EG" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Governorate Section */}
                        <Collapsible open={isGovernorateOpen} onOpenChange={setIsGovernorateOpen}>
                            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 text-left">
                                <span className="font-medium">بيانات المحافظة</span>
                                {isGovernorateOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-4 p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="governorate_en"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>اسم المحافظة بالإنجليزية</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="مثال: Cairo" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="governorate_ar"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>اسم المحافظة بالعربية</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="مثال: القاهرة" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="governorate1Pcode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>كود المحافظة</FormLabel>
                                            <FormControl>
                                                <Input placeholder="مثال: CAI" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CollapsibleContent>
                        </Collapsible>

                        {/* District Section */}
                        <Collapsible open={isDistrictOpen} onOpenChange={setIsDistrictOpen}>
                            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 text-left">
                                <span className="font-medium">بيانات المنطقة</span>
                                {isDistrictOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-4 p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="district_en"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>اسم المنطقة بالإنجليزية</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="مثال: Downtown" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="district_ar"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>اسم المنطقة بالعربية</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="مثال: وسط البلد" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="districtPcode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>كود المنطقة</FormLabel>
                                            <FormControl>
                                                <Input placeholder="مثال: DOW" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Subdistrict Section */}
                        <Collapsible open={isSubdistrictOpen} onOpenChange={setIsSubdistrictOpen}>
                            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 text-left">
                                <span className="font-medium">بيانات الناحية</span>
                                {isSubdistrictOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-4 p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="subdistrict_en"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>اسم الناحية بالإنجليزية</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="مثال: Tahrir" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="subdistrict_ar"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>اسم الناحية بالعربية</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="مثال: التحرير" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="subdistrictPcode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>كود الناحية</FormLabel>
                                            <FormControl>
                                                <Input placeholder="مثال: TAH" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Village/Town Section */}
                        <Collapsible open={isVillageOpen} onOpenChange={setIsVillageOpen}>
                            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 text-left">
                                <span className="font-medium">بيانات القرية/المدينة</span>
                                {isVillageOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-4 p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="village_town_en"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>اسم القرية/المدينة بالإنجليزية</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="مثال: Tahrir Square" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="village_town_ar"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>اسم القرية/المدينة بالعربية</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="مثال: ميدان التحرير" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="village_townPcode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>كود القرية/المدينة</FormLabel>
                                            <FormControl>
                                                <Input placeholder="مثال: TAH01" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Neighborhood/Community Section */}
                        <Collapsible open={isNeighborhoodOpen} onOpenChange={setIsNeighborhoodOpen}>
                            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 text-left">
                                <span className="font-medium">بيانات الحي/المجتمع</span>
                                {isNeighborhoodOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-4 p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="neighborhood_community_en"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>اسم الحي/المجتمع بالإنجليزية</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="مثال: Downtown Community" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="neighborhood_community_ar"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>اسم الحي/المجتمع بالعربية</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="مثال: مجتمع وسط البلد" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Location Details Section */}
                        <Collapsible open={isLocationDetailsOpen} onOpenChange={setIsLocationDetailsOpen}>
                            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 text-left">
                                <span className="font-medium">تفاصيل الموقع</span>
                                {isLocationDetailsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-4 p-4">
                                <FormField
                                    control={form.control}
                                    name="Location_Pcode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>كود الموقع</FormLabel>
                                            <FormControl>
                                                <Input placeholder="مثال: LOC001" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="location_type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>نوع الموقع</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="اختر نوع الموقع" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Community">مجتمع</SelectItem>
                                                    <SelectItem value="Camp">مخيم</SelectItem>
                                                    <SelectItem value="Neighbourhood">حي</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Coordinates Section */}
                        <Collapsible open={isCoordinatesOpen} onOpenChange={setIsCoordinatesOpen}>
                            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 text-left">
                                <span className="font-medium">الإحداثيات</span>
                                {isCoordinatesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-4 p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="Latitude_y"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>خط العرض</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="any"
                                                        placeholder="مثال: 30.0444"
                                                        {...field}
                                                        value={field.value || ''}
                                                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="Longitude_x"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>خط الطول</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="any"
                                                        placeholder="مثال: 31.2357"
                                                        {...field}
                                                        value={field.value || ''}
                                                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Status */}
                        <FormField
                            control={form.control}
                            name="is_active"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">الحالة</FormLabel>
                                        <div className="text-sm text-muted-foreground">
                                            تفعيل أو إلغاء تفعيل هذا الموقع
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
