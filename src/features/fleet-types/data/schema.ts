import { z } from 'zod'

export const fleetTypeSchema = z.object({
    id: z.number(),
    type_en: z.string(),
    type_ar: z.string(),
    capacity: z.number(),
    status: z.enum(['Active', 'Inactive']),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
})

export const createFleetTypeSchema = z.object({
    type_en: z.string().min(1, 'النوع بالإنجليزية مطلوب'),
    type_ar: z.string().min(1, 'النوع بالعربية مطلوب'),
    capacity: z.number().min(0, 'السعة يجب أن تكون أكبر من أو تساوي صفر'),
    status: z.enum(['Active', 'Inactive']),
})

export const updateFleetTypeSchema = z.object({
    type_en: z.string().min(1, 'النوع بالإنجليزية مطلوب').optional(),
    type_ar: z.string().min(1, 'النوع بالعربية مطلوب').optional(),
    capacity: z.number().min(0, 'السعة يجب أن تكون أكبر من أو تساوي صفر').optional(),
    status: z.enum(['Active', 'Inactive']).optional(),
})

export type FleetType = z.infer<typeof fleetTypeSchema>
export type CreateFleetType = z.infer<typeof createFleetTypeSchema>
export type UpdateFleetType = z.infer<typeof updateFleetTypeSchema>
