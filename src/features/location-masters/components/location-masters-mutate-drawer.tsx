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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    ChevronDown,
    ChevronUp,
    Globe,
    Building2,
    MapPin,
    Home,
    Trees,
    Users,
    Info,
    Navigation,
    Check,
    X
} from 'lucide-react'
import { useState } from 'react'
import { useLocationMasters } from './location-masters-provider'
import { CREATE_LOCATION_MASTER_MUTATION, UPDATE_LOCATION_MASTER_MUTATION } from '../graphql/mutations'
import { LOCATION_MASTERS_QUERY } from '../graphql/queries'
import { createLocationMasterSchema, updateLocationMasterSchema, type CreateLocationMaster, type UpdateLocationMaster } from '../data/schema'
import { cn } from '@/lib/utils'

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
        onCompleted: () => {
            form.reset()
            setOpen(null)
            setCurrentRow(null)
            refetch?.()
        },
    })

    const [updateLocationMaster, { loading: updateLoading }] = useMutation(UPDATE_LOCATION_MASTER_MUTATION, {
        refetchQueries: [LOCATION_MASTERS_QUERY],
        onCompleted: () => {
            form.reset()
            setOpen(null)
            setCurrentRow(null)
            refetch?.()
        },
    })

    const onSubmit = (data: CreateLocationMaster | UpdateLocationMaster) => {
        if (isUpdate && currentRow) {
            // Clean up the data - remove empty strings, null values, and convert to undefined
            const cleanedData = Object.fromEntries(
                Object.entries(data)
                    .filter(([_key, value]) => {
                        // Keep only non-empty values
                        return value !== '' && value !== null && value !== undefined
                    })
                    .map(([key, value]) => [key, value])
            )

            updateLocationMaster({
                variables: {
                    id: currentRow.id.toString(),
                    input: cleanedData as UpdateLocationMaster,
                },
            })
        } else {
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

    // Helper component for collapsible section header
    const SectionHeader = ({
        icon: Icon,
        title,
        isOpen,
        isRequired = false,
        badge
    }: {
        icon: React.ElementType
        title: string
        isOpen: boolean
        isRequired?: boolean
        badge?: string
    }) => (
        <div className="flex w-full items-center justify-between gap-2">
            <div className="flex items-center gap-3">
                <div className={cn(
                    "rounded-lg p-2 transition-colors",
                    isOpen ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}>
                    <Icon className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-base">{title}</span>
                    {isRequired && !isUpdate && (
                        <Badge variant="destructive" className="h-5 text-xs">مطلوب</Badge>
                    )}
                    {badge && (
                        <Badge variant="outline" className="h-5 text-xs">{badge}</Badge>
                    )}
                </div>
            </div>
            {isOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
        </div>
    )

    return (
        <Sheet open={open === 'create' || open === 'update'} onOpenChange={handleClose}>
            <SheetContent className="overflow-y-auto sm:max-w-2xl">
                <SheetHeader className="space-y-4 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                            <MapPin className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <SheetTitle className="text-2xl">
                                {isUpdate ? 'تعديل الموقع' : 'إضافة موقع جديد'}
                            </SheetTitle>
                            <SheetDescription className="text-base mt-1">
                                {isUpdate ? 'قم بتعديل بيانات الموقع' : 'أدخل بيانات الموقع الجديد'}
                            </SheetDescription>
                        </div>
                    </div>
                    {isUpdate && currentRow && (
                        <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                            <div className="flex items-center gap-2">
                                <Info className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">معلومات الموقع الحالي</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">الكود:</span>
                                    <span className="font-mono font-medium">{currentRow.Location_Pcode}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">النوع:</span>
                                    <Badge variant="outline" className="h-5">
                                        {currentRow.location_type === 'Community' ? 'مجتمع' :
                                            currentRow.location_type === 'Camp' ? 'مخيم' : 'حي'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    )}
                </SheetHeader>
                <Separator className="my-4" />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-1">
                        {/* Country Section */}
                        <Collapsible open={isCountryOpen} onOpenChange={setIsCountryOpen}>
                            <CollapsibleTrigger className={cn(
                                "flex w-full items-center justify-between rounded-lg border p-4 text-left transition-all hover:bg-accent/50",
                                isCountryOpen && "border-primary/50 bg-primary/5"
                            )}>
                                <SectionHeader
                                    icon={Globe}
                                    title="بيانات البلد"
                                    isOpen={isCountryOpen}
                                    isRequired={true}
                                />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-4 pt-4 px-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="country_en"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    اسم البلد بالإنجليزية
                                                    {!isUpdate && <span className="text-destructive text-sm">*</span>}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="مثال: Iraq"
                                                        {...field}
                                                        className="text-left"
                                                        dir="ltr"
                                                    />
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
                                                <FormLabel className="flex items-center gap-2">
                                                    اسم البلد بالعربية
                                                    {!isUpdate && <span className="text-destructive text-sm">*</span>}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="مثال: العراق" {...field} />
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
                                            <FormLabel className="flex items-center gap-2">
                                                كود البلد
                                                {!isUpdate && <span className="text-destructive text-sm">*</span>}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="مثال: IQ"
                                                    {...field}
                                                    maxLength={10}
                                                    className="font-mono"
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                كود دولي معياري (حتى 10 أحرف)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Governorate Section */}
                        <Collapsible open={isGovernorateOpen} onOpenChange={setIsGovernorateOpen}>
                            <CollapsibleTrigger className={cn(
                                "flex w-full items-center justify-between rounded-lg border p-4 text-left transition-all hover:bg-accent/50",
                                isGovernorateOpen && "border-primary/50 bg-primary/5"
                            )}>
                                <SectionHeader
                                    icon={Building2}
                                    title="بيانات المحافظة"
                                    isOpen={isGovernorateOpen}
                                    isRequired={true}
                                />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-4 pt-4 px-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="governorate_en"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    اسم المحافظة بالإنجليزية
                                                    {!isUpdate && <span className="text-destructive text-sm">*</span>}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="مثال: Baghdad"
                                                        {...field}
                                                        className="text-left"
                                                        dir="ltr"
                                                    />
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
                                                <FormLabel className="flex items-center gap-2">
                                                    اسم المحافظة بالعربية
                                                    {!isUpdate && <span className="text-destructive text-sm">*</span>}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="مثال: بغداد" {...field} />
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
                                            <FormLabel className="flex items-center gap-2">
                                                كود المحافظة
                                                {!isUpdate && <span className="text-destructive text-sm">*</span>}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="مثال: BGD"
                                                    {...field}
                                                    maxLength={10}
                                                    className="font-mono"
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                كود المحافظة (حتى 10 أحرف)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CollapsibleContent>
                        </Collapsible>

                        {/* District Section */}
                        <Collapsible open={isDistrictOpen} onOpenChange={setIsDistrictOpen}>
                            <CollapsibleTrigger className={cn(
                                "flex w-full items-center justify-between rounded-lg border p-4 text-left transition-all hover:bg-accent/50",
                                isDistrictOpen && "border-primary/50 bg-primary/5"
                            )}>
                                <SectionHeader
                                    icon={MapPin}
                                    title="بيانات المنطقة"
                                    isOpen={isDistrictOpen}
                                    isRequired={true}
                                />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-4 pt-4 px-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="district_en"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    اسم المنطقة بالإنجليزية
                                                    {!isUpdate && <span className="text-destructive text-sm">*</span>}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="مثال: Karkh"
                                                        {...field}
                                                        className="text-left"
                                                        dir="ltr"
                                                    />
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
                                                <FormLabel className="flex items-center gap-2">
                                                    اسم المنطقة بالعربية
                                                    {!isUpdate && <span className="text-destructive text-sm">*</span>}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="مثال: الكرخ" {...field} />
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
                                            <FormLabel className="flex items-center gap-2">
                                                كود المنطقة
                                                {!isUpdate && <span className="text-destructive text-sm">*</span>}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="مثال: KRK"
                                                    {...field}
                                                    maxLength={10}
                                                    className="font-mono"
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                كود المنطقة (حتى 10 أحرف)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Subdistrict Section */}
                        <Collapsible open={isSubdistrictOpen} onOpenChange={setIsSubdistrictOpen}>
                            <CollapsibleTrigger className={cn(
                                "flex w-full items-center justify-between rounded-lg border p-4 text-left transition-all hover:bg-accent/50",
                                isSubdistrictOpen && "border-primary/50 bg-primary/5"
                            )}>
                                <SectionHeader
                                    icon={Home}
                                    title="بيانات الناحية"
                                    isOpen={isSubdistrictOpen}
                                    isRequired={true}
                                />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-4 pt-4 px-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="subdistrict_en"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    اسم الناحية بالإنجليزية
                                                    {!isUpdate && <span className="text-destructive text-sm">*</span>}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="مثال: Al-Rashid"
                                                        {...field}
                                                        className="text-left"
                                                        dir="ltr"
                                                    />
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
                                                <FormLabel className="flex items-center gap-2">
                                                    اسم الناحية بالعربية
                                                    {!isUpdate && <span className="text-destructive text-sm">*</span>}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="مثال: الرشيد" {...field} />
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
                                            <FormLabel className="flex items-center gap-2">
                                                كود الناحية
                                                {!isUpdate && <span className="text-destructive text-sm">*</span>}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="مثال: RSH"
                                                    {...field}
                                                    maxLength={10}
                                                    className="font-mono"
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                كود الناحية (حتى 10 أحرف)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Village/Town Section */}
                        <Collapsible open={isVillageOpen} onOpenChange={setIsVillageOpen}>
                            <CollapsibleTrigger className={cn(
                                "flex w-full items-center justify-between rounded-lg border p-4 text-left transition-all hover:bg-accent/50",
                                isVillageOpen && "border-primary/50 bg-primary/5"
                            )}>
                                <SectionHeader
                                    icon={Trees}
                                    title="بيانات القرية/المدينة"
                                    isOpen={isVillageOpen}
                                    isRequired={true}
                                />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-4 pt-4 px-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="village_town_en"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    اسم القرية/المدينة بالإنجليزية
                                                    {!isUpdate && <span className="text-destructive text-sm">*</span>}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="مثال: Al-Karada"
                                                        {...field}
                                                        className="text-left"
                                                        dir="ltr"
                                                    />
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
                                                <FormLabel className="flex items-center gap-2">
                                                    اسم القرية/المدينة بالعربية
                                                    {!isUpdate && <span className="text-destructive text-sm">*</span>}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="مثال: الكرادة" {...field} />
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
                                            <FormLabel className="flex items-center gap-2">
                                                كود القرية/المدينة
                                                {!isUpdate && <span className="text-destructive text-sm">*</span>}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="مثال: KRD01"
                                                    {...field}
                                                    maxLength={10}
                                                    className="font-mono"
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                كود القرية/المدينة (حتى 10 أحرف)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Neighborhood/Community Section */}
                        <Collapsible open={isNeighborhoodOpen} onOpenChange={setIsNeighborhoodOpen}>
                            <CollapsibleTrigger className={cn(
                                "flex w-full items-center justify-between rounded-lg border p-4 text-left transition-all hover:bg-accent/50",
                                isNeighborhoodOpen && "border-primary/50 bg-primary/5"
                            )}>
                                <SectionHeader
                                    icon={Users}
                                    title="بيانات الحي/المجتمع"
                                    isOpen={isNeighborhoodOpen}
                                    badge="اختياري"
                                />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-4 pt-4 px-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="neighborhood_community_en"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>اسم الحي/المجتمع بالإنجليزية</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="مثال: Al-Mansour Community"
                                                        {...field}
                                                        className="text-left"
                                                        dir="ltr"
                                                    />
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
                                                    <Input placeholder="مثال: مجتمع المنصور" {...field} />
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
                            <CollapsibleTrigger className={cn(
                                "flex w-full items-center justify-between rounded-lg border p-4 text-left transition-all hover:bg-accent/50",
                                isLocationDetailsOpen && "border-primary/50 bg-primary/5"
                            )}>
                                <SectionHeader
                                    icon={Info}
                                    title="تفاصيل الموقع"
                                    isOpen={isLocationDetailsOpen}
                                    isRequired={true}
                                />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-4 pt-4 px-2">
                                <FormField
                                    control={form.control}
                                    name="Location_Pcode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                كود الموقع
                                                {!isUpdate && <span className="text-destructive text-sm">*</span>}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="مثال: LOC001"
                                                    {...field}
                                                    maxLength={20}
                                                    className="font-mono"
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                كود فريد للموقع (حتى 20 حرف)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="location_type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                نوع الموقع
                                                {!isUpdate && <span className="text-destructive text-sm">*</span>}
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="اختر نوع الموقع" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Community">
                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-4 w-4" />
                                                            <span>مجتمع</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="Camp">
                                                        <div className="flex items-center gap-2">
                                                            <Home className="h-4 w-4" />
                                                            <span>مخيم</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="Neighbourhood">
                                                        <div className="flex items-center gap-2">
                                                            <Building2 className="h-4 w-4" />
                                                            <span>حي</span>
                                                        </div>
                                                    </SelectItem>
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
                            <CollapsibleTrigger className={cn(
                                "flex w-full items-center justify-between rounded-lg border p-4 text-left transition-all hover:bg-accent/50",
                                isCoordinatesOpen && "border-primary/50 bg-primary/5"
                            )}>
                                <SectionHeader
                                    icon={Navigation}
                                    title="الإحداثيات الجغرافية"
                                    isOpen={isCoordinatesOpen}
                                    badge="اختياري"
                                />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-4 pt-4 px-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="Latitude_y"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>خط العرض (Latitude)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="any"
                                                        placeholder="مثال: 33.3152"
                                                        {...field}
                                                        value={field.value ?? ''}
                                                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                                        className="font-mono"
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-xs">
                                                    من -90 إلى 90
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="Longitude_x"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>خط الطول (Longitude)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="any"
                                                        placeholder="مثال: 44.3661"
                                                        {...field}
                                                        value={field.value ?? ''}
                                                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                                        className="font-mono"
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-xs">
                                                    من -180 إلى 180
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        <Separator className="my-6" />

                        {/* Status */}
                        <FormField
                            control={form.control}
                            name="is_active"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/30">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            {field.value ? (
                                                <Check className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <X className="h-4 w-4 text-muted-foreground" />
                                            )}
                                            <FormLabel className="text-base font-semibold m-0">حالة الموقع</FormLabel>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {field.value ? 'الموقع نشط ومتاح للاستخدام' : 'الموقع غير نشط'}
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

                        <Separator className="my-6" />

                        <SheetFooter className="gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={createLoading || updateLoading}
                            >
                                إلغاء
                            </Button>
                            <Button
                                type="submit"
                                disabled={createLoading || updateLoading}
                                className="gap-2"
                            >
                                {createLoading || updateLoading ? (
                                    <>
                                        <span className="animate-spin">⏳</span>
                                        <span>جاري الحفظ...</span>
                                    </>
                                ) : (
                                    <>
                                        {isUpdate ? (
                                            <>
                                                <Check className="h-4 w-4" />
                                                <span>تحديث الموقع</span>
                                            </>
                                        ) : (
                                            <>
                                                <MapPin className="h-4 w-4" />
                                                <span>إنشاء موقع جديد</span>
                                            </>
                                        )}
                                    </>
                                )}
                            </Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}
