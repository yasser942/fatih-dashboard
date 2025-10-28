import { z } from 'zod'

export const locationTypeEnum = z.enum(['Community', 'Camp', 'Neighbourhood'])

export const createLocationMasterSchema = z.object({
    country_en: z.string().min(1, 'اسم البلد بالإنجليزية مطلوب').max(255),
    country_ar: z.string().min(1, 'اسم البلد بالعربية مطلوب').max(255),
    country0Pcode: z.string().min(1, 'كود البلد مطلوب').max(10),
    governorate_en: z.string().min(1, 'اسم المحافظة بالإنجليزية مطلوب').max(255),
    governorate_ar: z.string().min(1, 'اسم المحافظة بالعربية مطلوب').max(255),
    governorate1Pcode: z.string().min(1, 'كود المحافظة مطلوب').max(10),
    district_en: z.string().min(1, 'اسم المنطقة بالإنجليزية مطلوب').max(255),
    district_ar: z.string().min(1, 'اسم المنطقة بالعربية مطلوب').max(255),
    districtPcode: z.string().min(1, 'كود المنطقة مطلوب').max(10),
    subdistrict_en: z.string().min(1, 'اسم الناحية بالإنجليزية مطلوب').max(255),
    subdistrict_ar: z.string().min(1, 'اسم الناحية بالعربية مطلوب').max(255),
    subdistrictPcode: z.string().min(1, 'كود الناحية مطلوب').max(10),
    village_town_en: z.string().min(1, 'اسم القرية/المدينة بالإنجليزية مطلوب').max(255),
    village_town_ar: z.string().min(1, 'اسم القرية/المدينة بالعربية مطلوب').max(255),
    village_townPcode: z.string().min(1, 'كود القرية/المدينة مطلوب').max(10),
    neighborhood_community_en: z.string().max(255).optional(),
    neighborhood_community_ar: z.string().max(255).optional(),
    Location_Pcode: z.string().min(1, 'كود الموقع مطلوب').max(20),
    location_type: locationTypeEnum,
    Latitude_y: z.number().min(-90).max(90).optional(),
    Longitude_x: z.number().min(-180).max(180).optional(),
    is_active: z.boolean().default(true),
})

export const updateLocationMasterSchema = z.object({
    country_en: z.string().min(1).max(255).optional(),
    country_ar: z.string().min(1).max(255).optional(),
    country0Pcode: z.string().min(1).max(10).optional(),
    governorate_en: z.string().min(1).max(255).optional(),
    governorate_ar: z.string().min(1).max(255).optional(),
    governorate1Pcode: z.string().min(1).max(10).optional(),
    district_en: z.string().min(1).max(255).optional(),
    district_ar: z.string().min(1).max(255).optional(),
    districtPcode: z.string().min(1).max(10).optional(),
    subdistrict_en: z.string().min(1).max(255).optional(),
    subdistrict_ar: z.string().min(1).max(255).optional(),
    subdistrictPcode: z.string().min(1).max(10).optional(),
    village_town_en: z.string().min(1).max(255).optional(),
    village_town_ar: z.string().min(1).max(255).optional(),
    village_townPcode: z.string().min(1).max(10).optional(),
    neighborhood_community_en: z.string().max(255).optional(),
    neighborhood_community_ar: z.string().max(255).optional(),
    Location_Pcode: z.string().min(1).max(20).optional(),
    location_type: locationTypeEnum.optional(),
    Latitude_y: z.number().min(-90).max(90).optional(),
    Longitude_x: z.number().min(-180).max(180).optional(),
    is_active: z.boolean().optional(),
}).passthrough()

export type LocationMaster = z.infer<typeof createLocationMasterSchema> & {
    id: number
}

export type CreateLocationMaster = z.infer<typeof createLocationMasterSchema>
export type UpdateLocationMaster = z.infer<typeof updateLocationMasterSchema>
