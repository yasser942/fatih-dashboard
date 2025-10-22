import { z } from 'zod'

export const fleetStatusValues = ['Available', 'InService', 'UnderMaintenance', 'OutOfService'] as const
export type FleetStatus = typeof fleetStatusValues[number]

export type Fleet = {
    id: number
    fleet_type_id: number
    fleetType: {
        id: number
        type_en: string
        type_ar: string
        capacity: number
        status: string
    }
    user_id?: number | null
    user?: {
        id: number
        name: string
        email: string
    } | null
    plate_number: string
    status: FleetStatus
    created_at?: string
    updated_at?: string
}

export const createFleetSchema = z.object({
    fleet_type_id: z.coerce.number().min(1, 'نوع المركبة مطلوب'),
    user_id: z.coerce.number().optional().nullable(),
    plate_number: z.string().min(1, 'رقم اللوحة مطلوب'),
    status: z.enum(fleetStatusValues),
})

export const updateFleetSchema = createFleetSchema.partial().passthrough()

export type CreateFleet = z.infer<typeof createFleetSchema>
export type UpdateFleet = z.infer<typeof updateFleetSchema>
